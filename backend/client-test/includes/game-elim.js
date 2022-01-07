let wordlist = [];
let points = 0;

export function createElimListeners(socket) {
  points = 0;
  socket.on("game elim start", (startWordlist) => (wordlist = startWordlist));
  socket.on("game elim update", ({ user, word, newWord }) => {
    const wordIdx = wordlist.findIndex((e) => e === word);
    const answerCorrect = user === socket.sessionId;
    if (answerCorrect) points += word.length;
    wordlist[wordIdx] = newWord;
    console.log(answerCorrect ? "Correct" : "Opponent claimed '" + word + "'");
    console.log(wordlist);
    //TODO: Update UI using answerCorrect and with new wordlist
  });
}

export function elimSubmit(socket, roomId, word) {
  socket.emit("game elim submit", { roomId: roomId, word: word });
}