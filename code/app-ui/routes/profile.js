var express = require('express')
var router = express.Router()

/* Show users profile page or login/create account */
router.get('/', function(req, res, next) {
  res.render('profile', { title: 'Your Profile'})
})

module.exports = router
