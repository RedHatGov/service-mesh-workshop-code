var request = require('request-promise')
var express = require('express')
var router = express.Router()

// TODO
/* GET call to scrape using Google Custom Search */
router.get('/', function(req, res, next) {
    res.status(200).send('boards API version 1.0')
})


module.exports = router