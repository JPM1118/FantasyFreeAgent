const router = require('express').Router();
const axios = require('axios');

const refreshToken = require('../utilities/refreshToken');

router.use(refreshToken);
router.get('/', (req, res, next) => {
  const { accessToken } = req.session.passport.user;
  const { leagues } = req.user;
  const { leagueKey } = leagues[0];
  const config = {
    headers: { 'Authorization': 'Bearer ' + accessToken }
  };
  axios.get(
    `https://fantasysports.yahooapis.com/fantasy/v2/players?format=json`,
    config
  )
    .then(response => {
      console.log(JSON.stringify(response.data, null, '  '))
      res.status(200).send(JSON.stringify(response.data, null, '  '));
    })
    .catch(err => {
      console.log('There was an error.', err.response.data)
    })
})


module.exports = router;