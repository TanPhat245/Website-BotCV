import { assets } from "../assets/assets";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ToggleQuyDinh from "../components/ToggleQuyDinh";
import { toast } from "react-toastify";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Checkbox,
} from "@mui/material";

const RecruiterLogin = () => {
  const [state, setState] = useState("Login"); // "Login" hoặc "Register"
  const [provinces, setProvinces] = useState([]); // Danh sách tỉnh/thành phố
  const [districts, setDistricts] = useState([]); // Danh sách quận/huyện
  const [selectedProvince, setSelectedProvince] = useState(""); // Tỉnh/thành phố được chọn
  const [selectedDistrict, setSelectedDistrict] = useState(""); // Quận/huyện được chọn

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigate = useNavigate();
  // Lấy danh sách tỉnh/thành phố từ API
  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/p/")
      .then((response) => setProvinces(response.data))
      .catch((error) => console.error("Error fetching provinces:", error));
  }, []);
  // Lấy danh sách quận/huyện khi tỉnh/thành phố thay đổi
  useEffect(() => {
    if (selectedProvince) {
      axios
        .get(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
        .then((response) => setDistricts(response.data.districts))
        .catch((error) => console.error("Error fetching districts:", error));
      setSelectedDistrict(""); // Reset quận/huyện khi tỉnh/thành phố thay đổi
    } else {
      setDistricts([]);
    }
  }, [selectedProvince]);
  //Handle đăng ký
  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== rePassword) {
      toast.warn("Mật khẩu không khớp");
      return;
    }

    if (!agreeTerms) {
      toast.warn("Bạn cần đồng ý với Điều khoản dịch vụ và Chính sách bảo mật");
      return;
    }
    //tìm cái tên tỉnh và quận huyện xong lấy name của nó(api có name hẹ hẹ)
    const selectedProvinceObj = provinces.find(
      (p) => p.code === Number(selectedProvince)
    );
    const selectedDistrictObj = districts.find(
      (d) => d.code === Number(selectedDistrict)
    );

    const provinceName = selectedProvinceObj?.name || "";
    const districtName = selectedDistrictObj?.name || "";
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND}api/company/register`,
        {
          fullName,
          companyName,
          email,
          password,
          provinceCode: provinceName,
          districtCode: districtName,
        }
      );

      const data = response.data;

      if (data.success) {
        toast.success("Đăng ký thành công!");
        setState("Login");
      } else {
        toast.success(data.message || "Đăng ký thất bại");
      }
    } catch (error) {
      console.error("Đăng ký lỗi:", error);
      toast.warn("Đã xảy ra lỗi khi đăng ký");
    }
  };
  // Handle đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND}api/company/login`,
        {
          email,
          password,
        }
      );

      const data = response.data;

      if (data.success) {
        toast.success("Đăng nhập thành công!");
        localStorage.setItem("companyToken", data.token);
        navigate("/dashboard");
      } else {
        alert(data.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Đăng nhập lỗi:", error);
      toast.error("Tài khoản hoặc mật khẩu không đúng");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-6">
          <img
            src={assets.logonew}
            onClick={() => navigate("/")}
            alt="Logo"
            className="mx-auto mb-4 cursor-pointer"
          />
          <h1 className="text-2xl font-bold text-green-700">
            {state === "Login"
              ? "Chào mừng bạn đã quay trở lại"
              : "Đăng ký tài khoản Nhà tuyển dụng"}
          </h1>
          <p className="text-gray-600">
            {state === "Login"
              ? "Cùng tạo dựng lợi thế cho doanh nghiệp bằng trải nghiệm công nghệ tuyển dụng ứng dụng sâu AI & Hiring Funnel"
              : "Cùng tạo dựng lợi thế cho doanh nghiệp bằng trải nghiệm công nghệ tuyển dụng ứng dụng sâu AI & Hiring Funnel."}
          </p>
        </div>

        {/* Đăng nhập */}
        {state === "Login" && (
          <>
            <div className="text-center mb-7 text-lg font-semibold text-blue-600">
              Đăng nhập với tư cách nhà tuyển dụng
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <TextField
                  fullWidth
                  required
                  type="email"
                  label="Email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <TextField
                  fullWidth
                  required
                  type="password"
                  label="Mật khẩu"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex justify-between items-center mb-4">
                <a href="#" className="text-blue-500 hover:underline">
                  Quên mật khẩu
                </a>
              </div>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="success"
              >
                Đăng nhập
              </Button>
            </form>

            <div className="text-center mt-4">
              Chưa có tài khoản?{" "}
              <span
                onClick={() => setState("Register")}
                className="text-blue-500 cursor-pointer hover:underline"
              >
                Đăng ký ngay
              </span>
            </div>
          </>
        )}

        {/* Đăng ký */}
        {state === "Register" && (
          <>
            {/* Quy định hoặc điều khoản */}
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <ToggleQuyDinh />
            </div>

            <form onSubmit={handleRegister}>
              {/* Email */}
              <div className="mb-4">
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Mật khẩu */}
              <div className="mb-4">
                <TextField
                  fullWidth
                  label="Mật khẩu"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Nhập lại mật khẩu */}
              <div className="mb-4">
                <TextField
                  fullWidth
                  label="Nhập lại mật khẩu"
                  type="password"
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
                  required
                />
              </div>

              {/* Họ và tên */}
              <div className="mb-4">
                <TextField
                  fullWidth
                  label="Họ và tên"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              {/* Công ty */}
              <div className="mb-4">
                <TextField
                  fullWidth
                  label="Công ty"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>

              {/* Địa điểm làm việc */}
              <div className="mb-4">
                <FormControl fullWidth required>
                  <InputLabel>Tỉnh/Thành phố</InputLabel>
                  <Select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    label="Tỉnh/Thành phố"
                  >
                    <MenuItem value="">
                      <em>Chọn tỉnh/thành phố</em>
                    </MenuItem>
                    {provinces.map((province) => (
                      <MenuItem key={province.code} value={province.code}>
                        {province.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {/* Quận/Huyện */}
              <div className="mb-4">
                <FormControl fullWidth required>
                  <InputLabel>Quận/Huyện</InputLabel>
                  <Select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    label="Quận/Huyện"
                    disabled={!selectedProvince}
                  >
                    <MenuItem value="">
                      <em>Chọn quận/huyện</em>
                    </MenuItem>
                    {districts.map((district) => (
                      <MenuItem key={district.code} value={district.code}>
                        {district.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {/* Điều khoản */}
              <div className="flex items-start mb-4">
                <Checkbox
                  id="terms"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  sx={{ padding: 0, marginRight: 1 }}
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  Tôi đã đọc và đồng ý với{" "}
                  <a href="#" className="text-blue-500 hover:underline">
                    Điều khoản dịch vụ
                  </a>{" "}
                  và{" "}
                  <a href="#" className="text-blue-500 hover:underline">
                    Chính sách bảo mật
                  </a>
                  .
                </label>
              </div>

              {/* Nút submit */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="success"
              >
                Hoàn tất
              </Button>
            </form>

            <div className="text-center mt-4">
              Đã có tài khoản?{" "}
              <span
                onClick={() => setState("Login")}
                className="text-blue-500 cursor-pointer hover:underline"
              >
                Đăng nhập ngay
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecruiterLogin;
