import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ManageJobs = () => {
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };
  const handleView = (job) => {
    setSelectedJob(job);
    setOpenDropdownIndex(null);
  };
  const handleCloseDetail = () => {
    setSelectedJob(null);
  };
  const token = localStorage.getItem("companyToken");
  //Chuyển hướng đến trang edit
  const handleEdit = (jobId) => {
    navigate(`/dashboard/edit-job/${jobId}`);
  };
  //api delete
  const handleDelete = async (jobId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá tin tuyển dụng này?"))
      return;

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND}api/company/delete/${jobId}`, {
        headers: { Authorization: `${token}` },
      });
      alert("Xoá thành công!");
      fetchData();
    } catch (err) {
      alert("Lỗi xoá tin: " + (err.response?.data?.message || err.message));
    }
  };
  //API lấy danh sách jobs
  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND}api/company/list-jobs`,
        {
          headers: { Authorization: `${token}` },
        }
      );
      const sortedJobs = [...(res.data.jobsData || [])].sort((a, b) => {
        if (sortBy === "newest")
          return new Date(b.createdAt) - new Date(a.createdAt);
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
      setJobs(sortedJobs);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [sortBy]);
  //thay đổi trạng thái đóng/mở
  const handleToggleVisible = async (jobId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND}api/company/change-job`,
        { id: jobId },
        {
          headers: { Authorization: `${token}` },
        }
      );

      const data = res.data;

      if (data.success) {
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job._id === jobId ? { ...job, visible: data.job.visible } : job
          )
        );
        toast.success(`Đã ${data.job.visible ? "mở" : "đóng"} tin tuyển dụng`);
      } else {
        toast.error("Lỗi: " + data.message);
      }
    } catch (err) {
      console.error("Lỗi kết nối:", err);
      toast.error("Lỗi kết nối đến máy chủ");
    }
  };
  //Phân trang
  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const paginatedJobs = jobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  return (
    <div className="p-4 overflow-x-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <h2 className="text-2xl font-semibold">Quản lý tin tuyển dụng</h2>
        {/* Sắp xếp */}
        <div className="flex items-center gap-2">
          <span className="text-sm">Sắp xếp:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border p-1 rounded text-sm"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
          </select>
        </div>
      </div>
      {/* tin tuyen dung */}
      {jobs.length === 0 ? (
        <div className="text-center font-semibold py-5 text-lg">
          Bạn chưa đăng tin nào cả. Hãy chọn nút bên dưới để đăng tin mới.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr className="text-left text-sm text-gray-600 uppercase">
                <th className="px-6 py-3 border-b max-sm:hidden">#</th>
                <th className="px-6 py-3 border-b">Tên</th>
                <th className="px-6 py-3 border-b max-sm:hidden">Ngày đăng</th>
                <th className="px-6 py-3 border-b max-sm:hidden">Địa chỉ</th>
                <th className="px-6 py-3 border-b text-center">Số ứng viên</th>
                <th className="px-6 py-3 border-b">Trạng thái</th>
                <th className="px-6 py-3 border-b max-sm:hidden">Hạn nộp</th>
                <th className="px-6 py-3 border-b">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {/*Tin tuyển dụng */}
              {paginatedJobs.map((job, index) => (
                <tr key={job._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 border-b max-sm:hidden">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {job.title.length > 25
                      ? job.title.slice(0, 25) + "..."
                      : job.title}
                  </td>
                  <td className="px-6 py-4 border-b max-sm:hidden">
                    {dayjs(job.createdAt).format("DD/MM/YYYY")}
                  </td>
                  <td className="px-6 py-4 border-b max-sm:hidden">
                    {job.district + ", " + job.provinceCode}
                  </td>
                  <td className="px-6 py-4 border-b text-center">{job.slot}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleVisible(job._id)}
                      className={`px-3 py-1 rounded text-white text-sm font-medium ${
                        job.visible
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {job.visible ? "Mở" : "Đóng"}
                    </button>
                  </td>
                  <td className="px-6 py-4 border-b max-sm:hidden">
                    {dayjs(job.deadline).format("DD/MM/YYYY")}
                  </td>

                  {/*3 button */}
                  <td className="px-6 py-4 relative overflow-visible">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleDropdown(index)}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                      >
                        •••
                      </button>
                      {openDropdownIndex === index && (
                        <div className="right-0 mt-2 w-32 bg-white border rounded shadow z-50">
                          <button
                            onClick={() => handleView(job)}
                            className="px-4 py-2 text-green-600 hover:bg-green-100 rounded"
                          >
                            Xem
                          </button>
                          <button
                            className="px-4 py-2 text-yellow-600 hover:bg-yellow-100 rounded"
                            onClick={() => handleEdit(job._id)}
                          >
                            Sửa
                          </button>
                          <button
                            className="px-4 py-2 text-red-600 hover:bg-red-100 rounded"
                            onClick={() => handleDelete(job._id)}
                          >
                            Xóa
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center items-center space-x-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                ◀ Trước
              </button>

              <div className="flex items-center space-x-1 text-sm">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-2 py-1 rounded ${
                      currentPage === i + 1
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Sau ▶
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex justify-center">
        <button
          onClick={() => navigate("/dashboard/add-job")}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200 flex items-center gap-2"
        >
          Thêm tin
        </button>
      </div>

      {/* Modal xem chi tiết */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-xl relative max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Chi tiết công việc</h3>
            <p>
              <strong>Tên:</strong> {selectedJob.title}
            </p>
            <p>
              <strong>Ngày đăng:</strong>{" "}
              {dayjs(selectedJob.createdAt).format("DD/MM/YYYY")}
            </p>
            <p>
              <strong>Địa chỉ:</strong>{" "}
              {selectedJob.district + ", " + selectedJob.provinceCode}
            </p>
            <p>
              <strong>Mô tả:</strong>
              <div
                className="rich-text"
                dangerouslySetInnerHTML={{ __html: selectedJob.description }}
              ></div>
            </p>
            <button
              onClick={handleCloseDetail}
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageJobs;
