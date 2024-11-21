import { Server, Socket } from 'socket.io';
import { generateNewWord } from '../utils/word-generation';
import { io } from 'socket.io-client';
import { RoomManager } from '../entities/RoomManager';

async function createGame(IO: Server, roomId: string, members: string[]) {
	const url = 'http://localhost:3003'; // hacky way of joining the room
	const skt = io(url, { autoConnect: false });
	skt.open();
	if (members.length === 1) {
		await new Promise((resolve) => {
			skt.emit('bot join', { roomId }, (callback) => {
				members.push(callback['id']);
				resolve('done');
			});
		});
	} else {
		skt.close();
	}
	
	RoomManager.createElimRoom(roomId, members);
	const room = RoomManager.getElimRoom(roomId)
	console.log(room)

	IO.to(roomId).emit('game elim start', room.wordlist);
	
	startTimer(IO, roomId);
	
	console.log(roomId, 'game started');
	if (skt.connected) {
		let word = RoomManager.getElimRoom(roomId).wordlist[Math.floor(Math.random() * 9)];
		sendWordLoop(skt, roomId, word);
		skt.on('game end', () => {
			skt.disconnect();
		});
	}
		
	
}

function sendWordLoop(socket, roomId, word) {
	try {
		let currentWord = word;
		const intervalId = setInterval(() => {
			socket.emit('game elim submit', {
				roomId: roomId,
				word: currentWord,
			});
			currentWord = RoomManager.getElimRoom(roomId).wordlist[Math.floor(Math.random() * 9)];
		}, currentWord.length * 140);

		socket.on('game end', () => {
			clearInterval(intervalId);
		});
	} catch (error) {}
}

function createListeners(io, socket: Socket) {
	socket.on('game elim submit', ({ roomId, word }) => {
		const room = RoomManager.getElimRoom(roomId);
		if (!room || !room.wordlist) {
			console.error('Error updating game: roomData[roomId][wordlist] undefined');
			return;
		}

		console.log(socket.id, 'submitted', word);

		const origWordIdx = room.wordlist.indexOf(word);
		const success = origWordIdx !== -1;
		if (success) {
			RoomManager.getElimRoom(roomId).score[socket.id] += word.length;
			const newWord = generateNewWord();
			RoomManager.getElimRoom(roomId).wordlist.splice(origWordIdx, 1, newWord);
			io.to(roomId).emit('game elim update', {
				user: socket.id,
				wordlist: RoomManager.getElimRoom(roomId).wordlist,
				newWord: newWord,
				scores: RoomManager.getElimRoom(roomId).score,
			});
		}
	});
}

function startTimer(io, roomId) {
	if (!RoomManager.roomExists(roomId)) {
		console.warn(`Error setting timer: ${roomId} undefined`);
		return;
	}

	const endTime = RoomManager.getElimRoom(roomId).timeEnd;
	let intId = setInterval(() => {
		let timeLeft = endTime - Date.now();
		if (timeLeft < 0) timeLeft = 0;
		io.to(roomId).emit('time', Math.floor(timeLeft / 1000));
		if (timeLeft <= 0) {
			clearInterval(intId);
			io.to(roomId).emit('game end');

			delete RoomManager.getElimRoom(roomId).wordlist;
			delete RoomManager.getElimRoom(roomId).score;

			console.log(roomId, 'game ended');
		}
	}, 500);
}

export { createGame, createListeners };
