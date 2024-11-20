package game

import "capslock/internal/gameRoom"

type EliminationGame struct {
    room    *gameRoom.Room
    // game-specific fields
}

func NewEliminationGame(room *gameRoom.Room) *EliminationGame {
    return &EliminationGame{
        room: room,
    }
}

func (g *EliminationGame) Start() {
    // Implement game logic
}
