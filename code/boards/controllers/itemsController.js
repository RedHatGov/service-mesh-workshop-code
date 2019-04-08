// Created by: Jason Dudash
// https://github.com/dudash
//
// (C) 2019
// Released under the terms of Apache-2.0 License

module.exports.getitems = function getitems (req, res, next) {
    var result = "[{blah:getitems}]"
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result || {}, null, 2));
};

module.exports.createitem = function createitem (req, res, next) {
    var result = "[{blah:createitem}]"
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result || {}, null, 2));
};

module.exports.getitem = function getitem (req, res, next) {
    var result = "[{blah:getitem}]"
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result || {}, null, 2));
};

module.exports.updateitem = function updateitem (req, res, next) {
    var result = "[{blah:updateitem}]"
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result || {}, null, 2));
};

module.exports.deleteitem = function deleteitem (req, res, next) {
    var result = "[{blah:deleteitem}]"
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result || {}, null, 2));
};