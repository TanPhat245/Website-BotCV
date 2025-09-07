import Job from "../models/JobModel.js";
import SaveJob from "../models/SavejobModel.js";
import Apply from "../models/ApplyModel.js";
//Lấy ds job
export const getJobs = async (req, res) => {
  try {
    const { recruiterId } = req.query;
    const query = { visible: true };
    if (recruiterId) {
      query.recruiter = recruiterId;
    }

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .populate("recruiter", "companyName logo")
      .lean();

    // Nếu có người dùng
    if (req.user) {
      const userId = req.user;
      const savedJobs = await SaveJob.find({ userId });
      const savedMap = new Map();
      savedJobs.forEach((item) =>
        savedMap.set(item.jobId.toString(), item._id.toString())
      );

      const jobsWithSaved = jobs.map((job) => {
        const savedJobId = savedMap.get(job._id.toString()) || null;
        return { ...job, savedJobId };
      });

      return res.status(200).json({ success: true, jobs: jobsWithSaved });
    }

    // Nếu chưa đăng nhập
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách jobs:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi lấy danh sách jobs" });
  }
};
//Lấy 1 job + 1 chi tiết
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId)
      .populate("recruiter", "companyName email logo")
      .lean();

    if (!job || !job.visible) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy tin tuyển dụng" });
    }
    const recruitedCount = await Apply.countDocuments({
      jobId,
      status: "Nhận việc",
    });
    // Nếu có user, kiểm tra xem job này đã được lưu chưa
    if (req.user) {
      const saved = await SaveJob.findOne({ userId: req.user, jobId: job._id });
      job.savedJobId = saved ? saved._id.toString() : null;
    }

    res.status(200).json({ success: true, job, recruitedCount });
  } catch (error) {
    console.error("Lỗi khi lấy job theo ID:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi lấy thông tin job" });
  }
};
//Đếm tin tuyển dụng thuộc ngành
export const countJobByCategory = async (req, res) => {
  try {
    const result = await Job.aggregate([
      { $match: { visible: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi đếm việc làm theo ngành nghề" });
  }
};
// Lấy số job mới hôm nay
export const getJobsTodayCount = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const count = await Job.countDocuments({
      createdAt: { $gte: today },
      visible: true,
    });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
// Lấy tổng số job
export const getJobsTotalCount = async (req, res) => {
  try {
    const count = await Job.countDocuments({ visible: true });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
