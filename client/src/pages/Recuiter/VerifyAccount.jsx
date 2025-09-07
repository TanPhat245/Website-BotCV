import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyAccount = () => {
  const [verified, setVerified] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [companyInfo, setCompanyInfo] = useState(null);
  const navigate = useNavigate();
  //Lấy thông tin nhà tuyển dụng và check đã xác minh chưa
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
        setVerified(res.data.verified);
        setCompanyInfo(res.data);
      } catch (err) {
        setMessage("Lỗi khi kiểm tra trạng thái xác minh.");
      }
    };
    checkVerification();
  }, []);
  //Gửi mail tới mail ntd
  const handleSendVerifyEmail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("companyToken");
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND}api/company/send-verification-email`,
        {},
        {
          headers: { Authorization: token },
        }
      );
      const msg = res.data.message || "Đã gửi lại email xác minh.";
      setMessage(msg);
      toast.success(msg);
    } catch (err) {
      setMessage("Gửi email thất bại.");
      toast.error("Gửi email thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {verified == true ? (
        <Box className="max-w-lg mx-auto mt-20 p-6 bg-white shadow rounded">
          <Typography variant="h6" className="text-green-600 text-center mb-4">
            Tài khoản của bạn đã được xác minh
          </Typography>
          <Typography className="text-center text-gray-800 mb-4">
            Chào mừng bạn, <strong>{companyInfo?.companyName}</strong>!
          </Typography>
          <Typography className="text-center text-sm text-gray-600 mb-1">
            Email: {companyInfo?.email}
          </Typography>
          <Typography className="text-center text-sm text-gray-600 mb-1">
            Người quản lý: {companyInfo?.fullName}
          </Typography>

          {/* 2 button chuyển hướng */}
          <Box className="flex justify-center gap-4 mt-6">
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/dashboard/add-job")}
            >
              Thêm tin tuyển dụng
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/dashboard/add-info-company")}
            >
              Thêm hồ sơ công ty
            </Button>
          </Box>
        </Box>
      ) : (
        <Box className="max-w-lg mx-auto mt-20 p-6 bg-white shadow rounded">
          <Typography variant="h6" className="text-red-600 text-center mb-4">
            Tài khoản của bạn chưa được xác minh email
          </Typography>
          <Typography className="text-center mb-4">
            Vui lòng kiểm tra hộp thư đến để xác minh tài khoản.
          </Typography>
          {message && (
            <Typography className="text-center text-sm text-gray-600 mb-2">
              {message}
            </Typography>
          )}
          <Box className="text-center">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendVerifyEmail}
              disabled={loading}
            >
              {loading ? "Đang gửi..." : "Gửi email xác minh"}
            </Button>
          </Box>
        </Box>
      )}
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
};

export default VerifyAccount;
