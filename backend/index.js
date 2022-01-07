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
    origin: "http://localhost:3000",
  },
});

//const sessionStore = new utils.InMemorySessionStore();
const roomData = new Map();

/*//Middleware to preserve sessionState
io.use((socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    // find existing session
    const session = sessionStore.findSession(sessionID);
    if (session) {
      socket.id = sessionID;
      return next();
    }
  }
  socket.id = crypto.randomBytes(12).toString("hex");
  next();
});*/

app.post("/validateroom", (req, res) => {
  res.send(Boolean(io.sockets.adapter.rooms.get(req.body)));
});

io.on("connection", async (socket) => {
  //DEBUGGING ONLY
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });

  /*sessionStore.saveSession(socket.id, {
    userID: socket.userID,
    username: socket.username,
    connected: true,
  });

  socket.emit("session", {
    sessionID: socket.id,
  });*/

  socket.on("room create", ({ type }, ack) => {
    const roomId = utils.generateRoomId();
    socket.join(roomId);
    const [numPlayer, mode] = type.split(" ");
    roomData[roomId] = {
      player: numPlayer === "single" ? 1 : 2,
      mode: mode,
    };
    console.log("Room created " + roomId + " (" + type + ")");

    ack(roomId);

    if (numPlayer === "single") {
      //TODO single player
    }
  });

  socket.on("room join", ({ roomId }) => {
    const roomMembers = io.sockets.adapter.rooms.get(roomId);
    if (
      !roomMembers ||
      roomMembers.size == 2 ||
      roomData[roomId]["player"] == 1
    )
      socket.emit("room join-fail");
    else {
      socket.join(roomId);
      const roomMembers = io.sockets.adapter.rooms.get(roomId);
      io.to(roomId).emit("room update", roomData[roomId]["mode"]);
      console.log(
        "Room joined " + roomId + " (" + roomData[roomId]["mode"] + ")"
      );
    }
  });

  socket.on("game start", ({ roomId }) => {
    let roomMembers = io.sockets.adapter.rooms.get(roomId);

    if(roomData[roomId]['mode']==='elim') gameElim.createGame(io, socket, roomId, Array.from(roomMembers), roomData);
    //else if(roomData[roomId][mode]==='ad') gameAd.createGame(io, socket, roomId, Array.from(roomMembers), roomData);

    utils.startTimer(io, roomId, roomData);
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

// gameElim.testDictionary(["even","evan","answer","master"]);

const port = process.env.PORT ? process.env.PORT : 3000;
httpServer.listen(port);
