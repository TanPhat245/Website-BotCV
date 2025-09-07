import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    companyName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    provinceCode: { type: String },
    districtCode: { type: String },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Company = mongoose.model("Company", companySchema);
export default Company;
