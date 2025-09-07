import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SaveIcon from "./HeartIcon";

const JobCard = ({ job }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef(null);
  const [savedJobId, setSavedJobId] = useState(null);
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [savedDocId, setSavedDocId] = useState(null);
  const token = localStorage.getItem("userToken");
  const isExpired = job.deadline && new Date(job.deadline) < new Date();
  //Handle lưu và bỏ lưu công việc--xong
  const handleToggleSave = async () => {
    try {
      if (isSaved) {
        // BỎ LƯU
        if (!savedJobId) {
          toast.error("Không thể bỏ lưu: ID tin đã lưu không hợp lệ.");
          return;
        }
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND}api/user/saved-job/${savedJobId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) {
          setIsSaved(false);
          setSavedDocId(null);
          toast.info("Đã bỏ lưu công việc!");
          window.dispatchEvent(
            new CustomEvent("update-counts", {
              detail: { type: "saved", change: -1 },
            })
          );
        } else {
          toast.error("Bỏ lưu thất bại. Vui lòng thử lại.");
        }
      } else {
        // LƯU TIN
        const res = await fetch(`${import.meta.env.VITE_BACKEND}api/user/save-job`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ jobId: job._id }),
        });
        const data = await res.json();
        if (data.success) {
          setIsSaved(true);
          setSavedJobId(data.data._id);
          toast.success("Đã lưu công việc thành công!");
          window.dispatchEvent(
            new CustomEvent("update-counts", {
              detail: { type: "saved", change: 1 },
            })
          );
        } else {
          toast.error(`${data.message || "Lưu thất bại"}`);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi thực hiện thao tác.");
    }
  };
  //Kiểm tra và fresh trạng thái đã lưu của công việc--xong
  useEffect(() => {
    const fetchSavedStatus = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND}api/user/saved-jobs`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          const found = data.data.find((item) => item.jobId === job._id);
          if (found) {
            setIsSaved(true);
            setSavedJobId(found.savedJobId);
            console.log("found.savedJobId:", found.savedJobId);
          } else {
            console.log("Job chưa được lưu");
            setIsSaved(false);
            setSavedDocId(null);
          }
        }
      } catch (err) {
        console.error("Lỗi khi kiểm tra saved jobs:", err);
      }
    };

    if (token) {
      fetchSavedStatus();
    }
  }, [job._id, token]);
  //Hiển thị tooltip mô tả công việc khi hover--xong
  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(true);
    }, 1000);
  };
  //Ẩn tooltip khi rời chuột
  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    setShowTooltip(false);
  };
  return (
    <div
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/*Nội dung job */}
      <div
        onClick={() => {
          navigate(`/apply-job/${job._id}`);
          scrollTo(0, 0);
        }}
        className={`relative border rounded-xl p-5 shadow-md transition duration-300 flex flex-col gap-4 max-w-sm mx-auto cursor-pointer ${
          isExpired
            ? "bg-gray-100 border-gray-300 opacity-60 cursor-not-allowed"
            : "bg-white hover:shadow-xl border-gray-300"
        }`}
      >
        {/*TAG HẾT HẠN*/}
        {isExpired && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            Hết hạn
          </div>
        )}
        <div className="flex items-center gap-4">
          {/* Logo */}
          {job.recruiter?.logo && (
            <img
              src={`${import.meta.env.VITE_BACKEND}${job.recruiter.logo.replace(/\\/g, "/")}`}
              alt="Logo công ty"
              className="w-6 h-6 mr-2 rounded-full object-cover"
            />
          )}
          {/*Title + tên cty */}
          <div className="flex-1">
            <h4 className="font-semibold text-lg text-gray-900 line-clamp-1">
              {job.title}
            </h4>
            <p className="text-sm text-gray-600">
              {job.recruiter?.companyName || "Công ty không xác định"}
            </p>
          </div>
        </div>
        {/*Lương +m đc + level */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="bg-green-100 text-green-700 px-1 py-1 rounded-full font-medium">
            {job.salary?.negotiable
              ? "Thỏa thuận"
              : `${job.salary.min} - ${job.salary.max} triệu`}{" "}
          </span>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
            {job.provinceCode}
          </span>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
            {job.level}
          </span>
        </div>
        {/* Hiển thị hạn chót */}
        {job.deadline && (
          <div className="text-sm text-red-600 font-medium">
            Hạn chót: {new Date(job.deadline).toLocaleDateString("vi-VN")}
          </div>
        )}
        <div className="mt-3 flex justify-between items-center">
          {/* Nút Xem chi tiết */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/apply-job/${job._id}`);
              scrollTo(0, 0);
            }}
            className="flex-1 bg-green-500 text-white py-2 mr-2 rounded-md font-medium hover:bg-green-600 transition"
          >
            Xem chi tiết
          </button>
          {/* Nút lưu */}
          <SaveIcon isSaved={isSaved} onClick={handleToggleSave} />
        </div>
      </div>
      {/* Tooltip mô tả công việc */}
      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 bg-white border border-gray-300 shadow-lg rounded-lg p-4 text-sm text-gray-800">
          <h5 className="font-semibold text-base mb-2">Mô tả công việc:</h5>
          <p
            className="line-clamp-6 whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: job.description }}
          ></p>
        </div>
      )}
    </div>
  );
};

export default JobCard;
