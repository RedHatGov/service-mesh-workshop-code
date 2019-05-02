// Created by: Jason Dudash
// https://github.com/dudash
//
// (C) 2019
// Released under the terms of Apache-2.0 License

var request = require('request-promise')
var express = require('express')
var router = express.Router()

/* 
Some examples for request-promise chaining commands:
https://gist.githubusercontent.com/trieloff/4889fc5f4142899c45cf2569f6654842/raw/d83bdbd1e8ea60afb39d99b926f2b2c536fe16c0/get-repos.js
*/

const GOOGLE_APIS_URL = process.env.GOOGLE_APIS_URL || 'https://www.googleapis.com/customsearch/v1/siterestrict'
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyDRdgirA2Pakl4PMi7t-8LFfnnjEFHnbY4'
const GOOGLE_CX = process.env.GOOGLE_CX || '005627457786250373845:lwanzyzfwji'

/* GET call to scrape using Google Custom Search */
router.get('/custom_search', function(req, res, next) {
    var queryterm = process.env.DEBUG_FORCED_CONTEXT_VALUE || ''
    //  TODO: filter queryterm for unallowable characters

    var google_request_options = {
        method: 'GET',
        uri: GOOGLE_APIS_URL,
        qs: {
            'key': GOOGLE_API_KEY,
            'cx': GOOGLE_CX,
            'q': req.query.term
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
    request(google_request_options)
    .then(function (result) {
        var reduced = []
        if (result.hasOwnProperty('items')) {
            reduced = result.items.map(function(item) {
                return {
                    'link':item.link,
                    'thumbnail': item.pagemap.cse_thumbnail,
                    'title': item.title,
                    'snippet': item.snippet
                }
            })
        }
        req.debug('RETURNING GOOD RESULTS:')
        req.debug(reduced)
        res.status(200).json(reduced)
    })
    .catch(function (err) {
        req.debug('RESPONDING with error')
        req.debug(err)
        console.log('GOOGLE REQUEST ERROR - RETURNING 500')
        res.status(500).json({'oops': err})
    })
})

module.exports = router