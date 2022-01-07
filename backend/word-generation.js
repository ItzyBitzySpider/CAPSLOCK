const fs = require("fs");

function generateWordlist() {
  let wl = [];
  const fd = fs.openSync("./wordlist.txt", "r");
  console.log(fd);
  const stats = fs.fstatSync(fd);
  for (let i = 0; i < 20; i++) wl.push(readWord(fd, stats));
  return wl;
}

function generateNewWord() {
  const fd = fs.openSync("./wordlist.txt", "r");
  console.log(fd);
  const stats = fs.fstatSync(fd);
  return readWord(fd, stats);
}

const chunkSize = 100;
function readWord(fd, stats) {
  const idx = Math.floor(Math.random() * (stats.size - chunkSize));
  var buffer = Buffer.alloc(chunkSize);
  fs.readSync(fd, buffer, 0, chunkSize, idx);
  const readContents = buffer.toString("utf8", 0, chunkSize).split("\n");
  console.log(readContents);
  return readContents[1];
}

module.exports = { generateWordlist, generateNewWord };
