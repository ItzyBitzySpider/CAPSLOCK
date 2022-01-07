const roomData = new Map();

const utils = require("./util.js")
const gameElim = require("./game-elim.js");
const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:8080",
  },
});

io.on("connection", async (socket) => {
  //DEBUGGING ONLY
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });

  socket.on("room create", ({ type }, ack) => {
    const roomId = utils.generateRoomId();
    socket.join(roomId);
    const [ numPlayer, mode ] = type.split(" ");
    roomData[roomId] = {
      player: numPlayer === "single" ? 1 : 2,
      mode: mode,
    };
    console.log("Room created " + roomId + " (" + type + ")");

    if (numPlayer === "single") {
      //TODO single player
    }
    ack(roomId);
  });

  socket.on("room join", ({ roomId }) => {
    const roomMembers = io.sockets.adapter.rooms.get(roomId);
    if (
      !roomMembers ||
      roomMembers.size == 2 ||
      roomData[roomId]["player"] == 1
    ) {
      socket.emit("room join-fail");
    } else {
      socket.join(roomId);
      const roomMembers = io.sockets.adapter.rooms.get(roomId);
      io.to(roomId).emit("room update", Array.from(roomMembers));
      console.log(
        "Room joined " + roomId + " (" + roomData[roomId]["mode"] + ")"
      );

      //TODO: Start game based on game type
      gameElim.createGame(io, roomId, roomData);
      gameElim.createListeners(io, socket, roomData);
      utils.startTimer(io, roomId)
    }
  });  

  // notify users upon disconnection
  socket.on("disconnecting", () => {
    console.log("dc");
    socket.rooms.forEach((roomId) => {
      socket.leave(roomId);
      const roomMembers = io.sockets.adapter.rooms.get(roomId);
      if (roomMembers) {
        //Room still exists
        io.to(roomId).emit("room update", Array.from(roomMembers)); //Inform other user that user in room left
      } else {
        //Room no longer exists
        roomData.delete(roomId); //Delete from roomData map if no one left in room
        console.log("Deleting " + roomId);
      }
    });
  });

  socket.on("disconnect", async () => {
    console.log("dc-ed");
  });
});

httpServer.listen(3000);
