export function startTimer(io, roomId) {
  setTimeout(()=>io.to(roomId).emit("game end"), 60000);  
}
