const router = require('express').Router();

const User = require('../models/Users');


router.get('/', async (req, res, next) => {

  const userId = req.session.passport.user.id;
  const leagueId = req.session.league.id;
  try {
    if (req.isAuthenticated()) {
      console.log(league);
      const players = await User.findById(userId)
        .then(user => {
          const league = user.players.id(leagueId)
          return league.players
        })
        .catch(e => { console.error(e) })
      res.status(200).json({ players: players })
    } else {
      res.status(404).send("Not Logged In.")
    }
  } catch (e) {
    console.error(e);
  }
})

module.exports = router;