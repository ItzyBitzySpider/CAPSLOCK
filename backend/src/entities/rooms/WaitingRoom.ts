import { AdRoom } from "./AdRoom";
import { ElimRoom } from "./ElimRoom";
import { Room } from "./Room";

export class WaitingRoom extends Room {
    constructor(roomId: string, numPlayers: number, id: string, mode: string) {
        super(roomId, numPlayers, [id], mode);
    }

    addPlayer(id: string) {
        if (this.members.length < this.maxPlayers) {
            this.members.push(id);
        }
    }

    toElimRoom() {
        return new ElimRoom(this.id, this.members);
    }

    toAdRoom() {
        return new AdRoom(this.id, this.members);
    }
}