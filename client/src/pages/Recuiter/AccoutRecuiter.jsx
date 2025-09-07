import React, { useEffect, useState } from "react";

const AccoutRecuiter = () => {
  const [company, setCompany] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const token = localStorage.getItem("companyToken");
  //Handle fetch thông tin tài khoản nhà tuyển dụng
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND}api/company/company-info`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        const data = await res.json();
        if (data.success) {
          setCompany(data.company);
        } else {
          alert("Không lấy được thông tin công ty: " + data.message);
        }
      } catch (error) {
        console.error("Lỗi gọi API:", error);
      }
    };
    if (token) fetchCompany();
  }, [token]);
  //Handle thay doi thong tin
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      return alert("Mật khẩu xác nhận không khớp.");
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND}api/company/update-info`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          oldPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Đổi mật khẩu thành công!");
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setShowChangePassword(false);
      } else {
        alert("Lỗi: " + data.message);
      }
    } catch (error) {
      console.error("Lỗi gọi API:", error);
    }
  };
  //Handle thay doi thong tin
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded space-y-4">
      <h2 className="text-2xl font-bold text-center text-blue-600">
        Thông tin tài khoản nhà tuyển dụng
      </h2>

      {company ? (
        <>
          <div>
            <strong>Email:</strong> {company.email}
          </div>
          <div>
            <strong>Họ tên:</strong> {company.fullName}
          </div>
          <div>
            <strong>Công ty:</strong> {company.companyName}
          </div>
          <div>
            <strong>Tỉnh:</strong> {company.provinceCode}
          </div>
          <div>
            <strong>Huyện:</strong> {company.districtCode}
          </div>

          <div className="text-right">
            <button
              className="text-sm text-blue-500 border-b border-blue-500 hover:bg-blue-50 px-2 py-1 rounded"
              onClick={() => setShowChangePassword(!showChangePassword)}
            >
              {showChangePassword ? "Hủy" : "Thay đổi mật khẩu"}
            </button>
          </div>
          {/*input*/}
          {showChangePassword && (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="password"
                name="currentPassword"
                placeholder="Mật khẩu hiện tại"
                className="w-full border p-2 rounded"
                value={form.currentPassword}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="newPassword"
                placeholder="Mật khẩu mới"
                className="w-full border p-2 rounded"
                value={form.newPassword}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu mới"
                className="w-full border p-2 rounded"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Xác nhận đổi mật khẩu
              </button>
            </form>
          )}
        </>
      ) : (
        <p>Đang tải thông tin...</p>
      )}
    </div>
  );
};

export default AccoutRecuiter;
