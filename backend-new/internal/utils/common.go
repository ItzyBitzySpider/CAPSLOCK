package utils

import (
	"fmt"
	"time"
)

func GenerateRoomID() string {
    // Implementation
    return fmt.Sprintf("%06d", time.Now().UnixNano()%1000000)
}
