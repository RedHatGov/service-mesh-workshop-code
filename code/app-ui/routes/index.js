var express = require('express')
var router = express.Router()
var moment = require('moment')
var request = require('request-promise')

/* GET dashboard page. */
router.get('/', function(req, res, next) {
  var userboards = ''
  res.render('dashboard', { title: 'Cut and Paster', boards: userboards })
})

/* POST from form submission to create a board */
router.post('/newboard', function(req, res) {
  var newBoardData = req.body.newboarddata
  var user = 'userX'
  // TODO: validate data
  const boardsURI = 'http://' + req.BOARDS_SVC_HOST + ':' + req.BOARDS_SVC_PORT + '/' + user + '/boards'
  req.debug('POST to boards SVC at: ' + boardsURI)
  var request_options = {
      method: 'POST',
      uri: boardsURI,
      body: {
        name: newBoardData.name,
        description: newBoardData.description,
        items: newBoardData.items
      },
      headers: {
          'User-Agent': req.SERVICE_NAME
      },
      json: true // Automatically parses the JSON string in the response
  }
  request(request_options)
  .then(function (result) {
      // req.debug(result)
      res.redirect("/")
  })
  .catch(function (err) {
      req.debug('ERROR POSTING DATA TO CREATE NEW BOARD')
      req.debug(err)
      res.redirect("/")
  })
})

module.exports = router
