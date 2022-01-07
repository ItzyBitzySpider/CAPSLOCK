const crypto = require("crypto");
function generateRoomId() {
  //return "abc";
  return crypto.randomBytes(8).toString("hex");
}

module.exports = { generateRoomId };
