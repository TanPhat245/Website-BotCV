import mongoose from "mongoose";

const RecruiterSchema = new mongoose.Schema(
  {
    companyId: {type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, unique: true,},
    companyName: {type: String, required: true,},
    namemanage: {type: String, required: true,},
    logo: {type: String, required: true,},
    phone: {type: String, required: true,},
    email: {type: String, required: true, unique: true,},
    description: {type: String, required: true,},
    address: {type: String, required: true,},
    image: {type: String, required: false,},
    website: { type: String, default: "" },
    employees: { type: String, default: "" },
    followers: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
  },
  { timestamps: true }
);

const Recruiter = mongoose.model("Recruiter", RecruiterSchema);
export default Recruiter;
