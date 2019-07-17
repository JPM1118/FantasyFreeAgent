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
        const fantasyInfoResponse = await axios.get(
          'https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;game_keys=388/leagues?format=json',
          config)
        const fantasyInfo = fantasyInfoResponse.data.fantasy_content.users[0].user

        const guid = fantasyInfo[0].guid
        const yProfileResponse = await axios.get(
          `https://social.yahooapis.com/v1/user/${guid}/profile`,
          config)
        const yProfile = yProfileResponse.data.profile

        let userLeagueArray = [];
        const leaguesObject = fantasyInfo[1].games[0].game[1].leagues

        Object.keys(leaguesObject).forEach((key, index) => {
          if (leaguesObject[key].hasOwnProperty('league')) {
            userLeagueArray.push({
              leagueInfo: {
                leagueKey: leaguesObject[key].league[0].league_key,
                leagueName: leaguesObject[key].league[0].name,
                leagueUrl: leaguesObject[key].league[0].url
              },
              players: []
            })
          }
        })
        let user = await User.findOne({ guid: guid })
        if (user) {
          done(null, { id: user.id, accessToken, tokenExpiration })
        } else {
          const newUser = new User({
            guid: fantasyInfo[0].guid,
            name: yProfile.nickname,
            leagues: userLeagueArray,
            refreshToken: refreshToken,
          })
          const savedUser = await newUser.save()
          done(null, { id: savedUser.id, accessToken, tokenExpiration });
        }

      }
    )
  )
} catch (err) {
  console.log(err)
}


