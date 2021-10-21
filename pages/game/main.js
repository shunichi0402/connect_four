const socket = io();

const roomInput = document.getElementById('room-input');
const createRoom = document.getElementById('create-room');
const joinRoom = document.getElementById('join-room');

createRoom.addEventListener('click', () => {
    if (roomInput.value != ''){
        socket.emit('create_room', { roomID: roomInput.value});
    }
});

joinRoom.addEventListener('click', () => {
    if (roomInput.value != '') {
        socket.emit('join_room', { roomID: roomInput.value });
    }
});

socket.on('r_create_room', data => {
    if(data.result){
        console.log('成功');
    } else {
        console.log('失敗');
        console.log(data.err);
    }
});

socket.on('r_join_room', data => {
    if(data.result){
        console.log('成功');
    } else {
        console.log('失敗');
        console.log(data.err);
    }
});

socket.on('dissolve_room', data => {
    console.log(data.err);
})