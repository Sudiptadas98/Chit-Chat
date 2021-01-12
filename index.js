// node server which will handle socket io connections.
const path = require('path');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, 'public')));

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));



const io = require('socket.io')(server);

const users = {};

io.on('connection', socket =>{
    //if any new user joins, broadcast to other users connected to this server.
    socket.on('new-user-joined', name =>{
        // console.log("New user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    //if someone sends a msg..broadcast to all other users
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    //if someone leaves the chat..broadcast to all other users.
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})