import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CircularProgress } from "@mui/material";

const InfoApply = () => {
  const { applyId } = useParams();
  const token = localStorage.getItem("companyToken");
  const [loading, setLoading] = useState(true);
  const [applicant, setApplicant] = useState(null);
  const [error, setError] = useState("");
//API Load thông tin ứng viên
  useEffect(() => {
    const fetchApplicantInfo = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND}api/company/user-info/${applyId}`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (res.data.success) {
          setApplicant(res.data);
        } else {
          setError(res.data.message || "Lỗi khi lấy dữ liệu.");
        }
      } catch (err) {
        setError("Lỗi kết nối hoặc không có quyền truy cập.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicantInfo();
  }, [applyId, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 font-semibold mt-5">{error}</div>
    );
  }

  const { user, applicationInfo } = applicant;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 border rounded-lg shadow-lg bg-white space-y-5">
      {/* Điều hướng quay lại */}
      <p
        onClick={() => window.history.back()}
        className="text-sm text-slate-400 underline cursor-pointer hover:text-blue-800"
      >
        Quay lại trang quản lý ứng tuyển
      </p>
      {/* Tiêu đề */}
      <div className="bg-purple-600 text-white text-center py-3 rounded">
        <h2 className="text-xl font-bold">Thông tin chi tiết ứng viên</h2>
      </div>

      {/* Thông tin cơ bản */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p>
            <span className="font-semibold">Họ tên:</span> {user.name}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-semibold">Số điện thoại:</span> {user.phone}
          </p>
          <p>
            <span className="font-semibold">Địa chỉ:</span>{" "}
            {user.address || "Chưa cập nhật"}
          </p>
        </div>

        <div>
          <p>
            <span className="font-semibold">Bằng cấp:</span>{" "}
            {user.degree || "Chưa cập nhật"}
          </p>
          <p>
            <span className="font-semibold">Lĩnh vực:</span>{" "}
            {user.field || "Chưa cập nhật"}
          </p>
          <p>
            <span className="font-semibold">Trình độ:</span>{" "}
            {user.level || "Chưa cập nhật"}
          </p>
          <p>
            <span className="font-semibold">Vị trí ứng tuyển:</span>{" "}
            {applicationInfo.jobTitle}
          </p>
        </div>
      </div>

      {/* Ngày ứng tuyển và trạng thái */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <p>
          <span className="font-semibold">Ngày ứng tuyển:</span>{" "}
          {new Date(applicationInfo.applyDate).toLocaleDateString()}
        </p>
        <p>
          <span className="font-semibold">Trạng thái:</span>
          <span className="ml-2 px-2 py-1 rounded text-sm font-medium bg-blue-100 text-blue-700">
            {applicationInfo.status}
          </span>
        </p>
      </div>

      {/* Hiển thị CV nếu có */}
      {user.cvUrl && user.cvUrl.endsWith(".pdf") ? (
        <div className="mt-5">
          <p className="font-semibold mb-2">CV của ứng viên:</p>
          <iframe
            src={`http://localhost:5000${user.cvUrl}`}
            className="w-full h-[500px] border rounded"
            title="CV của ứng viên"
          />
        </div>
      ) : user.cvUrl ? (
        <div className="mt-5">
          <p className="font-semibold mb-2">CV của ứng viên:</p>
          <img
            src={`http://localhost:5000${user.cvUrl}`}
            alt="CV của ứng viên"
            className="max-w-full border rounded shadow"
          />
        </div>
      ) : (
        <p className="italic text-gray-500 mt-3">Chưa có CV</p>
      )}
    </div>
  );
};

export default InfoApply;
