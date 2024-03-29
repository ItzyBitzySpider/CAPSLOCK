import { io } from 'socket.io-client';

const URL = process.env.REACT_APP_SOCKET_URL;
const socket = io(URL, { autoConnect: true });

socket.onAny((event, ...args) => {
	console.log(event, args);
});

let roomId = 'd338183545d3dd50';

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
