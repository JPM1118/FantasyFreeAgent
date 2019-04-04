const router = require('express').Router();

router.get('/', (req, res, next) => {
  console.log(req.session.passport.user);
})

module.exports = router;