import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DashboardHome = () => {
  const [stats, setStats] = useState({
    jobs: [],
    applicants: [],
  });
  const [companyInfo, setCompanyInfo] = useState(null);

  const token = localStorage.getItem("companyToken");
  const navigate = useNavigate();
  //Lấy thông tin ứng viên, job, công ty
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [jobsRes, appRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND}api/company/list-jobs`, {
            headers: { Authorization: `${token}` },
          }),
          axios.get(`${import.meta.env.VITE_BACKEND}api/company/applicants`, {
            headers: { Authorization: `${token}` },
          }),
        ]);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND}api/company/profile`, {
        headers: { Authorization: token },
      });
        setStats({
          jobs: jobsRes.data.jobsData || [],
          applicants: appRes.data.data || [],
        });
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu dashboard:", error);
      }
    };

    fetchDashboardData();
  }, []);
  //API lấy thông tin nhà tuyển dụng sử dụng cho check xác minh tk chưa
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      const token = localStorage.getItem("companyToken");
      const res = await axios.get(`${import.meta.env.VITE_BACKEND}api/company/profile`, {
        headers: { Authorization: token },
      });
      setCompanyInfo(res.data);
    };
    fetchCompanyInfo();
  }, []);
  return (
    <div className="space-y-8">
      {companyInfo && !companyInfo.verified && (
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 p-4 rounded shadow mb-6">
          <p className="font-semibold mb-1">
            Tài khoản của bạn chưa xác minh email
          </p>
          <p className="text-sm">
            Một số tính năng sẽ bị hạn chế. Vui lòng xác minh để sử dụng đầy đủ
            chức năng.
          </p>
          <button
            onClick={() => navigate("/dashboard/verify")}
            className="mt-2 inline-block text-sm text-blue-600 underline hover:text-blue-800"
          >
            Xác minh ngay
          </button>
        </div>
      )}
      <h1 className="text-2xl font-semibold text-gray-800">
        Xin chào, hôm nay có gì mới hông ta.
      </h1>
      {/* Thống kê tổng */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div
          onClick={() => navigate("/dashboard/manage-jobs")}
          className="bg-white cursor-pointer hover:shadow-gray-500 shadow rounded-xl p-6 border border-gray-200"
        >
          <h2 className="text-lg font-medium text-gray-600">
            Tổng tin tuyển dụng
          </h2>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {stats.jobs.length}
          </p>
        </div>
        <div
          onClick={() => navigate("/dashboard/view-applications")}
          className="bg-white shadow rounded-xl hover:shadow-gray-500 p-6 border cursor-pointer border-gray-200"
        >
          <h2 className="text-lg font-medium text-gray-600">Tổng ứng viên</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {stats.applicants.length}
          </p>
        </div>
        <div
          onClick={() => navigate("/dashboard/manage-jobs")}
          className="bg-white shadow rounded-xl hover:shadow-gray-500 p-6 border cursor-pointer border-gray-200"
        >
          <h2 className="text-lg font-medium text-gray-600">Tin đang mở</h2>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {stats.jobs.filter((job) => job.visible).length}
          </p>
        </div>
      </div>

      {/* Danh sách ứng viên gần nhất */}
      <div className="bg-white shadow rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Ứng viên mới nhất
        </h2>
        {stats.applicants.length === 0 ? (
          <p className="text-gray-500">Chưa có ứng viên nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-600">
              <thead className="bg-gray-100 text-gray-700 font-medium">
                <tr>
                  <th className="p-3">Tên ứng viên</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Số điện thoại</th>
                  <th className="p-3">CV</th>
                  <th className="p-3">Tin ứng tuyển</th>
                </tr>
              </thead>
              <tbody>
                {stats.applicants.slice(0, 5).map((applicant, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="p-3">{applicant.userName}</td>
                    <td className="p-3">{applicant.userEmail}</td>
                    <td className="p-3">{applicant.userPhone}</td>
                    <td className="p-3">
                      {applicant.userCvUrl ? (
                        <button
                          onClick={() => {
                            navigate(
                              `/dashboard/info-applier/${applicant._id}`
                            );
                            scrollTo(0, 100);
                          }}
                          className="bg-purple-600 text-white text-xs px-3 py-1 rounded hover:bg-purple-700"
                        >
                          Xem thông tin
                        </button>
                      ) : (
                        <span className="italic text-gray-400 text-sm">
                          Chưa có CV
                        </span>
                      )}
                    </td>
                    <td className="p-3">{applicant.jobTitle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
