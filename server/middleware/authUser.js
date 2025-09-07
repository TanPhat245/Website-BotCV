import jwt from "jsonwebtoken";

export const verifyUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || req.headers.token;
  if (!token) {
    return res.status(401).json({ success: false, message: "Không có token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Bạn cần đăng nhập để sử dụng chức năng" });
  }
};
