var express = require('express');
var router = express.Router();
var moment = require('moment');
var kafka = require('../kafka-events');
kafka.init();

/* GET home page. */
// get JUST the last 10 items from DB and pass into render
// and make sure to fetch most recent first
router.get('/', function(req, res, next) {
  kafka.sender.sendUserPayload(['pageload', '', '', 'someone asked for /'], function(err, data) {
    if (err) {
      console.log('kafka error ' + err);
    } else {
      console.log(data);
    }
  });
  alldocs = "";
  res.render('index', { title: 'Cut and Paste', itemsSubSet: alldocs });
});

/* non-api POST to add an item */
router.post('/paste', function(req, res) {
  var pasteData = req.body.pastedata;
  if (pasteData.length < 1) { 
    console.log('ignoring zero length add');
    return; 
  } // no empty data
  var stampit = moment().valueOf();
  console.log(stampit + ' pasting: ' + pasteData);
  res.redirect("/");
});

module.exports = router;
