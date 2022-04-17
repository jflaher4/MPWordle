'use strict';
var express = require('express');
var router = express.Router();

console.log("hi")

let index = require('../controllers/index');
/* GET home page. */
router.get('/', index.index)

module.exports = router;