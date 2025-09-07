import React, { useState, useEffect } from "react";
import axios from "axios";

const InfoCompany = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({});
  const [hasProfile, setHasProfile] = useState(true);
  const [recruiterId, setRecruiterId] = useState("");
  const [selectedLogoFile, setSelectedLogoFile] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const token = localStorage.getItem("companyToken");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Gọi API để lấy thoiong tin công ty
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
        if (res.data && res.data.recruiter) {
          setCompanyInfo(res.data.recruiter);
          setRecruiterId(res.data.recruiter._id);
          setHasProfile(true);
        } else {
          setHasProfile(false);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin công ty:", error);
        setHasProfile(false);
      }
    };
    fetchCompanyInfo();
  }, []);
  //Gọi api chỉnh sửa thông tin công ty
  const handleSave = async () => {
    try {
      //Lấy dữ lioeeu từ form
      const formData = new FormData();
      formData.append("phone", companyInfo.phone);
      formData.append("email", companyInfo.email);
      formData.append("address", companyInfo.address);
      formData.append("description", companyInfo.description);
      // Chỉ thêm nếu có file được chọn
      if (selectedLogoFile) {
        formData.append("logo", selectedLogoFile);
      }
      if (selectedImageFile) {
        formData.append("image", selectedImageFile);
      }
      //connect
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND}api/recruiter/update/${recruiterId}`,
        formData,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Cập nhật thành công!");
      setIsEditing(false);
      setCompanyInfo(res.data.recruiter);
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      alert("Cập nhật thất bại");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow-md rounded-md space-y-4">
      <h2 className="text-2xl font-bold text-center text-blue-600">
        Thông tin công ty
      </h2>

      {!hasProfile ? (
        <div className="text-center space-y-4">
          <p className="text-red-600 font-medium">Bạn chưa có hồ sơ công ty.</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() =>
              (window.location.href = "/dashboard/add-info-company")
            }
          >
            Thêm hồ sơ
          </button>
        </div>
      ) : isEditing ? (
        <div className="space-y-3">
          <p className="bg-yellow-100 border border-yellow-400 text-yellow-800 text-sm px-4 py-2 rounded-lg shadow w-fit mx-auto mb-4">
            Tên công ty và Tên người quản lý không thể chỉnh sửa tại đây. Nếu
            cần thay đổi, vui lòng truy cập Tài khoản → Quản lý tài khoản.
          </p>
          <input
            className="w-full border p-2 rounded"
            type="email"
            name="email"
            value={companyInfo.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            className="w-full border p-2 rounded"
            type="text"
            name="phone"
            value={companyInfo.phone}
            onChange={handleChange}
            placeholder="Số điện thoại"
          />
          <input
            className="w-full border p-2 rounded"
            type="text"
            name="address"
            value={companyInfo.address}
            onChange={handleChange}
            placeholder="Địa chỉ"
          />
          <textarea
            className="w-full border p-2 rounded"
            name="description"
            value={companyInfo.description}
            onChange={handleChange}
            placeholder="Mô tả về công ty"
            rows={3}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedLogoFile(e.target.files[0])}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedImageFile(e.target.files[0])}
          />
          <div className="flex justify-end space-x-2">
            <button
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => setIsEditing(false)}
            >
              Hủy
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleSave}
            >
              Lưu
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div>
            <strong>Người quản lý:</strong> {companyInfo.namemanage}
          </div>
          <div>
            <strong>Email:</strong> {companyInfo.email}
          </div>
          <div>
            <strong>Tên công ty:</strong> {companyInfo.companyName}
          </div>
          <div>
            <strong>Số điện thoại:</strong> {companyInfo.phone}
          </div>
          <div>
            <strong>Địa chỉ:</strong> {companyInfo.address}
          </div>
          <div>
            <strong>Mô tả:</strong> {companyInfo.description}
          </div>
          {companyInfo.logo && (
            <div>
              <strong>Logo:</strong>
              <div className="my-2">
                <img
                  src={`${import.meta.env.VITE_BACKEND}${companyInfo.logo.replace(
                    /\\/g,
                    "/"
                  )}`}
                  alt="Logo công ty"
                  className="w-32 h-32 object-contain border rounded"
                />
              </div>
            </div>
          )}

          {companyInfo.image && (
            <div>
              <strong>Banner:</strong>
              <div className="my-2">
                <img
                  src={`${import.meta.env.VITE_BACKEND}${companyInfo.image.replace(
                    /\\/g,
                    "/"
                  )}`}
                  alt="Ảnh banner công ty"
                  className="w-full h-40 object-cover border rounded"
                />
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-red-600"
              onClick={() => setIsEditing(true)}
            >
              Chỉnh sửa
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoCompany;
