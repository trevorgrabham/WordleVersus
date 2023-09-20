const socketIO = require("socket.io");

let numPeopleOnPage = 0;

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
    console.log(`${++numPeopleOnPage} are currently on the page`);
    socket.on("message", (data) => {
      console.log(data);
      socket.broadcast.emit("receivedMessage", data);
    });

    socket.on("sendMessage", (data) => {
      console.log(`Received ${data.message} from ${socket.id}`);
      socket.broadcast.emit("receivedMessage", data);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
      console.log(`There are now ${--numPeopleOnPage} people left on the page`);
    });
  });

  return io;
}

module.exports = initializeIO;
