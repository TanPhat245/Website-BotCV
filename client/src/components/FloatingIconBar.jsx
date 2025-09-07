import { useEffect, useState } from "react";
import {
  FaHeart,
  FaCheckCircle,
  FaCommentDots,
  FaHeadset,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const FloatingIconBar = () => {
  const [savedCount, setSavedCount] = useState(1);
  const [appliedCount, setAppliedCount] = useState(0);
  const navigate = useNavigate();

  //API đếm tin đã lưu
  //API đếm tin đã ứng tuyển--xong
  const fetchCounts = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const headers = { headers: { token } };

      const [savedRes, appliedRes] = await Promise.all([
        axios.get(
          `${import.meta.env.VITE_BACKEND}api/user/saved-jobs`,
          headers
        ),
        axios.get(
          `${import.meta.env.VITE_BACKEND}api/user/applications`,
          headers
        ),
      ]);

      if (savedRes.data.success) {
        setSavedCount(savedRes.data.data.length);
      }

      if (appliedRes.data.success) {
        setAppliedCount(appliedRes.data.applications.length);
      }
    } catch (err) {
      console.error("Lỗi khi lấy số lượng tin:", err);
    }
  };
  //Logic check save và apply--xong
  useEffect(() => {
    fetchCounts();
    const handleUpdate = (e) => {
      if (e.detail.type === "saved") {
        setSavedCount((prev) => prev + (e.detail.change || 0));
      }
      if (e.detail.type === "applied") {
        setAppliedCount((prev) => prev + (e.detail.change || 0));
      }
    };
    window.addEventListener("update-counts", handleUpdate);
    return () => window.removeEventListener("update-counts", handleUpdate);
  }, []);

  return (
    <div className="fixed right-4 bottom-40 flex flex-col items-center gap-3 z-50">
      {/* Tin đã lưu */}
      <div className="relative group">
        <button
          onClick={() => {
            navigate("/saved-jobs");
            scroll(0, 0);
          }}
          className="bg-white shadow-md p-3 rounded-full text-green-600 hover:bg-green-100 transition"
        >
          <FaHeart size={20} />
        </button>
        {savedCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {savedCount}
          </span>
        )}
        <span className="absolute right-12 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
          Xem tin đã lưu
        </span>
      </div>

      {/* Tin đã ứng tuyển */}
      <div className="relative group">
        <button
          onClick={() => {
            navigate("/applications");
            scroll(0, 0);
          }}
          className="bg-white shadow-md p-3 rounded-full text-green-600 hover:bg-green-100 transition"
        >
          <FaCheckCircle size={20} />
        </button>
        {appliedCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {appliedCount}
          </span>
        )}
        <span className="absolute right-12 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
          Xem tin đã ứng tuyển
        </span>
      </div>

      {/* Góp ý */}
      <div className="bg-white shadow-md rounded-md py-2 px-3 flex items-center gap-2 hover:bg-green-50 cursor-pointer transition">
        <FaCommentDots className="text-green-600" />
        <span className="text-sm text-green-600 font-medium">Góp ý</span>
      </div>

      {/* Hỗ trợ */}
      <div className="bg-white shadow-md rounded-md py-2 px-3 flex items-center gap-2 hover:bg-green-50 cursor-pointer transition">
        <FaHeadset className="text-green-600" />
        <span className="text-sm text-green-600 font-medium">Hỗ trợ</span>
      </div>
    </div>
  );
};

export default FloatingIconBar;
