'use strict';
var express = require('express');
var router = express.Router();

let landing_controller = require('../controllers/landing_controller');
/* GET home page. */
router.get('/', landing_controller.username_get)

router.post('/', landing_controller.username_post)

module.exports = router;