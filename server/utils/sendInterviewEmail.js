import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendInterviewEmail = async ({
  to,
  name,
  subject,
  time,
  location,
  rules,
  companyName,
}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"${companyName}" <${process.env.MAIL_USERNAME}>`,
    to,
    subject: `Thư mời phỏng vấn: ${subject}`,
    html: `
      <p>Chào ${name},</p>
      <p>Bạn đã được mời tham gia phỏng vấn với thông tin như sau:</p>
      <ul>
        <li><strong>Thời gian:</strong> ${new Date(time).toLocaleString()}</li>
        <li><strong>Địa điểm:</strong> ${location}</li>
        <li><strong>Quy định:</strong> ${rules}</li>
      </ul>
      <p>Trân trọng,<br/>Phòng tuyển dụng</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendInterviewEmail;
