let wordlist = [];
let points = 0;

export function createElimListeners(socket) {
  socket.on("game elim start", (startWordlist) => (wordlist = startWordlist));
  socket.on("game elim update", ({ user, word, newWord, scores }) => {
    const wordIdx = wordlist.findIndex((e) => e === word);
    const answerCorrect = user === socket.id;
    if (answerCorrect) points += word.length;
    wordlist[wordIdx] = newWord;
    console.log(answerCorrect ? "Correct" : "Opponent claimed '" + word + "'");
    console.log(wordlist);
    console.log(scores);
    //TODO: Update UI using answerCorrect and with new wordlist
  });
}

export function elimSubmit(socket, roomId, word) {
  socket.emit("game elim submit", { roomId: roomId, word: word });
}