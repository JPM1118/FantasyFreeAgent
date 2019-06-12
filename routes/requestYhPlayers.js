const router = require('express').Router();
const axios = require('axios');

const formatJson = require('../utilities/formatJson');
const transformResData = require('../route_helpers/getPlayerHelper');
const User = require('../models/Users');


module.exports = async function (req, res, next) {
  try {
    const { accessToken, id } = req.session.passport.user;
    const { leagueKey } = req.session.league.leagueInfo;
    const leagueId = req.session.league._id
    const config = {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    };
    let playerArray = []

    let count = 25;
    let start = 0;
    while (count === 25) {
      console.log(`count: ${count}, start: ${start}`);
      let response = await axios.get(
        `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/players;start=${start};sort=NAME/ownership?format=json`,
        config
      )
      let resData = response.data.fantasy_content.league[1].players
      // formatJson(resData)
      playerArray = [...playerArray, ...transformResData(resData)];
      count = response.data.fantasy_content.league[1].players.count;
      start += count;
      // formatJson(playerArray)  
    }
    const user = await User.findById(id);
    const league = await user.leagues.id(leagueId)
    league.players = playerArray
    await user.save();
    console.log('Yahoo players fetched.')
    next()
  } catch (e) {
    console.error(e);
  }
}



