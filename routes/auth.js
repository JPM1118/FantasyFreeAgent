const router = require('express').Router();
const passport = require('passport');

require('dotenv').config();

router.get('/login', (req, res) => {
  res.render('login');
})
router.get('/success', (req, res) => {
  res.render('success');
})
router.get('/logout', (req, res) => {
  req.logOut();
  // res.redirect(`${process.env.FRONTEND_HOME}`);
  // res.render('login');
  res.status(200).send('you are logged out')
})
router.get('/yahoo', passport.authenticate('oauth2', { failureRedirect: '/login' }),
  function (req, res) {
  }
)
router.get('/yahoo/redirect', passport.authenticate('oauth2'), (req, res) => {
  res.redirect('/auth/success')
  // return res.sendStatus(200)
})


module.exports = router;
