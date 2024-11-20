import { Room } from "./Room";
import { Player } from "./Player";

export class AdRoom extends Room {
    used: Set<string>;
    players: Record<string, Player>;

    constructor(roomId: string, members: string[]) {
        super(roomId, members.length, members, "ad");
        this.used = new Set();
        this.players = {
            [members[0]]: new Player(members[0], [], 3, members[1]),
            [members[1]]: new Player(members[1], [], 3, members[0]),
        };
    }
}
