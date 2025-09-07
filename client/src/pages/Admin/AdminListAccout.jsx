import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminListAccout = () => {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [filter, setFilter] = useState("all"); // all | user | company
  const [searchText, setSearchText] = useState("");
  //api lấy danh sách
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, companyRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/list-users"),
          axios.get("http://localhost:5000/api/admin/list-companies"),
        ]);
        setUsers(userRes.data.data || []);
        setCompanies(companyRes.data.data || []);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu:", error);
      }
    };

    fetchData();
  }, []);
  //logic tìm user
  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchText.toLowerCase())
  );
  //logic tìm nhà tuyển dụng
  const filteredCompanies = companies.filter(
    (c) =>
      c.fullname?.toLowerCase().includes(searchText.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchText.toLowerCase())
  );
  
  //Định dạng 1 card
  const Card = ({ title, email, type }) => (
    <div className="bg-white rounded shadow p-4 border-l-4 border-green-500">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-gray-600">{email}</p>
      <span className="text-sm text-blue-600 font-medium">{type}</span>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Quản lý tài khoản</h2>

      {/* Bộ lọc */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Tìm theo tên hoặc email..."
          className="px-4 py-2 border rounded w-full sm:w-1/2"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="all">Tất cả</option>
          <option value="user">Người tìm việc</option>
          <option value="company">Nhà tuyển dụng</option>
        </select>
      </div>

      {/* Người tìm việc */}
      {(filter === "all" || filter === "user") && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-green-700">
            Người tìm việc ({filteredUsers.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <Card
                key={user._id}
                title={user.name}
                email={user.email}
                type="Người tìm việc"
              />
            ))}
          </div>
        </div>
      )}

      {/* Nhà tuyển dụng */}
      {(filter === "all" || filter === "company") && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-blue-700">
            Nhà tuyển dụng ({filteredCompanies.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCompanies.map((c) => (
              <Card
                key={c._id}
                title={c.fullName}
                email={c.email}
                type="Nhà tuyển dụng"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminListAccout;
