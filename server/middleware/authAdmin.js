import jwt from "jsonwebtoken";

export const protectAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization || req.headers.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "Không có token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kiểm tra role là admin
    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Không có quyền admin" });
    }

    req.admin = decoded; // gán thông tin admin vào request
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token không hợp lệ" });
  }
};
