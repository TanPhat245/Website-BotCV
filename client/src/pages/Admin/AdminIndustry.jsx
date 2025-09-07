import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminIndustry = () => {
  const [industries, setIndustries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const token = localStorage.getItem("adminToken");
  const navigate = useNavigate();

  // Lấy danh sách ngành nghề
  const fetchIndustries = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/list-industry", {
        headers: { Authorization: token },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIndustries(data.data);
      } else {
        toast.error("Không thể tải danh sách ngành nghề");
      }
    } catch (err) {
      toast.error("Lỗi kết nối máy chủ");
      console.error(err);
    }
  };
  useEffect(() => {
    fetchIndustries();
  }, []);
  // Gợi ý tìm kiếm
  const handleSelectSuggestion = (industry) => {
    setSelectedIndustry(industry);
    setSearchTerm(industry.name);
    setShowSuggestions(false);
  };
  // Xử lý xóa ngành nghề
  const handleDelete = async (id) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xóa ngành nghề này?");
    if (!confirm) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/delete-industry/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        }
      );

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Đã xóa ngành nghề");
        setIndustries((prev) => prev.filter((item) => item._id !== id));
      } else {
        toast.error(data.message || "Xóa thất bại");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi xóa ngành");
    }
  };

  const filteredSuggestions = industries.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const displayedIndustries = selectedIndustry
    ? [selectedIndustry]
    : filteredSuggestions;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h2 className="text-3xl font-bold mb-4 text-center text-indigo-700">
        Danh sách ngành nghề
      </h2>

      {/* Tìm kiếm */}
      <div className="max-w-md mx-auto mb-8 relative">
        <input
          type="text"
          placeholder="🔍 Tìm ngành nghề..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSelectedIndustry(null);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {showSuggestions && searchTerm && (
          <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((item) => (
                <li
                  key={item._id}
                  onClick={() => handleSelectSuggestion(item)}
                  className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
                >
                  {item.name}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">
                Không tìm thấy ngành phù hợp
              </li>
            )}
          </ul>
        )}
      </div>

      {/* Card hiển thị ngành nghề */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {displayedIndustries.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            Không có ngành nghề nào.
          </div>
        ) : (
          displayedIndustries.map((item) => (
            <div
              key={item._id}
              onMouseEnter={() => setHoveredId(item._id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative bg-white shadow-md rounded-xl cursor-pointer p-6 hover:shadow-lg transition-all"
            >
              {/* Nút xóa khi hover */}
              {hoveredId === item._id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item._id);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-3 py-1 text-sm hover:bg-red-600 shadow"
                >
                  Xóa
                </button>
              )}

              {/* Nội dung card */}
              <div
                onClick={() =>
                  navigate(`/dashboard-admin/edit-industry/${item._id}`)
                }
              >
                <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500 break-words mb-2">
                  Mô tả: {item.description}
                </p>
                <p className="text-sm text-gray-400">
                  Ngày tạo: {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminIndustry;
