import express from 'express';
import { AddRecruiter, UpdateRecruiter, GetRecruiter, GetCompanyInfo, GetJobByRecruiter, SearchJobsByRecruiter } from '../controllers/RecruiterController.js';
import upload from '../middleware/uploadCompanyMiddleware.js';
import { protectCompany } from '../middleware/authMiddleware.js';

const router = express.Router();
// Thêm công ty + lôgô và banner thì 1 thôi
router.post('/add', protectCompany, upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), AddRecruiter);
// Sửa thông tin công ty
router.put('/update/:id', protectCompany, upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), UpdateRecruiter);
// Lấy thông tin công ty theo id
router.get('/my-info', protectCompany, GetRecruiter);
//Lấy thông tin công ty ở frontend
router.get("/:id", GetCompanyInfo);
// Lấy job của công ty
router.get("/job-recruiter/:id", GetJobByRecruiter);
//Tìm kiếm
router.get("/recruiter/:id/search", SearchJobsByRecruiter);
export default router;
