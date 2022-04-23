'use strict';
var express = require('express');
var router = express.Router();

let game_controller = require('../controllers/game_controller');

router.get('/', game_controller.game_start)

module.exports = router;