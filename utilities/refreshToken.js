const axios = require('axios');
const qs = require('qs');

const User = require('../models/Users');
require('dotenv').config()

module.exports = async function (req, res, next) {
  let { id, tokenExpiration, accessToken } = req.session.passport.user
  const { YAH_CL_ID, YAH_CL_SECRET, YAH_REDIRECT_URI } = process.env
  const authHeaderEncode = Buffer.from(`${YAH_CL_ID}:${YAH_CL_SECRET}`).toString('base64')
  console.log('from refreshToken.js', tokenExpiration - Date.now());
  if (tokenExpiration <= Date.now()) {
    const refreshToken = await User.findById(id)
      .then(user => user.refreshToken)
      .catch(err => console.error('refreshToken', err))
    const newTokens = await axios({
      method: 'post',
      url: 'https://api.login.yahoo.com/oauth2/get_token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${authHeaderEncode}`
      },
      data: qs.stringify({
        redirect_uri: YAH_REDIRECT_URI,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      })
    })
      .then(async response => {
        console.log('access_token', response.data.access_token);
        if (response.data) {
          const { access_token, refresh_token } = response.data;
          req.session.passport.user.tokenExpiration = Date.now() + 60 * 60 * 1000;
          req.session.passport.user.accessToken = access_token;
          const user = await User.findById(id);
          user.refreshToken = refresh_token
          await user.save();
          console.log('req.session.passport.user.accessToken', req.session.passport.user.accessToken);
          next();
        }
      })
      .catch(err => console.error('axios error', err.response))
  } else {
    next();
  }
}