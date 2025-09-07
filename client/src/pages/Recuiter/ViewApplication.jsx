import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaFileExcel } from "react-icons/fa";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

const ViewApplication = () => {
  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterJob, setFilterJob] = useState("");
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exportStatus, setExportStatus] = useState("");
  const [exportJob, setExportJob] = useState("");
  const [companyInfo, setCompanyInfo] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [mailContent, setMailContent] = useState({
    subject: "Thư mời phỏng vấn",
    body: "",
    time: "",
    location: "",
    rules: "",
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [currentJob, setCurrentJob] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("companyToken");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentApplications = applications.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(applications.length / itemsPerPage);
  //Fetch dữ liệu ứng viên và tìm
  const fetchData = async (keyword = "", status = "", jobTitle = "") => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND}api/company/applicants`,
        {
          headers: { Authorization: `${token}` },
          params: { keyword, status, jobTitle },
        }
      );
      setApplications(res.data.data || []);
      if (allJobs.length === 0) {
        const jobs = (res.data.data || [])
          .map((app) => app.jobTitle)
          .filter((value, index, self) => self.indexOf(value) === index);
        setAllJobs(jobs);
      }
      setCurrentPage(1);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  //Cập nhật trạng thái ứng viên
  const handleChangeStatus = async (jobId, userId, newStatus) => {
    if (newStatus === "Hẹn phỏng vấn") {
      setCurrentUser(userId);
      setCurrentJob(jobId);
      setOpenDialog(true);
      return;
    }
    const toastId = toast.loading("Đang cập nhật trạng thái...");
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND}api/company/change-status`,
        { jobId, userId, status: newStatus },
        { headers: { Authorization: `${token}` } }
      );
      toast.update(toastId, {
        render: "Cập nhật trạng thái thành công",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      fetchData(searchKeyword, filterStatus);
    } catch (err) {
      toast.update(toastId, {
        render:
          "Cập nhật thất bại: " + (err.response?.data?.message || err.message),
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };
  //Xuất dữ liệu ra Excel
  const exportToExcel = () => {
    let filtered = applications;

    if (exportStatus) {
      filtered = filtered.filter((app) => app.status === exportStatus);
    }

    if (exportJob) {
      filtered = filtered.filter((app) => app.jobTitle === exportJob);
    }

    if (!filtered.length) {
      alert("Không có dữ liệu phù hợp để xuất.");
      return;
    }

    const formattedData = filtered.map((app) => ({
      "Tên ứng viên": app.userName,
      Email: app.userEmail,
      "Số điện thoại": app.userPhone,
      "Địa chỉ": app.userAddress,
      "Tên tin tuyển dụng": app.jobTitle,
      "Trạng thái": app.status,
      "Ngày ứng tuyển": new Date(app.appliedAt).toLocaleDateString(),
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Danh sách ứng viên");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "DanhSachUngVien.xlsx");
  };
  //API lấy thông tin nhà tuyển dụng
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
  //Handle gửi thư mời phỏng vấn
  const handleSendInterviewMail = async () => {
    const toastId = toast.loading("Đang gửi thư mời...");

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND}api/company/interview-invite`,
        {
          jobId: currentJob,
          userId: currentUser,
          status: "Hẹn phỏng vấn",
          subject: mailContent.subject,
          time: mailContent.time,
          location: mailContent.location,
          body: mailContent.body,
          rules: mailContent.rules,
        },
        { headers: { Authorization: `${token}` } }
      );

      toast.update(toastId, {
        render: "Gửi thư mời thành công",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      setOpenDialog(false);
      fetchData();
    } catch (error) {
      toast.update(toastId, {
        render:
          "Lỗi khi gửi thư: " +
          (error.response?.data?.message || error.message),
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="p-4">
      {!companyInfo?.verified ? (
        <div className="text-red-600 bg-red-50 border border-red-200 rounded p-4 space-y-2">
          <p className="font-semibold text-lg">
            Không thể truy cập danh sách ứng viên
          </p>
          {!companyInfo?.verified && <p>- Vui lòng xác minh email.</p>}
          <div className="pt-2">
            <button
              onClick={() => navigate("/dashboard/verify")}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
            >
              Xác minh ngay
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {/* Xuất Excel */}
          <div className="flex flex-wrap gap-2 items-center mt-2">
            <select
              value={exportStatus}
              onChange={(e) => setExportStatus(e.target.value)}
              className="border px-3 py-2 rounded text-sm w-full sm:w-auto"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Đã ứng tuyển">Đã ứng tuyển</option>
              <option value="Tiếp nhận hồ sơ">Tiếp nhận hồ sơ</option>
              <option value="Phù hợp">Phù hợp</option>
              <option value="Chưa phù hợp">Chưa phù hợp</option>
              <option value="Hẹn phỏng vấn">Hẹn phỏng vấn</option>
              <option value="Gửi đề nghị">Gửi đề nghị</option>
              <option value="Nhận công việc">Nhận công việc</option>
              <option value="Từ chối">Từ chối</option>
              <option value="Ứng viên rút hồ sơ">Ứng viên rút hồ sơ</option>
              <option value="Hủy bởi hệ thống">Hủy bởi hệ thống</option>
            </select>

            <select
              value={exportJob}
              onChange={(e) => setExportJob(e.target.value)}
              className="border px-3 py-2 rounded text-sm w-full sm:w-auto"
            >
              <option value="">Tất cả tin tuyển dụng</option>
              {allJobs.map((job, index) => (
                <option key={index} value={job}>
                  {job}
                </option>
              ))}
            </select>

            <button
              onClick={exportToExcel}
              className="bg-green-600 text-white text-sm px-4 py-2 rounded hover:bg-green-700 flex items-center space-x-1 w-full sm:w-auto"
            >
              <FaFileExcel />
              <span>Xuất Excel</span>
            </button>
          </div>

          {/* Bộ lọc và tìm kiếm */}
          <div className="flex flex-wrap gap-2 md:items-center mb-4">
            {/* Tìm kiếm theo tên ứng viên hoặc tin tuyển dụng */}
            <div className="relative w-full md:w-1/2">
              <input
                type="text"
                placeholder="Tìm theo tên ứng viên hoặc tin tuyển dụng..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="border px-3 py-2 rounded w-full pl-10 shadow-sm text-sm"
              />
              <FaSearch className="absolute top-3 left-3 text-gray-400" />
            </div>
            {/* Nút tìm kiếm */}
            <button
              onClick={() => fetchData(searchKeyword, filterStatus, filterJob)}
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition w-full sm:w-auto"
            >
              Tìm kiếm
            </button>
            {/* Bộ lọc theo tin tuyển dụng và trạng thái */}
            <select
              value={filterJob}
              onChange={(e) => {
                setFilterJob(e.target.value);
                fetchData(searchKeyword, filterStatus, e.target.value);
              }}
              className="border px-3 py-2 rounded text-sm w-full md:w-1/4"
            >
              <option value="">Tất cả tin tuyển dụng</option>
              {allJobs.map((job, index) => (
                <option key={index} value={job}>
                  {job}
                </option>
              ))}
            </select>
            {/* Bộ lọc theo tin tuyển dụng và trạng thái */}
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                fetchData(searchKeyword, e.target.value, filterJob);
              }}
              className="border px-3 py-2 rounded text-sm w-full md:w-1/4"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Đã ứng tuyển">Đã ứng tuyển</option>
              <option value="Tiếp nhận hồ sơ">Tiếp nhận hồ sơ</option>
              <option value="Phù hợp">Phù hợp</option>
              <option value="Chưa phù hợp">Chưa phù hợp</option>
              <option value="Hẹn phỏng vấn">Hẹn phỏng vấn</option>
              <option value="Gửi đề nghị">Gửi đề nghị</option>
              <option value="Nhận công việc">Nhận công việc</option>
              <option value="Từ chối">Từ chối</option>
              <option value="Ứng viên rút hồ sơ">Ứng viên rút hồ sơ</option>
              <option value="Hủy bởi hệ thống">Hủy bởi hệ thống</option>
            </select>
            {/* Hiển thị thông tin tìm kiếm */}
            {filterJob && (
              <div className="mt-2 text-gray-600 text-sm w-full">
                Đã tìm thấy{" "}
                <span className="font-semibold">{applications.length}</span> ứng
                viên thuộc tin <span className="italic">"{filterJob}"</span>. Số
                lượng đã tuyển:{" "}
                <span className="font-semibold">
                  {
                    applications.filter(
                      (app) => app.status === "Nhận công việc"
                    ).length
                  }
                </span>
                . Số lượng yêu cầu:{" "}
                <span className="font-semibold">
                  {applications.find((app) => app.jobTitle === filterJob)
                    ?.slot || "Chưa rõ"}
                </span>
                .
              </div>
            )}
          </div>

          {/* Bảng trên PC, Tablet */}
          <div className="hidden md:block overflow-x-auto shadow-lg rounded-lg bg-white">
            <table className="min-w-full table-auto border border-gray-300">
              <thead className="bg-purple-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Tên ứng viên</th>
                  <th className="px-4 py-3 text-left">Tin tuyển dụng</th>
                  <th className="px-4 py-3 text-left">Ngày nộp</th>
                  <th className="px-4 py-3 text-left">Trạng thái</th>
                  <th className="px-4 py-3 text-left">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  currentApplications.map((app, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } border-b border-gray-200`}
                    >
                      <td
                        className="px-4 py-3 max-w-[200px] truncate"
                        title={app.userName}
                      >
                        {app.userName}
                      </td>
                      <td
                        className="px-4 py-3 max-w-[200px] truncate"
                        title={app.jobTitle}
                      >
                        {app.jobTitle}
                      </td>
                      <td className="px-4 py-3">
                        {dayjs(app.appliedAt).format("DD/MM/YYYY")}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            app.status === "Nhận công việc"
                              ? "bg-green-100 text-green-700"
                              : app.status === "Gửi đề nghị"
                              ? "bg-yellow-100 text-yellow-700"
                              : app.status === "Phù hợp"
                              ? "bg-blue-100 text-blue-700"
                              : app.status === "Chưa phù hợp"
                              ? "bg-red-100 text-red-700"
                              : app.status === "Tiếp nhận hồ sơ"
                              ? "bg-sky-100 text-sky-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 space-x-2">
                        {app.userCvUrl ? (
                          <button
                            onClick={() => {
                              navigate(`/dashboard/info-applier/${app._id}`);
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
                        <select
                          value={app.status}
                          onChange={(e) =>
                            handleChangeStatus(
                              app.jobId,
                              app.userId,
                              e.target.value
                            )
                          }
                          className="border border-gray-300 px-3 py-2 rounded-md text-sm bg-white shadow-sm focus:ring-2 focus:ring-blue-500 transition w-45"
                        >
                          <option value="Đã ứng tuyển">Đã ứng tuyển</option>
                          <option value="Tiếp nhận hồ sơ">
                            Tiếp nhận hồ sơ
                          </option>
                          <option value="Phù hợp">Phù hợp</option>
                          <option value="Chưa phù hợp">Chưa phù hợp</option>
                          <option value="Hẹn phỏng vấn">Hẹn phỏng vấn</option>
                          <option value="Gửi đề nghị">Gửi đề nghị</option>
                          <option value="Nhận công việc">Nhận công việc</option>
                          <option value="Từ chối">
                            Từ chối
                          </option>
                          <option disabled value="Ứng viên rút hồ sơ">
                            Ứng viên rút hồ sơ
                          </option>
                          <option disabled value="Hủy bởi hệ thống">
                            Hủy bởi hệ thống
                          </option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Card dạng list trên mobile */}
          <div className="block md:hidden space-y-3">
            {loading ? (
              <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
            ) : applications.length === 0 ? (
              <p className="text-center text-gray-500">Không có dữ liệu</p>
            ) : (
              currentApplications.map((app, index) => (
                <div
                  key={index}
                  className="border rounded p-3 shadow space-y-2"
                >
                  <p>
                    <span className="font-semibold">Tên:</span> {app.userName}
                  </p>
                  <p>
                    <span className="font-semibold">Tin:</span> {app.jobTitle}
                  </p>
                  <p>
                    <span className="font-semibold">Ngày nộp:</span>{" "}
                    {dayjs(app.appliedAt).format("DD/MM/YYYY")}
                  </p>
                  <p>
                    <span className="font-semibold">Trạng thái:</span>{" "}
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        app.status === "Nhận công việc"
                          ? "bg-green-100 text-green-700"
                          : app.status === "Gửi đề nghị"
                          ? "bg-yellow-100 text-yellow-700"
                          : app.status === "Phù hợp"
                          ? "bg-blue-100 text-blue-700"
                          : app.status === "Chưa phù hợp"
                          ? "bg-red-100 text-red-700"
                          : app.status === "Tiếp nhận hồ sơ"
                          ? "bg-sky-100 text-sky-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {app.status}
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {app.userCvUrl ? (
                      <button
                        onClick={() =>
                          navigate(`/dashboard/info-applier/${app._id}`)
                        }
                        className="bg-purple-600 text-white text-xs px-3 py-1 rounded hover:bg-purple-700"
                      >
                        Xem CV
                      </button>
                    ) : (
                      <span className="italic text-gray-400 text-sm">
                        Chưa có CV
                      </span>
                    )}
                    <select
                      value={app.status}
                      onChange={(e) =>
                        handleChangeStatus(
                          app.jobId,
                          app.userId,
                          e.target.value
                        )
                      }
                      className="border border-gray-300 px-3 py-2 rounded-md text-sm bg-white shadow-sm focus:ring-2 focus:ring-blue-500 transition w-full"
                    >
                      <option value="Đã ứng tuyển">Đã ứng tuyển</option>
                      <option value="Tiếp nhận hồ sơ">Tiếp nhận hồ sơ</option>
                      <option value="Phù hợp">Phù hợp</option>
                      <option value="Chưa phù hợp">Chưa phù hợp</option>
                      <option value="Hẹn phỏng vấn">Hẹn phỏng vấn</option>
                      <option value="Gửi đề nghị">Gửi đề nghị</option>
                      <option value="Nhận công việc">Nhận công việc</option>
                      <option disabled value="Từ chối">
                        Từ chối
                      </option>
                      <option disabled value="Ứng viên rút hồ sơ">
                        Ứng viên rút hồ sơ
                      </option>
                      <option disabled value="Hủy bởi hệ thống">
                        Hủy bởi hệ thống
                      </option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
          {applications.length > itemsPerPage && (
            <div className="flex justify-center mt-4 space-x-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      {/* Dialog gửi thư mời phỏng vấn */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Soạn thư mời phỏng vấn</DialogTitle>
        <DialogContent>
          <TextField
            label="Thời gian phỏng vấn"
            type="datetime-local"
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
            value={mailContent.time}
            onChange={(e) =>
              setMailContent({ ...mailContent, time: e.target.value })
            }
          />
          <TextField
            label="Địa điểm"
            fullWidth
            margin="dense"
            value={mailContent.location}
            onChange={(e) =>
              setMailContent({ ...mailContent, location: e.target.value })
            }
          />
          <TextField
            label="Nội dung thư"
            fullWidth
            multiline
            rows={4}
            margin="dense"
            value={mailContent.body}
            onChange={(e) =>
              setMailContent({ ...mailContent, body: e.target.value })
            }
          />
          <TextField
            label="Quy định đi phỏng vấn"
            fullWidth
            multiline
            rows={3}
            margin="dense"
            value={mailContent.rules}
            onChange={(e) =>
              setMailContent({ ...mailContent, rules: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={() => handleSendInterviewMail()}>
            Gửi thư
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewApplication;
