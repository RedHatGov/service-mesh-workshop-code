// Created by: Jason Dudash
// https://github.com/dudash
//
// (C) 2019
// Released under the terms of Apache-2.0 License

module.exports.createboard = function createboard (req, res, next) {
    var result = "[{blah:createboard}]"
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result || {}, null, 2));
};

module.exports.getboard = function getboard (req, res, next) {
    var result = "[{blah:getboard}]"
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result || {}, null, 2));
};

module.exports.updateboard = function updateboard (req, res, next) {
    var result = "[{blah:updateboard}]"
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result || {}, null, 2));
};

module.exports.deleteboard = function deleteboard (req, res, next) {
    var result = "[{blah:deleteboard}]"
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result || {}, null, 2));
};
