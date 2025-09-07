import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import Footer from "../components/Footer";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
dayjs.extend(relativeTime);
dayjs.locale("vi");
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from "@mui/material";

const Application = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const token = localStorage.getItem("userToken");
  // Bộ lọc và phân trang
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [sortOrder, setSortOrder] = useState("mới nhất");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  useEffect(() => {
    document.title = "Việc làm đã ứng tuyển | BotCV";
  }, []);
  // Lọc và sắp xếp danh sách
  const filteredApplications = applications
    .filter((app) =>
      filterStatus === "Tất cả" ? true : app.status === filterStatus
    )
    .sort((a, b) =>
      sortOrder === "mới nhất"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date)
    );

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const displayedApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //Luwuw vi tri
  const location = useLocation();
  const handleLoginClick = () => {
    navigate("/login", { state: { from: location.pathname } });
  };
  //láy danh sách ứng tuyển
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const res = await fetch(`${import.meta.env.VITE_BACKEND}api/user/applications`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setApplications(data.applications);
        } else {
          console.error("Lỗi:", data.message);
        }
      } catch (error) {
        console.error("Lỗi kết nối:", error);
      }
    };

    fetchApplications();
  }, []);
  // Xác nhận với react-confirm-alert
  const showConfirm = (message, onConfirm) => {
    confirmAlert({
      title: "Xác nhận",
      message,
      buttons: [
        {
          label: "Đồng ý",
          onClick: onConfirm,
        },
        {
          label: "Hủy",
          onClick: () => {},
        },
      ],
    });
  };
  // Hủy ứng tuyển
  const handleCancelApplication = (jobId) => {
    showConfirm("Bạn có chắc muốn hủy đơn ứng tuyển?", async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND}api/user/cancel-application`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ jobId }),
          }
        );

        const data = await res.json();

        if (data.success) {
          confirmAlert({
            message: "Đã hủy đơn ứng tuyển thành công.",
            buttons: [{ label: "Đóng" }],
          });
          setApplications((prev) =>
            prev.map((a) =>
              a.jobId._id === jobId ? { ...a, status: "Ứng viên rút hồ sơ" } : a
            )
          );
        } else {
          confirmAlert({
            message: "Hủy không thành công: " + data.message,
            buttons: [{ label: "Đóng" }],
          });
        }
      } catch (error) {
        console.error("Lỗi hủy đơn:", error);
        confirmAlert({
          message: "Lỗi kết nối server.",
          buttons: [{ label: "Đóng" }],
        });
      }
    });
  };
  // Nhận đề nghị
  const handleAcceptOffer = (jobId) => {
    const existingJobs = applications.filter(
      (a) => a.status === "Nhận công việc" && a.jobId._id !== jobId
    );

    const message =
      existingJobs.length > 0
        ? `Bạn đã Nhận công việc ở ${existingJobs.length} công việc khác. Bạn có muốn nhận thêm không?`
        : "Bạn chắc chắn muốn nhận đề nghị và chính thức Nhận công việc?";

    showConfirm(message, async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND}api/user/accept-offer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ jobId }),
        });

        const data = await res.json();
        if (data.success) {
          confirmAlert({
            message:
              "Bạn đã nhận đề nghị và chính thức Nhận công việc thành công.",
            buttons: [{ label: "Đóng" }],
          });
          setApplications((prev) =>
            prev.map((a) =>
              a.jobId._id === jobId ? { ...a, status: "Nhận công việc" } : a
            )
          );
        } else {
          confirmAlert({
            message: "Lỗi: " + data.message,
            buttons: [{ label: "Đóng" }],
          });
        }
      } catch (error) {
        console.error("Lỗi kết nối:", error);
        confirmAlert({
          message: "Lỗi kết nối server.",
          buttons: [{ label: "Đóng" }],
        });
      }
    });
  };
  //Handle từ chối
  const handleRejectOffer = (jobId) => {
    showConfirm("Bạn chắc chắn muốn từ chối đề nghị?", async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND}api/user/reject-offer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ jobId }),
        });

        const data = await res.json();
        if (data.success) {
          confirmAlert({
            message: "Bạn đã từ chối đề nghị thành công.",
            buttons: [{ label: "Đóng" }],
          });
          setApplications((prev) =>
            prev.map((a) =>
              a.jobId._id === jobId ? { ...a, status: "Từ chối" } : a
            )
          );
        } else {
          confirmAlert({
            message: "Lỗi: " + data.message,
            buttons: [{ label: "Đóng" }],
          });
        }
      } catch (error) {
        console.error("Lỗi kết nối:", error);
        confirmAlert({
          message: "Lỗi kết nối server.",
          buttons: [{ label: "Đóng" }],
        });
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-4">
        <nav className="text-sm text-gray-600">
          <Link to="/" className="hover:text-blue-500">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <Link to="/applications" className="hover:text-blue-500">
            Tin đã ứng tuyển
          </Link>
        </nav>
      </div>
      {!token ? (
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-6 rounded-md text-center shadow-md animate-pulse mb-6">
          <p className="text-lg font-semibold mb-4">
            Bạn chưa đăng nhập! Vui lòng đăng nhập để xem tin đã ứng tuyển.
          </p>
          <button
            onClick={handleLoginClick}
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded transition duration-300"
          >
            Đăng nhập ngay
          </button>
        </div>
      ) : (
        <div className="container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10">
          {/* Bộ lọc trạng thái và sắp xếp */}
          <div className="flex flex-wrap gap-4 mb-4">
            {/* Lọc trạng thái */}
            <FormControl sx={{ minWidth: 220 }} size="small">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={filterStatus}
                label="Trạng thái"
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <MenuItem value="Tất cả">Tất cả trạng thái</MenuItem>
                <MenuItem value="Đã ứng tuyển">Đã ứng tuyển</MenuItem>
                <MenuItem value="Tiếp nhận hồ sơ">Tiếp nhận hồ sơ</MenuItem>
                <MenuItem value="Phù hợp">Phù hợp</MenuItem>
                <MenuItem value="Chưa phù hợp">Chưa phù hợp</MenuItem>
                <MenuItem value="Hẹn phỏng vấn">Hẹn phỏng vấn</MenuItem>
                <MenuItem value="Gửi đề nghị">Gửi đề nghị</MenuItem>
                <MenuItem value="Nhận đề nghị">Nhận đề nghị</MenuItem>
                <MenuItem value="Từ chối">Từ chối</MenuItem>
                <MenuItem value="Nhận công việc">Nhận công việc</MenuItem>
                <MenuItem value="Ứng viên rút hồ sơ">
                  Ứng viên rút hồ sơ
                </MenuItem>
                <MenuItem value="Hủy bởi hệ thống">Hủy bởi hệ thống</MenuItem>
              </Select>
            </FormControl>

            {/* Sắp xếp */}
            <FormControl sx={{ minWidth: 220 }} size="small">
              <InputLabel>Sắp xếp</InputLabel>
              <Select
                value={sortOrder}
                label="Sắp xếp"
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <MenuItem value="mới nhất">Mới nhất đến cũ nhất</MenuItem>
                <MenuItem value="cũ nhất">Cũ nhất đến mới nhất</MenuItem>
              </Select>
            </FormControl>
          </div>
          <h2 className="text-xl font-semibold mb-4">Tin đã ứng tuyển</h2>
          <TableContainer component={Paper} elevation={1}>
            <Table>
              {/*header*/}
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell>Tên công ty</TableCell>
                  <TableCell>Tên công việc</TableCell>
                  <TableCell>Địa điểm làm việc</TableCell>
                  <TableCell>Mức lương</TableCell>
                  <TableCell>Ngày nộp</TableCell>
                  <TableCell>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              {/*body*/}
              <TableBody>
                {displayedApplications.map((app, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:hover": { backgroundColor: "#fafafa" },
                      borderLeft:
                        app.status === "Nhận công việc"
                          ? "8px solid #22c55e"
                          : "none",
                    }}
                  >
                    {/* Tên công ty */}
                    <TableCell>
                      {app.status === "Nhận công việc" && (
                        <span style={{ color: "#22c55e", marginRight: 4 }}>
                          ⭐
                        </span>
                      )}
                      {app.companyId?.companyName || "Không tìm thấy"}
                    </TableCell>

                    {/* Tên công việc */}
                    <TableCell sx={{ maxWidth: 200 }} title={app.jobId?.title}>
                      {app.jobId?.title || "Không tìm thấy"}
                    </TableCell>

                    {/* Địa điểm làm việc */}
                    <TableCell sx={{ maxWidth: 200 }}>
                      {app.companyId?.address || "Công ty chưa cập nhật"}
                    </TableCell>

                    {/* Mức lương */}
                    <TableCell>
                      {app.jobId?.salary
                        ? app.jobId.salary.negotiable ||
                          (!app.jobId.salary.min && !app.jobId.salary.max)
                          ? "Thỏa thuận"
                          : `${app.jobId.salary.min?.toLocaleString() || 0} - ${
                              app.jobId.salary.max?.toLocaleString() || 0
                            } Triệu`
                        : "Không cập nhật"}
                    </TableCell>

                    {/* Ngày nộp */}
                    <TableCell>
                      {dayjs(app.date || app.createdAt).format("DD/MM/YYYY")}
                    </TableCell>

                    {/* Trạng thái + nút */}
                    <TableCell>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                        }}
                      >
                        {/* Trạng thái */}
                        {app.status !== "Gửi đề nghị" && (
                          <span
                            style={{
                              padding: "6px 12px",
                              borderRadius: 6,
                              fontSize: "0.8rem",
                              textAlign: "center",
                              backgroundColor:
                                app.status === "Nhận công việc"
                                  ? "#d1fae5"
                                  : app.status === "Từ chối"
                                  ? "#fee2e2"
                                  : "#fef9c3",
                              color:
                                app.status === "Nhận công việc"
                                  ? "#16a34a"
                                  : app.status === "Từ chối"
                                  ? "#dc2626"
                                  : "#ca8a04",
                            }}
                          >
                            {app.status}
                          </span>
                        )}

                        {/* Hủy ứng tuyển */}
                        {![
                          "Nhận công việc",
                          "Gửi đề nghị",
                          "Hủy bởi hệ thống",
                          "Ứng viên rút hồ sơ",
                          "Hẹn phỏng vấn",
                          "Từ chối",
                        ].includes(app.status) && (
                          <Button
                            variant="text"
                            color="error"
                            size="small"
                            onClick={() =>
                              handleCancelApplication(app.jobId._id)
                            }
                            sx={{ textTransform: "none", fontSize: "0.75rem" }}
                          >
                            Hủy ứng tuyển
                          </Button>
                        )}

                        {/* Nhận / Từ chối đề nghị */}
                        {app.status === "Gửi đề nghị" && (
                          <>
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              onClick={() => handleAcceptOffer(app.jobId._id)}
                            >
                              Nhận đề nghị
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => handleRejectOffer(app.jobId._id)}
                            >
                              Từ chối đề nghị
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {/* Khi không có ứng tuyển */}
                {applications.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography align="center" color="textSecondary" py={3}>
                        Bạn chưa ứng tuyển công việc nào.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={() => {
              navigate("/collection-jobs");
              scrollTo(0, 0);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-slate-200 hover:text-black transition mx-auto block mt-3"
          >
            Tìm việc mới
          </button>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Application;
