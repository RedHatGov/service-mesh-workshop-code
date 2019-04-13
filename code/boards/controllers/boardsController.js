// Created by: Jason Dudash
// https://github.com/dudash
//
// (C) 2019
// Released under the terms of Apache-2.0 License

const BOARDS_COLLECTION = 'boards'

module.exports.createboard = function createboard (req, res, next) {
    var newBoard = req.body
    console.log(req)
    // TODO: manual validation of the req object should go here (or let swagger handle it)
    // req.db.get(BOARDS_COLLECTION).insert(newBoard)
    // .then((docs) => {
    //     // docs contains the documents inserted with added **_id** fields
    //     req.debugdb('INSERTED a new board')
    //     req.debugdb(docs)
    //     res.sendStatus(201)
    // }).catch((err) => {
    //     req.debugdb('INSERT failed for a new board')
    //     req.debugdb(err)
    //     res.sendStatus(500)
    // })
    res.sendStatus(500)
};

module.exports.getboard = function getboard (req, res, next) {
    var result = req.db.get(BOARDS_COLLECTION).findOne({'id':req.swagger.params.boardId.value})
    .then((docs) => {
        if (docs == null) {res.send(404)}
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
//     var result = "[{blah:updateboard}]"
//     res.setHeader('Content-Type', 'application/json');
//     res.end(JSON.stringify(result || {}, null, 2));
// };

// TODO:
// module.exports.deleteboard = function deleteboard (req, res, next) {
//     var result = "[{blah:deleteboard}]"
//     res.setHeader('Content-Type', 'application/json');
//     res.end(JSON.stringify(result || {}, null, 2));
// };
