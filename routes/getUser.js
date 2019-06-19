const router = require('express').Router();

router.get('/', (req, res, next) => {
  const { leagues } = req.user;
  const leagueInfo = []

  for (const league of leagues) {
    leagueInfo.push({ leagueInfo: league.leagueInfo, id: league.id })
  }
  req.isAuthenticated()
    ? res.status(200).json({ id: req.user.id, name: req.user.name, guid: req.user.guid, leagues: leagueInfo })
    : res.status(200).send("Not Logged In.")
})

module.exports = router;