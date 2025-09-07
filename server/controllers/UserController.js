import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Apply from "../models/ApplyModel.js";
import Job from "../models/JobModel.js";
import express from "express";
import Search from "../models/SearchModel.js";
import SaveJob from "../models/SavejobModel.js";
import Notification from "../models/NotifyModel.js";
import Recruiter from "../models/RecruiterModel.js";
import { io, onlineUsers } from "../server.js";
import mongoose from "mongoose";
import { sendResetPasswordEmail } from "../utils/sendMailPassword.js";
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Đăng ký
export const RegisterUser = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email đã được sử dụng." });

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "Đăng ký thành công." });
  } catch (err) {
    res.status(500).json({ message: "Lỗi máy chủ.", error: err.message });
  }
};
// Đăng nhập
export const LoginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Tài khoản không tồn tại." });

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Mật khẩu không đúng." });

    // Tạo token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Trả về thông tin user và token
    res.status(200).json({
      message: "Đăng nhập thành công.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi máy chủ.", error: err.message });
  }
};
//Lấy thông tin 1 người dùng + danh sách đã ứng tuyển
export const GetUser = async (req, res) => {
  try {
    const userId = req.user;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Người dùng không tồn tại" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
//Apply
export const ApplyJobs = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.user;
    // Kiểm tra đơn ứng tuyển đã tồn tại chưa
    const existingApplication = await Apply.findOne({ jobId, userId });

    if (existingApplication) {
      const reapplyAllowedStatuses = [
        "Từ chối",
        "Ứng viên rút hồ sơ",
        "Hủy bởi hệ thống",
      ];

      if (!reapplyAllowedStatuses.includes(existingApplication.status)) {
        return res.json({
          success: false,
          message: "Bạn đã ứng tuyển tin tuyển dụng này",
        });
      }

      // Cho phép ứng tuyển lại
      existingApplication.status = "Đã ứng tuyển";
      //createAt
      existingApplication.date = Date.now();
      await existingApplication.save();
      const updatedJob = await Job.findById(jobId).populate(
        "recruiter",
        "companyName logo"
      );
      return res.json({
        success: true,
        message: "Ứng tuyển lại thành công",
        data: existingApplication,
        job: updatedJob,
      });
    }

    //Kiểm tra jobId
    const jobData = await Job.findById(jobId);
    if (!jobData) {
      return res.json({
        success: false,
        message: "Không tìm thấy tin tuyển dụng",
      });
    }
    //Kiểm tra người dùng
    const userData = await User.findById(userId);
    if (!userData) {
      return res.json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }
    //Kiểm tra có hồ sơ tìm việc chưa
    const requiredFields = ["degree", "field", "level", "cvUrl", "address"];
    const missingFields = requiredFields.filter((field) => !userData[field]);

    if (missingFields.length > 0) {
      return res.json({
        success: false,
        message: "Vui lòng hoàn thiện hồ sơ trước khi ứng tuyển.",
        missingFields,
      });
    }
    //Kiểm tra nhà tuyển dụng
    const companyId = jobData.recruiter;
    const application = await Apply.create({
      companyId,
      userId,
      jobId,
      date: Date.now(),
      userName: userData.name,
      userPhone: userData.phone,
      userEmail: userData.email,
      userAddress: userData.address,
      userCvUrl: userData.cvUrl,
      jobTitle: jobData.title,
    });
    //Lưu thông báo
    await Notification.create({
      userId,
      type: "application",
      content: `Bạn đã ứng tuyển vào công việc ${jobData.title}`,
    });
    //Thông báo
    const socketId = onlineUsers.get(userId);
    if (socketId) {
      io.to(socketId).emit("newNotification", {
        type: "application",
        message: `Bạn đã ứng tuyển vào công việc ${jobData.title}`,
      });
    }
    res.json({
      success: true,
      message: "Ứng tuyển thành công",
      data: application,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
//Thay đổi thông tin(mật khẩu, tên người dùng)
export const ChangeUser = async (req, res) => {
  try {
    const userId = req.user; //lấy token
    const { name, currentPassword, newPassword } = req.body;
    // Lấy thông tin người dùng
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Người dùng không tồn tại" });
    }
    //Check mk mới
    if (newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "Mật khẩu hiện tại không đúng" });
      }
      // Mã hóa mật khẩu mới
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }
    // Thay tên đổi họ
    if (name) {
      user.name = name;
    }
    await user.save();
    res.json({ success: true, message: "Cập nhật thông tin thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
//Thêm thông tin hồ sơ
export const addInfoUser = async (req, res) => {
  try {
    const userId = req.user; //ae mình lấy token thôi hẹ hẹ
    const { degree, field, level, address } = req.body;
    const cvUrl = req.file ? `/uploads/cv/${req.file.filename}` : null;
    const user = await User.findById(userId); // tìm user, đéo tìm đc thì không làm ăn gì đâu
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Người dùng không tồn tại" });
    }
    // Chỉ thêm thông tin nếu chưa có
    if (user.degree || user.field || user.level || user.cvUrl || user.address) {
      return res.status(400).json({
        success: false,
        message: "Bờ rô đã có hồ sơ, hãy cập nhật đi.",
      });
    }

    user.degree = degree;
    user.field = field;
    user.level = level;
    user.cvUrl = cvUrl;
    user.address = address;

    await user.save();
    res.json({ success: true, message: "Thêm hồ sơ thành công", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
//Sửa thông tin hồ sơ
export const updateInfoUser = async (req, res) => {
  try {
    const userId = req.user;
    const { name, phone, degree, field, level, address } = req.body;
    const cvUrl = req.file
      ? `/uploads/cv/${req.file.filename}`
      : req.body.cvUrl;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(degree && { degree }),
        ...(field && { field }),
        ...(level && { level }),
        ...(cvUrl && { cvUrl }),
        ...(address && { address }),
      },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng" });
    }

    res.json({
      success: true,
      message: "Cập nhật hồ sơ thành công",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
//Lấy thông tin hồ sơ
export const getInfoUser = async (req, res) => {
  try {
    // Nếu chưa đăng nhập, trả user: null (KHÔNG trả lỗi)
    if (!req.user) {
      return res.status(200).json({ success: true, user: null });
    }

    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Lỗi khi lấy hồ sơ:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
//Lấy danh sách job đã ứng tuyển
export const GetUserJobApplications = async (req, res) => {
  try {
    const userId = req.user;

    const applications = await Apply.find({ userId })
      .populate({
        path: "companyId",
        select: "companyName email logo address",
        model: "Recruiter",
        populate: {
          path: "companyId",
          select: "companyName",
          model: "Company",
        },
      })
      .populate(
        "jobId",
        "title description location category level salary status"
      )
      .exec();
    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
//Hủy ứng tuyển
export const CancelApplication = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.user;

    const application = await Apply.findOne({ jobId, userId });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn ứng tuyển.",
      });
    }

    const status = application.status;

    if (status === "Đã tuyển" || status === "Hủy bởi hệ thống") {
      return res.status(400).json({
        success: false,
        message: "Không thể hủy đơn đã tuyển hoặc bị hệ thống hủy.",
      });
    }

    application.status = "Ứng viên rút hồ sơ";
    await application.save();

    res.json({
      success: true,
      message: "Đã hủy đơn ứng tuyển thành công.",
    });
  } catch (err) {
    console.error("Lỗi khi hủy đơn:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi server: " + err.message,
    });
  }
};
//Tìm kiếm Tên job(title) + địa điểm(provinceCode + district hoặc provinceCode hoặc district)
export const SearchJobs = async (req, res) => {
  try {
    const { title, provinceCode, district } = req.query;
    const userId = req.user;

    // Nếu người dùng đã đăng nhập => lưu lịch sử
    if (userId) {
      await Search.create({ userId, title, provinceCode, district });
    }

    // Tạo điều kiện tìm kiếm
    let search = {};
    if (title) {
      search.title = { $regex: title, $options: "i" };
    }
    if (provinceCode) {
      search.provinceCode = provinceCode;
    }
    if (district) {
      search.district = district;
    }
    //lOGIC tìm kiếm
    const jobs = await Job.find(search)
      .populate("recruiter", "companyName logo")
      .populate("company", "logo")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    console.error("Lỗi tìm kiếm công việc:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi tìm kiếm công việc" });
  }
};
//Lấy danh sách tìm kiếm
export const GetSearchHistory = async (req, res) => {};
//Lưu tin tuyển dụng
export const SaveJobController = async (req, res) => {
  try {
    //ae mình lấy token thôi hehe
    const userId = req.user;
    const { jobId } = req.body;
    const job = await Job.findById(jobId);
    if (!jobId) {
      return res.status(400).json({ success: false, message: "Thiếu ID JOB" });
    }

    const saved = await SaveJob.create({
      userId,
      jobId,
      recruiterId: job.recruiter,
    });
    res
      .status(201)
      .json({ success: true, message: "Đã lưu tin tuyển dụng!", data: saved });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Tin này đã được lưu rồi bro." });
    }
    console.error("Lỗi khi lưu tin:", err);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi lưu tin tuyển dụng." });
  }
};
//Lấy danh sách tin đã lưu
export const GetSavedJobs = async (req, res) => {
  try {
    const userId = req.user;

    const savedJobs = await SaveJob.find({ userId })
      .populate("jobId", "title salary companyName provinceCode district")
      .populate({
        path: "recruiterId",
        select: "companyName email logo",
        model: "Recruiter",
      })
      .lean();

    const jobs = savedJobs
      .filter((item) => item.jobId)
      .map((item) => ({
        savedJobId: item._id,
        jobId: item.jobId._id,
        savedAt: item.createdAt,
        ...item.jobId,
        ...item.recruiterId,
      }));

    res.status(200).json({ success: true, data: jobs });
  } catch (err) {
    console.error("Lỗi khi lấy tin đã lưu:", err);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi lấy tin đã lưu." });
  }
};
//Xoá tin đã lưu
export const DeleteSavedJob = async (req, res) => {
  try {
    const userId = req.user;
    const { jobId } = req.params;
    const deleted = await SaveJob.findOneAndDelete({ userId, _id: jobId });

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy tin đã lưu." });
    }

    res.status(200).json({ success: true, message: "Đã xoá tin đã lưu." });
  } catch (err) {
    console.error("Lỗi khi xoá tin đã lưu:", err);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi xoá tin." });
  }
};
//Check lưu tin
export const CheckSavedJob = async (req, res) => {
  try {
    const userId = req.user;
    const { jobId } = req.params;

    const saved = await SaveJob.findOne({ userId, jobId });

    return res.json({ saved: !!saved });
  } catch (err) {
    console.error("Lỗi khi kiểm tra tin đã lưu:", err);
    res.status(500).json({
      saved: false,
      message: "Lỗi server khi kiểm tra tin đã lưu.",
    });
  }
};
//Gửi thông báo
export const sendNotification = async (userId, type, content, io) => {
  const notification = new Notification({ userId, type, content });
  await notification.save();
  // Gửi socket realtime
  io.to(userId.toString()).emit("new_notification", notification);
};
//Lấy danh sách thông báo theo user
export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, data: notifications });
  } catch (err) {
    console.error("Lỗi lấy thông báo:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
//Đánh dấu đã đọc
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { isRead: true });
    res.status(200).json({ success: true, message: "Đã đánh dấu là đã đọc" });
  } catch (err) {
    console.error("Lỗi cập nhật thông báo:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
//Đánh dấu tất cả đã đọc
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user;
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });
    res
      .status(200)
      .json({ success: true, message: "Đã đánh dấu tất cả là đã đọc" });
  } catch (err) {
    console.error("Lỗi cập nhật thông báo:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
//FL nha tuyen dung
export const followRecruiter = async (req, res) => {
  try {
    const { recruiterId } = req.params;
    const userId = req.user;

    const recruiter = await Recruiter.findById(recruiterId);
    if (!recruiter) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy nhà tuyển dụng" });
    }

    const isFollowing = recruiter.followers.includes(userId);

    if (isFollowing) {
      recruiter.followers = recruiter.followers.filter(
        (id) => id.toString() !== userId
      );
    } else {
      recruiter.followers.push(userId);
    }

    await recruiter.save();

    res.json({
      success: true,
      message: isFollowing
        ? `Đã bỏ theo dõi ${recruiter.companyName}`
        : `Đã theo dõi ${recruiter.companyName}`,
      followersCount: recruiter.followers.length,
    });
  } catch (error) {
    console.error("Lỗi theo dõi nhà tuyển dụng:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi" });
  }
};
//Kiem tra theo dõi nhà tuyển dụng
export const checkFollowRecruiter = async (req, res) => {
  try {
    const { recruiterId } = req.params;
    const userId = req.user;

    const recruiter = await Recruiter.findById(recruiterId);
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy nhà tuyển dụng",
      });
    }

    const isFollowing = recruiter.followers.includes(userId.toString());

    res.json({
      success: true,
      isFollowing,
      followersCount: recruiter.followers.length,
    });
  } catch (error) {
    console.error("Lỗi kiểm tra theo dõi:", error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi",
    });
  }
};
//Nhận offer
export const acceptOffer = async (req, res) => {
  try {
    const userId = req.user;
    const { jobId } = req.body;

    const application = await Apply.findOne({
      userId: userId,
      jobId: new mongoose.Types.ObjectId(jobId),
    })
      .populate("jobId", "title slot recruiter")
      .populate("companyId", "companyName");

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn ứng tuyển." });
    }

    if (application.status !== "Gửi đề nghị") {
      return res.status(400).json({
        success: false,
        message: "Đơn ứng tuyển không ở trạng thái 'Gửi đề nghị'.",
      });
    }

    // Kiểm tra slot còn trống không
    const recruitedCount = await Apply.countDocuments({
      jobId,
      status: "Nhận công việc",
    });
    if (recruitedCount >= application.jobId.slot) {
      return res
        .status(400)
        .json({ success: false, message: "Công việc này đã tuyển đủ người." });
    }

    // Cập nhật trạng thái thành "Nhận công việc"
    application.status = "Nhận công việc";
    await application.save();

    res.json({
      success: true,
      message: "Bạn đã nhận đề nghị và chính thức Nhận công việc thành công.",
    });

    // Gửi thông báo cho nhà tuyển dụng nếu muốn
    const recruiterId = application.jobId.recruiter;
    const notificationContent = `Ứng viên đã chấp nhận đề nghị và chính thức Nhận công việc cho vị trí "${application.jobId.title}".`;

    await Notification.create({
      userId: recruiterId,
      type: "candidateAction",
      content: notificationContent,
    });
  } catch (error) {
    console.error("Lỗi khi nhận đề nghị:", error);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
};
// Từ chối offer
export const rejectOffer = async (req, res) => {
  try {
    const userId = req.user; // req.user là id dạng chuỗi
    const { jobId } = req.body;

    const application = await Apply.findOne({
      userId: userId,
      jobId: new mongoose.Types.ObjectId(jobId),
    })
      .populate("jobId", "title recruiter")
      .populate("companyId", "companyName");

    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn ứng tuyển." });
    }

    if (application.status !== "Gửi đề nghị") {
      return res.status(400).json({
        success: false,
        message: "Đơn ứng tuyển không ở trạng thái 'Gửi đề nghị'.",
      });
    }

    application.status = "Từ chối";
    await application.save();

    res.json({
      success: true,
      message: "Bạn đã từ chối đề nghị thành công.",
    });

    // Gửi thông báo cho nhà tuyển dụng nếu muốn
    const recruiterId = application.jobId.recruiter;
    const notificationContent = `Ứng viên đã từ chối đề nghị cho vị trí "${application.jobId.title}".`;

    await Notification.create({
      userId: recruiterId,
      type: "candidateAction",
      content: notificationContent,
    });
  } catch (error) {
    console.error("Lỗi khi từ chối đề nghị:", error);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
};
// Check user đã ứng tuyển job chưa
export const checkApplied = async (req, res) => {
  try {
    const userId = req.user;
    const { jobId } = req.params;

    const existingApplication = await Apply.findOne({ userId, jobId });

    if (existingApplication) {
      return res.json({
        success: true,
        applied: true,
        status: existingApplication.status,
      });
    }

    return res.json({
      success: true,
      applied: false,
    });
  } catch (error) {
    console.error("Lỗi kiểm tra ứng tuyển:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
const codeMap = new Map();
//Gửi mã xác thực email -- quên mật khẩu
export const sendResetCode = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Email không tồn tại trong hệ thống" });
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    codeMap.set(email, code);
    // Gửi mã qua email
    await sendResetPasswordEmail(email, code);
    res.status(200).json({ message: "Mã xác thực đã được gửi về email" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi gửi mã", error });
  }
};
//Xác minh mã xác thực email -- quên mật khẩu
export const verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const savedCode = codeMap.get(email);
    if (!savedCode || savedCode !== code) {
      return res
        .status(400)
        .json({ message: "Mã xác thực không đúng hoặc đã hết hạn" });
    }
    res.status(200).json({ message: "Mã xác thực hợp lệ" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xác minh mã", error });
  }
};
//Đặt lại mật khẩu mới -- quên mật khẩu
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    codeMap.delete(email);
    res.status(200).json({ message: "Đặt lại mật khẩu thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi đặt lại mật khẩu", error });
  }
};
