const router = require('express').Router();
const passport = require('passport');

router.get('/login', (req, res) => {
  res.render('login');

})

router.get('/logout', (req, res) => {
  res.send('logging out');
})

router.get('/google', passport.authenticate('google', {
  scope: ['profile'],
}))

router.get('/google/redirect', (req, res) => {
  res.send("you reached google callback uri");
})
router.get('/yahoo', passport.authenticate('oauth2', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/')
)

router.get('/yahoo/redirect', passport.authenticate('oauth2'), (req, res) => {
  res.redirect('/')
})


module.exports = router;
