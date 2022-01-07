import { io } from "socket.io-client";
import { createRoomListeners } from "./includes/room.js";
import { createElimListeners, elimSubmit } from "./includes/game-elim.js";

const URL = "http://localhost:3000";
const socket = io(URL, { autoConnect: true });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

createRoomListeners(socket);

socket.emit("room create", { type: "double elim" }, (roomId) => {
  console.log("Created room with ID: " + roomId);
});

socket.on("game end", () => {
  console.log("Game ended");
});

createElimListeners(socket);
