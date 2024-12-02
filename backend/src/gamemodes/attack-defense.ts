import { Server, Socket } from "socket.io";
import { io, Socket as ClientSocket } from "socket.io-client";
import { RoomManager } from "../entities/RoomManager";
import { dictionaryCheck, generateNewWord } from "../utils/word-generation";
import { AdRoom } from "../entities/rooms/AdRoom";
import { Player } from "../entities/Player";

async function createGame(
    IO: Server,
    socket: Socket,
    roomId: string,
    members: string[]
) {
    const url = "http://localhost:3003";
    const skt = io(url, { autoConnect: false });
    skt.open();
    if (RoomManager.getRoom(roomId).maxPlayers == 1) {
		await new Promise((resolve) => {
			skt.emit('bot join', { roomId }, (callback) => {
				RoomManager.joinRoom(roomId, callback['id']);
				resolve('done');
			});
		});
	} else {
		skt.close();
	}

    RoomManager.createAdRoom(roomId);
    IO.to(roomId).emit("game ad start");
    const room = RoomManager.getAdRoom(roomId);
    updateGameState(IO, room);

    if (skt.connected) {
        // run bot
        let interval = setInterval(() => {
            let word = "";
            if (Math.random() > 0.7) {
                // attack
                word = generateNewWord();
            } else {
                // defend
                let threats =
                    RoomManager.getAdRoom(roomId).players[skt.id].wordlist;
                if (threats.length !== 0)
                    word = threats[Math.floor(Math.random() * threats.length)];
            }
            // submit word
            try {
                skt.emit("game ad submit", {
                    roomId: roomId,
                    word: word,
                });
            } catch (error) {
                clearInterval(interval);
            }
        }, 800);
        // disconnect bot when game end
        skt.on("game end", () => {
            clearInterval(interval);
            skt.disconnect();
        });
    }
}

function createListeners(io, socket: Socket) {
    socket.on("game ad submit", ({ roomId, word }) => {
        if (!RoomManager.roomExists(roomId)) {
            console.warn("Room does not exist");
            return;
        }
        const room = RoomManager.getAdRoom(roomId);
        console.log(socket.id, "submitted", word);
        const opponent = room.players[room.players[socket.id].opponentId];
        const idx = room.players[socket.id].wordlist.indexOf(word);

        if (idx === -1) {
            //Attack (Allowed words: len > 3, no repeats, English (in my dictionary))
            if (
                word.length >= 3 &&
                !room["used"].has(word) &&
                dictionaryCheck(word)
            ) {
                room["used"].add(word);
                opponent.wordlist.push(word);
                const oppIdx = opponent.wordlist.indexOf(word);
                const timerId = setTimeout(() => {
                    //Timer ran out: Reduce 1 life, remove word from list
                    opponent.lives--;
                    opponent.wordlist.splice(oppIdx, 1);
                    opponent.timers.delete(word);
                    updateGameState(io, room);
                    console.log(opponent, "timed out:", word);

                    //No more lives; Game end
                    if (!room.players[socket.id].lives || !opponent.lives) {
                        closeGame(io, room);
                    }
                }, 5000);
                opponent.timers.set(word, timerId);
                console.log(socket.id, "attack:", word);
            }
        } else {
            //Defense (Remove entered word from list)
            RoomManager.getAdRoom(roomId).players[socket.id].wordlist.splice(idx, 1);
            clearTimeout(
                RoomManager.getAdRoom(roomId).players[socket.id].timers.get(word)
            );
            console.log(socket.id, "defend:", word);
        }
        updateGameState(io, room);
    });
}

function updateGameState(io, room: AdRoom) {
    const playerIds = Object.keys(room.players);
    io.to(room.id).emit("game ad update", {
        [playerIds[0]]: {
            wordlist: room.players[playerIds[0]].wordlist,
            lives: room.players[playerIds[0]].lives,
        },
        [playerIds[1]]: {
            wordlist: room.players[playerIds[1]].wordlist,
            lives: room.players[playerIds[1]].lives,
        },
    });
}

function closeGame(io, room: AdRoom) {
    io.to(room.id).emit("game end");
    const playerIds = Object.keys(room.players);
    room.players[playerIds[0]].timers.forEach((v, k) => {
        clearTimeout(v);
        room.players[playerIds[0]].timers.delete(k);
    });
    room.players[playerIds[1]].timers.forEach((v, k) => {
        clearTimeout(v);
        room.players[playerIds[1]].timers.delete(k);
    });

    delete room.players[playerIds[0]];
    delete room.players[playerIds[1]];
    delete room.used;

    console.log(room.id, "game ended");
}

export { createGame, createListeners };
