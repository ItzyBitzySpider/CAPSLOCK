import { readSync, openSync, fstatSync } from "fs";
import path from "path";

const chunkSize = 100;
function readWord(fd, idx) {
    let buffer = Buffer.alloc(chunkSize);
    readSync(fd, buffer, 0, chunkSize, idx);
    const readContents = buffer.toString("utf8", 0, chunkSize).split("\n");
    return readContents[1];
}

function generateWordlist() {
    let wl = [];
    const filePath = path.resolve(__dirname, "../../data/wordlist.txt");
    const fd = openSync(filePath, "r");
    const stats = fstatSync(fd);
    for (let i = 0; i < 9; i++)
        wl.push(
            readWord(fd, Math.floor(Math.random() * (stats.size - chunkSize)))
        );
    return wl;
}

function generateNewWord() {
    const filePath = path.resolve(__dirname, "../../data/wordlist.txt");
    const fd = openSync(filePath, "r");
    const stats = fstatSync(fd);
    return readWord(fd, Math.floor(Math.random() * (stats.size - chunkSize)));
}

//Range finder binary search
//Only read chunks of dictionary file at a time; Does not read file into memory
function dictionaryCheck(x) {
    const filePath = path.resolve(__dirname, "../../data/dictionary_sorted.txt");
    const fd = openSync(filePath, "r");
    const stats = fstatSync(fd);
    let lower = 0,
        upper = stats.size - 1;
    while (lower <= upper) {
        let m = lower + Math.floor((upper - lower) / 2);

        var buffer = Buffer.alloc(chunkSize);
        readSync(fd, buffer, 0, chunkSize, m);
        const readContents = buffer.toString("utf8", 0, chunkSize).split("\n");

        const resLower = x.localeCompare(readContents[1].trim()),
            resUpper = x.localeCompare(
                readContents[
                    readContents.length - 2 > 1 ? readContents.length - 2 : 1
                ].trim()
            );
        if (resLower === 0 || resUpper === 0) return true;

        if (resLower > 0 && resUpper < 0) {
            readContents.forEach((e) => {
                if (e === x) return true;
            });
        }

        if (resLower < 0) upper = m - 1;
        else lower = m + 1;
    }
    return false;
}

export { generateWordlist, generateNewWord, dictionaryCheck };
