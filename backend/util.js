const crypto = require("crypto");
const wordGen = require("./word-generation.js");
function generateRoomId() {
  //return "abc";
  return crypto.randomBytes(8).toString("hex");
}

function testDictionary(arr) {
  arr.forEach((e) => {
    console.log(e + ":", wordGen.dictionaryCheck(e));
  });
}

module.exports = { generateRoomId, testDictionary };
