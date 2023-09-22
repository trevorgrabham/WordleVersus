const socketIO = require("socket.io");

let rooms = {};

function initializeIO(server) {
  const io = socketIO(server, {
    cors: {
      origin: "http://127.0.0.1:8080",
      methods: ["GET", "POST"],
    },
    path: "/socket",
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    socket.on("message", (data) => {
      console.log(data);
      socket.broadcast.emit("receivedMessage", data);
    });

    // -------------------------- Start game room events --------------------------
    socket.on("createRoom", (data, callback) => {
      if (!data)
        return callback({
          error: true,
          message: `Room code is a required field`,
        });
      if (rooms[data.roomCode])
        return callback({
          error: true,
          message: `Room ${data.roomCode} already exists. Did you mean to 'Join Room' instead?`,
        });
      rooms[data.roomCode] = [socket.id];
      socket.join(data.roomCode);
      console.log(`${socket.id} successfully created room ${data.roomCode}`);
      return callback({
        error: false,
        message: `Successfully created room ${data.roomCode}`,
      });
    });

    socket.on("joinRoom", (data, callback) => {
      if (!data.roomCode)
        return callback({
          error: true,
          message: "Room code is a required field",
        });
      if (!rooms[data.roomCode])
        return callback({
          error: true,
          message: `Room with room code ${data.roomCode} does not exist. Did you mean to 'Create Room' instead?`,
        });
      if (rooms[data.roomCode].length >= 2)
        return callback({ error: `Room is already full` });
      rooms[data.roomCode].push(socket.id);
      socket.join(data.roomCode);
      socket.to(data.roomCode).emit("joinedRoom", { id: socket.id });
      console.log(`${socket.id} successfully joined room ${data.roomCode}`);
      return callback({
        error: false,
        message: `Successfully joined room ${data.roomCode}`,
      });
    });

    socket.on("leaveRoom", (data) => {
      if (!rooms[data.roomCode])
        return console.log(
          `${socket.id} is attempting to leave a room that has already been deleted`
        );
      console.log(
        `${socket.id} is attempting to leave room ${
          data.roomCode
        } that has length ${rooms[data.roomCode].length}`
      );
      socket.leave(data.roomCode);
      if (rooms[data.roomCode].length <= 1) {
        delete rooms[data.roomCode];
      } else {
        if (rooms[data.roomCode][0] === socket.id)
          rooms[data.roomCode].splice(0, 1);
        else rooms[data.roomCode].splice(1, 1);
      }
      console.log(`${socket.id} has successfully left ${data.roomCode}`);
      console.log(
        rooms[data.roomCode]
          ? `There is still ${rooms[data.roomCode][0]} left in the room`
          : `The room is now empty and has been deleted`
      );
    });
    // -------------------------- End game room events --------------------------

    // -------------------------- Start lobby events --------------------------
    socket.on("messageSend", (data) => {
      console.log(`Received ${data.message} from ${socket.id}`);
      socket
        .to(data.roomCode)
        .emit("messageReceived", { message: data.message });
    });

    socket.on("ready", (data) => {
      console.log(`${socket.id} indicated that they are ready`);
      socket.to(data.roomCode).emit("opponentReady");
    });

    socket.on("unready", (data) => {
      console.log(`${socket.id} indicated that they are NOT ready`);
      socket.to(data.roomCode).emit("opponentUnready");
    });
    // -------------------------- End lobby events --------------------------

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

module.exports = initializeIO;
