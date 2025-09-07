import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Info = () => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [cvFile, setCvFile] = useState(null);

  const [account, setAccount] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const token = localStorage.getItem("userToken");
  //Title
  useEffect(() => {
    document.title = "Thông tin cá nhân | BotCV";
  }, []);
  //Luwuw vi tri
  const navigate = useNavigate();
  const location = useLocation();
  const handleLoginClick = () => {
    navigate("/login", { state: { from: location.pathname } });
  };
  //API lấy user và profile--xong
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const resUser = await axios.get(
          `${import.meta.env.VITE_BACKEND}api/user/user`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAccount(resUser.data.user);

        const resProfile = await axios.get(
          `${import.meta.env.VITE_BACKEND}api/user/Get-Profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfile(resProfile.data.user);
        setEditedProfile(resProfile.data.user || {});
      } catch (error) {
        setMessage(error.response?.data?.message || "Lỗi khi tải thông tin");
      }
    };

    fetchUserData();
  }, []);
  //Xử lý thay đổi mật khẩu--xong
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setMessage("Mật khẩu xác nhận không khớp.");
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND}api/user/update`,
        { currentPassword: oldPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(res.data.message);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowChangePassword(false);
    } catch (error) {
      setMessage(error.response?.data?.message || "Đổi mật khẩu thất bại");
    }
  };
  //Xử lý lưu hồ sơ người dùng--xong
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const hasProfile =
      profile?.degree || profile?.address || profile?.cvUrl || profile?.field;
    const apiEndpoint = hasProfile
      ? `${import.meta.env.VITE_BACKEND}api/user/Update-Profile`
      : `${import.meta.env.VITE_BACKEND}api/user/Add-Profile`;

    try {
      const formData = new FormData();
      Object.entries(editedProfile).forEach(([key, value]) => {
        formData.append(key, value || "");
      });

      if (cvFile) {
        formData.append("cvFile", cvFile);
      }

      const res = await axios({
        method: hasProfile ? "put" : "post",
        url: apiEndpoint,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(res.data.message);
      setIsEditingProfile(false);
      setProfile(res.data.user);
    } catch (error) {
      setMessage(error.response?.data?.message || "Lưu hồ sơ thất bại");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <nav className="text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-blue-500">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <Link to="/info" className="hover:text-blue-500 font-semibold">
            Thông tin tài khoản
          </Link>
        </nav>

        {!token ? (
          <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-6 rounded-md text-center shadow-md animate-pulse mb-6">
            <p className="text-lg font-semibold mb-4">
              Bạn chưa đăng nhập! Vui lòng đăng nhập để xem thông tin tài khoản.
            </p>
            <button
              onClick={handleLoginClick}
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded transition duration-300"
            >
              Đăng nhập ngay
            </button>
          </div>
        ) : (
          <>
            {/* Thông tin tài khoản */}
            <div className="bg-white shadow-md rounded-md p-6 mb-8">
              <h2 className="text-xl font-bold text-blue-600 mb-4">
                Thông tin tài khoản
              </h2>
              {account && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                  <div>
                    <strong>Tên tài khoản:</strong> {account.name}
                  </div>
                  <div>
                    <strong>Email:</strong> {account.email}
                  </div>
                  <div>
                    <strong>Mật khẩu:</strong> ********
                  </div>
                </div>
              )}
              <div className="mt-4 text-right">
                <button
                  onClick={() => setShowChangePassword(!showChangePassword)}
                  className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition"
                >
                  {showChangePassword ? "Hủy" : "Thay đổi mật khẩu"}
                </button>
              </div>

              {showChangePassword && (
                <form
                  onSubmit={handleChangePassword}
                  className="mt-4 space-y-4"
                >
                  <input
                    type="password"
                    placeholder="Mật khẩu cũ"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Lưu
                  </button>
                </form>
              )}
            </div>

            {/* Hồ sơ người dùng */}
            <div className="bg-white shadow-md rounded-md p-6">
              <h2 className="text-xl font-bold text-blue-600 mb-4">
                Thông tin hồ sơ
              </h2>
              <p className="bg-yellow-100 border border-yellow-400 text-yellow-800 text-sm px-4 py-2 rounded-lg shadow w-fit mx-auto mb-4">
                💡Lưu ý, bạn phải nhập đầy đủ thông tin hồ sơ tìm việc để ứng
                tuyển.
              </p>
              {isEditingProfile ? (
                <form
                  onSubmit={handleSaveProfile}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {[
                    { label: "Họ tên", key: "name" },
                    { label: "SĐT", key: "phone" },
                    { label: "Ngành nghề", key: "field" },
                    { label: "Cấp bậc", key: "level" },
                    { label: "Địa chỉ", key: "address" },
                  ].map(({ label, key }) => (
                    <input
                      key={key}
                      placeholder={label}
                      type="text"
                      value={editedProfile[key] || ""}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          [key]: e.target.value,
                        })
                      }
                      className="border px-3 py-2 rounded"
                    />
                  ))}

                  {/* Dropdown chọn trình độ */}
                  <div>
                    <label className="block mb-1 font-medium text-sm text-gray-700">
                      Bằng cấp học vấn
                    </label>
                    <select
                      value={editedProfile.degree || ""}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          degree: e.target.value,
                        })
                      }
                      className="border px-3 py-2 rounded w-full"
                    >
                      <option value="">-- Chọn bằng cấp --</option>
                      <option value="Trung học">Trung học</option>
                      <option value="Phổ thông">Phổ thông</option>
                      <option value="Cử nhân">Cử nhân</option>
                      <option value="Kỹ sư">Kỹ sư</option>
                      <option value="Thạc sĩ">Thạc sĩ</option>
                      <option value="Tiến sĩ">Tiến sĩ</option>
                    </select>
                  </div>

                  {/* Upload CV */}
                  <div>
                    <label className="block mb-1 font-medium text-sm text-gray-700">
                      Upload CV
                    </label>
                    <input
                      type="file"
                      accept="application/pdf,image/png,image/jpeg"
                      onChange={(e) => setCvFile(e.target.files[0])}
                      className="border px-3 py-2 rounded w-full"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="col-span-2 flex justify-end gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="bg-gray-400 text-white px-4 py-2 rounded"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Lưu
                    </button>
                  </div>
                </form>
              ) : (
                profile && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                    <div>
                      <strong>Họ tên:</strong> {profile.name || "-"}
                    </div>
                    <div>
                      <strong>SĐT:</strong> {profile.phone || "-"}
                    </div>
                    <div>
                      <strong>Trình độ:</strong> {profile.degree || "-"}
                    </div>
                    <div>
                      <strong>Ngành:</strong> {profile.field || "-"}
                    </div>
                    <div>
                      <strong>Cấp bậc:</strong> {profile.level || "-"}
                    </div>
                    <div>
                      <strong>Địa chỉ:</strong> {profile.address || "-"}
                    </div>
                    <div className="col-span-2">
                      <strong>CV:</strong>{" "}
                      {profile.cvUrl ? (
                        <>
                          {profile.cvUrl.endsWith(".pdf") ? (
                            <a
                              href={profile.cvUrl}
                              className="text-blue-500 underline"
                              target="_blank"
                              rel="noreferrer"
                            >
                              Xem CV (PDF)
                            </a>
                          ) : (
                            <img
                              src={`http://localhost:5000${profile.cvUrl}`}
                              alt="Hình ảnh CV"
                              className="mt-2 rounded shadow max-h-64"
                            />
                          )}
                        </>
                      ) : (
                        "Chưa có"
                      )}
                    </div>

                    <div className="col-span-2 text-right mt-4">
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Chỉnh sửa
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Info;
