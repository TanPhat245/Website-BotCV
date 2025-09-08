// server/app.js
import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import * as Sentry from "@sentry/node";

import companyRoutes from "./routes/companyRoutes.js";
import UserRoute from "./routes/UserRoute.js";
import jobRoute from "./routes/JobRoute.js";
import ApplyRoute from "./routes/ApplyRoute.js";
import Recruiter from "./routes/RecruiterRoute.js";
import AdminRoute from "./routes/AdminRoute.js";
import connectDB from "./config/db.js";

// ====== Khởi tạo app ======
const app = express();
await connectDB();

app.use(
  cors({
    origin: "http://localhost:5173", // sửa lại cho đúng domain frontend của bạn
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ====== Routes ======
app.get("/", (req, res) => res.send("API đang chạy trên Vercel!"));
app.use("/api/company", companyRoutes);
app.use("/api/user", UserRoute);
app.use("/api/jobs", jobRoute);
app.use("/api/apply", ApplyRoute);
app.use("/api/recruiter", Recruiter);
app.use("/api/admin", AdminRoute);

Sentry.setupExpressErrorHandler(app);

// Xuất app để Vercel dùng
export default app;
