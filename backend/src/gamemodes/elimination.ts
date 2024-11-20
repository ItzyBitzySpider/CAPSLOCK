import { generateNewWord, generateWordlist } from '../utils/word-generation';
import { io } from 'socket.io-client';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function createGame(IO, roomId, members, roomData) {
	if (!roomData[roomId]) {
		console.warn('Error creating game: roomData[roomId] undefined');
		return;
	}
	roomData[roomId]['wordlist'] = generateWordlist();
	roomData[roomId]['score'] = {};
	members.forEach((m) => (roomData[roomId]['score'][m] = 0));

	IO.to(roomId).emit('game elim start', roomData[roomId]['wordlist']);
	startTimer(IO, roomId, roomData);
	console.log(roomId, 'game started');
	if (roomData[roomId]['player'] === 1) {
		const url = 'http://localhost:3003';
		const socket = io(url, { autoConnect: false });
		socket.open();
		await new Promise((resolve) => {
			socket.emit('bot join', { roomId }, (callback) => {
				roomData[roomId]['score'][callback['id']] = 0;
				resolve('done');
			});
		});

		// run bot
		// try {
		// 	let chosenWord =
		// 		roomData[roomId]['wordlist'][Math.floor(Math.random() * 9)];
		// 	let length = chosenWord.length;
		// 	console.log(length);
		// 	let delayTime = length * 2000;
		// 	socket.emit('game elim submit', {
		// 		roomId: roomId,
		// 		word: chosenWord,
		// 	});
		// 	timeout = setTimeout(sendWord, delayTime);
		// } catch (error) {
		// 	clearTimeout(interval);
		// }
		let word = roomData[roomId]['wordlist'][Math.floor(Math.random() * 9)];
		sendWordLoop(roomData, socket, roomId, word);

		// let interval = setInterval(() => {}, delayTime);
		socket.on('game end', () => {
			// clearInterval(interval);
			socket.disconnect();
		});
	}
}

function sendWordLoop(roomData, socket, roomId, word) {
	try {
		socket.emit('game elim submit', {
			roomId: roomId,
			word: word,
		});
		let nextWord = roomData[roomId]['wordlist'][Math.floor(Math.random() * 9)];
		setTimeout(() => {
			sendWordLoop(roomData, socket, roomId, nextWord);
		}, nextWord.length * 140);
	} catch (error) {}
}

function createListeners(io, socket, roomData) {
	socket.on('game elim submit', ({ roomId, word }) => {
		if (!roomData[roomId] || !roomData[roomId]['wordlist']) {
			console.warn('Error updating game: roomData[roomId][wordlist] undefined');
			return;
		}

		console.log(socket.id, 'submitted', word);

		const origWordIdx = roomData[roomId]['wordlist'].indexOf(word);
		const success = origWordIdx !== -1;
		if (success) {
			// if (!roomData[roomId]['score'][socket.id])
			// 	roomData[roomId]['score'][socket.id] = 0;
			roomData[roomId]['score'][socket.id] += word.length;
			const newWord = generateNewWord();
			roomData[roomId]['wordlist'].splice(origWordIdx, 1, newWord);
			io.to(roomId).emit('game elim update', {
				user: socket.id,
				wordlist: roomData[roomId]['wordlist'],
				newWord: newWord,
				scores: roomData[roomId]['score'],
			});
		}
	});
}

function startTimer(io, roomId, roomData) {
	if (!roomData[roomId]) {
		console.warn('Error setting timer: roomData[roomId] undefined');
		return;
	}
	roomData[roomId]['timeEnd'] = Date.now() + 60000;
	let intId = setInterval(() => {
		let timeLeft = roomData[roomId]['timeEnd'] - Date.now();
		if (timeLeft < 0) timeLeft = 0;
		io.to(roomId).emit('time', Math.floor(timeLeft / 1000));
		if (timeLeft <= 0) {
			clearInterval(intId);
			io.to(roomId).emit('game end');

			//Sorry I used an object instead of a map
			delete roomData[roomId]['wordlist'];
			delete roomData[roomId]['score'];

			console.log(roomId, 'game ended');
		}
	}, 500);
}

export { createGame, createListeners };
