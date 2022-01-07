function startTimer(io, roomId) {
  setTimeout(() => {
    io.to(roomId).emit("game end");
    io.sockets.adapter.rooms
      .get(roomId)
      .forEach((s) => io.sockets.sockets.get(s).leave(roomId));
    console.log("Game ended");
  }, 60000);
}

const crypto = require("crypto");
function generateRoomId() {
  return crypto.randomBytes(8).toString("hex");
}

module.exports = { startTimer, generateRoomId };
