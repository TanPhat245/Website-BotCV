// server.js
import "./config/instrument.js";
import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import * as Sentry from "@sentry/node";
import http from "http"; // <-- cần để tạo server cho Socket.IO
import { Server } from "socket.io"; // <-- import socket.io
import path from "path";

import companyRoutes from "./routes/companyRoutes.js";
import UserRoute from "./routes/UserRoute.js";
import jobRoute from "./routes/JobRoute.js";
import ApplyRoute from "./routes/ApplyRoute.js";
import Recruiter from "./routes/RecruiterRoute.js";
import AdminRoute from "./routes/AdminRoute.js";
import { startAllCrons } from "./cron/index.js";
// ====== Chạy cron ======
startAllCrons();

// ====== Khởi tạo app & kết nối DB ======
const app = express();
await connectDB();

// ====== Tạo HTTP server và tích hợp Socket.IO ======
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// ====== Socket.IO: Quản lý kết nối người dùng ======
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("Người dùng đã kết nối:", socket.id);

  // Nhận ID người dùng và lưu socket
  socket.on("registerUser", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("User online:", userId, "Socket:", socket.id);
  });

  // Ngắt kết nối
  socket.on("disconnect", () => {
    for (let [userId, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        onlineUsers.delete(userId);
        console.log("User đã ngắt kết nối:", userId);
        break;
      }
    }
  });
});
// ====== Socket.IO: Quản lý kết nối nhà tuyển dụng ======
const onlineRecruiter = new Map();

io.on("connection", (socket) => {
  console.log("Nhà tuyển dụng đã kết nối:", socket.id);

  socket.on("registerRecruiter", (recruiterId) => {
    onlineUsers.set(recruiterId, socket.id);
    console.log("Recruiter online:", recruiterId);
  });

  socket.on("disconnect", () => {
    for (let [recruiterId, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        onlineUsers.delete(recruiterId);
        console.log("Recruiter đã ngắt kết nối:", recruiterId);
        break;
      }
    }
  });
});

// Xuất để controller sử dụng emit
export { io, onlineUsers, onlineRecruiter };
// ====== Middleware ======
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ====== Routes ======
app.get("/", (req, res) => res.send("API đang chạy"));
app.get("/debug-sentry", () => {
  throw new Error("My first Sentry error!");
});
app.use("/api/company", companyRoutes);
app.use("/api/user", UserRoute);
app.use("/api/jobs", jobRoute);
app.use("/api/apply", ApplyRoute);
app.use("/api/recruiter", Recruiter);
app.use("/api/admin", AdminRoute);

// ====== Khởi chạy ======
const PORT = process.env.PORT || 5000;
Sentry.setupExpressErrorHandler(app);
server.listen(PORT, () => {
  console.log(`Máy chủ đang chạy ở cổng ${PORT}`);
});
