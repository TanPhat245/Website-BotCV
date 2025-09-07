import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const ToggleQuyDinh = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border border-green-500 rounded-md p-4 bg-white shadow-md">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-green-600 font-bold text-lg">Quy định</h2>
        {isOpen ? <ChevronUp className="text-green-500" /> : <ChevronDown className="text-green-500" />}
      </div>

      {isOpen && (
        <div className="mt-3 space-y-3 text-sm text-gray-700">
          <p>
            Để đảm bảo chất lượng dịch vụ, BotCV{" "}
            <span className="text-red-500 font-semibold">không cho phép một người dùng tạo nhiều tài khoản khác nhau.</span>
          </p>
          <p>
            Nếu phát hiện vi phạm, BotCV sẽ ngừng cung cấp dịch vụ tới tất cả các tài khoản trùng lặp hoặc chặn toàn bộ truy cập tới hệ thống website của TopCV.
          </p>
          <p>
            Sau khi đăng ký tài khoản nhà tuyển dụng (NTD) và cung cấp các thông tin cần thiết, NTD có thể được hỗ trợ hiển thị tin tuyển dụng cơ bản (standard),
            ngoài trừ một số vị trí nhất định. Số lượng tin đăng và cách thức hiển thị phụ thuộc vào quy định của TopCV tại từng thời điểm.
          </p>
          <p>
            Mọi thắc mắc vui lòng liên hệ Hotline CSKH:
            <br />
            📞 <strong>(024) 71079799</strong> &nbsp; 📞 <strong>0862 691929</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default ToggleQuyDinh;
