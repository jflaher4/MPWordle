var socket = io();

var messages = document.getElementById('messages');
var players = document.getElementById('players')
var form = document.getElementById('chat_form');
var input = document.getElementById('input');
var username = document.getElementById('username').textContent
var ready_button = document.getElementById('ready');

socket.emit('joined lobby', username);
socket.emit('chat message', username + ' has entered the chat.');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', username + ": " + input.value);
        input.value = '';
    }
});

ready_button.addEventListener('click', function (e) {
    socket.emit('ready up', username);
});

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
        player.textContent = x.username + ' ' + x.ready;
        players.appendChild(player);
    });
    if (playerList.length == 1) {
        var message = document.createElement('li');
        message.textContent = 'Waiting for other players ...';
        players.appendChild(message);
    } else if (playerList.length > 1) {
        all_ready = true;
        playerList.forEach((x, i) => {
            if (x.ready == 0) {
                all_ready = false;
            }
        });
        if (all_ready) {
            var message = document.createElement('li');
            message.textContent = 'Game starting ...';
            players.appendChild(message);

            var enter_form = document.createElement("form");
            enter_form.setAttribute("method", "POST");
            enter_form.setAttribute("action", "");

            var s = document.createElement("input");
            s.setAttribute("type", "submit");
            s.setAttribute("value", "ENTER GAME");

            enter_form.appendChild(s);
            document.getElementsByClassName("left")[0].appendChild(enter_form);
        }
    }
});