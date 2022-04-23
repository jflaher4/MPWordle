const querystring = require('query-string')

exports.lobby_start = function (req, res, next) {
    res.render('lobby', { title: 'Game Lobby' , username : req.query['uname'] });
}

exports.lobby_leave = function (req, res, next) {
    var username = req.body.uname;
    var playerId = req.body.playerId;

    const qs = querystring.stringify({ 'uname': username, 'playerId' : playerId});
    res.redirect('/game?'+qs);
}
