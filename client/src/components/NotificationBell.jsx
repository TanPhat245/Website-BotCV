import { useState, useEffect, useRef } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../index.css";
const NotificationBell = ({ notifications, fetchNotifications }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");
  const bellRef = useRef(null);
  const hasUnread = notifications.some((n) => !n.isRead);

  // Đọc tất cả thông báo
  const handleMarkAllRead = async () => {
    try {
      const unreadNoti = notifications.filter((n) => !n.isRead);
      for (const noti of unreadNoti) {
        await axios.patch(
          `${import.meta.env.VITE_BACKEND}api/user/read/${noti._id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      fetchNotifications();
    } catch (error) {
      console.error("Lỗi khi đánh dấu tất cả đã đọc:", error);
    }
  };
  // Click vào thông báo đọc và điều hướng
  const handleClickNotification = async (noti) => {
    try {
      if (!noti.isRead) {
        await axios.patch(
          `${import.meta.env.VITE_BACKEND}api/user/read/${noti._id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      if (noti.type === "application" || noti.type === "applicationStatus") {
        navigate("/applications");
      }
      fetchNotifications();
    } catch (error) {
      console.error("Lỗi khi xử lý thông báo:", error);
    }
  };
  // Logic click ngoài thì đóng bảng thông báo
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  //Đây là giao diện bảng thông báo, tôi cần đổi qua MUI, hãy làm giúp tôi, code cũ + code mới
  return (
    <div className="relative" ref={bellRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer relative"
      >
        <FaBell className={`text-2xl ${hasUnread ? "ring-bell" : ""}`} />
        {hasUnread && (
          <span className="absolute top-0 right-0 bg-red-500 rounded-full w-2 h-2"></span>
        )}
      </div>
      {/* Bảng thông báo */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg max-h-96 overflow-y-auto z-50 border border-gray-300">
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <span className="font-semibold">Thông báo</span>
            {hasUnread && (
              <button
                onClick={handleMarkAllRead}
                className="text-blue-500 text-sm hover:underline"
              >
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">Không có thông báo</p>
          ) : (
            notifications.map((n, idx) => (
              <div
                key={idx}
                onClick={() => handleClickNotification(n)}
                className={`relative p-3 text-sm border-b cursor-pointer ${
                  n.isRead
                    ? "bg-white"
                    : "bg-gray-100 font-medium hover:bg-gray-200"
                }`}
              >
                {!n.isRead && (
                  <span className="absolute top-2 right-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full shadow">
                    Mới
                  </span>
                )}
                <p className="pr-10 text-justif">{n.content}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
