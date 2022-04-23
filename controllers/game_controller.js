exports.game_start = function (req, res, next) {
    res.render('game', { title: 'Game' });
}