package config

type Config struct {
    Port     string
    MaxRooms int
    // Other config fields
}

func Load() *Config {
    return &Config{
        Port:     ":3003",
        MaxRooms: 100,
    }
}