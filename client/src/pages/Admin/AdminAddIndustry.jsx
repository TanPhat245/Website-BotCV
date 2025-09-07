import React, { useState } from "react";
import { toast } from "react-toastify";

const AdminAddIndustry = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  // Handle thêm ngành nghề
  const handleAddIndustry = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.warning("Vui lòng nhập tên ngành nghề");
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const res = await fetch("http://localhost:5000/api/admin/add-industry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ name, description }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Đã thêm ngành nghề thành công");
        setName("");
        setDescription("");
      } else {
        toast.error(data.message || "Thêm không được hehe");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi yêu cầu");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Trang thêm ngành nghề
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg p-8 rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
        ➕ Thêm ngành nghề mới
      </h2>
      <form onSubmit={handleAddIndustry}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tên ngành nghề
          </label>
          <input
            type="text"
            id="name"
            placeholder="VD: Công nghệ thông tin"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Mô tả ngành nghề
          </label>
          <textarea
            id="description"
            placeholder="VD: Ngành liên quan đến phần mềm, phần cứng, dữ liệu..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-200"
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Đang thêm..." : "Thêm ngành nghề"}
        </button>
      </form>
    </div>
  );
};

export default AdminAddIndustry;
