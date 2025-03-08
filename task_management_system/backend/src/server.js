const app = require("./app");
const dotenv = require("dotenv");
const http = require("http");
const socketIo = require("socket.io");
// const { initializeSocket } = require("./utils/socketConfig");
const server = http.createServer(app);
dotenv.config();


const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // The frontend URL, adjust as needed
    methods: ["GET", "POST"],
    credentials: true, // Enable credentials if needed (cookies, etc.)
  },
});
app.set("socketio", io);
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
socket.on("joinUserRoom", (userId) => {
  socket.join(userId);
  console.log(`User ${userId} joined their room`);
});
  // Join a room for the user
  socket.on("join", (userId) => {
    socket.join(userId.toString());
    console.log(`User ${userId} joined room`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
