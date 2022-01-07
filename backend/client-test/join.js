import { io } from 'socket.io-client';

const URL = 'http://35.240.217.27:3000/'; //"https://capslock-backend.herokuapp.com/";
// const URL = "http://localhost:3000";

const socket = io(URL, { autoConnect: true });

socket.onAny((event, ...args) => {
	console.log(event, args);
});

let roomId = 'b82d436c4993e09e';

socket.emit('room join', {
	roomId: roomId,
});

socket.on('game end', () => {
	console.log('Game ended');
});

setTimeout(() => {
	socket.emit('game start', { roomId });
}, 1000);

setTimeout(() => {
	elimSubmit(socket, roomId, 'model');
  console.log(socket);
}, 10000);

function elimSubmit(socket, roomId, word) {
	socket.emit('game elim submit', { roomId: roomId, word: word });
}
