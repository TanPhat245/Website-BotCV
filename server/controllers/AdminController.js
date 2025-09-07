import dotenv from "dotenv";
dotenv.config();
import { generateAdminToken } from "../utils/generateTokenAdmin.js";
import Industry from "../models/IndustryModel.js";
import Job from "../models/JobModel.js";
import Company from "../models/CompanyModel.js";
import User from "../models/UserModel.js";
import Apply from "../models/ApplyModel.js";

//Đăng nhập cho admin
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  if (
    email === process.env.EMAIL_ADMIN &&
    password === process.env.PASSWORD_ADMIN
  ) {
    const token = generateAdminToken("admin");
    return res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      admin: {
        email,
      },
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Email hoặc mật khẩu không đúng",
    });
  }
};
//Lấy danh sách ngành nghề
export const getIndustry = async (req, res) => {
  try {
    const industries = await Industry.find().sort({ createdAt: -1 });
    res.json({ success: true, data: industries });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
};
//Lấy danh sách ngành nghề không token
export const getIndustryNoToken = async (req, res) => {
  try {
    const industries = await Industry.find().sort({ createdAt: -1 });
    res.json({ success: true, data: industries });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
};
//Thêm ngành nghề
export const addIndustry = async (req, res) => {
  try {
    const { name, description } = req.body;
    const exist = await Industry.findOne({ name });
    if (exist) {
      return res
        .status(400)
        .json({ success: false, message: "Ngành nghề đã tồn tại." });
    }

    const newIndustry = new Industry({ name, description });
    await newIndustry.save();
    res.json({
      success: true,
      message: "Đã thêm ngành nghề.",
      data: newIndustry,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, message: "Lỗi khi thêm ngành nghề." });
  }
};
//Sửa nghành nghề
export const editIndustry = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updated = await Industry.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy ngành nghề." });

    res.json({
      success: true,
      message: "Đã cập nhật ngành nghề.",
      data: updated,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi khi sửa ngành nghề." });
  }
};
//Xóa ngành nghề
export const deleteIndustry = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Industry.findByIdAndDelete(id);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy ngành nghề." });

    res.json({ success: true, message: "Đã xóa ngành nghề." });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi khi xóa ngành nghề." });
  }
};
//Lấy chi tiết 1 ngành nghề theo ID
export const getIndustryById = async (req, res) => {
  try {
    const industry = await Industry.findById(req.params.id);
    if (!industry) {
      return res
        .status(404)
        .json({ success: false, message: "Ngành nghề không tồn tại" });
    }
    res.status(200).json({ success: true, data: industry });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: err.message });
  }
};
//Lấy danh sách người tìm việc
export const getListUser = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người tìm việc:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
//Lấy danh sách nhà tuyển dụng
export const getListCompany = async (req, res) => {
  try {
    const companies = await Company.find().select("-password");
    res.status(200).json({ success: true, data: companies });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách công ty:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
//Lấy danh sách tin tuyển dụng
export const getListJob = async (req, res) => {
  try {
    const jobs = await Job.find().populate("company", "companyName");
    res.status(200).json({ success: true, data: jobs });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách job:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
//Lấy danh sách đơn ứng tuyển
export const getListApply = async (req, res) => {
  try {
    const applications = await Apply.find()
      .populate({
        path: "companyId",
        select: "companyName email",
        model: "Recruiter",
      })
      .populate({
        path: "jobId",
        select: "title category status visible",
        model: "Job",
      })
      .populate({
        path: "userId",
        select: "name email phone",
        model: "User",
      });
    res.status(200).json({ success: true, data: applications });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách ứng tuyển:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
//Hủy ứng tuyển

//Đếm số lượng người, tin, ứng tuyển
export const getAdminSummary = async (req, res) => {
  try {
    const [jobCount, companyCount, userCount, applyCount] = await Promise.all([
      Job.countDocuments(),
      Company.countDocuments(),
      User.countDocuments(),
      Apply.countDocuments(),
    ]);

    res.status(200).json({
      jobs: jobCount,
      companys: companyCount,
      users: userCount,
      applications: applyCount,
    });
  } catch (err) {
    console.error("Lỗi khi lấy thống kê:", err);
    res.status(500).json({ message: "Lỗi server khi lấy thống kê" });
  }
};
//Vô hiệu hóa tài khoản
export const disabledAccount = async (req, res) => {
  try {
    const { id, type } = req.body;

    if (!id || !type) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu id hoặc loại tài khoản" });
    }

    if (type === "user") {
      await User.findByIdAndDelete(id);
    } else if (type === "company") {
      await Company.findByIdAndDelete(id);
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Loại tài khoản không hợp lệ" });
    }

    res
      .status(200)
      .json({ success: true, message: "Đã vô hiệu hóa tài khoản" });
  } catch (error) {
    console.error("Lỗi vô hiệu hóa tài khoản:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
//Hủy ứng tuyển
export const changeStatusApply = async (req, res) => {
  try {
    const { applyId } = req.body;
    if (!applyId) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu mã đơn ứng tuyển" });
    }

    const apply = await Apply.findByIdAndUpdate(
      applyId,
      { status: "Hủy bởi hệ thống" },
      { new: true }
    );

    if (!apply) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn ứng tuyển" });
    }

    res
      .status(200)
      .json({ success: true, message: "Đã hủy đơn ứng tuyển", data: apply });
  } catch (error) {
    console.error("Lỗi khi hủy đơn ứng tuyển:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
//Thêm gói tin
//Sửa gói tin
//Xóa gói tin
//Lấy danh sách gói tin
//Lấy danh sách nhà tuyển dụng đã mua gói tin
