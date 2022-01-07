function startTimer(io, roomId, roomData) {
  roomData[roomId]["timeEnd"] = Date.now() + 60000;
  let intId = setInterval(() => {
    const timeLeft = roomData[roomId]["timeEnd"] - Date.now();
    io.to(roomId).emit("time", Math.floor(timeLeft));
    if (timeLeft <= 0) {
      clearInterval(intId);
      io.to(roomId).emit("game end");
      const room = io.sockets.adapter.rooms.get(roomId);
      if (room)
        io.sockets.adapter.rooms
          .get(roomId)
          .forEach((s) => io.sockets.sockets.get(s).leave(roomId));
      console.log("Game ended");
    }
  }, 500);
}

const crypto = require("crypto");
function generateRoomId() {
  //return "abc";
  return crypto.randomBytes(8).toString("hex");
}

class InMemorySessionStore {
  constructor() {
    this.sessions = new Map();
  }

  findSession(id) {
    return this.sessions.get(id);
  }

  saveSession(id, session) {
    this.sessions.set(id, session);
  }

  findAllSessions() {
    return [...this.sessions.values()];
  }
}

module.exports = { startTimer, generateRoomId, InMemorySessionStore };
