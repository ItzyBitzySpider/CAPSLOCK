import { generateRoomId } from "./utils/utils";
import {
    createGame as createElimGame,
    createListeners as createElimListeners,
} from "./gamemodes/elimination";
import {
    createGame as createAdGame,
    createListeners as createAdListeners,
} from "./gamemodes/attack-defense";

import express from "express";
import { bodyParser } from "body-parser";
import { createServer } from "http";
import "socket.io";
import { Server } from "socket.io";

const app = express();
// app.use(bodyParser.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", //TODO: Change to deployment platform
    },
});

const roomData = new Map();

const countdown = function (io, roomId) {
    let count = 3;
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            if (count === 0) {
                resolve("done");
                io.to(roomId).emit("countdown", "Start");
                clearInterval(interval);
            } else {
                io.to(roomId).emit("countdown", count.toString());
                count -= 1;
            }
        }, 1000);
    });
};

app.post("/validateroom", (req, res) => {
    res.send(Boolean(io.sockets.adapter.rooms.get(req.body)));
});

// instance of each connection
io.on("connection", async (socket) => {
    //DEBUGGING ONLY
    socket.onAny((event, ...args) => {
        console.log(socket.id + ":", event, args);
    });

    socket.on("room create", ({ type }, ack) => {
        const roomId = generateRoomId();
        socket.join(roomId);
        const [numPlayer, mode] = type.split(" ");
        roomData[roomId] = {
            player: numPlayer === "single" ? 1 : 2,
            mode: mode,
        };
        console.log(roomId, "room created");
        ack(roomId);
    });

    // player joins second room
    socket.on("room join", ({ roomId }) => {
        const roomMembers = io.sockets.adapter.rooms.get(roomId);
        if (!roomMembers || !roomData[roomId]) {
            socket.emit("room does not exist");
        } else if (roomMembers.size === 2 || roomData[roomId]["player"] === 1) {
            socket.emit("room full");
        } else {
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

    socket.on("bot join", ({ roomId }, callback) => {
        socket.join(roomId);
        console.log(
            socket.id,
            "bot joined room:",
            roomId,
            "(" + roomData[roomId]["mode"] + ")"
        );
        callback({
            id: socket.id,
        });
    });

    // start game in given roomId
    socket.on("game start", async ({ roomId }) => {
        let roomMembers = io.sockets.adapter.rooms.get(roomId);
        if (roomMembers) {
            await countdown(io, roomId);
            if (roomData[roomId]["mode"] === "elim") {
                await createElimGame(
                    io,
                    roomId,
                    Array.from(roomMembers),
                    roomData
                );
            } else if (roomData[roomId]["mode"] === "ad") {
                await createAdGame(
                    io,
                    socket,
                    roomId,
                    Array.from(roomMembers),
                    roomData
                );
            }
        }
    });

    createElimListeners(io, socket, roomData);
    createAdListeners(io, socket, roomData);

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

// run server
const port = process.env.PORT || 3003;
console.log("listening on port " + port);
httpServer.listen(port);
