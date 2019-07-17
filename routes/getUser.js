const router = require('express').Router();

router.get('/', (req, res, next) => {
  const loggedIn = req.isAuthenticated()
  const playerArrayFull = req.session.playerArrayFull ? true : false;
  // const playerArrayFull = false;
  console.log(loggedIn)
  if (loggedIn) {
    const { leagues } = req.user;
    const leagueInfo = []

    for (const league of leagues) {
      leagueInfo.push({ leagueInfo: league.leagueInfo, id: league.id })
    }
    res.status(200).json({
      user: {
        id: req.user.id,
        name: req.user.name,
        guid: req.user.guid,
        leagues: leagueInfo
      },
      loggedIn,
      playerArrayFull
    })
  } else {
    res.status(200).json({ loggedIn })
  }
})

module.exports = router;