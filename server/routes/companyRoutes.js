import express from 'express';
import { changeJobApplicantStatus, changeJobStatus, createIndustryByCompany, deleteJobs, getCompany, getCompanyJobApplicants, getCompanyPostedJobs, getCompanyProfile, getJobApplicantInfo, loginCompany, postJob, resgisterCompany, sendInterviewInvite, sendVerificationEmail, updateCompany, updateJobs, verifyCompanyAccount } from '../controllers/companyController.js';
import { protectCompany } from '../middleware/authMiddleware.js';

const router = express.Router();

//Đăng ký
router.post('/register', resgisterCompany)
// Đăng nhập
router.post('/login', loginCompany)
// Lấy thông tin công ty
router.get('/company-info', protectCompany, getCompany)
// Cập nhật thông tin công ty
router.put('/update-info', protectCompany, updateCompany)
// Đăng tin tuyển
router.post('/post-job', protectCompany, postJob)
// Lấy danh sách ỨNG VIÊN
router.get('/applicants', protectCompany, getCompanyJobApplicants)
//Lấy job đc đăng bởi công ty
router.get('/list-jobs', protectCompany, getCompanyPostedJobs)
//Thay đổi trạng thái ứng viên
router.post('/change-status', protectCompany, changeJobApplicantStatus)
//Thay đổi trạng thái job
router.post('/change-job', protectCompany, changeJobStatus)
//Update job
router.put('/update/:id', protectCompany, updateJobs);
//Delete job
router.delete('/delete/:id', protectCompany, deleteJobs);
//Thêm ngành
router.post("/create-industry", protectCompany, createIndustryByCompany);
//Lấy thông tin ứng viên thông job đã apply
router.get("/user-info/:applyId", protectCompany, getJobApplicantInfo);
//gửi mail xác nhận
router.post('/send-verification-email', protectCompany, sendVerificationEmail);
//Xác nhận mail
router.get('/verify-company/:token', verifyCompanyAccount);
//Lấy thông tin công ty
router.get("/profile", protectCompany, getCompanyProfile);
// Hẹn lịch phỏng vấn
router.post('/interview-invite', protectCompany, sendInterviewInvite);
export default router;