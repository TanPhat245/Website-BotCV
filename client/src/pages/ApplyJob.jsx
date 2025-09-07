import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import JobCard from "../components/JobCard";
import Footer from "../components/Footer";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import axios from "axios";
dayjs.extend(relativeTime);
dayjs.locale("vi");
import { toast } from "react-toastify";

const ApplyJob = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openFinalDialog, setOpenFinalDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [message, setMessage] = useState("");
  const [account, setAccount] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editedProfile, setEditedProfile] = useState({});
  const isLoggedIn = Boolean(localStorage.getItem("userToken"));
  const [isSaved, setIsSaved] = useState(false);
  const [recruitedCount, setRecruitedCount] = useState(0);
  const [appliedStatus, setAppliedStatus] = useState(null);
  const [isApplied, setIsApplied] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  useEffect(() => {
    document.title = "Thông tin việc làm | BotCV";
  }, []);
  //Luwuw vi tri
  const location = useLocation();
  const handleLoginClick = () => {
    navigate("/login", { state: { from: location.pathname } });
  };
  const token = localStorage.getItem("userToken"); // token của user
  //Kết nối api lấy job--xong
  useEffect(() => {
    const fetchJobAndRelated = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND}api/jobs/${id}`
        );
        const data = await res.json();

        if (data.success) {
          const jobData = data.job;
          setJob(jobData);
          setRecruitedCount(data.recruitedCount);
          if (jobData.recruiter?._id) {
            const res2 = await fetch(
              `${import.meta.env.VITE_BACKEND}api/jobs?recruiterId=${
                jobData.recruiter._id
              }`
            );
            const data2 = await res2.json();
            if (data2.success) {
              const otherJobs = data2.jobs.filter((j) => j._id !== id);
              setRelatedJobs(otherJobs.slice(0, 4));
            }
          }
        }
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndRelated();
  }, [id]);
  //Lấy hồ sơ--xong
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;
      try {
        const resUser = await axios.get(
          `${import.meta.env.VITE_BACKEND}api/user/user`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (resUser.data.user) {
          setAccount(resUser.data.user);
        }
        const resProfile = await axios.get(
          `${import.meta.env.VITE_BACKEND}api/user/Get-Profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (resProfile.data.user) {
          setProfile(resProfile.data.user);
          setEditedProfile(resProfile.data.user);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        setMessage(error.response?.data?.message || "Lỗi khi tải thông tin");
      }
    };
    fetchUserData();
  }, []);
  //Kết nối api Ứng tuyển--xong
  const handleApply = async () => {
    if (!token) {
      setSnackbar({
        open: true,
        message: "Vui lòng đăng nhập để ứng tuyển.",
        severity: "warning",
      });
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND}api/user/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId: job._id }),
      });

      const data = await res.json();
      setOpenFinalDialog(false);
      setSnackbar({
        open: true,
        message: data.message || "Đã ứng tuyển!",
        severity: data.success ? "success" : "error",
      });
      if (data.success) {
        if (data.data?.job) {
          setJob(data.data.job);
        }
        setIsApplied(true);
        setTimeout(() => {
          navigate("/applications");
          scrollTo(0, 0);
        }, 1500);
        window.dispatchEvent(
          new CustomEvent("update-counts", {
            detail: { type: "applied", change: 1 },
          })
        );
      }
    } catch (err) {
      console.error("Lỗi:", err);
      setSnackbar({ open: true, message: "Lỗi kết nối", severity: "error" });
    }
  };
  //handle check đăng nhập--xong
  const handleOpenConfirmDialog = () => {
    if (!isLoggedIn) {
      setSnackbar({
        open: true,
        severity: "warning",
        message: (
          <>
            Bạn cần <b>đăng nhập</b> để ứng tuyển.
            <Button
              size="small"
              variant="text"
              color="inherit"
              onClick={() => handleLoginClick("/login")}
              style={{ marginLeft: 8 }}
            >
              Đăng nhập
            </Button>
          </>
        ),
      });
      return;
    }

    setOpenConfirmDialog(true);
  };
  //API lưu tin--xong
  const handleSaveJob = async () => {
    if (!token) {
      setSnackbar({
        open: true,
        severity: "warning",
        message: (
          <>
            Bạn cần <b>đăng nhập</b> để ứng tuyển.
            <Button
              size="small"
              variant="text"
              color="inherit"
              onClick={() => handleLoginClick("/login")}
              style={{ marginLeft: 8 }}
            >
              Đăng nhập
            </Button>
          </>
        ),
      });
      return;
    }
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND}api/user/save-job`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ jobId: job._id }),
        }
      );

      const data = await res.json();

      setSnackbar({
        open: true,
        message: data.message || "Đã lưu tin!",
        severity: data.success ? "success" : "error",
      });

      if (data.success) {
        setSnackbar({
          open: true,
          severity: "success",
          message: (
            <>
              Lưu tin <b>thành công</b> ấn nút kế bên để xem.
              <Button
                size="small"
                variant="text"
                color="inherit"
                onClick={() => navigate("/saved-jobs")}
                style={{ marginLeft: 8 }}
              >
                Tin đã lưu
              </Button>
            </>
          ),
        });
        setIsSaved(true);
      }
    } catch (err) {
      console.error("Lỗi khi lưu tin:", err);
      setSnackbar({
        open: true,
        message: "Lỗi khi kết nối đến server",
        severity: "error",
      });
    }
  };
  //API check save--xong
  useEffect(() => {
    const checkIfSaved = async () => {
      if (!token || !job?._id) return;
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND}api/user/check-saved/${job._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsSaved(res.data.saved); // true / false
      } catch (err) {
        console.error("Lỗi kiểm tra tin đã lưu:", err);
      }
    };
    checkIfSaved();
  }, [job, token]);
  //API check đã ứng tuyển--xong
  useEffect(() => {
    const checkIfApplied = async () => {
      if (!token || !job?._id) return;
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND}api/user/check-applied/${job._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsApplied(res.data.applied);
        setAppliedStatus(res.data.status || "");
      } catch (err) {
        console.error("Lỗi kiểm tra đã ứng tuyển:", err);
      }
    };
    checkIfApplied();
  }, [job, token]);
  //Xử lý up hình
  const handleProfileChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "cvFile") {
      setCvFile(files[0]);
    } else {
      setEditedProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  //Xử lý lưu hồ sơ--xong
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const hasProfile =
      profile?.degree || profile?.address || profile?.cvUrl || profile?.field;
    const apiEndpoint = hasProfile
      ? `${import.meta.env.VITE_BACKEND}api/user/Update-Profile`
      : `${import.meta.env.VITE_BACKEND}api/user/Add-Profile`;

    try {
      const formData = new FormData();
      Object.entries(editedProfile).forEach(([key, value]) => {
        formData.append(key, value || "");
      });
      if (cvFile) {
        formData.append("cvFile", cvFile);
      }

      const res = await axios({
        method: hasProfile ? "put" : "post",
        url: apiEndpoint,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data.message || "Cập nhật hồ sơ thành công!");
      setProfile(res.data.user);
      setOpenEditDialog(false);
      setOpenConfirmDialog(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Cập nhật thất bại");
    }
  };
  //Loading
  if (loading) return <Loading />;
  if (!job)
    return (
      <div className="text-center text-red-500 mt-10">
        Không tìm thấy công việc
      </div>
    );
  const isExpired = job.deadline && new Date(job.deadline) < new Date();
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-10 min-h-screen flex flex-col 2xl:px-20">
        {/* Thanh điều hướng */}
        <nav className="text-sm text-gray-600 mb-9">
          <Link to="/" className="hover:text-blue-500">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <Link to="/collection-jobs" className="hover:text-blue-500">
            Tin tuyển dụng
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">
            {job.title || "Chi tiết công việc"}
          </span>
        </nav>

        {/* Nội dung công việc */}
        <div className="bg-white text-black rounded-lg w-full">
          <div className="flex justify-center md:justify-between flex-wrap gap-8 px-14 py-20 mb-6 bg-sky-50 border border-sky-400 rounded-xl">
            <div className="flex flex-col md:flex-row items-center">
              {/* Logo */}
              {job.recruiter?.logo && (
                <img
                  src={`${
                    import.meta.env.VITE_BACKEND
                  }${job.recruiter.logo.replace(/\\/g, "/")}`}
                  alt="Logo công ty"
                  className="w-10 h-10 mr-10"
                />
              )}
              <div className="text-center md:text-left text-neutral-700">
                <h1 className="text-2xl sm:text-4xl font-medium">
                  {job.title}
                </h1>
                <div className="flex flex-wrap gap-8 text-gray-800 mt-4">
                  {/* Mức lương */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3 1.343 3 3M12 4v4m0 8v4m0-4c-1.657 0-3-1.343-3-3s1.343-3 3-3"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Mức lương</div>
                      <div className="font-semibold">
                        {job.salary?.negotiable
                          ? "Thỏa thuận"
                          : `${job.salary?.min} - ${job.salary?.max} triệu`}
                      </div>
                    </div>
                  </div>
                  {/* Địa điểm */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3zm0 0v10"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Địa điểm</div>
                      <div className="font-semibold">
                        {job.provinceCode || "N/A"}
                      </div>
                    </div>
                  </div>
                  {/* Kinh nghiệm */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2v-5H3v5a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Kinh nghiệm</div>
                      <div className="font-semibold">
                        {job.experiences || "Không yêu cầu"}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Số lượng cần tuyển */}
                <p className="mt-6 text-sm text-gray-800">
                  <span className="font-semibold text-green-600">
                    Số lượng cần tuyển:
                  </span>{" "}
                  {job.slot} &nbsp; | &nbsp;
                  <span className="font-semibold text-blue-600">
                    Đã tuyển:
                  </span>{" "}
                  {recruitedCount} &nbsp; | &nbsp;
                  <span className="font-semibold text-orange-600">
                    Còn thiếu:
                  </span>{" "}
                  {Math.max(job.slot - recruitedCount, 0)}
                </p>
                {recruitedCount >= job.slot && (
                  <p className="mt-2 text-red-600 font-semibold text-sm">
                    Đã tuyển đủ số lượng
                  </p>
                )}
              </div>
            </div>
            {/* Nút Ứng tuyển và Lưu vaf deadline*/}
            <div className="flex flex-col justify-center text-end text-sm max-md:mx-auto max-md:text-center">
              {isExpired ? (
                <button
                  className="bg-gray-500 cursor-not-allowed p-2.5 font-semibold px-10 text-white rounded"
                  disabled
                >
                  Hết hạn
                </button>
              ) : recruitedCount >= job.slot ? (
                <button
                  className="bg-gray-400 cursor-not-allowed p-2.5 font-semibold px-10 text-white rounded"
                  disabled
                >
                  Đã đủ số lượng
                </button>
              ) : !isApplied ||
                ["Từ chối", "Ứng viên rút hồ sơ", "Hủy bởi hệ thống"].includes(
                  appliedStatus
                ) ? (
                <button
                  onClick={handleOpenConfirmDialog}
                  className="bg-green-500 hover:bg-red-600 p-2.5 font-semibold px-10 text-white rounded"
                >
                  Ứng tuyển
                </button>
              ) : (
                <button
                  className="bg-gray-400 cursor-not-allowed p-2.5 font-semibold px-10 text-white rounded"
                  disabled
                >
                  Đã ứng tuyển
                </button>
              )}

              <p className="mt-1 text-gray-600">
                Ngày đăng: {dayjs(job.createdAt).fromNow()}
              </p>
              {isSaved ? (
                <button
                  disabled
                  className="bg-gray-400 text-white transition-all mt-3 px-1 py-2 font-semibold rounded-md shadow-md cursor-not-allowed"
                >
                  Đã lưu
                </button>
              ) : (
                <button
                  onClick={handleSaveJob}
                  className="bg-green-500 hover:bg-red-600 transition-all mt-3 px-1 py-2 text-white font-semibold rounded-md shadow-md"
                >
                  Lưu
                </button>
              )}

              {/* Hiển thị hạn chót */}
              {job.deadline && (
                <div className="text-sm mt-3 text-red-600 font-medium">
                  Hạn chót: {new Date(job.deadline).toLocaleDateString("vi-VN")}
                </div>
              )}
            </div>
          </div>
          {/* Mô tả công việc */}
          <div className="flex flex-col lg:flex-row justify-between items-start">
            {/* Section left: Chi tiết tuyển dụng(mô tả) */}
            <div className="w-full lg:w-2/3 px-14 py-10 bg-white rounded-lg border border-gray-300">
              <h2 className="font-bold text-2xl mb-4">Chi tiết tuyển dụng</h2>
              <div
                className="rich-text"
                dangerouslySetInnerHTML={{ __html: job.description }}
              ></div>
              {/*Thời gian làm việc, địa điểm làm việc */}
              <div className="mt-10">
                {/* Địa điểm làm việc */}
                {job.address && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Địa điểm làm việc
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {job.address.split("\n").map((line, index) => (
                        <li key={index}>{line}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Thời gian làm việc */}
                {Array.isArray(job.workingHours) &&
                  job.workingHours.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Thời gian làm việc
                      </h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {job.workingHours.map((time, index) => (
                          <li key={index}>{time}</li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
              {/*ỨNG TUYỂN 2*/}
              <div className="mt-12 p-6 border rounded-xl shadow-sm bg-white max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Cách thức ứng tuyển
                </h3>
                <p className="text-gray-600">
                  Ứng viên nộp hồ sơ trực tuyến bằng cách bấm{" "}
                  <b className="text-gray-800">Ứng tuyển</b> ngay dưới đây.
                </p>
                <button
                  onClick={handleOpenConfirmDialog}
                  className="bg-green-500 hover:bg-green-600 transition-all mt-6 px-8 py-2.5 text-white font-semibold rounded-md shadow-md"
                >
                  Ứng tuyển
                </button>
              </div>
            </div>
            {/* Section right: Các việc khác cùng công ty */}
            <div className="w-full lg:w-1/3 mt-8 lg:mt-0 lg:ml-8 space-y-5">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
                Thêm việc làm từ{" "}
                <span
                  onClick={() => navigate(`/company-info/${job.recruiter._id}`)}
                  className="text-red-600 cursor-pointer italic"
                >
                  {job.recruiter?.companyName || "nhà tuyển dụng"}
                </span>
              </h2>
              {relatedJobs.length === 0 ? (
                <p className="text-gray-500">Không có công việc nào khác.</p>
              ) : (
                relatedJobs.map((relatedJob) => (
                  <JobCard key={relatedJob._id} job={relatedJob} />
                ))
              )}
            </div>
            {/* Hộp thoại xác nhận thông tin ứng tuyển */}
            <Dialog
              open={openConfirmDialog}
              onClose={() => setOpenConfirmDialog(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>
                <Typography variant="h5" className="font-bold text-blue-600">
                  Xác nhận ứng tuyển
                </Typography>
              </DialogTitle>

              <DialogContent dividers>
                <Typography variant="body1" className="mb-2">
                  Bạn có chắc chắn muốn ứng tuyển công việc <b>{job.title}</b>{" "}
                  không?
                </Typography>
                <Typography variant="body2" className="text-gray-600 mb-4">
                  Vui lòng kiểm tra lại thông tin hồ sơ của bạn trước khi gửi.
                </Typography>

                <div className="bg-gray-50 rounded-lg p-4 border">
                  <Typography
                    variant="subtitle1"
                    className="font-semibold text-gray-700 mb-2"
                  >
                    Hồ sơ của bạn:
                  </Typography>
                  <ul className="space-y-1 text-sm text-gray-800 pl-4 list-disc">
                    <li>
                      <b>Tên:</b> {profile?.name || "Chưa cập nhật"}
                    </li>
                    <li>
                      <b>Email:</b> {account?.email || "Chưa cập nhật email"}
                    </li>
                    <li>
                      <b>SĐT:</b> {profile?.phone || "Chưa cập nhật"}
                    </li>
                    <li>
                      <b>Bằng cấp:</b> {profile?.degree || "Chưa cập nhật"}
                    </li>
                    <li>
                      <b>Ngành nghề:</b> {profile?.field || "Chưa cập nhật"}
                    </li>
                    <li>
                      <b>Trình độ:</b> {profile?.level || "Chưa cập nhật"}
                    </li>
                    <li>
                      <b>Địa chỉ:</b> {profile?.address || "Chưa cập nhật"}
                    </li>
                    <li>
                      <b>CV:</b>{" "}
                      {profile && profile.cvUrl ? (
                        profile.cvUrl.endsWith(".pdf") ? (
                          <a
                            href={profile.cvUrl}
                            className="text-blue-500 underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Xem CV (PDF)
                          </a>
                        ) : (
                          <img
                            src={`http://localhost:5000${profile.cvUrl}`}
                            alt="Hình ảnh CV"
                            className="mt-2 rounded shadow max-h-64"
                          />
                        )
                      ) : (
                        "Chưa có"
                      )}
                    </li>
                  </ul>
                </div>
              </DialogContent>

              <DialogActions className="flex justify-between px-4 py-3">
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setOpenConfirmDialog(false);
                    setOpenEditDialog(true);
                  }}
                >
                  Chỉnh sửa hồ sơ
                </Button>

                <div>
                  <Button
                    onClick={() => setOpenConfirmDialog(false)}
                    className="mr-2"
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={() => {
                      setOpenConfirmDialog(false);
                      setOpenFinalDialog(true);
                    }}
                    variant="contained"
                    color="primary"
                  >
                    Ứng tuyển
                  </Button>
                </div>
              </DialogActions>
            </Dialog>
            {/* Hộp thoại xác nhận cuối cùng */}
            <Dialog
              open={openFinalDialog}
              onClose={() => setOpenFinalDialog(false)}
            >
              <DialogTitle>Xác nhận cuối cùng</DialogTitle>
              <DialogContent>
                <Typography>Bạn chắc chắn muốn gửi hồ sơ đi?</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenFinalDialog(false)}>Hủy</Button>
                <Button
                  onClick={handleApply}
                  variant="contained"
                  color="success"
                >
                  Gửi hồ sơ
                </Button>
              </DialogActions>
            </Dialog>
            {/*Hộp thoại chỉnh sửa hồ sơ */}
            <Dialog
              open={openEditDialog}
              onClose={() => setOpenEditDialog(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Chỉnh sửa hồ sơ</DialogTitle>
              <DialogContent dividers>
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <FormControl fullWidth>
                    <InputLabel id="degree-label">Bằng cấp</InputLabel>
                    <Select
                      labelId="degree-label"
                      name="degree"
                      value={editedProfile.degree || ""}
                      onChange={handleProfileChange}
                      label="Bằng cấp"
                    >
                      <MenuItem value="">-- Chọn bằng cấp --</MenuItem>
                      <MenuItem value="Trung học">Trung học</MenuItem>
                      <MenuItem value="Phổ thông">Phổ thông</MenuItem>
                      <MenuItem value="Cử nhân">Cử nhân</MenuItem>
                      <MenuItem value="Kỹ sư">Kỹ sư</MenuItem>
                      <MenuItem value="Thạc sĩ">Thạc sĩ</MenuItem>
                      <MenuItem value="Tiến sĩ">Tiến sĩ</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    label="Ngành nghề"
                    name="field"
                    fullWidth
                    value={editedProfile.field || ""}
                    onChange={handleProfileChange}
                  />
                  <TextField
                    label="Trình độ"
                    name="level"
                    fullWidth
                    value={editedProfile.level || ""}
                    onChange={handleProfileChange}
                  />
                  <TextField
                    label="Địa chỉ"
                    name="address"
                    fullWidth
                    value={editedProfile.address || ""}
                    onChange={handleProfileChange}
                  />
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Tải lên CV (PDF/Hình ảnh)
                    </label>
                    <input
                      type="file"
                      name="cvFile"
                      accept="application/pdf,image/*"
                      onChange={handleProfileChange}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                    <Button
                      onClick={() => setOpenEditDialog(false)}
                      variant="outlined"
                      color="secondary"
                    >
                      Hủy
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                      Lưu hồ sơ
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            {/* Snackbar hiển thị thông báo */}
            <Snackbar
              open={snackbar.open}
              autoHideDuration={4000}
              onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
              <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
                {snackbar.message}
              </Alert>
            </Snackbar>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ApplyJob;
