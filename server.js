'use strict';
var debug = require('debug')('my express app');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const fs = require('fs');

var routes = require('./routes/landing');
var users = require('./routes/users');
var lobby = require('./routes/lobby');
var game = require('./routes/game');

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
app.use('/game', game);

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
    socket.on('joined lobby', (username) => {
        let playerInList = false;
        playerList.forEach((x, i) => {
            if (x.playerID == socket.id) {
                playerInList = true;
            }
        });
        if (!playerInList) {
            playerList.push({
                'username': username, 'ready': 0, 'playerID': socket.id
            });
        }
        io.emit('player list', playerList);
    });
    socket.on('ready up', (username) => {
        playerList.forEach((x, i) => {
            if (x.username == username) {
                x.ready = 1;
            }
        });
        io.emit('player list', playerList)
    });
    socket.on('chat message', msg => {
        io.emit('chat message', msg);
    });
    socket.on('disconnect', msg => {
        let disconnectedUser = socket.id
        playerList.forEach((x, i) => {
            if (x.playerID == socket.id) {
                disconnectedUser = x.username
                playerList.splice(i, 1);
            }
        });
        io.emit('chat message', disconnectedUser + ' has left the lobby');
    });
    socket.on('start game', msg => {
        io.emit('start game', getRandomWord());
    });
    socket.on('check guess', msg => {
        socket.emit('check guess', checkWord(msg));
    });

    socket.on('opponent guess', (colors) => {
        socket.broadcast.emit('opponent guess', colors);
    });
    socket.on('game chat message', msg => {
        io.emit('game chat message', msg);
    });
});

function getRandomWord() {
    
    const words = fs.readFileSync('data/five-letter-words.txt', 'utf-8').split(/\r?\n/).filter(x => x.charAt(0) === "*").map(x => x.substring(1));
    const randomWord = words[Math.floor(Math.random() * words.length)];
    return randomWord;

}

function checkWord(userGuess) {
    const words = fs.readFileSync('data/five-letter-words.txt', 'utf-8').split(/\r?\n/)
    return words.map(function (word) {
        if (word.charAt(0) === "*") {
            return word.substring(1);
        } else {
            return word;
        }
    }).includes(userGuess);
} 