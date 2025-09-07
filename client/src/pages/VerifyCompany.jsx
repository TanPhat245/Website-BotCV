import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyCompany = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND}api/company/verify-company/${token}`);
        console.log("Xác minh thành công:", res.data.message);
        navigate("/dashboard/verify?verified=1");
      } catch (err) {
        console.error("Lỗi xác minh:", err.response?.data?.message);
        navigate("/dashboard/verify?verified=0");
      }
    };

    if (token) verify();
  }, [token, navigate]);

  return <div>Đang xác minh tài khoản...</div>;
};

export default VerifyCompany;