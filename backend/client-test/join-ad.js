import { io } from 'socket.io-client';

// const URL = 'http://35.240.217.27:3000/'; //"https://capslock-backend.herokuapp.com/";
const URL = "http://localhost:3000";

const socket = io(URL, { autoConnect: true });

socket.onAny((event, ...args) => {
	console.log(event, args);
});

let roomId = 'abc';

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
	submit(socket, roomId, 'model');
	submit(socket, roomId, 'test');
}, 3000);

function submit(socket, roomId, word) {
	socket.emit('game ad submit', { roomId: roomId, word: word });
}
socket.on("game ad update", ({ roomData }) => {
  console.log(roomData);
});