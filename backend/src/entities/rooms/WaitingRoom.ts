import { Room } from "./Room";

export class WaitingRoom extends Room {
    constructor(roomId: string, numPlayers: number, id: string, mode: string) {
        super(roomId, numPlayers, [id], mode);
    }
}