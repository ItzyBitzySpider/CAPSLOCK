import { io } from "socket.io-client";
import { createRoomListeners } from "./includes/room.js";
import { createElimListeners } from "./includes/game-elim.js";

// const URL = "http://35.240.217.27:3000/"; 
const URL = "http://localhost:3000";

const socket = io(URL, { autoConnect: true });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

createRoomListeners(socket);

var roomId;
socket.emit("room create", { type: "double ad" }, (rid) => {
  console.log("Created room with ID: " + rid);
  roomId = rid;
});

socket.on("session", (sessionId) => {
  socket.auth = { sessionId };
});
socket.on("game end", () => {
  console.log("Game ended");
});

createElimListeners(socket);
socket.on("game ad update", ({ roomData }) => {
  console.log(roomData);
});

setTimeout(() => {
	submit(socket, roomId, 'model');
	submit(socket, roomId, 'jon');
}, 10000);

function submit(socket, roomId, word) {
	socket.emit('game ad submit', { roomId: roomId, word: word });
}