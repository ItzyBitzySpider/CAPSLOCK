const wordGen = require("./word-generation.js");

function createGame(io, socket, roomId, members, roomData) {
  roomData[roomId]["wordlist"] = new Set(wordGen.generateWordlist());
  console.log(roomData[roomId]["wordlist"]);
  roomData[roomId]["score"] = {};
  members.forEach((m) => (roomData[roomId]["score"][m] = 0));
  io.to(roomId).emit(
    "game elim start",
    Array.from(roomData[roomId]["wordlist"])
  );
  console.log(socket);
  socket.on("game elim submit", ({ roomId, word }) => {
    console.log(socket.id + " submitted " + word);

    const success = roomData[roomId]["wordlist"].delete(word);
    if (success) {
      console.log("Word accepted");
      roomData[roomId]["score"][socket.id] += word.length;
      const newWord = wordGen.generateNewWord();
      io.to(roomId).emit("game elim update", {
        user: socket.id,
        word: word,
        newWord: newWord,
        scores: roomData[roomId]["score"],
      });
    }
  });
  console.log(socket);
  console.log("Game started ("+roomId+")");
}

module.exports = { createGame };
