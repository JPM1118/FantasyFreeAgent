const router = require('express').Router();
const axios = require('axios');

const requestYhPlayers = require('../utilities/requestYhPlayers');
const checkTransactionsHelper = require('../route_helpers/checkTransactionsHelper');

router.get('/', async (req, res, next) => {
  try {
    const { accessToken, id } = req.session.passport.user;
    const { leagueKey } = req.session.league.leagueInfo;
    if (!req.session.lastTransaction) {
      req.session.lastTransaction = Date.now()
    }
    let lastTransaction = req.session.lastTransaction;
    // debugger;
    let latestTransactions = await axios.get(
      `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/transactions?format=json`,
      {
        headers: { 'Authorization': 'Bearer ' + accessToken }
      })
    // debugger;
    checkTransactionsHelper(latestTransactions, id, lastTransaction);
    let { timestamp } = latestTransactions.data.fantasy_content.league[1].transactions[0].transaction[0]
    timestamp = parseInt(timestamp + '000');
    if (lastTransaction < timestamp) {
      console.log('new transaction!')
      req.session.lastTransaction = timestamp;
      next()
      // return res.status(200).send(true);
    } else {
      console.log('players are up-to-date')
      return res.status(200).send("Players are up-to-date");
    }
  } catch (err) {
    console.error(err);
  }
})

module.exports = router