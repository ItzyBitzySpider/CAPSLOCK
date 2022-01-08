import { io } from "socket.io-client";
import { createRoomListeners } from "./includes/room.js";
import { createElimListeners } from "./includes/game-elim.js";

// const URL = "http://35.240.217.27:3003/"; 
const URL = "http://localhost:3003";

const socket = io(URL, { autoConnect: true });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

createRoomListeners(socket);

socket.emit("room create", { type: "double elim" }, (roomId) => {
  console.log("Created room with ID: " + roomId);
});

socket.on("session", (sessionId) => {
  socket.auth = { sessionId };
});
socket.on("game end", () => {
  console.log("Game ended");
});

createElimListeners(socket);
