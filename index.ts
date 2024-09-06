import { createServer } from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

const API = "https://system.ludowalagames.com/api" + "/boardConnector/joinRoom";

type RoomJoinRes = {
  status?: boolean;
  roomId?: string;
  message?: string;
};

const roomId = "demo123";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});

// Before connection
io.use(async (socket, next) => {
  const token = socket.handshake?.auth?.token;
  if (!token) {
    return next(new Error("Authentication failed"));
  }

  const data = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
    },
  });

  const response = (await data.json()) as RoomJoinRes;

  if (response.status === true) {
    console.log("authenticated");
    socket.data.roomId = response.roomId;
    return next();
  }
  return next(new Error("Authentication failed"));
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  // Join with the specific room id got from the API
  socket.join(socket.data.roomId);

  io.to(socket.data.roomId).emit(
    "message",
    "Welcome to the room " + socket.data.roomId
  );
  console.log("Joined room:", socket.data.roomId);
  socket.emit("message", "Welcome to the room!");

  socket.join(socket.data.roomId);

  socket.on("sendMessage", (message) => {
    console.log(socket.data.roomId + ":", message);
    // io.to(socket.data.roomId).emit("message", message);
  });
});

// Send message to specific room

function sendMessageToRoom(roomId: string, message: string) {
  io.to(roomId).emit("message", message);
}

// Example usage:

setInterval(() => {
  sendMessageToRoom(roomId, "From server to " + roomId);
}, 3000);

instrument(io, {
  auth: false,
  mode: "development",
});

httpServer.listen(3000);
