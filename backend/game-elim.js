//TODO combine these 2 into 1 function?
function createGame(io, roomId, roomData) {
  roomData[roomId]["wordlist"] = new Set([
    //TODO auto-generate
    "dozen",
    "tendency",
    "dismiss",
    "cigarette",
    "model",
    "assignment",
    "leash",
    "chase",
  ]);
  io.to(roomId).emit(
    "game elim start",
    Array.from(roomData[roomId]["wordlist"])
  );
}

function createListeners(io, socket, roomData) {
  socket.on("game elim submit", ({ roomId, word }) => {
    console.log(socket.id + " submitted " + word);

    const success = roomData[roomId]["wordlist"].delete(word);
    if (success) {
      console.log("Word accepted");
      const newWord = "pennies"; //TODO auto-generate
      io.to(roomId).emit("game elim update", {
        user: socket.id,
        word: word,
        newWord: newWord,
      });
    }
  });
}

function destroyListeners() {
  socket.off("game elim submit");
}

module.exports = { createGame, createListeners, destroyListeners };
