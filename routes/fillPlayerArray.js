const router = require('express').Router();


router.get('/', (req, res, next) => {
  try {
    res.status(200).json({ playerArrayFull: true })
  } catch (e) {
    next(e)
  }
})

module.exports = router