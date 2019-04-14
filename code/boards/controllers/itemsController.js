// Created by: Jason Dudash
// https://github.com/dudash
//
// (C) 2019
// Released under the terms of Apache-2.0 License

var moment = require('moment')
const shortid = require('shortid')
const ITEMS_COLLECTION = 'items'

module.exports.getitems = function getitems (req, res, next) {
    req.db.get(ITEMS_COLLECTION).find({'owner':req.swagger.params.userId.value})
    .then((docs) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(docs || {}, null, 2));
    }).catch((err) => {
        req.debugdb('GET ITEMS failed')
        req.debugdb(err)
        res.sendStatus(500)
    })
};

module.exports.createitem = function createitem (req, res, next) {
    var newItem = req.body
    // TODO: manual validation of the req object should go here (or let swagger handle it)
    newItem.id = shortid.generate()
    newItem.created_at = moment().format()
    newItem.owner = req.swagger.params.userId.value
    // TODO: future check requesting user can access item with arg ID
    req.db.get(ITEMS_COLLECTION).insert(newItem)
    .then((docs) => {
        // docs contains the documents inserted with added **_id** fields
        req.debugdb('INSERTED a new item')
        req.debugdb(docs)
        res.status(201).send('Created ' + docs.id)
    }).catch((err) => {
        req.debugdb('INSERT failed for a new item')
        req.debugdb(err)
        res.sendStatus(500)
    })
};

module.exports.getitem = function getitem (req, res, next) {
    // TODO: future check requesting user can access item with arg ID
    req.db.get(ITEMS_COLLECTION).findOne({'id':req.swagger.params.itemId.value})
    .then((docs) => {
        if (docs == null) {res.sendStatus(404)}
        else {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(docs || {}, null, 2));
        }
    }).catch((err) => {
        req.debugdb('GET ITEM failed')
        req.debugdb(err)
        res.sendStatus(500)
    })
};

// TODO:
// module.exports.updateitem = function updateitem (req, res, next) {
// };

module.exports.deleteitem = function deleteitem (req, res, next) {
    // TODO: future check requesting user can delete item with arg ID
    req.db.get(ITEMS_COLLECTION).remove({'id':req.swagger.params.itemId.value})
    .then((docs) => {
        res.sendStatus(204)
    }).catch((err) => {
        req.debugdb('DEL ITEM failed')
        req.debugdb(err)
        res.sendStatus(500)
    })
};