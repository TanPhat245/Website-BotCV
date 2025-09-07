import React, { useEffect, useState } from "react";
import axios from "axios";

const InfoPackage = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
       //Theem logic lấy gói đăng tin từ API
      } catch (err) {
        console.error("Lỗi khi tải gói tin", err);
      }
    };
    fetchPackages();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Gói đăng tin của bạn</h1>
      {packages.length === 0 ? (
        <p className="text-gray-500">Bạn chưa đăng ký gói nào.</p>
      ) : (
        <ul className="space-y-4">
          {packages.map((pkg) => (
            <li key={pkg.id} className="border p-4 rounded">
              <h2 className="text-lg font-semibold">{pkg.name}</h2>
              <p>Thời hạn: {pkg.duration} ngày</p>
              <p>Ngày mua: {new Date(pkg.createdAt).toLocaleDateString()}</p>
              <p>Ngày hết hạn: {new Date(pkg.expiresAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InfoPackage;