const passport = require('passport');
const axios = require('axios');
const OAuth2Strategy = require('passport-oauth2')
require('dotenv').config();
const User = require('../models/Users');

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  User.findById(user.id)
    .then(user => done(null, user))
    .catch(err => done(err))
})
try {
  passport.use(
    new OAuth2Strategy({
      authorizationURL: 'https://api.login.yahoo.com/oauth2/request_auth',
      tokenURL: 'https://api.login.yahoo.com/oauth2/get_token',
      clientID: process.env.YAH_CL_ID,
      clientSecret: process.env.YAH_CL_SECRET,
      callbackURL: process.env.YAH_REDIRECT_URI,
    },
      async (accessToken, refreshToken, profile, done) => {
        const tokenExpiration = Date.now() + (1000 * 60 * 60);

        let config = {
          headers: { 'Authorization': 'Bearer ' + accessToken }
        };
        const fantasyInfo = await axios.get(
          'https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=388/leagues?format=json',
          config
        )
          .then(res => {
            return res.data.fantasy_content.users[0].user
          })
          .catch(err => console.log('err', err))
        const guid = fantasyInfo[0].guid
        const yProfile = await axios.get(
          `https://social.yahooapis.com/v1/user/${guid}/profile`,
          config)
          .then(res => {
            return res.data.profile
          })
          .catch(err => console.log('err', err))

        let userLeagueArray = [];
        const leaguesObject = fantasyInfo[1].games[0].game[1].leagues

        Object.keys(leaguesObject).forEach((key, index) => {
          if (leaguesObject[key].hasOwnProperty('league')) {
            userLeagueArray.push({
              leagueKey: leaguesObject[key].league[0].league_key,
              leagueName: leaguesObject[key].league[0].name,
              leagueUrl: leaguesObject[key].league[0].url
            })
          }
        })
        User.findOne({ guid: guid })
          .then(currentUser => {
            if (currentUser) {
              done(null, { id: currentUser.id, accessToken, tokenExpiration })
            } else {
              new User({
                guid: fantasyInfo[0].guid,
                name: yProfile.nickname,
                leagues: userLeagueArray,
                refreshToken: refreshToken,
              })
                .save()
                .then(newUser => {
                  done(null, { id: newUser.id, accessToken, tokenExpiration });
                })
                .catch(err => done(err))
            }
          })
          .catch(err => {
            console.log(err)
            done(err)
          })
      }
    )
  )
} catch (err) {
  console.log(err)
}


