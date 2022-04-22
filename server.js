'use strict';
var debug = require('debug')('my express app');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/landing');
var users = require('./routes/users');
var lobby = require('./routes/lobby');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',routes);
app.use('/users', users);
app.use('/lobby', lobby);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

const http = require('http')
const server = http.createServer(app)

// Handle a socket connection from web client
var socketio = require('socket.io')
const io = socketio(server)

server.listen(app.get('port'), () => debug('Express server listening on port ' + server.address().port));

var playerList = [];

io.on('connection', socket => {

    socket.on('join', (username) => {
        playerList.push({
            'username': username, 'ready': 0, 'playerID': 1 + Math.max(playerList.map(player => {
                return player.playerID;
            }))
        });
        io.emit('player list', playerList);
    });

    socket.on('chat message', msg => {
        io.emit('chat message', msg);
    });
    socket.on('disconnect', msg => {
        io.emit('chat message', username + ' left the lobby');
    });
});