import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminEditIndustry = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [industryName, setIndustryName] = useState("");
  const [description, setDescription] = useState("");
  const token = localStorage.getItem("adminToken");
  //api Lấy thông tin 1 ngành nghề
  useEffect(() => {
    const fetchIndustry = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/admin/industry/${id}`, {
          headers: { Authorization: token },
        });
        const data = await res.json();
        if (data.success) {
          setIndustryName(data.data.name);
          setDescription(data.data.description || "");
        } else {
          toast.error("Không tìm thấy ngành nghề");
        }
      } catch (err) {
        toast.error("Lỗi khi tải dữ liệu ngành nghề");
      }
    };
    fetchIndustry();
  }, [id]);
  //API cập nhật ngành nghề
  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/edit-industry/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ name: industryName, description }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("✅ Đã cập nhật thành công!");
        navigate("/dashboard-admin/list-industry");
      } else {
        toast.error(data.message || "❌ Lỗi khi cập nhật");
      }
    } catch (err) {
      toast.error("❌ Có lỗi xảy ra");
    }
  };

  return (
    // Trang sửa ngành nghề
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center px-4 py-12">
      <div className="backdrop-blur-md bg-white/30 border border-white/40 shadow-xl rounded-xl p-8 max-w-xl w-full">
        <h2 className="text-3xl font-bold text-center text-indigo-800 mb-6">
          Sửa ngành nghề
        </h2>

        <label className="block text-sm font-medium text-indigo-900 mb-1">Tên ngành nghề</label>
        <input
          type="text"
          value={industryName}
          onChange={(e) => setIndustryName(e.target.value)}
          placeholder="VD: Công nghệ thông tin"
          className="w-full px-4 py-2 mb-4 rounded-md border border-indigo-200 bg-white/80 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <label className="block text-sm font-medium text-indigo-900 mb-1">Mô tả</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mô tả ngắn gọn về ngành nghề này..."
          className="w-full px-4 py-2 h-28 rounded-md border border-indigo-200 bg-white/80 resize-none mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <button
          onClick={handleUpdate}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition duration-300"
        >
          ✅ Cập nhật
        </button>
      </div>
    </div>
  );
};

export default AdminEditIndustry;
