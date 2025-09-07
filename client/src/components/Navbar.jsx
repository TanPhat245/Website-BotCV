import React, { useState } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import NotificationBell from "./NotificationBell";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { FiUser } from "react-icons/fi";
// ToolsDropdown Component
const ToolsDropdown = ({ isMobile, onLinkClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={isMobile ? "flex flex-col" : "relative"}
      onMouseEnter={() => !isMobile && setIsOpen(true)}
      onMouseLeave={() => !isMobile && setIsOpen(false)}
    >
      <h1
        className="text-gray-700 font-medium cursor-pointer hover:text-blue-500 transition"
        onClick={() => isMobile && setIsOpen(!isOpen)}
      >
        Công cụ
      </h1>
      {isOpen && (
        <div
          className={
            isMobile
              ? "ml-4 flex gap-2"
              : "absolute top-full left-0 bg-white shadow-md rounded-md py-2 min-w-[220px] whitespace-nowrap z-50"
          }
        >
          <div
            onClick={() => {
              onLinkClick("/info");
              scrollTo(0, 0);
            }}
            className="block px-4 py-2 hover:bg-green-300 cursor-pointer"
          >
            Hồ sơ
          </div>
          <div
            onClick={() => {
              onLinkClick("/saved-jobs");
              scrollTo(0, 0);
            }}
            className="block px-4 py-2 hover:bg-green-300 cursor-pointer"
          >
            Tin đã lưu
          </div>
          <div
            onClick={() => {
              onLinkClick("/applications");
              scrollTo(0, 0);
            }}
            className="block px-4 py-2 hover:bg-green-300 cursor-pointer"
          >
            Tin đã ứng tuyển
          </div>
        </div>
      )}
    </div>
  );
};

// NavLinks Component
const NavLinks = ({ isMobile, setIsMenuOpen }) => {
  const navigate = useNavigate();

  const handleLinkClick = (path) => {
    navigate(path);
    if (isMobile) setIsMenuOpen(false);
  };

  return (
    <div className={isMobile ? "flex flex-col gap-4" : "flex gap-6"}>
      <h1
        onClick={() => {
          handleLinkClick("/collection-jobs");
          scrollTo(0, 0);
        }}
        className="text-gray-700 font-medium cursor-pointer hover:text-blue-500 transition"
      >
        Cơ hội việc làm
      </h1>
      <h1
        onClick={() => {
          handleLinkClick("/handbook");
          scrollTo(0, 0);
        }}
        className="text-gray-700 font-medium cursor-pointer hover:text-blue-500 transition"
      >
        Cẩm nang nghề nghiệp
      </h1>
      <ToolsDropdown isMobile={isMobile} onLinkClick={handleLinkClick} />
    </div>
  );
};

//Navbar Component
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("userToken");
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  //Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userToken");
    navigate("/");
    window.location.href = "/";
    toast.success("Đăng xuất thành công!");
  };
  //API thông báo
  const fetchNotifications = async () => {
    if (!user || !user.id) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND}api/user/notify-user/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(res.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy thông báo:", error);
    }
  };
  //Socket nhận thông báo realtime
  useEffect(() => {
    if (user && user.id) {
      fetchNotifications();
      // Khởi tạo socket
      const newSocket = io("http://localhost:5000");
      setSocket(newSocket);

      // Đăng ký user khi socket kết nối
      newSocket.emit("registerUser", user.id);

      // Lắng nghe sự kiện newNotification
      newSocket.on("newNotification", (notification) => {
        console.log("Nhận thông báo realtime:", notification);
        fetchNotifications();
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, []);

  return (
    <div className="shadow py-4 sticky top-0 bg-white z-50">
      <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
        {/* Logo */}
        <img
          onClick={() => {
            navigate("/");
            scrollTo(0, 0);
          }}
          className="cursor-pointer h-8 sm:h-10"
          src={assets.logonew}
          alt="logo"
        />

        {/* Navbar déktop */}
        <div className="hidden sm:flex">
          <NavLinks isMobile={false} setIsMenuOpen={setIsMenuOpen} />
        </div>

        {/* Menu */}
        <button
          className="sm:hidden text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <HiX /> : <HiMenu />}
        </button>

        {/* Thông tin user */}
        <div className="hidden sm:flex items-center gap-4 text-sm">
          {user ? (
            <div className="flex items-center gap-4">
              <NotificationBell
                notifications={notifications}
                fetchNotifications={fetchNotifications}
              />
              {/*Thông tin user sau khi login*/}
              <div className="relative group">
                {/*icon user */}
                <div className="w-9 h-9 flex items-center justify-center rounded-full border cursor-pointer bg-gray-100">
                  <FiUser className="w-5 h-5 text-gray-600" />
                </div>

                {/* Dropdown */}
                <div className="absolute right-0 top-10 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 bg-white shadow-lg rounded w-44 z-50">
                  <div className="px-4 py-2 text-sm text-gray-800 border-b">
                    Chào, {user.name || user.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 text-sm"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>

              {/*Login cho nhà tuyển dụng*/}
              <div className="text-right leading-tight hidden md:block">
                <div className="text-sm text-gray-500">
                  Bạn là nhà tuyển dụng?
                </div>
                <button
                  onClick={() => navigate("/recruiterLogin")}
                  className="text-blue-600 hover:underline font-semibold text-sm"
                >
                  Đăng tuyển ngay &raquo;
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/recruiterLogin")}
                className="text-gray-600"
              >
                Nhà tuyển dụng
              </button>
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-500 text-white px-4 py-2 rounded-full"
              >
                Đăng nhập
              </button>
            </div>
          )}
        </div>

        {/* Mobile */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-white z-50 sm:hidden p-4">
            <button
              className="text-2xl mb-4"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              <HiX />
            </button>
            <NavLinks isMobile={true} setIsMenuOpen={setIsMenuOpen} />
            {user ? (
              <div className="mt-4">
                <p className="mb-2">Chào, {user.name || user.email}</p>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:underline"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-4">
                <button
                  onClick={() => navigate("/recruiterLogin")}
                  className="text-gray-600"
                >
                  Nhà tuyển dụng
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full"
                >
                  Đăng nhập
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
