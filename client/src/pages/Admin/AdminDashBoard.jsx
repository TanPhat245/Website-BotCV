import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [summary, setSummary] = useState({
    jobs: 0,
    companys: 0,
    users: 0,
    applications: 0,
    revenue: 0,
  });
  //API thống kê
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/summary")
      .then((res) => setSummary(res.data))
      .catch((err) => console.error("Lỗi khi tải thống kê:", err));
  }, []);

  const chartData = [
    { name: "Tin tuyển dụng", value: summary.jobs },
    { name: "Nhà tuyển dụng", value: summary.companys },
    { name: "Người tìm việc", value: summary.users },
    { name: "Đơn ứng tuyển", value: summary.applications },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">Thống kê hệ thống</h2>

      {/* Card thống kê */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Tin tuyển dụng" value={summary.jobs} />
        <StatCard title="Nhà tuyển dụng" value={summary.companys} />
        <StatCard title="Người tìm việc" value={summary.users} />
        <StatCard title="Đơn ứng tuyển" value={summary.applications} />
        <StatCard title="Doanh thu (VNĐ)" value={summary.revenue?.toLocaleString() || "Chưa có"} />
      </div>

      {/* Biểu đồ */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Biểu đồ tổng quan</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#16a34a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-xl cursor-grabbing border border-gray-300 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300 text-center">
    <div className="text-xl text-gray-600 mb-1">{title}</div>
    <div className="text-2xl font-bold text-green-600">Đang có: {value}</div>
  </div>
);


export default AdminDashboard;
