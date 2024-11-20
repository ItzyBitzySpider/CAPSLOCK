package types

import "encoding/json"

type Message struct {
    Type    string          `json:"type"`
    RoomID  string         `json:"roomId,omitempty"`
    Payload json.RawMessage `json:"payload,omitempty"`
}
