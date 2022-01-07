import { io } from "socket.io-client";
import { createElimListeners, elimSubmit } from "./includes/game-elim.js";
import { createRoomListeners } from "./includes/room.js";

const URL = "http://35.240.217.27:3000/"//"https://capslock-backend.herokuapp.com/";
// const URL = "http://localhost:3000";

const socket = io(URL, { autoConnect: true });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

createRoomListeners(socket);

let roomId = "3cd1f49ce03bdb47";

socket.emit("room join", {
  roomId: roomId,
});

socket.on("session", (sessionId) => {
  socket.auth = { sessionId };
});
socket.on("game end", () => {
  console.log("Game ended");
});

createElimListeners(socket);
setTimeout(() => {
socket.emit("game start", { roomId });
},1000);

setTimeout(() => {
  elimSubmit(socket, roomId, "jon");
}, 2000);
