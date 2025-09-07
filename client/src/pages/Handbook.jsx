import React from "react";
import Navbar from "../components/Navbar"; // Thanh điều hướng
import Footer from "../components/Footer"; // Footer
import { Link } from "react-router-dom";

const Handbook = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-4">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-500">
              Trang chủ
            </Link>
            <span className="mx-2">/</span>
            <Link to="/handbook" className="hover:text-blue-500">
              Cẩm nang nghề nghiệp
            </Link>
          </nav>
        </div>

      <div className="bg-gray-100 min-h-screen">
        {/* Header */}
        <div className="bg-green-100 py-10">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-green-700 mb-4">
              Định hướng nghề nghiệp
            </h1>
            <p className="text-gray-700">
              Chia sẻ và định hướng nghề nghiệp giúp bạn đạt được mục tiêu, phát
              triển sự nghiệp và tìm kiếm công việc phù hợp.
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition">
                Tìm việc làm
              </button>
              <button className="bg-white border border-green-500 text-green-500 px-6 py-2 rounded-lg hover:bg-green-100 transition">
                Xem bài viết
              </button>
            </div>
          </div>
        </div>

        {/* Bài viết nổi bật */}
        <div className="container mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Bài viết nổi bật
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Bài viết 1 */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <img
                src="https://cdn-new.topcv.vn/unsafe/600x/https://static.topcv.vn/cms/nganh-truyen-thong-la-gi-topcv-0.png67be7685174b7.png"
                alt="Bài viết"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Ngành truyền thông là gì?
                </h3>
                <p className="text-gray-600 mb-4">
                  Cơ hội việc làm ngành truyền thông.
                </p>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                  Xem ngay
                </button>
              </div>
            </div>
            {/* Bài viết 2 */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <img
                src="https://cdn-new.topcv.vn/unsafe/600x/https://static.topcv.vn/cms/nganh-marketing-la-gi-topcv-16.jpg64afd436a1936.jpg"
                alt="Bài viết"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Ngành Marketing là gì?
                </h3>
                <p className="text-gray-600 mb-4">
                  Cơ hội việc làm ngành Marketing.
                </p>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                  Xem ngay
                </button>
              </div>
            </div>
            {/* Bài viết 3 */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <img
                src="https://cdn-new.topcv.vn/unsafe/600x/https://static.topcv.vn/cms/logistics-topcv-3.jpg65e5a1ac0b862.jpg"
                alt="Bài viết"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Làm thế nào để chọn ngành phù hợp?
                </h3>
                <p className="text-gray-600 mb-4">
                  Hướng dẫn chọn ngành nghề phù hợp với bạn.
                </p>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                  Xem ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Danh sách bài viết */}
        <div className="container mx-auto px-4 py-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Danh sách bài viết
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg overflow-hidden"
              >
                <img
                  src="https://cdn-new.topcv.vn/unsafe/300x/https://static.topcv.vn/cms/du-hoc-nganh-dieu-duong-tai-duc-topcv.jpg678e1ccb3d10a.jpg"
                  alt="Bài viết"
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-sm font-bold text-gray-800 mb-2">
                  Review chương trình du học nghề Điều dưỡng tại Đức: Điều kiện, mức lương {index + 1}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Đức đang phải đối mặt với tình trạng già hóa dân số cao, dẫn đến sự thiếu hụt trầm trọng về nhân lực trong ngành Y tế, đặc biệt là Điều dưỡng. {index + 1}.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Banner MBTI */}
        <div className="bg-green-100 py-10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-green-700 mb-4">
              Trắc nghiệm tính cách MBTI
            </h2>
            <p className="text-gray-700 mb-6">
              Làm trắc nghiệm MBTI để khám phá tính cách và định hướng nghề
              nghiệp phù hợp với bạn.
            </p>
            <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition">
              Làm trắc nghiệm ngay
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Handbook;