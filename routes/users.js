const router = require('express').Router()

//get a user
router.get("/", (req, res) => {
  res.send("I am user route")
});

module.exports = router
