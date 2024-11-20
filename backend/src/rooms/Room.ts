export abstract class Room {
    id: string;
    maxPlayers: number;
    members: string[];
    mode: string;

    constructor(
        roomId: string,
        maxPlayers: number,
        members: string[],
        mode: string
    ) {
        this.id = roomId;
        this.maxPlayers = maxPlayers;
        this.members = members;
        this.mode = mode;
    }
}