exports.game_start = function (req, res, next) {
    console.log("WTF")
    res.render('game', { title: 'Game Lobby' });
}