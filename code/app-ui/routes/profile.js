var express = require('express')
var router = express.Router()

/* Show users profile page or login/create account */
router.get('/', function(req, res, next) {
  var user = res.locals.user
  res.render('profile', { title: 'Your Profile'})
})

/* GET a user's page. */
router.get('/:userId', function(req, res, next) {
  var user = res.locals.user
  const profileGetURI = req.HTTP_PROTOCOL + req.PROFILE_SVC_HOST + ':' + req.PROFILE_SVC_PORT + '/' + req.params.userId 
  req.debug('GET from profile SVC at: ' + profileGetURI)
  var request_get_options = {
      method: 'GET',
      uri: profileGetURI,
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
  var profileData = []
  request(request_get_options)
  .then(function (getresult) {
      req.debug(getresult)  // uncomment to show JSON
      var profileData = []
      var itemListPromises = getresult.items.map(function(itemId) { return getItemRequest(req, user, itemId, profileData)});
      Promise.all(itemListPromises).then(function(profileData) {
          res.render('profile', { title: 'User Profile', profile: getresult, errorWithProfile: false })
      })
      .catch(function (err) {
          req.debug('ERROR GETTING DATA FROM PROFILE SERVICE')
          req.debug(err)
          res.render('profile', { title: 'User Profile', profile:  getresult, errorWithProfile: true })
      })
  })
  .catch(function (err) {
      req.debug('ERROR GETTING DATA FROM PROFILE SERVICE')
      req.debug(err)
      res.render('profile', { title: 'User Profile', profile:  getresult, errorWithProfile: true })
  })
})

module.exports = router
