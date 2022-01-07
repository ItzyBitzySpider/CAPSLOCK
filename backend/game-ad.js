const wordGen = require("./word-generation.js");

function createGame(io, socket, roomId, members, roomData) {

  members.forEach((m) => {
    roomData[roomId][m] = {};
    roomData[roomId][m]["wordlist"] = [];
    roomData[roomId][m]["lives"] = 3;
  });

  socket.on("game ad submit", ({ roomId, word }) => {
    console.log(socket.id + " submitted " + word);

    //Defense
    if(roomData[roomId][socket.id]["wordlist"].find((e)=>e===word)){
      roomData[roomId][socket.id]["wordlist"].delete(word);
    }

    io.to(roomId).emit("game ad update", {
      roomData
    });
    

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
