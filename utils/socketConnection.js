import { Server } from "socket.io";

const socketConnection = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // your frontend origin
    },
  });

  io.on("connection", (socket) => {
    //handle events here
  });
};

export default socketConnection;
