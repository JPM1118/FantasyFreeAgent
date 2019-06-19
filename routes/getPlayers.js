const router = require('express').Router();

const User = require('../models/Users');
const checkTransactions = require('../routes/checkTransactions');

router.use(checkTransactions)
router.get('/', async (req, res, next) => {
  try {
    const userId = req.session.passport.user.id;
    const leagueId = req.session.league.id;
    if (req.isAuthenticated()) {
      const user = await User.findById(userId)
      const league = await user.leagues.id(leagueId)
      const players = league.players
      res.status(200).json({ players: players })
    } else {
      res.status(404).send("Not Logged In.")
    }
  } catch (e) {
    console.error(e);
  }
})

module.exports = router;