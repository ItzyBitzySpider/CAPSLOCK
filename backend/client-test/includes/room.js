export function createRoomListeners(socket) {
  socket.on("room join-fail", () => {
    //No need for success; room update should be assumed as success
    console.log("Enable to join room");
  });

  socket.on("room update", (members) => {
    console.log(members);
  });
};