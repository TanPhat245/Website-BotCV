import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const iconMap = {
  Marketing: "📈",
  "Giáo dục": "📚",
  "Tài chính/Ngân hàng/Bảo hiểm": "💰",
  "Thiết kế": "🎨",
  "Tạp vụ": "🧹",
  "Công nghệ thông tin": "💻",
  "Bất động sản - Xây dựng": "🏗️",
  "Lao động phổ thông": "🛠️",
  default: "🧭",
};

const Detail = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const handleCategoryClick = (category) => {
    navigate(`/collection-jobs?category=${encodeURIComponent(category)}`);
  };
  //API đếm ngành nghề--xong
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND}api/jobs/count-by-category`
        );
        setCategories(res.data.slice(0, 8));
      } catch (err) {
        console.error("Lỗi khi load dữ liệu ngành nghề:", err);
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className="container mx-auto my-10">
      <h2 className="text-2xl font-bold text-green-600 text-center mb-2">
        Top ngành nghề nổi bật
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Bạn muốn tìm việc mới? Xem danh sách việc làm{" "}
        <a
          onClick={() => {
            navigate("/collection-jobs");
            scrollTo(0, 0);
          }}
          className="text-green-600 cursor-pointer underline"
        >
          tại đây
        </a>
        .
      </p>
      {/*Danh sách ngành nghề */}
      <div className="grid grid-cols-1 cursor-pointer sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <div
            key={index}
            onClick={() => handleCategoryClick(category._id)}
            className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition duration-300 text-center"
          >
            <div className="text-4xl mb-4">
              {iconMap[category._id] || iconMap.default}
            </div>
            <h3 className="font-semibold text-lg">{category._id}</h3>
            <p className="text-green-600 font-medium">
              {category.count.toLocaleString()} việc làm
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Detail;
