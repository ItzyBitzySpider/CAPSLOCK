import { AdRoom } from "./AdRoom";
import { ElimRoom } from "./ElimRoom";
import { Room } from "./Room";
import { WaitingRoom } from "./WaitingRoom";

export class RoomManager {
    static rooms = new Map<string, Room>();

    static roomExists(roomId: string) {
        console.log(this.rooms)
        return this.rooms.has(roomId);
    }

    static deleteRoom(roomId: string) {
        this.rooms.delete(roomId);
    }

    static createElimRoom(roomId: string, members: string[]) {
        const room: ElimRoom = new ElimRoom(roomId, members);
        this.rooms.set(roomId, room);
    }

    static createAdRoom(roomId: string, members: string[]) {
        const room: AdRoom = new AdRoom(roomId, members);
        this.rooms.set(roomId, room);
    }

    static createWaitingRoom(
        roomId: string,
        id: string,
        mode: string,
        numPlayers: number
    ) {
        const room: WaitingRoom = new WaitingRoom(roomId, numPlayers, id, mode);
        this.rooms.set(roomId, room);
    }

    static getRoom(roomId: string) {
        return this.rooms.get(roomId);
    }

    static getAdRoom(roomId: string) {
        const room = this.rooms.get(roomId);
        if (room instanceof AdRoom) {
            return room;
        } else {
            console.error("Error getting room: room is not AdRoom");
            return;
        }
    }

    static getElimRoom(roomId: string) {
        const room = this.rooms.get(roomId);
        console.log('getroom', this.rooms.get(roomId))
        if (room instanceof ElimRoom) {
            return room;
        } else {
            console.error("Error getting room: room is not ElimRoom");
            return;
        }
    }
}
