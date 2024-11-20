package game

import "capslock/internal/gameRoom"

type AdvanceGame struct {
    room    *gameRoom.Room
    // game-specific fields
}

func NewAdvanceGame(room *gameRoom.Room) *AdvanceGame {
    return &AdvanceGame{
        room: room,
    }
}

func (g *AdvanceGame) Start() {
    // Implement game logic
}
