# Project CAPSLOCK

CAPSLOCK is a 1 vs 1 typing game. Presently there are 2 gamemodes available, elimination and attack defense. In the elimination gamemode, players are provided with a set of words which they can "claim" by typing them. When a word is claimed, the opponent can no longer type it. The point value of each word is equivalent to its length. The player with the highest score wins at the end of the time limit wins. In attack defense, players attack by typing new words which their opponent has to type within 5 seconds. If they fail to do so, they lose a life. A player wins when their opponent loses 3 lives. 

## Tech Stack

The frontend is written in ReactJS and TailwindCSS for simple inline styling. The backend is a simple NodeJS server. CAPSLOCK uses the Socket.IO library to handle websocket connections, taking advantage of the rooms feature to handle broadcast of events to game sessions. 

## Deployment

```bash
docker-compose -f docker-compose-prod.yml up
```

## Demo

[![Watch the video](https://img.youtube.com/vi/4Imk9OCuzQU/maxresdefault.jpg)](https://youtu.be/4Imk9OCuzQU)
