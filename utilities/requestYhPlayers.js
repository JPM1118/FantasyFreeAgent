const axios = require('axios');

const transformResData = require('./getPlayerHelper');
const User = require('../models/Users');


const requestYhPlayers = async (league, accessToken, userId) => {
  try {
    // debugger;
    const { leagueKey } = league.leagueInfo;
    const leagueId = league.id;
    const config = {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    };
    let playerArray = []

    let count = 25;
    let start = 0;
    while (count === 25) {
      let response = await axios.get(
        `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/players;start=${start};sort=NAME/ownership?format=json`,
        config
      )
      let resData = response.data.fantasy_content.league[1].players
      playerArray = [...playerArray, ...transformResData(resData)];
      count = response.data.fantasy_content.league[1].players.count;
      start += count;
    }
    const user = await User.findById(userId);
    const editedLeague = await user.leagues.id(leagueId)
    editedLeague.players = playerArray
    await user.save();
    return 'finished';
  } catch (e) {
    console.error(e)
  }
}

module.exports = requestYhPlayers



