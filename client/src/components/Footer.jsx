import React from 'react';
import { FaFacebook, FaYoutube, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-100 text-gray-700">
      {/* Footer Content */}
      <div className="container mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Tìm việc làm trên ứng dụng */}
        <div>
          <h3 className="font-bold text-lg mb-4">TÌM VIỆC LÀM TRÊN ỨNG DỤNG BOTCV</h3>
          <img
            src="https://1.bp.blogspot.com/-dHN4KiD3dsU/XRxU5JRV7DI/AAAAAAAAAz4/u1ynpCMIuKwZMA642dHEoXFVKuHQbJvwgCEwYBhgL/s1600/qr-code.png"
            alt="QR Code"
            className="mb-4 w-32 h-32 object-cover"
          />
        </div>

        {/* Về việc làm tốt */}
        <div>
          <h3 className="font-bold text-lg mb-4">VỀ BOTCV</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-blue-500">Về botCV</a></li>
            <li><a href="#" className="hover:text-blue-500">Quy chế hoạt động</a></li>
            <li><a href="#" className="hover:text-blue-500">Chính sách bảo mật</a></li>
            <li><a href="#" className="hover:text-blue-500">Giải quyết tranh chấp</a></li>
            <li><a href="#" className="hover:text-blue-500">Điều khoản sử dụng</a></li>
          </ul>
        </div>

        {/* Liên kết */}
        <div>
          <h3 className="font-bold text-lg mb-4">LIÊN KẾT</h3>
          <div className="flex gap-4 mb-4">
            <FaFacebook className="text-blue-600 text-2xl cursor-pointer hover:scale-110 transition" />
            <FaYoutube className="text-red-600 text-2xl cursor-pointer hover:scale-110 transition" />
            <FaLinkedin className="text-blue-500 text-2xl cursor-pointer hover:scale-110 transition" />
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-gray-200 text-center py-4 text-sm">
        <p>
          CÔNG TY TNMTV PHAT - Người đại diện theo pháp luật: Huỳnh Tấn Phát;
          <br />
          Địa chỉ: Tầng 18, Tòa nhà UOA, Số 6 đường Tân Trào, Phường Tân Phú, Quận 7, Thành phố Hồ Chí Minh, Việt Nam.
        </p>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-5 right-5 bg-black text-white text-xs p-3 rounded-lg shadow-lg transition"
      >
        ⬆
        <p>Đầu</p>
        <p>trang</p>
      </button>
    </div>
  );
};

export default Footer;