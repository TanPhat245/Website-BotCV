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
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isPackageOpen, setIsPackageOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const dummyNotifications = [
    { message: "Bạn có 1 ứng viên mới ứng tuyển", read: false },
    { message: "Tin tuyển dụng của bạn sắp hết hạn", read: true },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
    toast.success("Đăng xuất thành công!");
  };

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

          <div className="flex items-center gap-3">
            <NotificationBell notifications={dummyNotifications} />
            <p className="max-sm:hidden">Xin chào người quản trị</p>
            <ul className="list-none m-0 p-2 bg-white rounded-md border text-sm">
              <li
                className="py-1 px-3 cursor-pointer whitespace-nowrap hover:text-red-500 rounded"
                onClick={handleLogout}
              >
                Đăng xuất
              </li>
            </ul>
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
              onClick={() => navigate("/dashboard-admin")}
              className="text-xl font-semibold mb-6 text-gray-800 cursor-pointer"
            >
              Bảng điều khiển
            </h2>
            <ul className="space-y-3">
              {/* Quản lý người dùng */}
              <li>
                <div
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  className="flex items-center border-2 justify-between p-3 rounded-lg hover:bg-green-300 hover:border-green-500 cursor-pointer transition"
                >
                  <span className="flex items-center text-sm text-gray-700">
                    <img
                      src={assets.person_tick_icon}
                      alt="Account"
                      className="w-5 h-5 mr-2"
                    />
                    Quản lý người dùng
                  </span>
                  <span>
                    {isAccountOpen ? <IoChevronDown /> : <IoChevronUp />}
                  </span>
                </div>
                {isAccountOpen && (
                  <ul className="border ml-6 mt-2 space-y-1 transition-all duration-300">
                    <li>
                      <NavLink
                        to="/dashboard-admin/list-account"
                        className="block p-2 rounded hover:bg-gray-100 text-sm text-gray-600"
                      >
                        Danh sách người dùng
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>

              {/* Quản lý đơn ứng tuyển */}
              <li>
                <div
                  onClick={() => setIsApplyOpen(!isApplyOpen)}
                  className="flex items-center border-2 justify-between p-3 rounded-lg hover:bg-green-300 hover:border-green-500 cursor-pointer transition"
                >
                  <span className="flex items-center text-sm text-gray-700">
                    <img
                      src={assets.home_icon}
                      alt="Jobs"
                      className="w-5 h-5 mr-2"
                    />
                    Quản lý ứng tuyển
                  </span>
                  <span>{isApplyOpen ? <IoChevronDown /> : <IoChevronUp />}</span>
                </div>
                {isApplyOpen && (
                  <ul className="border ml-6 mt-2 space-y-1 transition-all duration-300">
                    <li>
                      <NavLink
                        to="/dashboard-admin/list-apply"
                        className="block p-2 rounded hover:bg-gray-100 text-sm text-gray-600"
                      >
                        Danh sách ứng tuyển
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>

              {/* Quản lý đăng ký mua tin */}
              <li>
                <div
                  onClick={() => setIsPackageOpen(!isPackageOpen)}
                  className="border-2 flex items-center justify-between p-3 rounded-lg hover:bg-green-300 hover:border-green-500 cursor-pointer transition"
                >
                  <span className="flex items-center text-sm text-gray-700">
                    <img
                      src={assets.home_icon}
                      alt="Jobs"
                      className="w-5 h-5 mr-2"
                    />
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
                        to="/dashboard-admin/list-package"
                        className="block p-2 rounded hover:bg-gray-100 text-sm text-gray-600"
                      >
                        Danh sách gói tin
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/dashboard-admin/list-package"
                        className="block p-2 rounded hover:bg-gray-100 text-sm text-gray-600"
                      >
                        Doanh thu
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>

              {/* Quản lý ngành nghề */}
              <li>
                <div
                  onClick={() => setIsIndustryOpen(!isIndustryOpen)}
                  className="border-2 flex items-center justify-between p-3 rounded-lg hover:bg-green-300 hover:border-green-500 cursor-pointer transition"
                >
                  <span className="flex text-sm items-center text-gray-700">
                    <FaRegUser className="w-5 h-5 mr-2" />
                    Quản lý ngành nghề
                  </span>
                  <span>
                    {isIndustryOpen ? <IoChevronDown /> : <IoChevronUp />}
                  </span>
                </div>
                {isIndustryOpen && (
                  <ul className="border ml-6 mt-2 space-y-1 transition-all duration-300">
                    <li>
                      <NavLink
                        to="/dashboard-admin/list-industry"
                        className="block p-2 rounded hover:bg-gray-100 text-sm text-gray-600"
                      >
                        Danh sách ngành nghề
                      </NavLink>
                     <NavLink
                        to="/dashboard-admin/add-industry"
                        className="block p-2 rounded hover:bg-gray-100 text-sm text-gray-600"
                      >
                        Thêm ngành nghề
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
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
