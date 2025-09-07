import mongoose from "mongoose";

const industrySchema = new mongoose.Schema(
  {
    name: {type: String, required: true, unique: true, trim: true,},
    description: {type: String, default: "Ngành nghề này chưa có mô tả nào!",},
  },
    { timestamps: true }
);

const Industry = mongoose.model("Industry", industrySchema);
export default Industry;
