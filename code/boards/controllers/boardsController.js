// Created by: Jason Dudash
// https://github.com/dudash
//
// (C) 2019
// Released under the terms of Apache-2.0 License

var moment = require('moment')
const shortid = require('shortid')
const BOARDS_COLLECTION = 'boards'

module.exports.getboards = function getboards (req, res, next) {
    req.db.get(BOARDS_COLLECTION).find({"owner":req.swagger.params.userId.value})
    .then((docs) => {
        if (docs == null) {res.sendStatus(404)}
        else {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(docs || {}, null, 2));
        }
    }).catch((err) => {
        req.debugdb('GET BOARDS failed')
        req.debugdb(err)
        res.sendStatus(500)
    })
};

module.exports.createboard = function createboard (req, res, next) {
    var newBoard = req.body
    // TODO: manual validation of the req object should go here (or let swagger handle it)
    newBoard.id = shortid.generate()
    newBoard.created_at = moment().format()
    newBoard.owner = req.swagger.params.userId.value
    // TODO: future check requesting user can access item with arg ID
    req.db.get(BOARDS_COLLECTION).insert(newBoard)
    .then((docs) => {
        // docs contains the documents inserted with added **_id** fields
        req.debugdb('INSERTED a new board')
        req.debugdb(docs)
        res.status(201).send('Created ' + docs.id)
    }).catch((err) => {
        req.debugdb('INSERT failed for a new board')
        req.debugdb(err)
        res.sendStatus(500)
    })
};

module.exports.getboard = function getboard (req, res, next) {
    // TODO: future check requesting user can access board with arg ID
    req.db.get(BOARDS_COLLECTION).findOne({'id':req.swagger.params.boardId.value})
    .then((docs) => {
        console.log(docs)
        if (docs == null) {res.sendStatus(404)}
        else {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(docs || {}, null, 2));
        }
    }).catch((err) => {
        req.debugdb('GET BOARD failed')
        req.debugdb(err)
        res.sendStatus(500)
    })
};

// TODO:
// module.exports.updateboard = function updateboard (req, res, next) {
// };

module.exports.deleteboard = function deleteboard (req, res, next) {
    // TODO: future check requesting user can delete item with arg ID
    req.db.get(BOARDS_COLLECTION).remove({'id':req.swagger.params.boardId.value})
    .then((docs) => {
        res.sendStatus(204)
    }).catch((err) => {
        req.debugdb('DEL BOARD failed')
        req.debugdb(err)
        res.sendStatus(500)
    })
};
