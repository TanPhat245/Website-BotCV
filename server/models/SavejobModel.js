import mongoose from "mongoose";

const SaveJobSchema = new mongoose.Schema(
{
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  jobId: {type: mongoose.Schema.Types.ObjectId, ref: 'Job',required: true},
  recruiterId: {type: mongoose.Schema.Types.ObjectId, ref: "Recruiter", required: true},
  savedAt: {type: Date, default: Date.now}
}, { timestamps: true });
//Đíu cho nó lưu trùng nhau
SaveJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });

const SaveJob =  mongoose.model("SaveJob", SaveJobSchema);
export default SaveJob