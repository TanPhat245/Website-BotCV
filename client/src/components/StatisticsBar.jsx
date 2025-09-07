import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBriefcase } from "react-icons/fa";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const StatisticsBar = () => {
  const [todayCount, setTodayCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  //api thoong ke
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [todayRes, totalRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND}api/jobs/today-count`),
          axios.get(`${import.meta.env.VITE_BACKEND}api/jobs/total-count`),
        ]);
        setTodayCount(todayRes.data.count);
        setTotalCount(totalRes.data.count);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu thống kê việc làm:", err);
      }
    };

    fetchStats();
  }, []);

  const today = format(new Date(), "dd/MM/yyyy");

  return (
    <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-6 rounded-xl mx-2 mt-5 flex justify-between items-center flex-wrap gap-4">
      {/* Tiêu đề + ngày */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <FaBriefcase />
          <span>Thị trường việc làm hôm nay</span>
        </div>
        <p className="text-xl opacity-90 cursor-pointer">{today}</p>
      </div>

      {/* Thống kê số lượng */}
      <div className="flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-2 text-sm">
          <span>Việc làm đang tuyển</span>
          <span className="text-green-200 font-bold">
            {totalCount.toLocaleString()}
          </span>
          <FaArrowUpRightFromSquare onClick={()=>navigate('/collection-jobs')} className="text-green-300 cursor-pointer" />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold">Việc làm mới hôm nay</span>
          <span className="text-green-200 font-bold">{todayCount}</span>
        </div>
      </div>
    </div>
  );
};

export default StatisticsBar;
