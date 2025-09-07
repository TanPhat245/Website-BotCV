import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
dayjs.extend(relativeTime);
dayjs.locale("vi");
import { Box, Typography, Chip, Button, Tooltip } from "@mui/material";

const SaveJob = () => {
  const [jobs, setJobs] = useState([]);
  //TITTLE
  useEffect(() => {
    document.title = "Việc làm đã lưu | BotCV";
  }, []);
  //Hàm Lưu vị trí gia truyền
  const navigate = useNavigate();
  const location = useLocation();
  const handleLoginClick = () => {
    navigate("/login", { state: { from: location.pathname } });
  };
  const token = localStorage.getItem("userToken");

  //Gọi API lấy danh sách việc làm đã lưu
  const fetchSavedJobs = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND}api/user/saved-jobs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        setJobs(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  //Xóa tin đã lưu
  const handleRemove = async (savedJobId) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND}api/user/saved-job/${savedJobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Đã xoá tin đã lưu.");
        setJobs((prev) => prev.filter((job) => job.savedJobId !== savedJobId));
      }
    } catch (err) {
      console.error(err);
      toast.error("Xoá tin đã lưu thất bại.");
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <nav className="text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-blue-500">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <Link to="/handbook" className="hover:text-blue-500">
            Cẩm nang nghề nghiệp
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">Việc làm đã lưu</span>
        </nav>

        {!token ? (
          <div className="bg-yellow-100 border border-red-300 text-yellow-800 p-6 rounded-md text-center shadow-md animate-pulse mb-6">
            <p className="text-lg font-semibold mb-4">
              Bạn chưa đăng nhập! Vui lòng đăng nhập để xem tin đã lưu.
            </p>
            <button
              onClick={handleLoginClick}
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded transition duration-300"
            >
              Đăng nhập ngay
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-semibold mb-4">Việc làm đã lưu</h1>
            {jobs.length === 0 ? (
              <p className="text-gray-600">Bạn chưa lưu việc làm nào.</p>
            ) : (
              <ul className="space-y-4">
                {jobs.map((job) => (
                  <li
                    key={job.savedJobId}
                    className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
                  >
                    <div className="flex items-center">
                      {/* Logo */}
                      {job.logo && (
                        <img
                          src={`${
                            import.meta.env.VITE_BACKEND
                          }${job.logo.replace(/\\/g, "/")}`}
                          alt="Logo công ty"
                          className="w-6 h-6 mr-2 rounded-full object-cover"
                        />
                      )}
                      {/* Nội dung hiển thị thông tin công việc đã lưu */}
                      <Box>
                        {/* Link đến trang chi tiết công việc */}
                        <Link
                          to={`/apply-job/${job.jobId}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <Typography
                            variant="h6"
                            fontWeight={500}
                            sx={{ "&:hover": { color: "primary.main" } }}
                          >
                            {job.title}
                          </Typography>
                        </Link>
                        {/* Hiển thị tên công ty và địa điểm */}
                        <Typography variant="body2" color="text.secondary">
                          {job.companyName} • {job.provinceCode}, {job.district}
                        </Typography>

                        {/* Thông tin phụ: lương và ngày lưu */}
                        <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
                          {/* Mức lương */}
                          <Chip
                            label={
                              job.salary?.negotiable
                                ? "Thỏa thuận"
                                : `${job.salary.min} - ${job.salary.max} triệu`
                            }
                            sx={{
                              backgroundColor: "green.100",
                              color: "green.700",
                              fontWeight: 500,
                            }}
                          />
                          {/* Ngày lưu */}
                          <Chip
                            label={`Ngày lưu: ${dayjs(job.savedAt).fromNow()}`}
                            sx={{
                              backgroundColor: "blue.100",
                              color: "blue.700",
                              fontWeight: 500,
                            }}
                          />
                        </Box>
                      </Box>
                    </div>
                    {/* Nút xóa khỏi danh sách đã lưu */}
                    <Tooltip title="Xóa khỏi danh sách đã lưu">
                      <Button
                        onClick={() => handleRemove(job.savedJobId)}
                        variant="text"
                        color="error"
                        sx={{
                          textTransform: "none",
                          fontWeight: 500,
                          "&:hover": { color: "error.dark" },
                        }}
                      >
                        Bỏ lưu
                      </Button>
                    </Tooltip>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SaveJob;
