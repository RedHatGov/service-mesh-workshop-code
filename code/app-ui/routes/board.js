var express = require('express')
var router = express.Router()
var moment = require('moment')
var request = require('request-promise')

/* GET board's page. */
router.get('/:boardId', function(req, res, next) {
    var user = res.locals.user
    const boardsGetURI = req.HTTP_PROTOCOL + req.BOARDS_SVC_HOST + ':' + req.BOARDS_SVC_PORT + '/' + user + '/boards/' + req.params.boardId
    req.debug('GET from boards SVC at: ' + boardsGetURI)
    var request_get_options = {
        method: 'GET',
        uri: boardsGetURI,
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
    var itemsData = []
    request(request_get_options)
    .then(function (getresult) {
        // req.debug(getresult)  // uncomment to show board JSON
        var itemsData = []
        var itemListPromises = getresult.items.map(function(itemId) { return getItemRequest(req, user, itemId, itemsData)});
        Promise.all(itemListPromises).then(function(itemsData) {
            res.render('board', { title: 'Cut and Paster', board: getresult, items: itemsData, errorWithItems: false })
        })
        .catch(function (err) {
            req.debug('ERROR GETTING DATA FROM BOARDS SERVICE')
            req.debug(err)
            res.render('board', { title: 'Cut and Paster', board:  getresult, items: itemsData, errorWithItems: true })
        })
    })
    .catch(function (err) {
        req.debug('ERROR GETTING DATA FROM BOARDS SERVICE')
        req.debug(err)
        res.render('board', { title: 'Cut and Paster', board:  getresult, items: itemsData, errorWithItems: true })
    })
})

function getItemRequest(req, user, itemId, itemsData) {
    const boardsGetItemURI = req.HTTP_PROTOCOL + req.BOARDS_SVC_HOST + ':' + req.BOARDS_SVC_PORT + '/' + user + '/items/' + itemId
    req.debug('GET from boards SVC at: ' + boardsGetItemURI)
    var request_getitem_options = {
        method: 'GET',
        uri: boardsGetItemURI,
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
    return request(request_getitem_options)
    .then(function (getitemresult) {
        // req.debug(getitemresult)  // uncomment to show item JSON
        return getitemresult
    })
    .catch(function (err) {
        req.debug('ERROR GETTING ITEM DATA FROM BOARDS SERVICE')
        req.debug(err)
        return err
    })
}

/* POST (form submission) to add an item to board items list */
router.post('/:boardId/paste', function(req, res) {
    var pasteData = req.body.pastedata
    if (pasteData.length < 1) { 
        req.debug('ignoring zero length add to user board')
        return 
    }
    var user = res.locals.user
    var board = JSON.parse(req.body.board)
    const boardsNewItemURI = req.HTTP_PROTOCOL + req.BOARDS_SVC_HOST + ':' + req.BOARDS_SVC_PORT + '/' + user + '/items'
    req.debug('POST to boards SVC at: ' + boardsNewItemURI)
    var request_post_options = {
        method: 'POST',
        uri: boardsNewItemURI,
        body: {
            owner: user,
            type: 'string',
            raw: pasteData,
            name: ''
        },
        headers: {
            'User-Agent': req.header('user-agent'),
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
    request(request_post_options) // ADD A NEW ITEM
    .then(function (postresult) {
        req.debug('SUCCESS CREATED NEW ITEM')
        req.debug(postresult)
        var itemId = postresult.split(' ')[1]
        if (board.items == null || board.items.length < 1) {
            board.items = [itemId]
        }
        else {
            board.items.push(itemId)
        }
        // req.debug(board)
        const boardsUpdateURI = req.HTTP_PROTOCOL + req.BOARDS_SVC_HOST + ':' + req.BOARDS_SVC_PORT + '/' + user + '/boards/' + req.params.boardId
        req.debug('PUT to boards SVC at: ' + boardsUpdateURI)
        var request_put_options = {
            method: 'PUT',
            uri: boardsUpdateURI,
            body: board,
            headers: {
                'User-Agent': req.header('user-agent'),
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
        request(request_put_options) // UPDATE BOARD TO ADD NEW ITEM IN LIST
        .then(function (putresult) {
            req.debug('SUCCESS ADDED NEW ITEM TO BOARD')
            req.debug(putresult)
            res.redirect('back')
        })
        .catch(function (err) {
            req.debug('ERROR UPDATING DATA FOR BOARD')
            req.debug(err)
            res.redirect('back')
        })
    })
    .catch(function (err) {
        req.debug('ERROR CREATING NEW ITEM')
        req.debug(err)
        res.redirect('back')
    })
})

module.exports = router
