const router = require('express').Router();
const passport = require('passport');

require('dotenv').config();

router.get('/login', (req, res, next) => {
  try {
    res.render('login');
  } catch (e) { next(e) }
})
router.get('/success', (req, res, next) => {
  try {
    res.render('success');
  } catch (e) { next(e) }

})
router.get('/logout', (req, res, next) => {
  try {
    req.logOut();
    res.status(200).send('you are logged out')
  } catch (e) { next(e) }

})
router.get('/yahoo', passport.authenticate('oauth2', { failureRedirect: '/login' }),
  function (req, res, next) {
    try {

    } catch (e) { next(e) }
  }
)
router.get('/yahoo/redirect', passport.authenticate('oauth2'), (req, res, next) => {
  try {
    res.redirect('/auth/success')
  } catch (e) { next(e) }
})


module.exports = router;
