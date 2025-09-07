import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // Tạo transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
      },
    });

    // Nội dung email
    const mailOptions = {
      from: `"Hệ thông tìm việc BotCV" <${process.env.EMAIL_USER}> xin thông báo`,
      to,
      subject,
      text,
      html,
    };

    // Gửi mail
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
