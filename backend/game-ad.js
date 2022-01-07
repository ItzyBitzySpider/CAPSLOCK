const wordGen = require("./word-generation.js");

function createGame(roomId, members, roomData) {
  for (var i = 0; i < members.length; i++) {
    roomData[roomId][members[i]] = {};
    roomData[roomId][members[i]]["wordlist"] = [];
    roomData[roomId][members[i]]["timers"] = new Map();
    roomData[roomId][members[i]]["lives"] = 3;
    roomData[roomId][members[i]]["opponent"] =
      i == members.length - 1 ? members[0] : members[i + 1];
  }
}

function createListeners(io, socket, roomData) {
  socket.on("game ad submit", ({ roomId, word }) => {
    if (!roomData[roomId]) {
      console.log("Error creating game: roomData[roomId] undefined");
      return;
    }

    console.log(socket.id + " submitted " + word);

    const opponent = roomData[roomId][socket.id]["opponent"];

    const idx = roomData[roomId][socket.id]["wordlist"].indexOf(word);
    if (idx === -1) {
      //Attack
      if (word.length >= 3 && wordGen.dictionaryCheck(word)) {
        //TODO non-repeated words
        roomData[roomId][opponent]["wordlist"].push(word);
        const oppIdx = roomData[roomId][opponent]["wordlist"].indexOf(word);
        const timerId = setTimeout(() => {
          roomData[roomId][opponent]["lives"]--;
          roomData[roomId][opponent]["wordlist"].splice(oppIdx, 1);
          roomData[roomId][opponent]["timers"].get(word);
          io.to(roomId).emit("game ad update", {
            [socket.id]:{
              wordlist: roomData[roomId][socket.id]["wordlist"],
              lives: roomData[roomId][socket.id]["lives"],
            },
            [opponent]:{
              wordlist: roomData[roomId][opponent]["wordlist"],
              lives: roomData[roomId][opponent]["lives"],
            }
          });

          
          console.log("Timed out:",word)
        }, 10000);
        roomData[roomId][opponent]["timers"].set(word, timerId);
        console.log(socket.id, "attack:", word);
      }
    } else {
      //Defense
      roomData[roomId][socket.id]["wordlist"].splice(idx, 1);
      clearTimeout(roomData[roomId][socket.id]["timers"].get(word));
      console.log(socket.id, "defend:", word);
    }
    io.to(roomId).emit("game ad update", {
      [socket.id]:{
        wordlist: roomData[roomId][socket.id]["wordlist"],
        lives: roomData[roomId][socket.id]["lives"],
      },
      [opponent]:{
        wordlist: roomData[roomId][opponent]["wordlist"],
        lives: roomData[roomId][opponent]["lives"],
      }
    });
    //console.log(roomData[roomId]);
    //io.to(roomId).emit("game ad update", roomData[roomId]);
  });
}

module.exports = { createGame, createListeners };
