import jwt from 'jsonwebtoken'
import Company from '../models/CompanyModel.js'

export const protectCompany = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Không có quyền, hãy đăng nhập' });
  }
  const token = authHeader;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.company = await Company.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: error.message });
  }
};