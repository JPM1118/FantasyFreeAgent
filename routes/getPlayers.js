const router = require('express').Router();

router.get('/', (req, res, next) => {
  res.send(req.session.passport.user)
})

module.exports = router;