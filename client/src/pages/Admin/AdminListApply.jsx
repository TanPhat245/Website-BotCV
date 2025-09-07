import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import Pagination from "../../components/Pagination";
dayjs.extend(relativeTime);
dayjs.locale("vi");

const AdminListApply = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedApply, setSelectedApply] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPageApply, setCurrentPageApply] = useState(1);
  const [currentPageJob, setCurrentPageJob] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 6;

  //Lấy danh sách job và ập lai
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [applyRes, jobRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/list-applications"),
          axios.get("http://localhost:5000/api/admin/list-jobs"),
        ]);
        setApplications(applyRes.data.data || []);
        setJobs(jobRes.data.data || []);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      }
    };
    fetchAllData();
  }, []);
  //Hủy đơn ứng tuyển của admim
  const handleCancelApply = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn ứng tuyển này?")) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/admin/delete-application/${id}`
      );
      setApplications((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error("Lỗi khi hủy ứng tuyển:", err);
    }
  };
  //API ẩn tin của admim
  const handleToggleJobVisible = async (jobId) => {
    try {
      await axios.post("http://localhost:5000/api/company/change-status", {
        id: jobId,
      });
      setJobs((prev) =>
        prev.map((j) => (j._id === jobId ? { ...j, visible: !j.visible } : j))
      );
    } catch (err) {
      console.error("Lỗi khi thay đổi trạng thái job:", err);
    }
  };
  //Logic tìm và lọc apply
  const filteredApplications = applications.filter(
    (app) =>
      app.userId?.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      app.jobId?.title?.toLowerCase().includes(debouncedSearch.toLowerCase())
  );
  //Logic tìm và lọc job
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      job.company?.companyName
        ?.toLowerCase()
        .includes(debouncedSearch.toLowerCase())
  );
  // Tính ứng tuyển được phân trang
  const paginatedApplications = filteredApplications.slice(
    (currentPageApply - 1) * itemsPerPage,
    currentPageApply * itemsPerPage
  );
  // Tính việc làm được phân trang
  const paginatedJobs = filteredJobs.slice(
    (currentPageJob - 1) * itemsPerPage,
    currentPageJob * itemsPerPage
  );
  useEffect(() => {
    setLoading(true);
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText);
      setLoading(false);
    }, 500); // Delay 0.5s

    return () => clearTimeout(handler);
  }, [searchText]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Tìm kiếm và lọc */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Tìm theo công việc, người dùng, công ty..."
          className="px-4 py-2 border rounded w-full sm:w-1/2"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="all">Tất cả</option>
          <option value="apply">Đơn ứng tuyển</option>
          <option value="job">Tin tuyển dụng</option>
        </select>
      </div>

      {/* Danh sách ứng tuyển */}
      {(filterType === "all" || filterType === "apply") && (
        <>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Đơn Ứng Tuyển
          </h2>
          {loading ? (
            <div className="text-blue-600 text-center animate-pulse">
              Đang tìm kiếm...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedApplications.map((a) => (
                <div
                  key={a._id}
                  onClick={() => {
                    setSelectedApply(a);
                    setOpen(true);
                  }}
                  className="bg-white border rounded-md shadow-md p-4 hover:border-blue-500 hover:shadow-lg transition cursor-pointer relative"
                >
                  <h3 className="font-bold text-lg text-gray-800">
                    {a.userName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    📧 {a.userEmail} | 📱 {a.userPhone}
                  </p>
                  <p className="text-gray-700 mt-2">
                    🧑‍💼 Công việc:{" "}
                    <span className="font-medium">{a.jobId?.title}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Ngày ứng tuyển: {dayjs(a.createdAt).format("DD/MM/YYYY")}
                  </p>
                  <span className="inline-block mt-2 text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {a.status}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelApply(a._id);
                    }}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    Hủy
                  </button>
                </div>
              ))}
            </div>
          )}
          <Pagination
            total={filteredApplications.length}
            currentPage={currentPageApply}
            onChange={setCurrentPageApply}
          />
        </>
      )}

      {/* Danh sách việc làm */}
      {(filterType === "all" || filterType === "job") && (
        <>
          <h2 className="text-2xl font-bold my-8 text-gray-800">
            Tin Tuyển Dụng
          </h2>
          {loading ? (
            <div className="text-blue-600 text-center animate-pulse">
              Đang tìm kiếm...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white border rounded-md shadow-md p-4 hover:border-green-500 hover:shadow-lg transition relative"
                >
                  <h3 className="font-bold text-lg text-gray-800">
                    {job.title}
                  </h3>
                  <p className="text-gray-600">
                    🏢 {job.company?.companyName || "Không xác định"}
                  </p>
                  <p className="text-gray-600">
                    📍 {job.provinceCode}, {job.district}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    📅 Đăng ngày: {dayjs(job.createdAt).format("DD/MM/YYYY")}
                  </p>
                  <span
                    className={`mt-2 inline-block px-3 py-1 text-sm rounded-full ${
                      job.visible
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {job.visible ? "Đang hiển thị" : "Đã ẩn"}
                  </span>

                  <button
                    onClick={() => handleToggleJobVisible(job._id)}
                    className="absolute top-2 right-2 text-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-2 py-1 rounded"
                  >
                    {job.visible ? "Ẩn tin" : "Hiển thị"}
                  </button>
                </div>
              ))}
            </div>
          )}
          <Pagination
            total={filteredJobs.length}
            currentPage={currentPageJob}
            onChange={setCurrentPageJob}
          />
        </>
      )}

      {/* Hộp thoại xem chi tiết ứng tuyển */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <Dialog.Title className="text-lg font-bold mb-4 text-blue-700">
              Thông tin chi tiết đơn ứng tuyển
            </Dialog.Title>
            {selectedApply && (
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <strong>Họ tên:</strong> {selectedApply.userName}
                </p>
                <p>
                  <strong>Email:</strong> {selectedApply.userEmail}
                </p>
                <p>
                  <strong>Điện thoại:</strong> {selectedApply.userPhone}
                </p>
                <p>
                  <strong>Công việc:</strong> {selectedApply.jobId?.title}
                </p>
                <p>
                  <strong>Trạng thái:</strong> {selectedApply.status}
                </p>
                <p>
                  <strong>Ngày ứng tuyển:</strong>{" "}
                  {dayjs(selectedApply.createdAt).format("DD/MM/YYYY")}
                </p>
                {selectedApply.userCvUrl && (
                  <p>
                    <strong>CV:</strong>{" "}
                    <a
                      href={`http://localhost:5000${selectedApply.userCvUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      Xem CV
                    </a>
                  </p>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Đóng
                </button>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default AdminListApply;
