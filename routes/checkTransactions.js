const router = require('express').Router();
const axios = require('axios');

router.get('/', async (req, res, next) => {
  try {
    const { accessToken, id } = req.session.passport.user;
    const { leagueKey } = req.session.league;
    if (!req.session.lastTransaction) {
      req.session.lastTransaction = Date.now()
    }
    // debugger;
    let latestTransactions = await axios.get(
      `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/transactions?format=json`,
      {
        headers: { 'Authorization': 'Bearer ' + accessToken }
      })
    debugger;
    let { timestamp } = latestTransactions.data.fantasy_content.league[1].transactions[0].transaction[0]
    if (req.session.lastTransaction < timestamp) {
      console.log('new transaction!')
      req.session.lastTransaction = timestamp;
      return res.status(200).send(true);
    } else {
      console.log('players are up-to-date')
      return res.status(200).send(false);
    }
  } catch (err) {
    console.error(err);
  }
})

module.exports = router