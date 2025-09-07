import express from 'express';
import { countJobByCategory, getJobById, getJobs, getJobsTodayCount, getJobsTotalCount } from '../controllers/JobController.js';
import { optionalAuth } from '../middleware/optionalAuth.js';

const router = express.Router();

//Đếm tin thuộc ngành nghề
router.get('/count-by-category', countJobByCategory);
//Lấy danh sách jobs từ database
router.get('/', optionalAuth, getJobs);
//Lấy sl job mới trong ngày
router.get('/today-count', getJobsTodayCount);
//Lấy tổng job đang có
router.get('/total-count', getJobsTotalCount);
//Lấy thông tin 1 job
router.get('/:id', optionalAuth, getJobById);
export default router;
