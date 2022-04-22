'use strict';
var express = require('express');
var router = express.Router();

let lobby_controller = require('../controllers/lobby_controller');

router.get('/', lobby_controller.lobby_start)

module.exports = router;