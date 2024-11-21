import { generateRoomId } from "./utils/utils";
import {
    createGame as createElimGame,
    createListeners as createElimListeners,
} from "./gamemodes/elimination";
import {
    createGame as createAdGame,
    createListeners as createAdListeners,
} from "./gamemodes/attack-defense";

import express, { Request, Response } from "express";
import { createServer, Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { RoomManager } from "./entities/RoomManager";

const app = express();

const httpServer: HttpServer = createServer(app);
const io: Server = new Server(httpServer, {
    cors: {
        origin: "*", //TODO: Change to deployment platform
    },
});

const countdown = function (io: Server, roomId: string): Promise<string> {
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

app.post("/validateroom", (req: Request, res: Response) => {
    res.send(Boolean(io.sockets.adapter.rooms.get(req.body)));
});

io.on("connection", async (socket: Socket) => {
    createElimListeners(io, socket);
    createAdListeners(io, socket);

    socket.onAny((event: string, ...args: any[]) => {
        console.log(socket.id + ":", event, args);
    });

    socket.on(
        "room create",
        ({ type }: { type: string }, ack: (roomId: string) => void) => {
            const roomId: string = generateRoomId();
            console.log(roomId);
            socket.join(roomId);
            console.log(io.sockets.adapter.rooms.get(roomId));
            const [numPlayer, mode] = type.split(" ");
            RoomManager.createWaitingRoom(
                roomId,
                socket.id,
                mode,
                numPlayer === "single" ? 1 : 2
            );
            console.log(roomId, "room created");
            ack(roomId);
        }
    );

    socket.on("room join", ({ roomId }: { roomId: string }) => {
        const roomMembers = io.sockets.adapter.rooms.get(roomId);
        console.log(roomMembers);
        if (!roomMembers || !RoomManager.roomExists(roomId)) {
            socket.emit("room does not exist");
        } else if (
            RoomManager.getRoom(roomId).maxPlayers ===
            RoomManager.getRoom(roomId).members.length
        ) {
            socket.emit("room full");
        } else {
            socket.join(roomId);
            io.to(roomId).emit("room update", RoomManager.getRoom(roomId)!.mode);
            console.log(
                socket.id,
                "joined room:",
                roomId,
                "(" + RoomManager.getRoom(roomId).mode + ")"
            );
        }
    });

    socket.on(
        "bot join",
        (
            { roomId }: { roomId: string },
            callback: (data: { id: string }) => void
        ) => {
            socket.join(roomId);
            console.log(
                socket.id,
                "bot joined room:",
                roomId,
                "(" + RoomManager.getRoom(roomId)!.mode + ")"
            );
            callback({
                id: socket.id,
            });
        }
    );

    socket.on("game start", async ({ roomId }: { roomId: string }) => {
        const roomMembers = io.sockets.adapter.rooms.get(roomId);
        console.log(roomMembers, roomId);
        if (roomMembers) {
            await countdown(io, roomId);
            if (RoomManager.getRoom(roomId).mode === "elim") {
                await createElimGame(io, roomId, Array.from(roomMembers));
            } else if (RoomManager.getRoom(roomId).mode === "ad") {
                await createAdGame(io, socket, roomId, Array.from(roomMembers));
            }
        } else {
            console.log("why");
        }
    });

    socket.on("disconnecting", () => {
        if (socket.rooms) {
            socket.rooms.forEach((roomId) => {
                socket.leave(roomId);
                const roomMembers = io.sockets.adapter.rooms.get(roomId);
                if (!roomMembers) {
                    RoomManager.deleteRoom(roomId);
                    console.log(roomId, "deleted");
                }
            });
        }
    });

    socket.on("disconnect", async () => {
        console.log(socket.id, "disconnected");
    });
});

const port: number | string = process.env.PORT || 3003;
console.log("listening on port " + port);
httpServer.listen(port);
