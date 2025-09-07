import Recruiter from "../models/RecruiterModel.js";
import Company from "../models/CompanyModel.js";
import fs from "fs";
import path from "path";
import Job from "../models/JobModel.js";

//Thêm công ty
// Mỗi công ty chỉ có 1 recruiter
export const AddRecruiter = async (req, res) => {
  try {
    const company = req.company;
    const { phone, email, description, address, website, employees } = req.body;
    const logo = req.files?.logo?.[0]?.path;
    const image = req.files?.image?.[0]?.path;
    // Kỉm tra có cty chưa(Mỗi thằng công ty chỉ có 1 recruiter)
    const existing = await Recruiter.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Thông tin công ty đã tồn tại" });
    }
    const recruiter = await Recruiter.create({
      companyId: req.company._id,
      companyName: company.companyName,
      namemanage: company.fullName,
      logo,
      phone,
      email,
      description,
      address,
      image,
      website,
      employees,
    });
    res.status(201).json({ success: true, recruiter });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Sửa thông tin công ty
export const UpdateRecruiter = async (req, res) => {
  try {
    //Tạo các biến để hứng Recruiter
    const { id } = req.params;
    const recruiter = await Recruiter.findById(id);
    if (!recruiter)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy recruiter" });
    // Xử lý file
    const logo = req.files?.logo?.[0]?.path;
    const image = req.files?.image?.[0]?.path;
    // Logic xóa file cũ: Kiểm tra cũ(2) và mới(1)
    if (logo && recruiter.logo) {
      fs.unlink(path.join(recruiter.logo), (err) => {
        if (err) console.log("Lỗi xóa logo cũ:", err.message);
      });
      recruiter.logo = logo;
    }
    if (image && recruiter.image) {
      fs.unlink(path.join(recruiter.image), (err) => {
        if (err) console.log("Lỗi xóa image cũ:", err.message);
      });
      recruiter.image = image;
    }
    // Cập nhật thông tin
    const { phone, email, description, address } = req.body;
    if (phone) recruiter.phone = phone;
    if (email) recruiter.email = email;
    if (description) recruiter.description = description;
    if (address) recruiter.address = address;
    await recruiter.save();
    res.json({ success: true, recruiter });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Lấy thông tin
export const GetRecruiter = async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ companyId: req.company._id });
    if (!recruiter)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy recruiter" });
    res.json({ success: true, recruiter });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Lấy thông tin công ty ở frontend
export const GetCompanyInfo = async (req, res) => {
  try {
    const recruiterId = req.params.id;

    const recruiter = await Recruiter.findById(recruiterId);
    if (!recruiter) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy thông tin công ty" });
    }

    res.json({ success: true, recruiter });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin công ty:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
//Lấy danh sách công việc của công ty
export const GetJobByRecruiter = async (req, res) => {
  try {
    const recruiterId = req.params.id;
    const jobs = await Job.find({ recruiter: recruiterId, visible: true }).sort(
      { createdAt: -1 }
    );

    res.json({ success: true, jobs });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách job:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
// Tìm kiếm job theo recruiterId với từ khóa và tỉnh
export const SearchJobsByRecruiter = async (req, res) => {
  try {
    const recruiterId = req.params.id;
    const { keyword = "", province = "" } = req.query;

    const query = { recruiter: recruiterId, visible: true };

    if (keyword) {
      query.title = { $regex: keyword, $options: "i" };
    }
    if (province) {
      query.provinceCode = province;
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
