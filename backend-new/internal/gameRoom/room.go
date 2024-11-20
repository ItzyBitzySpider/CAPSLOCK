package gameRoom

type Room struct {
	players    map[*Player]bool
	mode       string
	broadcast  chan []byte
	register   chan *Player
	unregister chan *Player
}

func newRoom(mode string) *Room {
	return &Room{
        broadcast: make(chan []byte),
        register: make(chan *Player),
        unregister: make(chan *Player),
        players: make(map[*Player]bool),
        mode: mode,
	}
}

func (r *Room) Run() {
	for {
		select {
		case player := <-r.register:
			r.players[player] = true
		case player := <-r.unregister:
			if _, ok := r.players[player]; ok {
				delete(r.players, player)
				close(player.send)
			}
		case message := <-r.broadcast:
			for player := range r.players {
				select {
				case player.send <- message:
				default:
					close(player.send)
					delete(r.players, player)
				}
			}
		}
	}
}
