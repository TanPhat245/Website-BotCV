import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  //API login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Đăng nhập thành công");
        localStorage.setItem("adminToken", data.token);
        navigate("/dashboard-admin");
      } else {
        toast.error(data.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      toast.error("Lỗi kết nối máy chủ");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://e00-marca.uecdn.es/assets/multimedia/imagenes/2024/10/31/17304023611084.jpg')",
      }}
    >
      <div className="bg-white/20 backdrop-blur-md shadow-lg rounded-xl px-8 py-10 max-w-sm w-full">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          🔐 Đăng nhập Admin
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-white mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 rounded bg-white/30 text-white placeholder-white focus:outline-none"
              placeholder="admin@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-white mb-1" htmlFor="password">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 rounded bg-white/30 text-white placeholder-white focus:outline-none"
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
