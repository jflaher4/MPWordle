
exports.lobby_start = function (req, res, next) {
    res.render('lobby', { title: 'Game Lobby' , username : req.query['uname'] });
}

exports.lobby_leave = function (req, res, next) {
    //res.redirect('/game')
    console.log("HI");
}
