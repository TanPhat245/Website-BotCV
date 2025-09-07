// cron/closeExpiredJobs.js
import cron from "node-cron";
import Job from "../models/JobModel.js"; // Cập nhật path nếu cần

export const startCloseExpiredJobsCron = () => {
  // Chạy mỗi ngày lúc 12gio
  //cron.schedule("*/1 * * * *" chayj 1p
  cron.schedule("0 0 * * *", async () => {
    try {
      const now = new Date();
      const result = await Job.updateMany(
        { deadline: { $lt: now }, visible: true },
        { $set: { visible: false } }
      );
      console.log(`[CronJob] Đã tự động đóng ${result.modifiedCount} job hết hạn.`);
    } catch (err) {
      console.error("[CronJob] Lỗi khi đóng job:", err.message);
    }
  });

  console.log("[CronJob] Cron đóng job hết hạn đã được khởi động");
};
