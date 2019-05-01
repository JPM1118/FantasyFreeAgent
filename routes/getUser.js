const router = require('express').Router();

router.get('/', (req, res, next) => {
  // console.log(req.sessionID)
  console.log(req.isAuthenticated());
  req.isAuthenticated()
    ? res.status(200).json({ id: req.user.id, name: req.user.name, guid: req.user.guid, leagues: req.user.leagues })
    : res.status(200).send("Not Logged In.")
})

module.exports = router;