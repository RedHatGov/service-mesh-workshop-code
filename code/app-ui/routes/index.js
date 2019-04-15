var express = require('express')
var router = express.Router()
var moment = require('moment')

/* GET home page. */
router.get('/', function(req, res, next) {
  var userboards = ''
  res.render('dashboard', { title: 'Cut and Paster', boards: userboards })
})

/* form POST to add an item */
router.post('/paste', function(req, res) {
  var pasteData = req.body.pastedata
  if (pasteData.length < 1) { 
    console.log('ignoring zero length add')
    return 
  } // no empty data
  var stampit = moment().valueOf()
  console.log(stampit + ' pasting: ' + pasteData)
  // TODO redirect into current board view
  res.redirect("/")
})

/* local GET to create a board */
router.get('/newboard', function(req, res) {
  // TODO create
  // TODO redirect into new board view
  res.redirect("/")
})

module.exports = router
