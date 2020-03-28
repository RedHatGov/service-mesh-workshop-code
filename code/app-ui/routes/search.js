var express = require('express')
var router = express.Router()
var moment = require('moment')
var request = require('request-promise')

/* POST (search form submission) */
router.post('/', function(req, res) {
    var searchTerm = req.body.term
    req.debug('searching for ' + searchTerm)
    if (searchTerm===null || searchTerm.length < 1) { 
        req.debug('ignoring zero length searchTerm')
        res.redirect('/')
    }
    res.render('search', { title: 'Search Results', searchTerm: searchTerm })

    // TODO: build the search service and call it

    // const searchURI = req.HTTP_PROTOCOL + req.SEARCH_SVC_HOST + ':' + req.SEARCH_SVC_PORT + '/search'
    // req.debug('POST to boards SVC at: ' + boardsURI)
    // var request_options = {
    //     method: 'GET',
    //     uri: searchURI,
    //     body: {
    //         owner: res.locals.user,
    //         type: 'string',
    //         raw: searchTerm,
    //         name: ''
    //     },
    //     headers: {
    //         'User-Agent': req.header('user-agent'),
    //         'Authorization': 'Bearer ' + res.locals.authToken,
    //         'x-request-id': req.header('x-request-id'),
    //         'x-b3-traceid': req.header('x-b3-traceid'),
    //         'x-b3-spanid': req.header('x-b3-spanid'),
    //         'x-b3-parentspanid': req.header('x-b3-parentspanid'),
    //         'x-b3-sampled': req.header('x-b3-sampled'),
    //         'x-b3-flags': req.header('x-b3-flags'),
    //         'x-ot-span-context': req.header('x-ot-span-context'),
    //         'b3': req.header('b3')
    //     },
    //     json: true // Automatically parses the JSON string in the response
    // }
    // request(request_options)
    // .then(function (result) {
    //     req.debug(result)
    //     res.redirect('back')
    // })
    // .catch(function (err) {
    //     req.debug('ERROR COMMUNICATING WITH TO SEARCH SERVICE')
    //     req.debug(err)
    //     res.redirect('back')
    // })
})

module.exports = router
