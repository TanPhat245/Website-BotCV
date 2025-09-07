import mongoose from "mongoose";

const recruiterNotificationSchema = new mongoose.Schema(
  {
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, },
    type: { type: String, required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const NotifyCompany = mongoose.model("RecruiterNotification", recruiterNotificationSchema);
export default NotifyCompany;