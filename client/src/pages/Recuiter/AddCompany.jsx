import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  TextareaAutosize,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
const AddCompany = () => {
  //State quản lý thông tin công ty
  const [companyInfo, setCompanyInfo] = useState({
    managerName: "",
    email: "",
    companyName: "",
    phone: "",
    address: "",
    description: "",
    website: "",
    employees: "",
  });
  const [logo, setLogo] = useState(null);
  const [image, setImage] = useState(null);
  const [isVerified, setIsVerified] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showResendEmail, setShowResendEmail] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  //Logic quản lý thông tin công ty
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyInfo({ ...companyInfo, [name]: value });
  };
  //Xử lý upload hình
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "logo") setLogo(files[0]);
    if (name === "image") setImage(files[0]);
  };

  //Logic gửi thông tin công ty lên server
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isVerified) {
      toast.warning(
        "Tài khoản chưa xác minh email. Vui lòng kiểm tra hộp thư."
      );
      setShowResendEmail(true);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("phone", companyInfo.phone);
      formData.append("email", companyInfo.email);
      formData.append("description", companyInfo.description);
      formData.append("address", companyInfo.address);
      formData.append("website", companyInfo.website);
      formData.append("employees", companyInfo.employees);
      formData.append("companyName", companyInfo.companyName);
      formData.append("managerName", companyInfo.managerName);
      if (logo) formData.append("logo", logo);
      if (image) formData.append("image", image);

      const token = localStorage.getItem("companyToken");
      //Api them moi cong ty
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND}api/recruiter/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        }
      );

      toast.success("Thêm hồ sơ công ty thành công!");
      setTimeout(() => navigate("/dashboard/info-company"), 1500);  
      setCompanyInfo({
        managerName: "",
        email: "",
        companyName: "",
        phone: "",
        address: "",
        description: "",
        website: "",
        employees: "",
      });
      setLogo(null);
      setImage(null);
    } catch (err) {
      alert(err?.response?.data?.message || "Lỗi khi thêm công ty");
    }
  };
  //API check nhà tuyenr dụng xác nhận mail chưa và gửi mail.
  useEffect(() => {
    const checkVerification = async () => {
      try {
        const token = localStorage.getItem("companyToken");
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND}api/company/profile`,
          {
            headers: { Authorization: token },
          }
        );
        setIsVerified(res.data.verified);
      } catch (err) {
        toast.error("Lỗi xác minh tài khoản");
      } finally {
        setLoading(false);
      }
    };
    checkVerification();
  }, []);
  //Gui mail
  const handleSendVerifyEmail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("companyToken");
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND}api/company/send-verification-email`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setMessage(res.data.message || "Đã gửi email xác minh.");
    } catch (error) {
      console.error("Lỗi gửi email:", error);
      setMessage(
        error?.response?.data?.message || "Gửi email xác minh thất bại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="max-w-2xl mx-auto mt-10 bg-white shadow-md rounded-md p-6">
      <Typography variant="h5" className="text-center font-bold mb-6">
        Thêm Thông Tin Công Ty
      </Typography>

      {/* THÔNG BÁO XÁC MINH */}
      {!isVerified ? (
        <Box className="mb-4 text-center">
          <Typography className="text-red-600 font-medium mb-2">
            Tài khoản của bạn chưa xác minh email. Vui lòng kiểm tra hộp thư đến
            để xác minh.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendVerifyEmail}
            disabled={loading}
          >
            {loading ? "Đang gửi..." : "Gửi email xác minh"}
          </Button>
        </Box>
      ) : (
        // FORM THÊM THÔNG TIN CHỈ HIỆN NẾU ĐÃ XÁC MINH
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="Tên công ty"
            name="companyName"
            value={companyInfo.companyName}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Tên người quản lý"
            name="managerName"
            value={companyInfo.managerName}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Số điện thoại"
            name="phone"
            value={companyInfo.phone}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={companyInfo.email}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Website"
            name="website"
            value={companyInfo.website}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Quy mô công ty"
            name="employees"
            value={companyInfo.employees}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Địa chỉ"
            name="address"
            value={companyInfo.address}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Mô tả công ty"
            name="description"
            value={companyInfo.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
          />
          <div>
            <label className="block text-sm font-medium mb-1">
              Logo công ty
            </label>
            <input
              type="file"
              name="logo"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <Box className="text-center mt-4">
            <Button type="submit" variant="contained" color="success">
              Thêm công ty
            </Button>
          </Box>
        </form>
      )}
    </Box>
  );
};

export default AddCompany;
