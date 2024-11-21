import { Server, Socket } from "socket.io";
import { io } from "socket.io-client";
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
    if (members.length === 1) {
        await new Promise((resolve) => {
            skt.emit("bot join", { roomId }, (callback) => {
                members.push(callback["id"]);
                resolve("done");
            });
        });
    } else {
        skt.close();
    }

    RoomManager.createAdRoom(roomId, members);

    IO.to(roomId).emit("game ad start");
    const room = RoomManager.getAdRoom(roomId);
    updateGameState(
        IO,
        socket,
        room,
        room.players[room.players[socket.id].opponentId]
    );

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
        const room = RoomManager.getAdRoom(roomId);
        if (!room) {
            console.error(`Error updating game: ${room.id} undefined`);
            return;
        }
        console.log(socket.id, "submitted", word);
        const opponentId = room.players[socket.id].opponentId;
        const opponent = room.players[opponentId];
        const idx = opponent.wordlist.indexOf(word);

        if (idx === -1) {
            //Attack (Allowed words: len > 3, no repeats, English (in my dictionary))
            if (
                word.length >= 3 &&
                !room["used"].has(word) &&
                dictionaryCheck(word)
            ) {
                room["used"].add(word);
                opponent.wordlist.push(word);
                const oppIdx = opponent["wordlist"].indexOf(word);
                const timerId = setTimeout(() => {
                    //Timer ran out: Reduce 1 life, remove word from list
                    opponent.lives--;
                    opponent.wordlist.splice(oppIdx, 1);
                    opponent.timers.delete(word);
                    updateGameState(io, socket, room, opponent);
                    console.log(opponent, "timed out:", word);

                    //No more lives; Game end
                    if (!room.players[socket.id].lives || !opponent.lives) {
                        closeGame(io, socket, room, opponent);
                    }
                }, 5000);
                opponent.timers.set(word, timerId);
                console.log(socket.id, "attack:", word);
            }
        } else {
            //Defense (Remove entered word from list)
            room[socket.id]["wordlist"].splice(idx, 1);
            clearTimeout(room[socket.id]["timers"].get(word));
            console.log(socket.id, "defend:", word);
        }
        updateGameState(io, socket, room, opponent);
    });
}

function updateGameState(io, socket: Socket, room: AdRoom, opponent: Player) {
    io.to(room.id).emit("game ad update", {
        [socket.id]: {
            wordlist: room.players[socket.id].wordlist,
            lives: room.players[socket.id].lives,
        },
        [opponent.id]: {
            wordlist: room.players[opponent.id].wordlist,
            lives: room.players[opponent.id].lives,
        },
    });
}

function closeGame(io, socket: Socket, room: AdRoom, opponent: Player) {
    io.to(room.id).emit("game end");

    room.players[socket.id].timers.forEach((v, k) => {
        clearTimeout(v);
        room.players[socket.id].timers.delete(k);
    });
    room.players[opponent.id].timers.forEach((v, k) => {
        clearTimeout(v);
        room.players[opponent.id].timers.delete(k);
    });

    delete room.players[socket.id];
    delete room.players[opponent.id];
    delete room.used;

    console.log(room.id, "game ended");
}

export { createGame, createListeners };
