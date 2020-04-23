var express = require('express')
var router = express.Router()
var moment = require('moment')
var request = require('request-promise')

/* Show users profile page or login/create account */
router.get('/', function(req, res, next) {
  
  // TODO: if not logged in redirect to login page or jump page to allow login / registration
  // req.auth.checkSso()
  // this might change some assumptions for the service mesh workshop, need to update that 
  // when we implement this - see redhatgov.io

  const user = res.locals.user
  const userId = res.locals.userId  // this will be set if we are logged in, or fake if we are DEBUGGING
  getAndRender(req, res, next, userId)
})

/* GET a user's page. */
router.get('/:userId', function(req, res, next) {
  var user = res.locals.user
  var userId = req.params.userId
  getAndRender(req, res, next, userId)
})

function getAndRender(req, res, next, userId) {
  const profileGetURI = req.HTTP_PROTOCOL + req.PROFILE_SVC_HOST + ':' + req.PROFILE_SVC_PORT + '/users/' + userId
  req.debug('GET from profile SVC at: ' + profileGetURI)
  var request_get_options = {
      method: 'GET',
      uri: profileGetURI,
      headers: {
          'user-agent': req.header('user-agent'),
          'Authorization': 'Bearer ' + res.locals.authToken,
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
  var profileData = []
  var profileImage = []
  request(request_get_options)
  .then(function (getresult) {
      req.debug(getresult)  // uncomment to show JSON
      let title = getresult.firstName + "\'s Profile"
      let styleId = getresult.styleId

      // TODO: get the profile image

      res.render('profile', { title: title, profile: getresult, isMyProfile: false, errorWithProfile: false, style: styleId })
  })
  .catch(function (err) {
      req.debug('ERROR GETTING DATA FROM PROFILE SERVICE')
      req.debug(JSON.stringify(err))

      if (JSON.stringify(err).includes('ECONNREFUSED')) {
        res.render('profile', { title: 'Unknown User', errorWithProfile: true, errorAlert: true, errorAlertText: err.message, style: 0 })
      } else {
        res.render('profile', { title: 'Unknown User', errorWithProfile: true, style: 0 })
      }
  })
}

module.exports = router
