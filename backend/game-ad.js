const wordGen = require('./word-generation.js');
const { io } = require('socket.io-client');

async function createGame(IO, socket, roomId, members, roomData) {
	const url = 'http://localhost:3003';
	const skt = io(url, { autoConnect: false });
	skt.open();
	if (roomData[roomId]['player'] === 1) {
		await new Promise((resolve) => {
			skt.emit('bot join', { roomId }, (callback) => {
				console.log(callback['id']);
				members.push(callback['id']);
        resolve('done');
			});
		});
	} else {
		skt.disconnect();
	}
	for (var i = 0; i < members.length; i++) {
		roomData[roomId][members[i]] = {};
		roomData[roomId][members[i]]['wordlist'] = [];
		roomData[roomId][members[i]]['timers'] = new Map();
		roomData[roomId][members[i]]['lives'] = 3;
		roomData[roomId][members[i]]['opponent'] =
			i == members.length - 1 ? members[0] : members[i + 1];
	}
	roomData[roomId]['used'] = new Set();
	IO.to(roomId).emit('game ad start');
	updateGameState(
		IO,
		socket,
		roomId,
		roomData,
		roomData[roomId][socket.id]['opponent']
	);

	if (roomData[roomId]['player'] === 1) {
		// run bot
		let interval = setInterval(() => {
			let word = '';
			if (Math.round(Math.random()) === 1) {
				// attack
				word = wordGen.generateNewWord();
			} else {
				// defend
				let threats = roomData[roomId][socket.id]['wordlist'];
				if (threats.length !== 0)
					word = threats[Math.floor(Math.random() * threats.length)];
			}
			// submit word
			try {
				skt.emit('game ad submit', {
					roomId: roomId,
					word: word,
				});
			} catch (error) {
				clearInterval(interval);
			}
		}, 800);
		// disconnect bot when game end
		skt.on('game end', () => {
			clearInterval(interval);
			skt.disconnect();
		});
	}
}

function createListeners(io, socket, roomData) {
	socket.on('game ad submit', ({ roomId, word }) => {
		if (!roomData[roomId] || !roomData[roomId][socket.id]) {
			console.warn(
				'Error updating game: roomData[roomId][socket.id] undefined'
			);
			return;
		}
		console.log(socket.id, 'submitted', word);
		const opponent = roomData[roomId][socket.id]['opponent'];
		const idx = roomData[roomId][socket.id]['wordlist'].indexOf(word);

		if (idx === -1) {
			//Attack (Allowed words: len > 3, no repeats, English (in my dictionary))
			if (
				word.length >= 3 &&
				!roomData[roomId]['used'].has(word) &&
				wordGen.dictionaryCheck(word)
			) {
				roomData[roomId]['used'].add(word);
				roomData[roomId][opponent]['wordlist'].push(word);
				const oppIdx = roomData[roomId][opponent]['wordlist'].indexOf(word);
				const timerId = setTimeout(() => {
					//Timer ran out: Reduce 1 life, remove word from list
					roomData[roomId][opponent]['lives']--;
					roomData[roomId][opponent]['wordlist'].splice(oppIdx, 1);
					roomData[roomId][opponent]['timers'].delete(word);
					updateGameState(io, socket, roomId, roomData, opponent);
					console.log(opponent, 'timed out:', word);

					//No more lives; Game end
					if (
						!roomData[roomId][socket.id]['lives'] ||
						!roomData[roomId][opponent]['lives']
					) {
						closeGame(io, socket, roomId, roomData, opponent);
					}
				}, 5000);
				roomData[roomId][opponent]['timers'].set(word, timerId);
				console.log(socket.id, 'attack:', word);
			}
		} else {
			//Defense (Remove entered word from list)
			roomData[roomId][socket.id]['wordlist'].splice(idx, 1);
			clearTimeout(roomData[roomId][socket.id]['timers'].get(word));
			console.log(socket.id, 'defend:', word);
		}
		updateGameState(io, socket, roomId, roomData, opponent);
	});
}

function updateGameState(io, socket, roomId, roomData, opponent) {
	io.to(roomId).emit('game ad update', {
		[socket.id]: {
			wordlist: roomData[roomId][socket.id]['wordlist'],
			lives: roomData[roomId][socket.id]['lives'],
		},
		[opponent]: {
			wordlist: roomData[roomId][opponent]['wordlist'],
			lives: roomData[roomId][opponent]['lives'],
		},
	});
}

function closeGame(io, socket, roomId, roomData, opponent) {
	io.to(roomId).emit('game end');

	roomData[roomId][socket.id]['timers'].forEach((v, k) => {
		clearTimeout(v);
		roomData[roomId][socket.id]['timers'].delete(k);
	});
	roomData[roomId][opponent]['timers'].forEach((v, k) => {
		clearTimeout(v);
		roomData[roomId][opponent]['timers'].delete(k);
	});

	delete roomData[roomId][socket.id];
	delete roomData[roomId][opponent];
	delete roomData[roomId]['used'];

	console.log(roomId, 'game ended');
}

module.exports = { createGame, createListeners };
