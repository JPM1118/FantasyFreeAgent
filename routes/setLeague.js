const router = require('express').Router();

router.post('/', (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      req.session.league = req.body.currentLeague;
      res.status(200).send('request received')
    } else {
      res.status(404).send('user is not logged in.')
    }
  } catch (e) {
    next(e)
  }
})

module.exports = router;