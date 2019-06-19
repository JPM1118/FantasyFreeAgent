const requestYhPlayers = require('./requestYhPlayers');
const User = require('../models/Users');

module.exports = async function (req, res, next) {
  if (req.session.playerArrayFull) {
    console.log("playerArray Full")
    next()
  } else {
    const { id, accessToken } = req.session.passport.user;
    const user = await User.findById(id);
    const { leagues } = user;
    Object.values(leagues).forEach(async league => {
      if (league.players && league.players.length == 0) {
        await requestYhPlayers(league, accessToken, id)
      }
      req.session.playerArrayFull = true;
    })
    next();
  }
};