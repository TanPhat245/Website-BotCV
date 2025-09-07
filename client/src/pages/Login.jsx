import React, { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { TextField, Button, Checkbox, FormControlLabel } from "@mui/material";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [resetData, setResetData] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const handleResetChange = (e) => {
    const { name, value } = e.target;
    setResetData((prev) => ({ ...prev, [name]: value }));
  };
  const toggleForm = () => setIsLogin(!isLogin);
  // Hàm xử lý thay đổi dữ liệu trong form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  // Hàm xử lý gửi form đăng nhập/đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agree) {
      toast.warn("Bạn phải đồng ý với điều khoản.");
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast.warn("Mật khẩu không khớp.");
      return;
    }

    try {
      const url = isLogin
  ? `${import.meta.env.VITE_BACKEND}api/user/login`
  : `${import.meta.env.VITE_BACKEND}api/user/register`;

      const payload = isLogin
        ? {
            email: formData.email,
            password: formData.password,
          }
        : {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
          };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        if (isLogin) {
          localStorage.setItem("userToken", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          toast.success("Đăng nhập thành công!");
          navigate(redirectTo, { replace: true });
        } else {
          toast.success("Đăng ký thành công!");
          setIsLogin(true);
        }
      } else {
        toast.error(data.message || "Đã xảy ra lỗi.");
      }
    } catch (err) {
      toast.error("Lỗi kết nối đến máy chủ.");
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Đăng nhập" : "Đăng ký"}
        </h2>
        {/*Form nhập mail -> nhập mã mail -> nhập mk mới */}
        {isForgotPassword ? (
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {/* Bước 1: Nhập email */}
            {resetStep === 1 && (
              <>
                <TextField
                  fullWidth
                  type="email"
                  name="email"
                  label="Nhập email đã đăng ký"
                  value={resetData.email}
                  onChange={handleResetChange}
                />
                <Button
                  fullWidth
                  variant="contained"
                  onClick={async () => {
                    if (!resetData.email)
                      return toast.warning("Nhập email trước");

                    try {
                      const res = await fetch(
                        `${import.meta.env.VITE_BACKEND}api/user/forgot-password/send-code`,
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ email: resetData.email }),
                        }
                      );

                      const data = await res.json();

                      if (res.ok) {
                        toast.success(data.message || "Đã gửi mã xác minh!");
                        setResetStep(2);
                      } else {
                        toast.error(
                          data.message || "Không gửi được mã xác minh."
                        );
                      }
                    } catch (err) {
                      toast.error("Lỗi máy chủ.");
                      console.error(err);
                    }
                  }}
                >
                  Gửi mã xác minh
                </Button>
              </>
            )}

            {/* Bước 2: Nhập mã xác minh */}
            {resetStep === 2 && (
              <>
                <TextField
                  fullWidth
                  name="code"
                  label="Mã xác minh từ email"
                  value={resetData.code}
                  onChange={handleResetChange}
                />
                <Button
                  fullWidth
                  variant="contained"
                  onClick={async () => {
                    if (!resetData.code)
                      return toast.warning("Nhập mã xác minh");

                    try {
                      const res = await fetch(
                        `${import.meta.env.VITE_BACKEND}api/user/forgot-password/verify-code`,
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            email: resetData.email,
                            code: resetData.code,
                          }),
                        }
                      );

                      const data = await res.json();

                      if (res.ok) {
                        toast.success(data.message || "Mã hợp lệ!");
                        setResetStep(3);
                      } else {
                        toast.error(data.message || "Mã xác minh không đúng.");
                      }
                    } catch (err) {
                      toast.error("Lỗi máy chủ.");
                      console.error(err);
                    }
                  }}
                >
                  Xác minh mã
                </Button>
              </>
            )}

            {/* Bước 3: Nhập lại mật khẩu */}
            {resetStep === 3 && (
              <>
                <TextField
                  fullWidth
                  type="password"
                  name="newPassword"
                  label="Mật khẩu mới"
                  value={resetData.newPassword}
                  onChange={handleResetChange}
                />
                <TextField
                  fullWidth
                  type="password"
                  name="confirmPassword"
                  label="Xác nhận mật khẩu mới"
                  value={resetData.confirmPassword}
                  onChange={handleResetChange}
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={async () => {
                    if (
                      !resetData.newPassword ||
                      resetData.newPassword !== resetData.confirmPassword
                    ) {
                      return toast.warning("Mật khẩu không khớp hoặc trống.");
                    }
                    try {
                      const res = await fetch(
                        `${import.meta.env.VITE_BACKEND}api/user/forgot-password/reset-password`,
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            email: resetData.email,
                            newPassword: resetData.newPassword,
                          }),
                        }
                      );
                      const data = await res.json();
                      if (res.ok) {
                        toast.success(
                          data.message || "Đặt lại mật khẩu thành công!"
                        );
                        setIsForgotPassword(false);
                        setResetStep(1);
                      } else {
                        toast.error(
                          data.message || "Không đặt lại được mật khẩu."
                        );
                      }
                    } catch (err) {
                      toast.error("Lỗi máy chủ.");
                      console.error(err);
                    }
                  }}
                >
                  Cập nhật mật khẩu
                </Button>
              </>
            )}

            {/* Quay lại */}
            <p className="text-center mt-4">
              <button
                type="button"
                className="text-blue-500 underline"
                onClick={() => {
                  setIsForgotPassword(false);
                  setResetStep(1);
                }}
              >
                Quay lại đăng nhập
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                {/* Họ tên */}
                <div>
                  <TextField
                    fullWidth
                    required
                    id="name"
                    name="name"
                    label="Họ và tên"
                    value={formData.name}
                    onChange={handleChange}
                    margin="normal"
                  />
                </div>
                {/* Số điện thoại */}
                <div>
                  <TextField
                    fullWidth
                    required
                    id="phone"
                    name="phone"
                    label="Số điện thoại"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
            {/* Email */}
            <div>
              <TextField
                fullWidth
                required
                type="email"
                id="email"
                name="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {/* Mật khẩu */}
            <div>
              <TextField
                fullWidth
                required
                type="password"
                id="password"
                name="password"
                label="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {/* Nhập lại mật khẩu */}
            {!isLogin && (
              <div>
                <TextField
                  fullWidth
                  required
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            )}
            {/* Đồng ý điều khoản */}
            <div className="flex justify-between items-center w-full mt-2">
              <FormControlLabel
                control={
                  <Checkbox
                    required
                    id="agree"
                    name="agree"
                    checked={formData.agree}
                    onChange={handleChange}
                  />
                }
                label={
                  <span>
                    Tôi đồng ý với{" "}
                    <span className="underline text-blue-600">điều khoản</span>
                  </span>
                }
              />
              {/* Nút quên mật khẩu chỉ hiển thị khi đang ở trang đăng nhập */}
              {isLogin && !isForgotPassword && (
                <button
                  type="button"
                  className="text-blue-500 underline text-sm"
                  onClick={() => setIsForgotPassword(true)}
                >
                  Quên mật khẩu?
                </button>
              )}
            </div>
            {/* Nút submit */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              {isLogin ? "Đăng nhập" : "Đăng ký"}
            </Button>
          </form>
        )}
        <p className="text-center mt-4">
          {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
          <button
            onClick={toggleForm}
            className="text-blue-500 underline hover:text-blue-700"
          >
            {isLogin ? "Đăng ký" : "Đăng nhập"}
          </button>
        </p>
      </div>
      <Footer />
    </>
  );
};

export default Login;
