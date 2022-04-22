
exports.lobby_start = function (req, res, next) {
    res.render('lobby', { title: 'Game Lobby' , username : req.query['uname'] });
}
