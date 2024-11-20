import { io } from 'socket.io-client';

// const URL = 'http://35.240.217.27:3003/'; //"https://capslock-backend.herokuapp.com/";
const URL = "http://localhost:3003";

const socket = io(URL, { autoConnect: true });

socket.onAny((event, ...args) => {
	console.log(event, args);
});

let roomId = '062eb97b2e96211a';

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
}, 10000);

function elimSubmit(socket, roomId, word) {
	socket.emit('game elim submit', { roomId: roomId, word: word });
}