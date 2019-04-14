// Created by: Jason Dudash
// https://github.com/dudash
//
// (C) 2019
// Released under the terms of Apache-2.0 License

var moment = require('moment')
const shortid = require('shortid')
const ITEMS_COLLECTION = 'shared_items'

module.exports.shareditems = function shareditems (req, res, next) {
    req.db.get(ITEMS_COLLECTION).find({})
    .then((docs) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(docs || {}, null, 2));
    }).catch((err) => {
        req.debugdb('GET SHARED ITEMS failed')
        req.debugdb(err)
        res.sendStatus(500)
    })
};

module.exports.createitem = function createitem (req, res, next) {
    var newItem = req.body
    newItem.id = shortid.generate()
    newItem.created_at = moment().format()
    // TODO: manual validation of the req object should go here (or let swagger handle it)
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