import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
  },
});

export const sendResetPasswordEmail = async (toEmail, code) => {
  const mailOptions = {
    from: `"Hệ thống tuyển dụng" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Mã xác thực đặt lại mật khẩu",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #2e6da4;">Yêu cầu đặt lại mật khẩu</h2>
        <p>Bạn hoặc ai đó vừa yêu cầu đặt lại mật khẩu tài khoản tại hệ thống tuyển dụng.</p>
        <p><strong>Mã xác thực:</strong></p>
        <div style="font-size: 24px; font-weight: bold; color: #d9534f;">${code}</div>
        <p style="margin-top: 20px;">Mã có hiệu lực trong vòng vài phút. Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Đã gửi mã xác thực tới ${toEmail}`);
  } catch (error) {
    console.error("Lỗi gửi email:", error);
    throw error;
  }
};