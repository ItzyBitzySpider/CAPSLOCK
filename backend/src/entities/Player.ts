export class Player {
    id: string;
    wordlist: string[];
    timers: Map<string, NodeJS.Timeout>;
    lives: number;
    opponentId: string;

    constructor(
        id: string,
        wordlist: string[],
        lives: number,
        opponent: string
    ) {
        this.id = id;
        this.wordlist = wordlist;
        this.timers = new Map();
        this.lives = lives;
        this.opponentId = opponent;
    }
}
