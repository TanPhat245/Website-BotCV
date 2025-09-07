import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditJob = () => {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("companyToken");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    provinceCode: "",
    district: "",
    slot: 1,
    visible: true,
    deadline: "",
  });

  const [loading, setLoading] = useState(true);
  //Lấy dữ liệu công việc từ API
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND}api/jobs/${jobId}`, {
          headers: { Authorization: token },
        });
        setFormData(res.data.job);
        setLoading(false);
      } catch (err) {
        alert("Không thể tải dữ liệu công việc.");
        navigate("/dashboard/manage-jobs");
      }
    };
    fetchJob();
  }, [jobId]);
  //Handle check box
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  // Hàm xử lý gửi form cập nhật công việc
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND}api/company/update/${jobId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      alert("Cập nhật thành công!");
      scrollTo(0, 0);
      navigate("/dashboard/manage-jobs");
    } catch (err) {
      alert(
        "Lỗi khi cập nhật tin tuyển dụng: " + err.response?.data?.message ||
          err.message
      );
    }
  };
  // Nếu đang tải dữ liệu, hiển thị thông báo
  if (loading) return <p className="p-4">Đang tải...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Chỉnh sửa tin tuyển dụng</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tiêu đề, mô tả, tỉnh/thành, quận/huyện, số lượng ứng viên , thêm sửa hạn chót*/}
        <div>
          <label className="block font-medium">Tiêu đề</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Mô tả</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="6"
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Tỉnh/Thành</label>
          <input
            type="text"
            name="provinceCode"
            value={formData.provinceCode}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Quận/Huyện</label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Số lượng ứng viên</label>
          <input
            type="number"
            name="slot"
            value={formData.slot}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            min={1}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Hạn chót</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline?.slice(0, 10) || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/*Button */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="visible"
            checked={formData.visible}
            onChange={handleChange}
            className="accent-green-600"
          />
          <label className="font-medium">Hiển thị công khai</label>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate("/dashboard/manage-jobs")}
            className="px-4 py-2 border rounded"
          >
            Huỷ
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJob;
