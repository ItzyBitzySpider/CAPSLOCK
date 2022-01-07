const wordGen = require("./word-generation.js");

function createGame(io, socket, roomId, members, roomData) {
  members.forEach((m) => {
    roomData[roomId][m] = {};
    roomData[roomId][m]["wordlist"] = [];
    roomData[roomId][m]["timers"] = [];
    roomData[roomId][m]["lives"] = 3;
  });

  socket.on("game ad submit", ({ roomId, word }) => {
    console.log(socket.id + " submitted " + word);

    const idx = roomData[roomId][socket.id]["wordlist"].indexOf(word);
    if (idx === -1) {
      //Attack
      for(var i=0;i<members.length;i++){
        if(members[i] !== socket.id){
          roomData[roomId][members[i]]["wordlist"].push(word);
        }
      }
    } else {
      //Defense
      roomData[roomId][socket.id]["wordlist"].splice(idx, 1);
    }

    io.to(roomId).emit("game ad update", { roomData });

    const success = roomData[roomId]["wordlist"].delete(word);
    if (success) {
      console.log("Word accepted");
      roomData[roomId]["score"][socket.id] += word.length;
      const newWord = wordGen.generateNewWord();
    }
  });
}

function testDictionary(arr) {
  arr.forEach((e) => {
    console.log(e + ":" + wordGen.dictionaryCheck(e));
  });
}

module.exports = { createGame, testDictionary };
