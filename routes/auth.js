const router = require('express').Router()

router.get('/', (req, res) => {
  res.send('comprobando auth')
})

module.exports = router
