
var socket = io();

var messages = document.getElementById('messages');
var players = document.getElementById('players')
var form = document.getElementById('form');
var input = document.getElementById('input');
var username = document.getElementById('username').textContent
var button = document.getElementById('ready');

socket.emit('join', username);
socket.emit('chat message', username + ' has entered the chat.');


form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', username + ": " + input.value);
        input.value = '';
    }
});


// Not complete YET
button.addEventListener("click", function (ready) {
    io.emit('ready up', username);
})

socket.on('chat message', function (msg) {
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('player list', function (playerList) {
    var child = players.lastElementChild;
    while (child) {
        players.removeChild(child);
        child = players.lastElementChild;
    }
    playerList.forEach((x, i) => {
        var player = document.createElement('li');
        player.textContent = x.username;
        players.appendChild(player);
    });
    if (playerList.length == 1) {
        var player = document.createElement('li');
        player.textContent = 'Waiting for other players ...';
        players.appendChild(player);
    }
});