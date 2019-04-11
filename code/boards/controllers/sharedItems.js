// Created by: Jason Dudash
// https://github.com/dudash
//
// (C) 2019
// Released under the terms of Apache-2.0 License

module.exports.shareditems = function shareditems (req, res, next) {
    var result = "[{blah:shareditems}]"
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result || {}, null, 2));
};
