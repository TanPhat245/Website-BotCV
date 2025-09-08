// server/server.js
import http from "http";
import { Server } from "socket.io";
import { startAllCrons } from "./cron/index.js";
import app from "./app.js";

// ====== Cron jobs ======
startAllCrons();

// ====== Socket.IO ======
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const onlineUsers = new Map();
const onlineRecruiter = new Map();

io.on("connection", (socket) => {
  console.log("Người dùng kết nối:", socket.id);
  socket.on("registerUser", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  socket.on("registerRecruiter", (recruiterId) => {
    onlineRecruiter.set(recruiterId, socket.id);
  });
  socket.on("disconnect", () => {
    onlineUsers.forEach((id, userId) => {
      if (id === socket.id) onlineUsers.delete(userId);
    });
    onlineRecruiter.forEach((id, recruiterId) => {
      if (id === socket.id) onlineRecruiter.delete(recruiterId);
    });
  });
});

export { io, onlineUsers, onlineRecruiter };

// ====== Chạy local ======
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
