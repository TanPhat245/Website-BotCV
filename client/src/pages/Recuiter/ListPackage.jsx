import React from "react";
import { useNavigate } from "react-router-dom";

const ListPackage = () => {
  const navigate = useNavigate();

  const packages = [
    { id: 1, name: "Gói ngày", description: "Hiển thị tin trong 1 ngày", price: 100000 },
    { id: 2, name: "Gói tháng", description: "Hiển thị tin trong 30 ngày", price: 800000 },
    { id: 3, name: "Gói năm", description: "Hiển thị tin trong 365 ngày", price: 9000000 },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Thông tin các gói tin</h1>
      <div className="space-y-4">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="border p-4 rounded hover:shadow cursor-pointer"
            onClick={() => navigate("/dashboard/regis-package", { state: pkg })}
          >
            <h2 className="text-lg font-semibold">{pkg.name}</h2>
            <p>{pkg.description}</p>
            <p className="text-green-600 font-medium">
              Giá: {pkg.price.toLocaleString()} VNĐ
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListPackage;