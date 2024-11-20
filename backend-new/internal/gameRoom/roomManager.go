package gameRoom

import (
	"errors"
)

type RoomMap map[string]*Room

var roomMap RoomMap

func GetRoom(mode string) (*Room, error) {
	if roomMap == nil || roomMap[mode] == nil {
		return nil, errors.New("Room not found")
	}
	return roomMap[mode], nil
}

func CreateRoom(mode string) *Room {
	room := newRoom(mode)
	go room.Run()
	roomMap[mode] = room
	return room
}