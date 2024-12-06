import { Server } from "socket.io";
import { dictionaryCheck } from "./word-generation.js";
import { randomBytes } from "crypto";

function generateRoomId() {
    return randomBytes(8).toString("hex");
}

function testDictionary(arr) {
    arr.forEach((e) => {
        console.log(e + ":", dictionaryCheck(e));
    });
}

function countdown(io: Server, roomId: string): Promise<string> {
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

export { countdown, generateRoomId, testDictionary };
