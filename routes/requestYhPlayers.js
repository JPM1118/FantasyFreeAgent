const router = require('express').Router();
const axios = require('axios');

const formatJson = require('../utilities/formatJson');
const transformResData = require('../route_helpers/getPlayerHelper');
const refreshToken = require('../utilities/refreshToken');
const User = require('../models/Users');


router.use(refreshToken);
router.get('/', async (req, res, next) => {
  try {
    const { accessToken, id } = req.session.passport.user;
    const { leagueKey } = req.session.league;
    const leagueId = req.session.league._id
    const config = {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    };
    let playerArray = []

    let count = 25;
    let start = 0;
    while (count === 25) {
      console.log(`count: ${count}, start: ${start}`);
      await axios.get(
        `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/players;start=${start};sort=NAME/ownership?format=json`,
        config
      )
        .then(response => {
          let resData = response.data.fantasy_content.league[1].players
          // formatJson(resData)
          playerArray = [...playerArray, ...transformResData(resData)];
          count = response.data.fantasy_content.league[1].players.count;
          start += count;
          // formatJson(playerArray)
        })
        .catch(err => {
          console.log('There was an error.', err)
        })
    }
    const user = await User.findById(id);
    const league = await user.leagues.id(leagueId)
    league.players = playerArray
    await user.save();
    return res.status(200).send('players updated successfully.')
  } catch (e) {
    console.error(e);
  }
})


module.exports = router

