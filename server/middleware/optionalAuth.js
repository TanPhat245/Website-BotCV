import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

export const optionalAuth = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      req.user = user || null;
    } catch (error) {
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
};
