const requestYhPlayers = require('./requestYhPlayers');
const User = require('../models/Users');
const promisify = require('util').promisify;

const checkPlayerArray = async (req, res, next) => {
  try {
    req.setTimeout(300000)
    if (req.isAuthenticated()) {
      req.session.playerArrayFull = false
      if (req.session.playerArrayFull) {
        console.log("playerArray Full")
        next()
      } else {
        const { id, accessToken } = req.session.passport.user;
        const user = await User.findById(id);
        const { leagues } = user;
        const leaguesArray = []
        Object.values(leagues).forEach(league => {
          if (league.players && league.players.length == 0) {
            leaguesArray.push(league);
          }
        })
        async function processArray(array) {
          const promises = array.map(el => requestYhPlayers(el, accessToken, id))
          await Promise.all(promises)
          console.log('done!')
        }
        // debugger;
        await processArray(leaguesArray)
        // await requestYhPlayers(leaguesArray[0], accessToken, id);
        // debugger;
        req.session.playerArrayFull = true;
        next();
      }
    } else { next() }
  } catch (e) { console.error(e) }
};

module.exports = checkPlayerArray