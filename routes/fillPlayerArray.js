const router = require('express').Router();


router.get('/', (req, res, next) => {
  try {
    // debugger;
    res.status(200).json({ playerArrayFull: true })
  } catch (err) {
    console.error(err)
  }
})

module.exports = router