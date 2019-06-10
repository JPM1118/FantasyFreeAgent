const router = require('express').Router();

router.post('/', (req, res, next) => {
  // console.log(req.body.currentLeague)
  if (req.isAuthenticated()) {
    req.session.league = req.body.currentLeague;
    res.status(200).send('request received')
  } else {
    res.status(404).send('user is not logged in.')
  }
})

module.exports = router;