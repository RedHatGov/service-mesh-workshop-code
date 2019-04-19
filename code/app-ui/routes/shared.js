var express = require('express')
var router = express.Router()
var moment = require('moment')
var request = require('request-promise')

/* GET shared page. */
router.get('/', function(req, res, next) {
    const boardsURI = 'http://' + req.BOARDS_SVC_HOST + ':' + req.BOARDS_SVC_PORT + '/shareditems'
    req.debug('GET from boards SVC at: ' + boardsURI)
    var request_options = {
        method: 'GET',
        uri: boardsURI,
        headers: {
            'User-Agent': req.SERVICE_NAME
        },
        json: true // Automatically parses the JSON string in the response
    }
    request(request_options)
    .then(function (result) {
        // req.debug('GOT SHARED ITEMS:')
        // req.debug(result)
        res.render('shared', { title: 'Cut and Paster', board: {name: 'Shared Items'}, items: result, errorWithItems: false })
    })
    .catch(function (err) {
        req.debug('ERROR GETTING DATA FROM BOARDS SERVICE')
        req.debug(err)
        res.render('shared', { title: 'Cut and Paster', board: {name: 'Shared Items'}, items: [], errorWithItems: true })
    })
})

/* POST (form submission) to add an item to shared items list */
router.post('/paste', function(req, res) {
    var pasteData = req.body.pastedata
    if (pasteData.length < 1) { 
        res.debug('ignoring zero length add to shared board')
        return 
    }
    const boardsURI = 'http://' + req.BOARDS_SVC_HOST + ':' + req.BOARDS_SVC_PORT + '/shareditems'
    req.debug('POST to boards SVC at: ' + boardsURI)
    var request_options = {
        method: 'POST',
        uri: boardsURI,
        body: {
            owner: 'userX',
            type: 'string',
            raw: pasteData,
            name: ''
        },
        headers: {
            'User-Agent': req.SERVICE_NAME
        },
        json: true // Automatically parses the JSON string in the response
    }
    request(request_options)
    .then(function (result) {
        // req.debug(result)
        res.redirect("/shared")
    })
    .catch(function (err) {
        req.debug('ERROR POSTING DATA TO BOARDS SERVICE')
        req.debug(err)
        res.redirect("/shared")
    })
})

module.exports = router
