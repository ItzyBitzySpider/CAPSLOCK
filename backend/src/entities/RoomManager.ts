import { AdRoom } from "./rooms/AdRoom";
import { ElimRoom } from "./rooms/ElimRoom";
import { Room } from "./rooms/Room";
import { WaitingRoom } from "./rooms/WaitingRoom";

export class RoomManager {
    static rooms = new Map<string, Room>();

    static roomExists(roomId: string) {
        return this.rooms.has(roomId);
    }

    static deleteRoom(roomId: string) {
        this.rooms.delete(roomId);
    }

    static joinRoom(roomId: string, id: string) {
        const room = this.rooms.get(roomId);
        if (room instanceof WaitingRoom) {
            room.addPlayer(id);
            this.rooms.set(roomId, room);
        } else {
            console.error("Error joining room: room is not WaitingRoom");
        }
    }

    static createElimRoom(roomId: string) {
        if (this.getRoom(roomId) instanceof ElimRoom) {
            console.log("Room is already ElimRoom");
            return;
        }
        if (!(this.getRoom(roomId) instanceof WaitingRoom)) {
            console.error("Room is not Waiting Room")
            return
        }
        const waitingRoom: WaitingRoom = this.getWaitingRoom(roomId);
        const room: ElimRoom = waitingRoom.toElimRoom();
        this.rooms.set(roomId, room);
    }

    static createAdRoom(roomId: string) {
        if (this.getRoom(roomId) instanceof AdRoom) {
            console.log("Room is already AdRoom");
            return;
        }
        if (!(this.getRoom(roomId) instanceof WaitingRoom)) {
            console.error("Room is not Waiting Room")
            return
        }
        const waitingRoom: WaitingRoom = this.getWaitingRoom(roomId);;
        const room: AdRoom = waitingRoom.toAdRoom();
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

    static getAdRoom(roomId: string): AdRoom | null {
        const room = this.rooms.get(roomId);
        if (room instanceof AdRoom) {
            return room;
        } else {
            console.error("Error getting room: room is not AdRoom");
            return;
        }
    }

    static getElimRoom(roomId: string): ElimRoom | null {
        const room = this.rooms.get(roomId);
        if (room instanceof ElimRoom) {
            return room;
        } else {
            console.error("Error getting room: room is not ElimRoom");
            return;
        }
    }

    static getWaitingRoom(roomId: string): WaitingRoom | null {
        const room = this.rooms.get(roomId);
        if (room instanceof WaitingRoom) {
            return room;
        } else {
            console.error("Error getting room: room is not ElimRoom");
            return;
        }
    }
}
