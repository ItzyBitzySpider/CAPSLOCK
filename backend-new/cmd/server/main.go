package main

import (
	"log"
	"net/http"

	"capslock/config"
	"capslock/internal/gameRoom"
	"github.com/gorilla/mux"
)

func main() {
	cfg := config.Load()

	router := mux.NewRouter()
	router.HandleFunc("/createRoom", func(w http.ResponseWriter, r *http.Request) {
		room := gameRoom.CreateRoom("classic")
        gameRoom.ServeWs(room, w, r)
	})
    router.HandleFunc("joinRoom", func(w http.ResponseWriter, r *http.Request) {
        room, err := gameRoom.GetRoom("id")
        if err != nil {
            http.Error(w, "Room not found", http.StatusNotFound)
        }
        gameRoom.ServeWs(room, w, r)
    })

	log.Printf("Server starting on port %s", cfg.Port)
	log.Fatal(http.ListenAndServe(cfg.Port, router))
}
