import { generateWordlist } from "../utils/word-generation";
import { Room } from "./Room";

export class ElimRoom extends Room {
    wordlist: string[];
    score: Record<string, number>;
    timeEnd: number;

    constructor(roomId: string, members: string[]) {
        super(roomId, members.length, members, "elim");
        this.wordlist = generateWordlist();
        this.score = {
            [members[0]]: 0,
            [members[1]]: 0,
        };
        this.timeEnd = Date.now() + 60000;
    }
}
