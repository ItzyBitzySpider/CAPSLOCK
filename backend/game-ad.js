const wordGen = require("./word-generation.js");

function createGame(io, socket, roomId, members, roomData) {
  for (var i = 0; i < members.length; i++) {
    roomData[roomId][members[i]] = {};
    roomData[roomId][members[i]]["wordlist"] = [];
    roomData[roomId][members[i]]["timers"] = new Map();
    roomData[roomId][members[i]]["lives"] = 3;
    roomData[roomId][members[i]]["opponent"] =
      i == members.length - 1 ? members[0] : members[i + 1];
  }
  roomData[roomId]["used"] = new Set();
  io.to(roomId).emit("game ad start");
  updateGameState(io,socket,roomId,roomData,roomData[roomId][socket.id]["opponent"]);
}

function createListeners(io, socket, roomData) {
  socket.on("game ad submit", ({ roomId, word }) => {
    if (!roomData[roomId] || !roomData[roomId][socket.id]) {
      console.log("Error creating game: roomData[roomId][socket.id] undefined");
      return;
    }

    console.log(socket.id + " submitted " + word);

    const opponent = roomData[roomId][socket.id]["opponent"];

    const idx = roomData[roomId][socket.id]["wordlist"].indexOf(word);
    if (idx === -1) {
      //Attack
      if (
        word.length >= 3 &&
        !roomData[roomId]["used"].has(word) &&
        wordGen.dictionaryCheck(word)
      ) {
        roomData[roomId]["used"].add(word);
        roomData[roomId][opponent]["wordlist"].push(word);
        const oppIdx = roomData[roomId][opponent]["wordlist"].indexOf(word);
        const timerId = setTimeout(() => {
          //Timer ran out: Reduce 1 life, remove word from list
          roomData[roomId][opponent]["lives"]--;
          roomData[roomId][opponent]["wordlist"].splice(oppIdx, 1);
          roomData[roomId][opponent]["timers"].delete(word);
          updateGameState(io, socket, roomId, roomData, opponent);
          console.log("Timed out:", word);

          //No more lives; Game end
          if (
            !roomData[roomId][socket.id]["lives"] ||
            !roomData[roomId][opponent]["lives"]
          ) {
            closeGame(io, socket, roomId, roomData, opponent);
          }
        }, 10000);
        roomData[roomId][opponent]["timers"].set(word, timerId);
        console.log(socket.id, "attack:", word);
      }
    } else {
      //Defense: Remove entered word from list
      roomData[roomId][socket.id]["wordlist"].splice(idx, 1);
      clearTimeout(roomData[roomId][socket.id]["timers"].get(word));
      console.log(socket.id, "defend:", word);
    }
    updateGameState(io, socket, roomId, roomData, opponent);
    //console.log(roomData[roomId]);
    //io.to(roomId).emit("game ad update", roomData[roomId]);
  });
}

function updateGameState(io, socket, roomId, roomData, opponent) {
  io.to(roomId).emit("game ad update", {
    [socket.id]: {
      wordlist: roomData[roomId][socket.id]["wordlist"],
      lives: roomData[roomId][socket.id]["lives"],
    },
    [opponent]: {
      wordlist: roomData[roomId][opponent]["wordlist"],
      lives: roomData[roomId][opponent]["lives"],
    },
  });
}

function closeGame(io, socket, roomId, roomData, opponent) {
  io.to(roomId).emit("game end");

  roomData[roomId][socket.id]["timers"].forEach((v, k) => {
    clearTimeout(v);
    roomData[roomId][socket.id]["timers"].delete(k);
  });
  roomData[roomId][opponent]["timers"].forEach((v, k) => {
    clearTimeout(v);
    roomData[roomId][opponent]["timers"].delete(k);
  });

  delete roomData[roomId][socket.id];
  delete roomData[roomId][opponent];
  delete roomData[roomId]["used"];

  console.log(roomData);

  // const room = io.sockets.adapter.rooms.get(roomId);
  // if (room)
  //   io.sockets.adapter.rooms
  //     .get(roomId)
  //     .forEach((s) => io.sockets.sockets.get(s).leave(roomId));
  console.log("Game ended");
}

module.exports = { createGame, createListeners };
