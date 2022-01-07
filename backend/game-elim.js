const wordGen = require("./word-generation.js");

function createGame(io, roomId, members, roomData) {
  roomData[roomId]["wordlist"] = new Set(wordGen.generateWordlist());
  console.log(roomData[roomId]["wordlist"]);
  roomData[roomId]["score"] = {};
  members.forEach((m) => (roomData[roomId]["score"][m] = 0));

  io.to(roomId).emit(
    "game elim start",
    Array.from(roomData[roomId]["wordlist"])
  );
  startTimer(io, roomId, roomData);
  console.log("Game started (" + roomId + ")");
}

function createListeners(io, socket, roomData) {
  socket.on("game elim submit", ({ roomId, word }) => {
    console.log(socket.id + " submitted " + word);

    const success = roomData[roomId]["wordlist"].delete(word);
    if (success) {
      console.log("Word accepted");
      roomData[roomId]["score"][socket.id] += word.length;
      const newWord = wordGen.generateNewWord();
      roomData[roomId]["wordlist"].add(newWord);
      io.to(roomId).emit("game elim update", {
        user: socket.id,
        word: word,
        newWord: newWord,
        scores: roomData[roomId]["score"],
      });
    }
  });
}

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

module.exports = { createGame, createListeners };
