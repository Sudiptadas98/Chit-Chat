const socket = io();

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");


var audio = new Audio('receive.mp3');

//function which will append event info to the container.
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
    }
}

//after submit the form, send the info to server.
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value;
    if(!message){
        return false;
    }
    append(`You: ${message}`, 'right');
    messageContainer.scrollTop = messageContainer.scrollHeight;
    socket.emit('send', message);
    messageInput.value = ''
})

//ask new user for his/her name and let the server know.
const name = prompt("enter your name to join");
socket.emit('new-user-joined', name);

//if a new user joins, receive the event from the server.
socket.on('user-joined', name =>{
    append(`${name} joined the chat`, 'left');
    messageContainer.scrollTop = messageContainer.scrollHeight;
})

//if server sends a message, receive it.
socket.on('receive', data =>{
    
    append(`${data.name}: ${data.message}`, 'left');
    messageContainer.scrollTop = messageContainer.scrollHeight;
})

//if a user left the chat, append the info to the container.
socket.on('left', name =>{
    append(`${name} left the chat`, 'left');
    messageContainer.scrollTop = messageContainer.scrollHeight;
})

