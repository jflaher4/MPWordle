
var socket = io();

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');
var username = document.getElementById('username').textContent

socket.emit('join', username);
socket.emit('chat message', username + ' has entered the chat.');


form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', username + ": " + input.value);
        input.value = '';
    }
});

socket.on('chat message', function (msg) {
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});