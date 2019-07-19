const requestYhPlayers = require('../utilities/requestYhPlayers');
const User = require('../models/Users');

const checkPlayerArray = async (req, res, next) => {
  try {
    req.setTimeout(300000)
    if (req.isAuthenticated()) {
      if (req.session.playerArrayFull) {
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
        }
        await processArray(leaguesArray)
        req.session.playerArrayFull = true;
        next();
      }
    } else { next() }
  } catch (e) { next(e) }
};

module.exports = checkPlayerArray