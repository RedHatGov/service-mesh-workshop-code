var express = require('express')
var router = express.Router()
var moment = require('moment')
var request = require('request-promise')

/* GET dashboard page. */
router.get('/', function(req, res, next) {
  var userboards = ''
  var user = res.locals.user
  const boardsURI = req.HTTP_PROTOCOL + req.BOARDS_SVC_HOST + ':' + req.BOARDS_SVC_PORT + '/' + user + '/boards'
  req.debug('GET from boards SVC at: ' + boardsURI)
  var request_options = {
      method: 'GET',
      uri: boardsURI,
      headers: {
          'user-agent': req.header('user-agent'),
          'x-request-id': req.header('x-request-id'),
          'x-b3-traceid': req.header('x-b3-traceid'),
          'x-b3-spanid': req.header('x-b3-spanid'),
          'x-b3-parentspanid': req.header('x-b3-parentspanid'),
          'x-b3-sampled': req.header('x-b3-sampled'),
          'x-b3-flags': req.header('x-b3-flags'),
          'x-ot-span-context': req.header('x-ot-span-context'),
          'b3': req.header('b3')
      },
      json: true // Automatically parses the JSON string in the response
  }
  request(request_options)
  .then(function (result) {
    userboards = result
    if (req.app.locals.errorAlertText != null && req.app.locals.errorAlertText != '') { // this can come from adding a new board failures too
      var errorAlertText = req.app.locals.errorAlertText
      req.app.locals.errorAlertText = null // clear the error now that we are rendering it
      res.render('dashboard', { title: 'Cut and Paster', user:user, boards: userboards, errorAlert: true, errorAlertText: errorAlertText})
    }
    else
      res.render('dashboard', { title: 'Cut and Paster', user:user, boards: userboards, errorAlert: false })
  })
  .catch(function (err) {
      req.debug('ERROR GETTING DATA FROM BOARDS SERVICE')
      req.debug(err)
      res.render('dashboard', { title: 'Cut and Paster', user:user, boards: userboards, errorAlert: true, errorAlertText: err.toString() })
  })
})

/* POST from form submission to create a board */
router.post('/newboard', function(req, res) {
  req.debug(req.body)
  var newBoardName = req.body.newboardname
  var newBoardDescription = req.body.newboarddesc
  var newBoardIsPrivate = req.body.newboardprivate
  var user = res.locals.user
  // TODO: validate data
  const boardsURI = req.HTTP_PROTOCOL + req.BOARDS_SVC_HOST + ':' + req.BOARDS_SVC_PORT + '/' + user + '/boards'
  req.debug('POST to boards SVC at: ' + boardsURI)
  var request_options = {
      method: 'POST',
      uri: boardsURI,
      body: {
        name: newBoardName,
        description: newBoardDescription,
        private: newBoardIsPrivate,
        items: []
      },
      headers: {
          'user-agent': req.header('user-agent'),
          'x-request-id': req.header('x-request-id'),
          'x-b3-traceid': req.header('x-b3-traceid'),
          'x-b3-spanid': req.header('x-b3-spanid'),
          'x-b3-parentspanid': req.header('x-b3-parentspanid'),
          'x-b3-sampled': req.header('x-b3-sampled'),
          'x-b3-flags': req.header('x-b3-flags'),
          'x-ot-span-context': req.header('x-ot-span-context'),
          'b3': req.header('b3')
      },
      json: true // Automatically parses the JSON string in the response
  }
  request(request_options)
  .then(function (result) {
      //req.debug(result)
      req.app.locals.errorAlertText = null
      res.redirect('/')
  })
  .catch(function (err) {
      req.debug('ERROR POSTING DATA TO CREATE NEW BOARD')
      req.debug(err)
      req.app.locals.errorAlertText = err.toString()
      res.redirect('/')
  })
})

module.exports = router
