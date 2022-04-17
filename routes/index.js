'use strict';
var express = require('express');
var router = express.Router();

let index_controller = require('../controllers/index_controller');
/* GET home page. */
router.get('/', index_controller.username_get)

router.post('/', index_controller.username_post)

module.exports = router;