import express from "express";
import { addIndustry, deleteIndustry, editIndustry, getAdminSummary, getIndustry, getIndustryById, getListApply, getListCompany, getListJob, getListUser, loginAdmin } from "../controllers/AdminController.js";
import {protectAdmin} from "../middleware/authAdmin.js"
const router = express.Router();
//Đăng nhập của admin
router.post("/login", loginAdmin);
router.get("/list-industry", protectAdmin, getIndustry);
//Lấy danh sách ngành nghề không token
router.get("/list", getIndustry);
//Thêm ngành nghề
router.post("/add-industry", protectAdmin, addIndustry);
//Sửa nghành nghề
router.put("/edit-industry/:id", protectAdmin, editIndustry);
//Xóa ngành nghề
router.delete("/delete-industry/:id", protectAdmin, deleteIndustry);
//Lấy 1 ngnahf nghề
router.get("/industry/:id", protectAdmin, getIndustryById);
//Lấy danh sách người dùng
router.get("/list-users", getListUser);
//Lấy danh sách công ty
router.get("/list-companies", getListCompany);
//Lấy danh sách job
router.get("/list-jobs", getListJob);
//Lấy danh sách ứng tuyển
router.get("/list-applications", getListApply);
//Vô hiệu hóa tài khoản
//Hủy ứng tuyển

//Thêm gói tin
//Sửa gói tin
//Xóa gói tin
//Lấy danh sách gói tin
//Lấy danh sách nhà tuyển dụng đã mua gói tin
router.get('/summary', getAdminSummary);
export default router;
