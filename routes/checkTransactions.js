const router = require('express').Router();
const axios = require('axios');

const checkTransactionsHelper = require('../route_helpers/checkTransactionsHelper');

// router.get('/', async (req, res, next) => {
module.exports = async (req, res, next) => {
  try {
    const { accessToken, id } = req.session.passport.user;
    const { leagueKey } = req.session.league.leagueInfo;
    const leagueId = req.session.league.id;
    if (!req.session.lastTransaction) {
      req.session.lastTransaction = Date.now()
    }
    let lastTransaction = req.session.lastTransaction;
    let latestTransactions = await axios.get(
      `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/transactions?format=json`,
      {
        headers: { 'Authorization': 'Bearer ' + accessToken }
      })
    let { timestamp } = latestTransactions.data.fantasy_content.league[1].transactions[0].transaction[0]
    timestamp = parseInt(timestamp + '000');

    if (lastTransaction < timestamp) {
      console.log('new transaction!')
      await checkTransactionsHelper(latestTransactions, id, leagueId, lastTransaction);
      req.session.lastTransaction = timestamp;
      // res.status(200).send("Players have been updated.");
      next()
    } else {
      console.log('players are up-to-date')
      // res.status(200).send("Players are already up-to-date.");
      next()
    }
  } catch (err) {
    console.error(err);
  }
}

// module.exports = router