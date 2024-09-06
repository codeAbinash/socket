import { io } from "socket.io-client";

const token =
  "Bearer " + "4442|kx83InwBxbKCBOQpM7bgPkK2MPcNAnpfOR73rOVnbec4fa6c";
const socket = io("ws://localhost:3000", {
  // const socket = io("http://socket.ludowalagames.com:3000", {
  reconnectionDelayMax: 10000,
  auth: {
    token: token,
  },
  // query: {
  //   "my-key": "my-value",
  // },
});

socket.on("connect", () => {
  console.log(socket.id);
});

socket.on("fail", (data) => {
  console.log(data);
});

socket.on("message", (data) => {
  console.log(data);
});

socket.on("error", (data) => {
  console.log(data);
});

socket.on("connect_error", (err) => {
  console.log("Connection error:", err.message);
});

socket.emit("message", {
  data: "Hello",
  name: "Abinash",
});

setInterval(() => {
  socket.emit("sendMessage", "Hello from client");
}, 3000);
