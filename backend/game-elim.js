const wordGen = require("./word-generation.js");

//TODO combine these 2 into 1 function?
function createGame(io, roomId, roomData) {
  roomData[roomId]["wordlist"] = new Set(wordGen.generateWordlist());
  console.log(roomData[roomId]["wordlist"]);
  io.to(roomId).emit(
    "game elim start",
    Array.from(roomData[roomId]["wordlist"])
  );
}

function createListeners(io, socket, roomData) {
  socket.on("game elim submit", ({ roomId, word }) => {
    console.log(socket.sessionId + " submitted " + word);

    const success = roomData[roomId]["wordlist"].delete(word);
    if (success) {
      console.log("Word accepted");
      const newWord = wordGen.generateNewWord();
      io.to(roomId).emit("game elim update", {
        user: socket.sessionId,
        word: word,
        newWord: newWord,
      });
    }
  });
}

function testDictionary(arr) {
  arr.forEach((e) => {
    console.log(e + ":" + wordGen.dictionaryCheck(e));
  });
}

module.exports = { createGame, createListeners, testDictionary };
