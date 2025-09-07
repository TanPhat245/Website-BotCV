import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
{
  title: {type: String, required: true},
  description: {type: String, required: true},
  salary: {min: {type: Number}, max: {type: Number}, negotiable: {type: Boolean, default: false}},
  category: {type: String,required: true},
  level: {type: String, enum: ['Thực tập', 'Nhân viên', 'Trưởng phòng', 'Quản lý', 'Phó giám đốc', 'Giám đốc'], default: 'Thực tập'},
  type: {type: String, enum: ['On-site', 'Remote', 'Hybrid'], default: 'On-site'},
  experiences: {type: String,required: true},
  time: {type: String, enum: ['Toàn thời gian', 'Bán thời gian', 'Thực tập', 'Freelance','Khác'], default: 'Toàn thời gian'},
  provinceCode: {type: String, required: true},
  district: {type: String, required: true},
  recruiter: {type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true},
  company: {type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true},
  createdAt: {type: Date, default: Date.now},
  visible: {type: Boolean, default: true},
  slot: {type: Number, required: true},
  degree: {type: String, enum: ['Không yêu cầu','Trung học', 'Phổ thông', 'Đại học', 'Thạc sĩ', 'Tiến sĩ'], default: 'Không yêu cầu'},
  deadline: { type: Date, required: false, default: null },
  address: { type: String, required: false, default: "" },
  workingHours: { type: [String], default: [], },
});

const Job =  mongoose.model("Job", JobSchema);
export default Job;