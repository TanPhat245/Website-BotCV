import jwt from "jsonwebtoken";

export const generateAdminToken = (adminId) => {
  return jwt.sign({ id: adminId, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
