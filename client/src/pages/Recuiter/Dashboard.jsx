import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import NotificationBell from "../../components/NotificationBell";
import axios from "axios";
import { LuPackage } from "react-icons/lu";
import { toast } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isJobOpen, setIsJobOpen] = useState(false);
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isapplicationOpen, setIsApplicationOpen] = useState(false);
  const [isPackageOpen, setIsPackageOpen] = useState(false);
  const token = localStorage.getItem("companyToken");
  const [companyInfo, setCompanyInfo] = useState({});
  const dummyNotifications = [
    { message: "Bạn có 1 ứng viên mới ứng tuyển", read: false },
    { message: "Tin tuyển dụng của bạn sắp hết hạn", read: true },
  ];

  const handleLogout = () => {
    localStorage.removeItem("companyToken");
    navigate("/");
    toast.success("Đăng xuất thành công!");
  };
  // Gọi API để lấy thoiong tin công ty
  //Thêm ở dashboard Gói đăng tin, DashboardHome thì 1 carh hiển thị tên gói tin và còn nhiêu ngày nữa hết hạn
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND}api/recruiter/my-info`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        setCompanyInfo(res.data.recruiter);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin công ty:", error);
      }
    };
    fetchCompanyInfo();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Navbar nhà tuyển dụng */}
      <div className="shadow py-4 border bg-white z-40 relative">
        <div className="px-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Nút mở sidebar trên mobile */}
            <button
              className="sm:hidden block text-2xl"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              ☰
            </button>
            <img
              onClick={() => navigate("/")}
              className="h-10 max-sm:w-32 cursor-pointer"
              src={assets.logonew}
              alt="logo"
            />
          </div>
          {/* Điều hướng Dashboard*/}
          <div className="hidden sm:flex flex-1 justify-center items-center gap-6">
            <button
              onClick={() => navigate("/dashboard/manage-jobs")}
              className="text-base font-semibold text-gray-700 hover:text-blue-600"
            >
              Tin đăng
            </button>
            <button
              onClick={() => navigate("/dashboard/view-applications")}
              className="text-base font-semibold text-gray-700 hover:text-blue-600"
            >
              Ứng viên
            </button>
            <button
              onClick={() => navigate("/dashboard/info-company")}
              className="text-base font-semibold text-gray-700 hover:text-blue-600"
            >
              Hồ sơ công ty
            </button>
          </div>
          {/*Thông báo <NotificationBell notifications={dummyNotifications} />*/}
          <div className="flex items-center gap-3">
            <p className="max-sm:hidden">Xin chào</p><b>{companyInfo.companyName}</b>
            <div className="relative group">
              {companyInfo.logo && (
                <img
                  src={`${import.meta.env.VITE_BACKEND}${companyInfo.logo.replace(
                    /\\/g,
                    "/"
                  )}`}
                  alt="Logo công ty"
                  className="w-6 h-6 mr-2 rounded-full object-cover"
                />
              )}
              <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12">
                <ul className="list-none m-0 p-2 bg-white rounded-md border text-sm">
                  <li
                    className="py-1 px-3 cursor-pointer whitespace-nowrap hover:text-red-500 rounded"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </li>
                  <li className="py-1 px-3 cursor-pointer whitespace-nowrap hover:text-red-500 rounded">
                    Thông tin
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="flex items-start relative">
        {/* Sidebar left */}
        <aside
          className={`fixed sm:static top-0 left-0 h-full bg-white shadow-lg border-r w-64 z-50 transform transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } sm:translate-x-0`}
        >
          <div className="p-5">
            <h2
              onClick={() => navigate("/dashboard")}
              className="text-xl font-semibold mb-6 text-gray-800 cursor-pointer"
            >
              Bảng điều khiển
            </h2>
            <ul className="space-y-3">
              {/* Tài khoản */}
              <li>
                <div
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  className="flex items-center border-2 justify-between p-3 rounded-lg hover:bg-green-300 hover:border-green-500 cursor-pointer transition"
                >
                  <span className="flex items-center text-gray-700">
                    <img
                      src={assets.person_tick_icon}
                      alt="Account"
                      className="w-5 h-5 mr-2"
                    />
                    Tài khoản
                  </span>
                  <span>
                    {isAccountOpen ? <IoChevronDown /> : <IoChevronUp />}
                  </span>
                </div>
                {isAccountOpen && (
                  <ul className="border ml-6 mt-2 space-y-1 transition-all duration-300">
                    <li>
                      <NavLink
                        to="/dashboard/info-account"
                        className="block p-2 rounded hover:bg-gray-100 text-sm text-gray-600"
                      >
                        Xem thông tin
                      </NavLink>
                      <NavLink
                        to="/dashboard/verify"
                        className="block p-2 rounded hover:bg-gray-100 text-sm text-gray-600"
                      >
                        Xác minh tài khoản
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>

              {/* Tin tuyển dụng */}
              <li>
                <div
                  onClick={() => setIsJobOpen(!isJobOpen)}
                  className="flex items-center border-2 justify-between p-3 rounded-lg hover:bg-green-300 hover:border-green-500 cursor-pointer transition"
                >
                  <span className="flex items-center text-gray-700">
                    <img
                      src={assets.home_icon}
                      alt="Jobs"
                      className="w-5 h-5 mr-2"
                    />
                    Tin tuyển dụng
                  </span>
                  <span>{isJobOpen ? <IoChevronDown /> : <IoChevronUp />}</span>
                </div>
                {isJobOpen && (
                  <ul className="border ml-6 mt-2 space-y-1 transition-all duration-300">
                    <li>
                      <NavLink
                        to="/dashboard/add-job"
                        className="block p-2 rounded hover:bg-gray-100 text-sm text-gray-600"
                      >
                        Đăng tin mới
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/dashboard/manage-jobs"
                        className="block p-2 rounded hover:bg-gray-100 text-sm text-gray-600"
                      >
                        Quản lý tin đăng
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>

              {/* Công ty */}
              <li>
                <div
                  onClick={() => setIsCompanyOpen(!isCompanyOpen)}
                  className="border-2 flex items-center justify-between p-3 rounded-lg hover:bg-green-300 hover:border-green-500 cursor-pointer transition"
                >
                  <span className="flex items-center text-gray-700">
                    {companyInfo.logo && (
                      <img
                        src={`${import.meta.env.VITE_BACKEND}${companyInfo.logo.replace(
                          /\\/g,
                          "/"
                        )}`}
                        alt="Logo công ty"
                        className="w-6 h-6 mr-2 rounded-full object-cover"
                      />
                    )}
                    Công ty
                  </span>
                  <span>
                    {isCompanyOpen ? <IoChevronDown /> : <IoChevronUp />}
                  </span>
                </div>
                {isCompanyOpen && (
                  <ul className="border ml-6 mt-2 space-y-1 transition-all duration-300">
                    <li>
                      <NavLink
                        to="/dashboard/info-company"
                        className="block p-2 rounded hover:bg-gray-100 text-sm text-gray-600"
                      >
                        Hồ sơ công ty
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/dashboard/add-info-company"
                        className="block p-2 rounded hover:bg-gray-100 text-sm text-gray-600"
                      >
                        Thêm hồ sơ công ty
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>

              {/* Quản lý ứng viên */}
              <li>
                <div
                  onClick={() => setIsApplicationOpen(!isapplicationOpen)}
                  className="border-2 flex items-center justify-between p-3 rounded-lg hover:bg-green-300 hover:border-green-500 cursor-pointer transition"
                >
                  <span className="flex items-center text-gray-700">
                    <FaRegUser className="w-5 h-5 mr-2" />
                    Quản lý ứng viên
                  </span>
                  <span>
                    {isapplicationOpen ? <IoChevronDown /> : <IoChevronUp />}
                  </span>
                </div>
                {isapplicationOpen && (
                  <ul className="border ml-6 mt-2 space-y-1 transition-all duration-300">
                    <li>
                      <NavLink
                        to="/dashboard/view-applications"
                        className="block p-2 rounded hover:bg-gray-100 text-sm text-gray-600"
                      >
                        Danh sách ứng viên
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>

              {/*Dk goi dang tin
              <li>
                <div
                  onClick={() => setIsPackageOpen(!isPackageOpen)}
                  className="border-2 flex items-center justify-between p-3 rounded-lg hover:bg-green-300 hover:border-green-500 cursor-pointer transition"
                >
                  <span className="flex items-center text-gray-700">
                    <LuPackage className="w-5 h-5 mr-2" />
                    Quản lý gói tin
                  </span>
                  <span>
                    {isPackageOpen ? <IoChevronDown /> : <IoChevronUp />}
                  </span>
                </div>
                {isPackageOpen && (
                  <ul className="border ml-6 mt-2 space-y-1 transition-all duration-300">
                    <li>
                      <NavLink
                        to="/dashboard/regis-package"
                        className="block p-2 rounded hover:bg-gray-100 text-sm text-gray-600"
                      >
                        Đăng ký gói tin
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/dashboard/list-package"
                        className="block p-2 rounded hover:bg-gray-100 text-sm text-gray-600"
                      >
                        Thông tin các gói tin
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/dashboard/info-package"
                        className="block p-2 rounded hover:bg-gray-100 text-sm text-gray-600"
                      >
                        Gói đăng tin của bạn
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li> */}
              
            </ul>
          </div>
        </aside>

        {/* Overlay che khi sidebar mở (mobile) */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40 sm:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Main content */}
        <main className="flex-1 p-6 bg-gray-50 min-h-screen sm:ml-0 mb-16 sm:mb-0">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
