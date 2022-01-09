const utils = require("./util.js");
const gameElim = require("./game-elim.js");
const gameAd = require("./game-ad.js");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.text());

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*", //TODO: Change to deployment platform
  },
});

const roomData = new Map();

app.post("/validateroom", (req, res) => {
  res.send(Boolean(io.sockets.adapter.rooms.get(req.body)));
});

io.on("connection", async (socket) => {
  //DEBUGGING ONLY
  socket.onAny((event, ...args) => {
    console.log(socket.id + ":", event, args);
  });

  socket.on("room create", ({ type }, ack) => {
    const roomId = utils.generateRoomId();
    socket.join(roomId);
    const [numPlayer, mode] = type.split(" ");
    roomData[roomId] = {
      player: numPlayer === "single" ? 1 : 2,
      mode: mode,
    };
    console.log(roomId, "room created");

    ack(roomId);
  });

  socket.on("room join", ({ roomId }) => {
    const roomMembers = io.sockets.adapter.rooms.get(roomId);
    if (
      !roomMembers ||
      roomMembers.size === 2 ||
      !roomData[roomId] ||
      roomData[roomId]["player"] === 1
    )
      socket.emit("room join-fail");
    else {
      socket.join(roomId);
      io.to(roomId).emit("room update", roomData[roomId]["mode"]);
      console.log(
        socket.id,
        "joined room:",
        roomId,
        "(" + roomData[roomId]["mode"] + ")"
      );
    }
  });

  socket.on("game start", ({ roomId }) => {
    //TODO single player
    /*if (numPlayer === "single") {
    }*/

    let roomMembers = io.sockets.adapter.rooms.get(roomId);

    if (roomMembers) {
      if (roomData[roomId]["mode"] === "elim")
        gameElim.createGame(io, roomId, Array.from(roomMembers), roomData);
      else if (roomData[roomId]["mode"] === "ad")
        gameAd.createGame(
          io,
          socket,
          roomId,
          Array.from(roomMembers),
          roomData
        );
    }
  });

  gameElim.createListeners(io, socket, roomData);
  gameAd.createListeners(io, socket, roomData);

  // notify users upon disconnection
  socket.on("disconnecting", () => {
    if (socket.rooms)
      socket.rooms.forEach((roomId) => {
        socket.leave(roomId);
        const roomMembers = io.sockets.adapter.rooms.get(roomId);
        if (!roomMembers) {
          //Room no longer exists
          roomData.delete(roomId); //Delete from roomData map if no one left in room
          console.log(roomId, "deleted");
        } else {
          //TODO: Expansion to more than 2 players
          //Room still exists
          //io.to(roomId).emit("room update", Array.from(roomMembers)); //Inform other user that user in room left
        }
      });
  });

  socket.on("disconnect", async () => {
    console.log(socket.id, "disconnected");
  });
});

const port = process.env.PORT || 3003;
httpServer.listen(port);
