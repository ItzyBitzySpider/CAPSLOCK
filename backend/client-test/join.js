import { io } from "socket.io-client";
import { createElimListeners, elimSubmit } from "./includes/game-elim.js";
import { createRoomListeners } from "./includes/room.js";

const URL = "https://capslock-backend.herokuapp.com/";
const socket = io(URL, { autoConnect: true });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

createRoomListeners(socket);

let roomId = "abc";

socket.emit("room join", {
  roomId: roomId,
});

socket.on("game end",() => {
  console.log("Game ended");
});

createElimListeners(socket);

elimSubmit(socket, roomId, "model");