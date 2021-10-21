'use stript';

const express = require('express');
const session = require('express-session');
const { Socket } = require('socket.io');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;

let rooms = {};
// roomID : {num : 人数, admin : 管理者, type : {}, limit : 人数制限, users:[socketID]}

let socketIDs = {};
// socetID : {socket, usrName} 

io.on('connection', socket => {

    const newSocketIDs = {
        socket,
        roomID : null
    };

    socketIDs[socket.id] = newSocketIDs;

    socket.on('create_room', data => { // ルーム参加

        const roomID = data.roomID; // ルームID
        const limit = 2; // data.limit 将来的には接続人数を増やす

        if (rooms[roomID]){ // ルームが存在するか

            socket.emit('r_create_room', {result: false, err : '同じ名前のルームが既に作成されています'}); // 失敗

        } else{

            socket.emit('r_create_room', { result: true}); // 成功

            const newRoomObj = { // 新ルーム情報
                num : 1,
                admin : socket.id,
                type : {},
                limit,
                users: [socket.id]
            };

            rooms[roomID] = newRoomObj; // 配列に追加
            
            socketIDs[socket.id].roomID = roomID; // ソケット情報にルームを追加
            socket.join(roomID); // ルームに参加

        }
    });

    socket.on('join_room', data => {
        const roomID = data.roomID;

        if (rooms[roomID]) { // ルームが存在するか
            const room = rooms[roomID];

            if(socketIDs[socket.id].roomID == null){
                if (room.limit > room.num){
                    socket.emit('r_join_room', { result: true}); // 成功
    
                    room.num++; // 人数追加
                    room.users.push(socket.id);
                    
                    socketIDs[socket.id].roomID = roomID; // ソケット情報にルームのID追加
    
                    socket.join(roomID);
                } else {
                    socket.emit('r_join_room', { result: false , err : '人数オーバー'}); // 失敗
                }
            } else {
                socket.emit('r_join_room', { result: false, err: 'すでにルームに参加しています' }); // 失敗
            }
        } else {
            socket.emit('r_join_room', { result: false, err : 'ルームが存在しません'}); // 失敗
        }

    });

    socket.on('leave_room', data => {
        const roomID = socketIDs[socket.id].roomID;
        if (roomID != null){


            if (rooms[roomID].admin == socket.id) {

                const users = rooms[roomID].users;

                io.to(roomID).emit('dissolve_room', { result: true, err : 'ホストが退出したためルームが削除されました' });
                users.forEach(user => {
                    socketIDs[user].socket.leave(roomID);
                    socketIDs[user].room = null;
                });

                delete rooms[roomID];
            } else {

                rooms[roomID].num--;
                rooms[roomID].users = rooms[roomID].users.filter(item => item != socket.id);

                socket.leave(roomID);
            }

            socket.leave(roomID);

            socket.on('r_leave_room', { result: true});
        } else {
            socket.on('r_leave_room', {result:false, err:'ルームに参加してません'});
        }
    });

    socket.on('disconnect', () => {
        console.log('disconnect');

        if(socketIDs[socket.id]){
            const roomID = socketIDs[socket.id].roomID;
            console.log(roomID);

            if (roomID != null){

                console.log('aaa');
                console.log(rooms[roomID]);

                if (rooms[roomID].admin == socket.id){

                    const users = rooms[roomID].users;

                    io.to(roomID).emit('dissolve_room', { result: true, err: 'ホストが退出したためルームが削除されました' });
                    users.forEach(user => {
                        socketIDs[user].socket.leave(roomID);
                        socketIDs[user].room = null;
                    });

                    delete rooms[roomID];
                } else {

                    rooms[roomID].num--;
                    rooms[roomID].users = rooms[roomID].users.filter(item => item != socket.id);
    
                    socket.leave(roomID);
                }

            }

            delete socketIDs[socket.id];
        }
        
        console.log(socketIDs);
    });
})


const sess = {
    secret: 'connect___four',
    cookie: { maxAge: 2592000000 }, //30days 2592000000
    resave: false,
    saveUninitialized: false,
};

app.use(session(sess));

app.use('/', express.static(__dirname + '/pages/'));

http.listen(PORT, function () {
    console.log(`listening at port ${PORT}...`);
});