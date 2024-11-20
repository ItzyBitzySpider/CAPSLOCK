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

export { generateRoomId, testDictionary };
