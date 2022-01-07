const wordGen = require("./word-generation.js");

function createGame(io, roomId, members, roomData) {
  if (!roomData[roomId]) {
    console.log("Error creating game: roomData[roomId] undefined");
    return;
  }
  roomData[roomId]["wordlist"] = wordGen.generateWordlist();
  console.log(roomData[roomId]["wordlist"]);
  roomData[roomId]["score"] = {};
  members.forEach((m) => (roomData[roomId]["score"][m] = 0));

  io.to(roomId).emit("game elim start", roomData[roomId]["wordlist"]);
  startTimer(io, roomId, roomData);
  console.log("Game started (" + roomId + ")");
}

function createListeners(io, socket, roomData) {
  socket.on("game elim submit", ({ roomId, word }) => {
    if (!roomData[roomId]) {
      console.log("Error creating game: roomData[roomId] undefined");
      return;
    }

    console.log(socket.id + " submitted " + word);

    const origWordIdx = roomData[roomId]["wordlist"].indexOf(word);
    const success = origWordIdx !== -1;
    if (success) {
      console.log("Word accepted");
      roomData[roomId]["score"][socket.id] += word.length;
      const newWord = wordGen.generateNewWord();
      roomData[roomId]["wordlist"].splice(origWordIdx, 1, newWord);
      io.to(roomId).emit("game elim update", {
        user: socket.id,
        wordlist: roomData[roomId]["wordlist"],
        newWord: newWord,
        scores: roomData[roomId]["score"],
      });
    }
  });
}

function startTimer(io, roomId, roomData) {
  if (!roomData[roomId]) {
    console.log("Error creating game: roomData[roomId] undefined");
    return;
  }
  roomData[roomId]["timeEnd"] = Date.now() + 60000;
  let intId = setInterval(() => {
    const timeLeft = roomData[roomId]["timeEnd"] - Date.now();
    io.to(roomId).emit("time", Math.floor(timeLeft/1000));
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

module.exports = { createGame, createListeners };
