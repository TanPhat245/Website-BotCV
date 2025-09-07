import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
const CompanyInfo = () => {
  const { id } = useParams();
  const [provinces, setProvinces] = useState([]);
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchProvince, setSearchProvince] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const token = localStorage.getItem("userToken");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  //Title
  useEffect(() => {
    document.title = "Thông tin công ty | BotCV";
  }, []);
  //Kiểm tra trạng thái theo dõi
  const checkFollowStatus = async () => {
    try {
      if (!token || !id) return;
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND}api/user/check-follow/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsFollowing(res.data.isFollowing);
      setFollowersCount(res.data.followersCount);
    } catch (err) {
      console.error("Lỗi khi kiểm tra trạng thái theo dõi:", err);
    }
  };
  //Theo dõi
  const handleFollow = async () => {
    try {
      if (!token || !id) return;
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND}api/user/follow-recruiter/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsFollowing(!isFollowing);
      setFollowersCount(res.data.followersCount);
    } catch (err) {
      console.error("Lỗi khi theo dõi/bỏ theo dõi:", err);
    }
  };
  //Hàm lấy thông tin công ty theo ID
  useEffect(() => {
    //Hàm lấy thông tin công ty
    const fetchCompany = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND}api/recruiter/${id}`
        );
        setCompany(res.data.recruiter);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin công ty:", err);
      }
    };
    //Hàm lấy danh sách tỉnh/thành phố
    const fetchProvinces = async () => {
      try {
        const res = await axios.get("https://provinces.open-api.vn/api/p/");
        const data = res.data.map((item) =>
          item.name.replace("Tỉnh ", "").replace("Thành phố ", "")
        );
        setProvinces(data);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách tỉnh/thành phố:", err);
      }
    };
    //Fetch danh sách công việc của công ty
    const fetchJobs = async () => {
      try {
        setLoadingJobs(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND}api/recruiter/job-recruiter/${id}`
        );
        setJobs(res.data.jobs);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách job:", err);
      } finally {
        setLoadingJobs(false);
      }
    };
    if (id) fetchJobs();
    if (token) {
      checkFollowStatus();
    }
    fetchCompany();
    fetchProvinces();
  }, [id]);
  //Tim kiếm
  const handleSearch = async () => {
    if (!id) return;
    setSearchLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND}api/recruiter/recruiter/${id}/search`,
        { params: { keyword: searchKeyword, province: searchProvince } }
      );
      setJobs(res.data.jobs);
    } catch (e) {
      console.error(e);
    } finally {
      setSearchLoading(false);
    }
  };
  //loading
  if (!company) {
    return (
      <div className="text-center py-10">Đang tải thông tin công ty...</div>
    );
  }

  return (
    <div className="bg-[#f7f7f7] min-h-screen font-sans">
      <Navbar />

      {/* Header */}
      <div className="bg-[#f7f7f7] py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gradient-to-r from-[#4caf50] to-[#81c784] w-full flex flex-col md:flex-row items-center gap-4 px-4 py-4 rounded-xl shadow">
            <div className="bg-white p-2 rounded-full">
              {company && (
                <img
                  src={`${import.meta.env.VITE_BACKEND}${company.logo.replace(
                    /\\/g,
                    "/"
                  )}`}
                  alt="logo"
                  className="w-20 h-20 rounded-full object-cover"
                />
              )}
            </div>

            <div className="text-white flex-1">
              <h1 className="text-xl md:text-2xl font-bold mb-2 truncate">
                {company.companyName}
              </h1>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="flex items-center gap-1">
                  🌐{" "}
                  <a
                    href={company.website}
                    className="underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {company.website ? company.website : "Chưa cập nhật"}
                  </a>
                </span>
                <span>📧 {company.email}</span>
                <span>📞 {company.phone}</span>
              </div>

              {/* Thông tin bổ sung */}
              <div className="flex flex-wrap gap-2 text-sm mt-2">
                <span>
                  👥 {company.employees ? company.employees : "Chưa cập nhật"}{" "}
                  nhân viên
                </span>
                <span>❤️ {followersCount ?? "Chưa có"} người theo dõi</span>
              </div>
            </div>

            <button
              onClick={handleFollow}
              className="mt-4 md:mt-0 px-4 py-2 bg-white text-green-600 rounded hover:bg-gray-100 text-sm"
            >
              {isFollowing ? "Bỏ theo dõi" : "+ Theo dõi"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* Left Column */}
        <div className="md:w-2/3 w-full space-y-6">
          {/* Giới thiệu công ty */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-2">Giới thiệu công ty</h2>
            <p className="text-gray-700 leading-relaxed">
              {company.description}
            </p>
            <p className="text-gray-700 mt-2">📍 {company.address}</p>
          </div>

          {/* Tin tuyển dụng */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Tuyển dụng</h2>

            {/* Tìm kiếm */}
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <input
                type="text"
                placeholder="Tên công việc..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="border px-3 py-2 flex-1 rounded text-sm"
              />
              <select
                className="border px-2 py-2 text-sm rounded"
                value={searchProvince}
                onChange={(e) => setSearchProvince(e.target.value)}
              >
                <option value="">Tất cả tỉnh/thành phố</option>
                {provinces.map((province, i) => (
                  <option key={i} value={province}>
                    {province}
                  </option>
                ))}
              </select>
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              >
                {searchLoading ? "Đang tìm..." : "Tìm kiếm"}
              </button>
            </div>

            {/* Danh sách job */}
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="border rounded p-4 hover:shadow flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={`${
                        import.meta.env.VITE_BACKEND
                      }${company.logo.replace(/\\/g, "/")}`}
                      alt="logo"
                      className="w-14 h-14 rounded"
                    />
                    <div>
                      <h3 className="font-semibold text-green-700 text-base md:text-lg leading-snug hover:underline cursor-pointer truncate max-w-[250px] md:max-w-[350px]">
                        {job.title}
                      </h3>
                      <p className="text-gray-700 text-sm truncate max-w-[200px] md:max-w-[300px]">
                        {company.companyName}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2 text-xs">
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {job.provinceCode}
                        </span>
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          Còn {dayjs(job.deadline).diff(dayjs(), "day")} ngày để
                          ứng tuyển
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start md:items-end mt-4 md:mt-0">
                    {job.salary && (
                      <span className="text-green-700 font-semibold mb-2">
                        {" "}
                        {job.salary?.negotiable
                          ? "Thỏa thuận"
                          : `${job.salary.min} - ${job.salary.max} triệu`}{" "}
                      </span>
                    )}

                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                        Ứng tuyển
                      </button>
                      <button className="rounded p-2 text-gray-500 hover:text-red-600">
                        ♡
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="md:w-1/3 w-full space-y-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Thông tin liên hệ</h2>
            <p className="text-gray-700 text-sm">{company.address}</p>
            <div className="w-full h-48 mt-4">
              <iframe
                title="Bản đồ công ty"
                className="w-full h-full rounded"
                frameBorder="0"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  company.address
                )}&output=embed`}
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CompanyInfo;
