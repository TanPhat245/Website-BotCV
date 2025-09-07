import React, { useState } from 'react'

const RegisPackage = () => {
  const samplePackages = [
    { id: 1, name: "Gói ngày", duration: "1 ngày", price: 100000 },
    { id: 2, name: "Gói tháng", duration: "30 ngày", price: 800000 },
    { id: 3, name: "Gói năm", duration: "365 ngày", price: 9000000 },
  ];
  const [selectedPackage, setSelectedPackage] = useState(null);

  const handleSubmit = () => {
    alert(`Đã đăng ký gói: ${selectedPackage?.name}`);
    // Gửi request POST đến backend tại đây
  };

  return (
    <>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Đăng ký gói tin</h1>
        <div className="grid gap-4">
          {samplePackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`border p-4 rounded cursor-pointer hover:border-blue-500 transition ${selectedPackage?.id === pkg.id ? "border-blue-600 bg-blue-50" : ""}`}
              onClick={() => setSelectedPackage(pkg)}
            >
              <h2 className="font-semibold text-lg">{pkg.name}</h2>
              <p>Thời hạn: {pkg.duration}</p>
              <p>Giá: {pkg.price.toLocaleString()} VNĐ</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 text-right">
        <button
          onClick={handleSubmit}
          disabled={!selectedPackage}
          className="bg-blue-600 text-white px-5 py-2 rounded disabled:opacity-50"
        >
          Đăng ký
        </button>
      </div>
    </>
  );
}

export default RegisPackage