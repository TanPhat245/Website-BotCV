import Company from "../models/CompanyModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";
import Job from "../models/JobModel.js";
import Apply from "../models/ApplyModel.js";
import Recruiter from "../models/RecruiterModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import Industry from "../models/IndustryModel.js";
import User from "../models/UserModel.js";
import Notification from "../models/NotifyModel.js";
import sendInterviewEmail from "../utils/sendInterviewEmail.js";
import { io, onlineRecruiter, onlineUsers } from "../server.js";
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
import dotenv from "dotenv";
dotenv.config();
const validTransitions = {
  "Đã ứng tuyển": ["Tiếp nhận hồ sơ", "Ứng viên rút hồ sơ", "Hủy bởi hệ thống"],
  "Tiếp nhận hồ sơ": [
    "Phù hợp",
    "Chưa phù hợp",
    "Ứng viên rút hồ sơ",
    "Hủy bởi hệ thống",
  ],
  "Phù hợp": [
    "Hẹn phỏng vấn",
    "Gửi đề nghị",
    "Từ chối",
    "Ứng viên rút hồ sơ",
    "Hủy bởi hệ thống",
  ],
  "Chưa phù hợp": ["Hủy bởi hệ thống"],
  "Hẹn phỏng vấn": [
    "Gửi đề nghị",
    "Từ chối",
    "Ứng viên rút hồ sơ",
    "Hủy bởi hệ thống",
  ],
  "Gửi đề nghị": [
    "Nhận công việc",
    "Từ chối",
    "Ứng viên rút hồ sơ",
    "Hủy bởi hệ thống",
  ],
  "Nhận đề nghị": [
    "Nhận công việc",
    "Từ chối",
    "Ứng viên rút hồ sơ",
    "Hủy bởi hệ thống",
  ],
  "Nhận công việc": [],
  "Từ chối": [],
  "Ứng viên rút hồ sơ": [],
  "Hủy bởi hệ thống": [],
};
// Đăng ký đã + kết nối
export const resgisterCompany = async (req, res) => {
  const { fullName, companyName, email, password, provinceCode, districtCode } =
    req.body;
  //kiểm tra thông tin có đủ không
  console.log("Received data:", req.body);

  if (
    !fullName ||
    !companyName ||
    !email ||
    !password ||
    !provinceCode ||
    !districtCode
  ) {
    return res.json({ success: false, message: "Thiếu thông tin" });
  }
  try {
    //tìm email
    const companyExists = await Company.findOne({ email });
    //kiểm tra email tồn tại chưa
    if (companyExists) {
      return res.json({ success: false, message: "Email đã tồn tại" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newCompany = new Company({
      fullName,
      companyName,
      email,
      password: hashPassword,
      provinceCode,
      districtCode,
    });
    //Lưu database
    await newCompany.save();
    //Check trả về
    res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      company: {
        _id: newCompany._id,
        fullName: newCompany.fullName,
        companyName: newCompany.companyName,
        email: newCompany.email,
      },
      token: generateToken(newCompany._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ.", error: err.message });
  }
};
// Đăng nhập + kết nối
export const loginCompany = async (req, res) => {
  const { email, password } = req.body;

  // Kiểm tra đủ thông tin
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Thiếu email hoặc mật khẩu" });
  }
  try {
    const company = await Company.findOne({ email });
    if (!company) {
      return res
        .status(400)
        .json({ success: false, message: "Email không tồn tại" });
    }
    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Sai mật khẩu" });
    }

    // Nếu đúng
    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      company: {
        _id: company._id,
        fullName: company.fullName,
        companyName: company.companyName,
        email: company.email,
        provinceCode: company.provinceCode,
        districtCode: company.districtCode,
      },
      token: generateToken(company._id),
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi máy chủ", error: error.message });
  }
};
// Lấy thông tin người tuyển dụng
export const getCompany = async (req, res) => {
  try {
    const companyId = req.company._id;
    const company = await Company.findById(companyId).select("-password");
    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy công ty" });
    }
    res.json({ success: true, company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Cập nhật thông tin người tuyển dụng
export const updateCompany = async (req, res) => {
  try {
    const companyId = req.company._id;
    const {
      fullName,
      companyName,
      provinceCode,
      districtCode,
      oldPassword,
      newPassword,
    } = req.body;
    const company = await Company.findById(companyId);
    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy công ty" });
    }
    // Nếu có yêu cầu đổi mật khẩu
    if (oldPassword && newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, company.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "Mật khẩu cũ không đúng" });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      company.password = hashedPassword;
    }
    // Cập nhật các thông tin khác
    if (fullName) company.fullName = fullName;
    if (companyName) company.companyName = companyName;
    if (provinceCode) company.provinceCode = provinceCode;
    if (districtCode) company.districtCode = districtCode;
    await company.save();
    res.json({ success: true, message: "Cập nhật thông tin thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Đăng tin tuyển
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      salary,
      category,
      level,
      type,
      experiences,
      time,
      provinceCode,
      district,
      visible,
      slot,
      degree,
      deadline,
      address,
      workingHours,
    } = req.body;

    const companyId = req.company._id;

    // Lấy recruiter của công ty
    const recruiter = await Recruiter.findOne({ companyId });
    if (!recruiter) {
      return res.status(404).json({
        message: "Không tìm thấy thông tin Recruiter cho công ty này",
      });
    }

    // Tạo job mới
    const newJob = new Job({
      title,
      description,
      salary,
      category,
      level,
      type,
      experiences,
      time,
      provinceCode,
      district,
      visible,
      recruiter: recruiter._id,
      company: companyId,
      slot,
      degree,
      deadline: deadline ? new Date(deadline) : null,
      address: address || "",
      workingHours: workingHours || [],
      //tét
      //deadline: deadline ? new Date(deadline) : new Date(Date.now() + 5000)
    });

    await newJob.save();

    // ======= GỬI THÔNG BÁO =======
    // Lấy danh sách followers
    const recruiterWithFollowers = await Recruiter.findById(recruiter._id)
      .populate("followers", "_id")
      .populate("companyId", "name");

    if (recruiterWithFollowers && recruiterWithFollowers.followers.length > 0) {
      const companyName =
        recruiterWithFollowers.companyId.name ||
        "Nhà tuyển dụng mà bạn đã theo dõi";
      const notifyContent = `${companyName} vừa đăng tin tuyển dụng mới: ${newJob.title}`;

      for (const user of recruiterWithFollowers.followers) {
        const userIdStr = user._id.toString();

        // Gửi socket nếu user online
        const socketId = onlineUsers.get(userIdStr);
        if (socketId) {
          io.to(socketId).emit("newNotification", {
            type: "newJob",
            content: notifyContent,
            createdAt: new Date(),
          });
        }

        // Lưu DB
        await Notification.create({
          userId: user._id,
          type: "newJob",
          content: notifyContent,
        });
      }
    }

    res.status(201).json({ message: "Đăng tin thành công", job: newJob });
  } catch (error) {
    console.error("Lỗi khi đăng tin:", error);
    res.status(500).json({ message: "Đăng tin thất bại" });
  }
};
// Lấy danh sách ỨNG VIÊN bao gồm, tên job, tên ứng viên, email, số điện thoại, địa chỉ, cv + roi
export const getCompanyJobApplicants = async (req, res) => {
  try {
    const { keyword = "", status = "", jobTitle = "" } = req.query;
    const company = req.company;
    const recruiter = await Recruiter.findOne({ companyId: company._id });
    if (!recruiter) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy recruiter" });
    }
    const recruiterId = recruiter._id;

    // Build điều kiện lọc
    let query = { companyId: recruiterId };
    if (status) query.status = status;

    // Lấy danh sách các đơn ứng tuyển theo công ty hiện tại
    const applications = await Apply.find(query)
      .sort({ createdAt: -1 })
      .populate({
        path: "companyId",
        select: "companyName email logo",
        model: "Recruiter",
      })
      .populate({
        path: "jobId",
        select: "title description category level salary status slot visible",
        model: "Job",
      })
      .populate({
        path: "userId",
        select: "name email",
        model: "User",
      })
      .lean();

    if (!applications.length) {
      return res
        .status(200)
        .json({ success: true, message: "Không có ứng viên nào", data: [] });
    }

    // Trả về danh sách ứng viên đã được lưu sẵn các thông tin từ lúc Apply
    const formattedApplicants = applications.map((app) => ({
      _id: app._id,
      jobTitle: app.jobTitle,
      userName: app.userName,
      userEmail: app.userEmail,
      userPhone: app.userPhone,
      userAddress: app.userAddress,
      userCvUrl: app.userCvUrl,
      appliedAt: app.createdAt,
      status: app.status,
      companyId: app.companyId?._id || "",
      jobId: app.jobId?._id || "",
      userId: app.userId?._id || "",
      companyFullName: app.companyId?.companyName || "",
      slot: app.jobId?.slot || 0,
      visible: app.jobId?.visible ?? true,
    }));

    // Lọc dữ liệu
    const filteredApplicants = formattedApplicants.filter((app) => {
      const lowerKeyword = keyword.toLowerCase();
      const jobMatch = jobTitle ? app.jobTitle === jobTitle : true;
      const keywordMatch =
        app.userName?.toLowerCase().includes(lowerKeyword) ||
        app.jobTitle?.toLowerCase().includes(lowerKeyword);

      return jobMatch && (!keyword ? true : keywordMatch);
    });

    res.status(200).json({
      success: true,
      data: filteredApplicants,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách ứng viên:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách ứng viên",
    });
  }
};
// Lấy job đc đăng bởi công ty + roi
export const getCompanyPostedJobs = async (req, res) => {
  try {
    const companyId = req.company._id;
    const jobs = await Job.find({ company: companyId });
    res.json({ success: true, jobsData: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Update job
export const updateJobs = async (req, res) => {
  try {
    const jobId = req.params.id;
    const companyId = req.company._id;
    const job = await Job.findById(jobId);
    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy tin tuyển dụng" });
    }

    if (job.company.toString() !== companyId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền chỉnh sửa tin này",
      });
    }
    const updatedFields = req.body;
    if (updatedFields.salary) {
      updatedFields.salary = {
        ...job.salary,
        ...updatedFields.salary,
      };
    }
    const updatedJob = await Job.findByIdAndUpdate(jobId, updatedFields, {
      new: true,
    });
    res.json({
      success: true,
      message: "Cập nhật thành công",
      job: updatedJob,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Delete job
export const deleteJobs = async (req, res) => {
  try {
    const jobId = req.params.id;
    const companyId = req.company._id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy tin tuyển dụng" });
    }

    if (job.company.toString() !== companyId.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Bạn không có quyền xoá tin này" });
    }

    await Job.findByIdAndDelete(jobId);
    res.json({ success: true, message: "Xoá tin thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Thay đổi trạng thái ứng viên
export const changeJobApplicantStatus = async (req, res) => {
  try {
    const { jobId, userId, status } = req.body;
    //kiểm trạng thái, thật ra khỏi cũng dc vì dùng select nó check k đúng enum là báo r
    const allowedStatuses = [
      "Đã ứng tuyển",
      "Tiếp nhận hồ sơ",
      "Phù hợp",
      "Chưa phù hợp",
      "Hẹn phỏng vấn",
      "Gửi đề nghị",
      "Nhận đề nghị",
      "Từ chối",
      "Nhận công việc",
      "Ứng viên rút hồ sơ",
      "Hủy bởi hệ thống",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái không hợp lệ",
        ds,
      });
    }
    //hàng độc quyền muốn lấy token
    const company = req.company;
    const recruiter = await Recruiter.findOne({ companyId: company._id });
    if (!recruiter) {
      return res.status(403).json({
        success: false,
        message: "Không tìm thấy recruiter phù hợp với công ty này",
      });
    }

    const job = await Job.findById(jobId);
    if (!job || job.recruiter.toString() !== recruiter._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền thay đổi trạng thái ứng viên này",
      });
    }

    //logic check du slot
    if (status === "Nhận công việc") {
      const recruitedCount = await Apply.countDocuments({
        jobId,
        status: "Nhận công việc",
      });

      if (recruitedCount >= job.slot) {
        return res.status(400).json({
          success: false,
          message: `Đã tuyển đủ ${job.slot} người cho công việc "${job.title}". Không thể tuyển thêm.`,
        });
      }
    }
    //Kiểm tra tồn tại đơn ứng tuyển chưa.
    const application = await Apply.findOne({ jobId, userId });
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn ứng tuyển" });
    }
    //Logic check thay đổi trang thái đúng luồng không
    const currentStatus = application.status;
    const allowedNext = validTransitions[currentStatus];
    if (!allowedNext.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Không thể chuyển từ trạng thái "${currentStatus}" sang "${status}".`,
      });
    }

    application.status = status;
    await application.save();
    //-------------Thông báo---------------
    // Thông báo trạng thái mới
    const notificationContent = `Trạng thái ứng tuyển của bạn cho "${job.title}" đã được cập nhật thành "${status}".`;

    // Gửi socket nếu user online
    const socketId = onlineUsers.get(userId);
    if (socketId) {
      io.to(socketId).emit("newNotification", {
        type: "applicationStatus",
        message: notificationContent,
      });
    }

    // Lưu vào database
    await Notification.create({
      userId,
      type: "applicationStatus",
      content: notificationContent,
    });
    //-------------Thông báo---------------

    // Nếu vừa chuyển sang "Nhận công việc", thống kê tổng số người đã tuyển
    if (status === "Nhận công việc") {
      const recruitedCountAfter = await Apply.countDocuments({
        jobId,
        status: "Nhận công việc",
      });
    }
    //gửi mail cho từng trạng thái
    const { userEmail, userName, jobTitle } = application;
    // Gửi email khi ứng viên được mời phỏng vấn
    if (status === "Hẹn phỏng vấn") {
      await sendEmail({
        to: userEmail,
        subject: `Thư mời phỏng vấn cho công việc: ${jobTitle}`,
        text: `Xin chào ${userName},\n
Chúng tôi xin cảm ơn bạn đã quan tâm và ứng tuyển cho vị trí "${jobTitle}" tại ${
          recruiter.companyName || "công ty chúng tôi"
        }.\n
Sau khi xem xét hồ sơ, chúng tôi rất ấn tượng với năng lực và kinh nghiệm của bạn, và trân trọng mời bạn tham gia buổi phỏng vấn để trao đổi chi tiết hơn.\n
Thông tin phỏng vấn sẽ được gửi qua hệ thống hoặc email trong thời gian sớm nhất.\n
Vui lòng phản hồi lại để xác nhận lịch hẹn, và chuẩn bị những nội dung cần thiết cho buổi phỏng vấn.\n
Chúng tôi mong được gặp bạn trong buổi phỏng vấn sắp tới.\n
Trân trọng,\n${recruiter.companyName || "Nhà tuyển dụng"}`,
      });
    }
    //gửi mail Nhận công việc
    if (status === "Nhận công việc") {
      await sendEmail({
        to: userEmail,
        subject: `Thư xác nhận Nhận công việc - Vị trí: ${jobTitle}`,
        text: `Xin chào ${userName},\n
Chúng tôi rất vui mừng thông báo rằng bạn đã chính thức được nhận vào làm việc tại vị trí "${jobTitle}" tại ${
          recruiter.companyName || "công ty chúng tôi"
        }.\n
Chúc mừng bạn đã vượt qua toàn bộ quy trình tuyển dụng và trở thành một phần quan trọng trong đội ngũ của chúng tôi.\n
Chúng tôi sẽ gửi thêm thông tin chi tiết về ngày bắt đầu làm việc, tài liệu cần chuẩn bị, và các bước tiếp theo qua hệ thống hoặc email.\n
Hãy chuẩn bị sẵn sàng để bắt đầu hành trình mới cùng chúng tôi.\n
Một lần nữa, chào mừng bạn đến với ${recruiter.companyName || "chúng tôi"}!\n
Trân trọng,\n${recruiter.companyName || "Nhà tuyển dụng"}`,
      });
    }
    // Gửi email khi từ chối
    if (status === "Từ chối") {
      await sendEmail({
        to: userEmail,
        subject: `Thông báo kết quả ứng tuyển vị trí: ${jobTitle}`,
        text: `Xin chào ${userName},\n\nCảm ơn bạn đã quan tâm và ứng tuyển cho vị trí "${jobTitle}". Rất tiếc, sau khi cân nhắc kỹ lưỡng, chúng tôi quyết định không tiếp tục với hồ sơ của bạn.\n\nChúc bạn thành công trong tương lai.\nTrân trọng,\n${
          recruiter.companyName || "Nhà tuyển dụng"
        }`,
      });
    }
    // Gửi email khi phù hợp
    if (status === "Phù hợp") {
      await sendEmail({
        to: userEmail,
        subject: `Hồ sơ của bạn phù hợp với vị trí: ${jobTitle}`,
        text: `Xin chào ${userName},\n\nSau khi xem xét hồ sơ, chúng tôi đánh giá bạn phù hợp với vị trí "${jobTitle}". Bộ phận tuyển dụng sẽ liên hệ bạn sớm.\n\nTrân trọng,\n${
          recruiter.companyName || "Nhà tuyển dụng"
        }`,
      });
    }
    // Gửi email khi gửi đề nghị
    if (status === "Gửi đề nghị") {
      await sendEmail({
        to: userEmail,
        subject: `Thư đề nghị làm việc vị trí: ${jobTitle}`,
        text: `Xin chào ${userName},\n\nChúc mừng bạn! Chúng tôi rất mong muốn bạn gia nhập đội ngũ với vị trí "${jobTitle}". Vui lòng kiểm tra email hoặc hệ thống để xem chi tiết đề nghị.\n\nTrân trọng,\n${
          recruiter.companyName || "Nhà tuyển dụng"
        }`,
      });
    }
    res.json({
      success: true,
      message: "Cập nhật trạng thái ứng viên thành công",
      application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Thay đổi trạng thái job + logic check deadline
export const changeJobStatus = async (req, res) => {
  try {
    const { id } = req.body;
    const companyId = req.company._id;
    const job = await Job.findById(id);

    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy công việc" });
    }

    if (job.company.toString() !== companyId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền thay đổi tin này",
      });
    }

    job.visible = !job.visible;
    await job.save();

    return res.json({ success: true, job });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
// Thêm ngành
export const createIndustryByCompany = async (req, res) => {
  const { name } = req.body;
  if (!name)
    return res.status(400).json({ success: false, message: "Thiếu tên ngành" });

  const formattedName = toTitleCase(name);

  const exists = await Industry.findOne({
    name: { $regex: `^${formattedName}$`, $options: "i" },
  });

  if (exists) {
    return res.status(200).json({ success: true, message: "Ngành đã tồn tại" });
  }

  const newIndustry = await Industry.create({
    name: formattedName,
    description: "Ngành này do nhà tuyển dụng thêm vào.",
  });

  return res.status(201).json({ success: true, data: newIndustry });
};
// Hàm in hoa chữ cái đầu khi lưu
function toTitleCase(str) {
  return str
    .trim()
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toLocaleUpperCase("vi") + word.slice(1))
    .join(" ");
}
// Lấy thông tin ứng viên thông job đã apply
export const getJobApplicantInfo = async (req, res) => {
  try {
    const { applyId } = req.params;
    const companyId = req.company._id;
    // Tìm đơn ứng tuyển
    const application = await Apply.findById(applyId);
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn ứng tuyển" });
    }
    // Tìm recruiter thuộc công ty đó
    const recruiter = await Recruiter.findOne({ companyId });
    if (
      !recruiter ||
      application.companyId.toString() !== recruiter._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xem đơn ứng tuyển này",
      });
    }
    // Lấy thông tin user
    const user = await User.findById(application.userId).select(
      "-password -__v"
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin người dùng",
      });
    }
    // Trả kết quả
    res.json({
      success: true,
      user,
      applicationInfo: {
        applyDate: application.date,
        jobTitle: application.jobTitle,
        status: application.status,
      },
    });
  } catch (err) {
    console.error("Lỗi lấy thông tin ứng viên:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
// Gửi mail xác nhận
export const sendVerificationEmail = async (req, res) => {
  try {
    const company = await Company.findById(req.company._id);
    if (!company)
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });

    const token = jwt.sign({ id: company._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    const url = `${process.env.CLIENT_URL}/verify-company/${token}`;
    const html = `
      <p>Chào <b>${company.companyName}</b>,</p>
      <p>Vui lòng xác nhận tài khoản của bạn bằng cách nhấn vào liên kết sau:</p>
      <a href="${url}" target="_blank" style="padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Xác nhận tài khoản</a>
      <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
      <p>Trân trọng,<br/>Hệ thống việc làm</p>
    `;
    await sendEmail({
      to: company.email,
      subject: "Xác nhận tài khoản nhà tuyển dụng",
      html,
    });
    return res.json({ message: "Đã gửi email xác nhận." });
  } catch (error) {
    console.error("Lỗi gửi mail xác nhận:", error);
    return res.status(500).json({ message: "Gửi email thất bại" });
  }
};
// Xác nhận mail
export const verifyCompanyAccount = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const company = await Company.findById(decoded.id);
    if (!company)
      return res.status(404).json({ message: "Không tìm thấy công ty" });

    if (company.verified) {
      return res.json({ message: "Công ty đã xác minh trước đó" });
    }

    company.verified = true;
    await company.save();

    res.json({ message: "Xác minh thành công" });
  } catch (err) {
    res.status(400).json({ message: "Token không hợp lệ hoặc hết hạn" });
  }
};
// Lấy thông tin company(có  chứa verify)
export const getCompanyProfile = async (req, res) => {
  try {
    const companyId = req.company._id;
    const company = await Company.findById(companyId).select("-password");
    if (!company) {
      return res.status(404).json({ message: "Không tìm thấy công ty" });
    }
    res.json({
      _id: company._id,
      email: company.email,
      companyName: company.companyName,
      verified: company.verified,
      fullName: company.fullName,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
// Gửi thông báo phỏng vấn
export const sendInterviewInvite = async (req, res) => {
  try {
    const { jobId, userId, time, location, rules, content } = req.body;

    //Tìm ứng viên và công việc
    const user = await User.findById(userId);
    const job = await Job.findById(jobId);

    if (!user || !job) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thông tin ứng viên hoặc công việc." });
    }
    const recruiter = await Recruiter.findById(job.recruiter);
    if (!recruiter) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy nhà tuyển dụng." });
    }
    //Gửi email mời phỏng vấn
    await sendInterviewEmail({
      to: user.email,
      name: user.name,
      subject: job.title,
      time,
      location,
      rules,
      companyName: recruiter.companyName,
    });
    //Cập nhật trạng thái ứng tuyển và lưu thông tin phỏng vấn
    const apply = await Apply.findOneAndUpdate(
      { userId: userId, jobId: jobId },
      {
        status: "Hẹn phỏng vấn",
        interview: {
          time,
          location,
          rules,
          content,
        },
      },
      { new: true }
    );

    if (!apply) {
      return res.status(404).json({ message: "Không tìm thấy đơn ứng tuyển." });
    }

    return res.status(200).json({
      message: "Đã gửi thư mời phỏng vấn và cập nhật trạng thái thành công.",
    });
  } catch (error) {
    console.error("Lỗi khi gửi thư mời phỏng vấn:", error);
    return res.status(500).json({ message: "Lỗi server." });
  }
};
// Gửi thông báo
export const sendNotification = async (userId, type, content, io) => {};
// Lấy danh sách thông báo theo user
export const getNotifications = async (req, res) => {};
// Đánh dấu đã đọc
export const markAsRead = async (req, res) => {};
// Đánh dấu tất cả đã đọc
export const markAllAsRead = async (req, res) => {};
