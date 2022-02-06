const fs = require("fs");

const chunkSize = 100;
function readWord(fd, idx) {
  var buffer = Buffer.alloc(chunkSize);
  fs.readSync(fd, buffer, 0, chunkSize, idx);
  const readContents = buffer.toString("utf8", 0, chunkSize).split("\n");
  return readContents[1];
}

function generateWordlist() {
  let wl = [];
  const fd = fs.openSync("./wordlist.txt", "r");
  const stats = fs.fstatSync(fd);
  for (let i = 0; i < 9; i++)
    wl.push(readWord(fd, Math.floor(Math.random() * (stats.size - chunkSize))));
  return wl;
}

function generateNewWord() {
  const fd = fs.openSync("./wordlist.txt", "r");
  const stats = fs.fstatSync(fd);
  return readWord(fd, Math.floor(Math.random() * (stats.size - chunkSize)));
}

//Range finder binary search
//Only read chunks of dictionary file at a time; Does not read file into memory
function dictionaryCheck(x) {
  const fd = fs.openSync("./dictionary_sorted.txt", "r");
  const stats = fs.fstatSync(fd);
  let lower = 0,
    upper = stats.size - 1;
  while (lower <= upper) {
    let m = lower + Math.floor((upper - lower) / 2);

    var buffer = Buffer.alloc(chunkSize);
    fs.readSync(fd, buffer, 0, chunkSize, m);
    const readContents = buffer.toString("utf8", 0, chunkSize).split("\n");

    const resLower = x.localeCompare(readContents[1].trim()),
      resUpper = x.localeCompare(
        readContents[
          readContents.size - 2 > 1 ? readContents.size - 2 : 1
        ].trim()
      );
    if (resLower === 0 || resUpper === 0) return true;

    if (resLower > 0 && resUpper < 0) {
      readContents.forEach((e) => {
        if (e === x) return true;
      });
    }

    // console.log(
    //   lower +
    //     " " +
    //     upper +
    //     " " +
    //     resLower +
    //     " " +
    //     resUpper +
    //     "\n" +
    //     buffer.toString("utf8", 0, chunkSize) +
    //     "\n------------"
    // );

    if (resLower < 0) upper = m - 1;
    else lower = m + 1;
  }
  return false;
}

module.exports = { generateWordlist, generateNewWord, dictionaryCheck };
