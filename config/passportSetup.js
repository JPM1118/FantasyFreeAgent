const passport = require('passport');
const axios = require('axios');
// const YahooStrategy = require('passport-yahoo-oauth2').OAuth2Strategy;
const OAuth2Strategy = require('passport-oauth2')
const GoogleStrategy = require('passport-google-oauth20');
require('dotenv').config();
const User = require('../models/Users');

passport.serializeUser((user, done) => {
  console.log(user);
  done(null, user)
})

passport.deserializeUser((user, done) => {
  console.log(user);
  User.findById(user.id)
    .then(user => done(null, user))
    .catch(err => done(err))
})

passport.use(
  new OAuth2Strategy({
    authorizationURL: 'https://api.login.yahoo.com/oauth2/request_auth',
    tokenURL: 'https://api.login.yahoo.com/oauth2/get_token',
    clientID: process.env.YAH_CL_ID,
    clientSecret: process.env.YAH_CL_SECRET,
    callbackURL: process.env.YAH_REDIRECT_URI,
  },
    async (accessToken, refreshToken, profile, done) => {
      // console.log(accessToken);
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

      let userLeagueArray = [];
      let leaguesObject = fantasyInfo[1].games[0].game[1].leagues

      Object.keys(leaguesObject).forEach((key, index) => {
        if (leaguesObject[key].hasOwnProperty('league')) {
          userLeagueArray.push({
            leagueKey: leaguesObject[key].league[0].league_key,
            leagueName: leaguesObject[key].league[0].name,
            leagueUrl: leaguesObject[key].league[0].url
          })
        }
      })
      User.findOne({ guid: fantasyInfo[0].guid })
        .then(currentUser => {
          if (currentUser) {
            done(null, { id: currentUser.id, accessToken })
          } else {
            new User({
              guid: fantasyInfo[0].guid,
              leagues: userLeagueArray,
              refreshToken: refreshToken,
            })
              .save()
              .then(newUser => {
                done(null, { id: newUser.id, accessToken });
              })
              .catch(err => done(err))
          }
        })
        .catch(err => done(err))
    }
  )
)

passport.use(
  new GoogleStrategy({
    //options
    clientID: process.env.GOOG_CL_ID,
    clientSecret: process.env.GOOG_CL_SECRET,
    callbackURL: '/auth/google/redirect',
  }, () => {
  })
)


