import express from 'express';
import { RegisterUser, LoginUser, GetUser, GetUserJobApplications, ChangeUser, ApplyJobs, addInfoUser, updateInfoUser, getInfoUser, SearchJobs, SaveJobController, GetSavedJobs, DeleteSavedJob, CheckSavedJob, CancelApplication, getNotifications, markAsRead, markAllAsRead, followRecruiter, checkFollowRecruiter, acceptOffer, rejectOffer, checkApplied, sendResetCode, verifyResetCode, resetPassword } from '../controllers/UserController.js';
import { verifyUser } from '../middleware/authUser.js'
import upload from '../middleware/uploadMiddleware.js';
import { optionalAuth } from '../middleware/optionalAuth.js';
const router = express.Router();

// Đăng ký
router.post('/register', RegisterUser);
// Đăng nhập
router.post('/login', LoginUser);
//Lấy thông tin 1 người dùng
router.get('/user', optionalAuth, GetUser);
//Thay đổi thông tin
router.post('/update', verifyUser, ChangeUser);
//Lấy danh sách job đã ứng tuyển(chắc chắn đéo đậu cái nào đâu)
router.get('/applications', verifyUser ,GetUserJobApplications);
//Hủy ứng tuyển
router.post("/cancel-application", verifyUser, CancelApplication);
//Ưng tuyển
router.post('/apply', verifyUser, ApplyJobs);
//Tìm kiếm việc làm
router.get('/search', optionalAuth, SearchJobs);
//Lưu tin
router.post('/save-job', verifyUser, SaveJobController);
//Lấy danh sách việc làm đã lưu
router.get('/saved-jobs', verifyUser, GetSavedJobs);
//Xóa lưu
router.delete('/saved-job/:jobId', verifyUser, DeleteSavedJob);
//Check luu tin
router.get("/check-saved/:jobId", verifyUser, CheckSavedJob);
//Lấy danh sách thông báo
router.get("/notify-user/:userId", verifyUser,getNotifications);
//Đánh dấu là đã đọc
router.patch("/read/:id", verifyUser ,markAsRead);
// Đánh dấu tất cả đã đọc
router.patch("/read-all", verifyUser, markAllAsRead);
//Theo dõi và bỏ fl nhà tuyen dụng
router.put("/follow-recruiter/:recruiterId", verifyUser, followRecruiter);
//Kiểm tra theo dõi nhà tuyển dụng
router.get("/check-follow/:recruiterId", verifyUser, checkFollowRecruiter);
// Nhận đề nghị
router.post('/accept-offer', verifyUser, acceptOffer);
// Từ chối đề nghị
router.post('/reject-offer', verifyUser, rejectOffer);
//Check ứng tuyển
router.get('/check-applied/:jobId', verifyUser, checkApplied);
// Quên mật khẩu: Gửi mã xác thực về email
router.post('/forgot-password/send-code', sendResetCode);
// Quên mật khẩu: Xác minh mã
router.post('/forgot-password/verify-code', verifyResetCode);
// Quên mật khẩu: Đặt lại mật khẩu mới
router.post('/forgot-password/reset-password', resetPassword);
//----------------------Hồ sơ----------------------------
//Thêm sơ mới
router.post('/Add-Profile', verifyUser,upload.single("cvFile"), addInfoUser);
//Sửa hồ sơ
router.put('/Update-Profile', verifyUser,upload.single("cvFile"), updateInfoUser);
//Lấy thông tin hồ sơ để hiện lên fe
router.get('/Get-Profile', optionalAuth, getInfoUser);
export default router;
