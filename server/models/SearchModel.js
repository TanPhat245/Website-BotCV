import mongoose from "mongoose";

const SearchSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String },
    provinceCode: { type: String },
    district: { type: String },
  },
  { timestamps: true }
);

const Search =  mongoose.model("Search", SearchSchema);
export default Search
