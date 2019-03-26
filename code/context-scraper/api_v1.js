var request = require('request-promise')
var express = require('express')
var router = express.Router()

const GOOGLE_APIS_URL = process.env.GOOGLE_APIS_URL || 'https://www.googleapis.com/customsearch/v1/siterestrict'
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyDRdgirA2Pakl4PMi7t-8LFfnnjEFHnbY4'
const GOOGLE_CX = process.env.GOOGLE_CX || '005627457786250373845:lwanzyzfwji'

/* GET call to scrape using Google Custom Search */
router.get('/custom_search', function(req, res, next) {
    var google_request_options = {
        method: 'GET',
        uri: GOOGLE_APIS_URL,
        qs: {
            'key': GOOGLE_API_KEY,
            'cx': GOOGLE_CX,
            'q': process.env.DEBUG_FORCED_CONTEXT_VALUE || 'jason'
        },
        headers: {
            'User-Agent': req.SERVICE_NAME
        },
        json: true // Automatically parses the JSON string in the response
    }
    request(google_request_options)
    .then(function (result) {
        // TODO filter stuff out here
        // TODO combine with additional API calls as needed
        //console.log(result)
        res.status(200).json(result)
    })
    .catch(function (err) {
        console.log(err)
        res.status(500).json({'oops': err})
    })
})

module.exports = router