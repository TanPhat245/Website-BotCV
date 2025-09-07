import mongoose from "mongoose";

const ApplySchema = new mongoose.Schema(
  {
    userId: { type: String, ref: "User", required: true },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruiter",
      required: true,
    },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    status: {
      type: String,
      default: "Đã ứng tuyển",
      enum: [
        "Đã ứng tuyển",
        "Tiếp nhận hồ sơ",
        "Phù hợp",
        "Chưa phù hợp",
        "Hẹn phỏng vấn",
        "Gửi đề nghị",
        "Nhận đề nghị",
        "Từ chối",
        "Nhận công việc",
        "Ứng viên rút hồ sơ",
        "Hủy bởi hệ thống",
      ],
    },
    date: { type: Date, required: true, default: Date.now },
    userName: { type: String },
    userPhone: { type: String },
    userEmail: { type: String },
    userAddress: { type: String },
    userCvUrl: { type: String },
    jobTitle: { type: String },
    interview: {
      subject: String,
      time: Date,
      location: String,
      rules: String,
    },
  },
  { timestamps: true }
);

const Apply = mongoose.model("Apply", ApplySchema);
export default Apply;

//Đã ứng tuyển -> đã nhận hồ sơ -> Phỏng vấn(hệ thống tự động gửi mail cho ứng viên) -> Đã tuyển/Từ chối -> Ứng viên rút hồ sơ(ứng viên tự hủy đơn ứng tuyển, hệ thống tự gửi email cho nhà tuyển dụng)-> Hủy bởi hệ thống(Mail cho ứng viên)
//------------------------------Cần làm-------------------------------
//Thêm logic tự động đóng job bằng cron,--xong có test 1p
//Thêm field địa điểm làm việc cho job, thêm địa chỉ cụ thể cho người nhà tuyển dụng nhập ở JobModel.js và companyController.js --xong
//Nhập database cho field website ở mongoDB, thêm ở frontend--xong
//Nhập cho địa chỉ job--xong
//Thêm các button thêm tin, ứng viên, công ty ngay navbar vị trí Dashboard.jsx--đã xong
//Khi deploy nhớ thay đổi mấy cái link localhost và để vào env cho dễ quản lý
//Thêm bộ lọc tin tuyển dụng, mới nhất, cũ nhất, thêm cột deadline, truncate tên, thêm nút xem nhanh(bấm vào hiện bản thông tin job). và responsive

//-----------------------------case -----------------------------
//thêm trang xem cv gồm thông tin ứng viên, hình ảnh, full thông tin user. model user thêm ảnh đại diện--đã xong
//Thống kê - của nhà tuyển dụng, xuất excel--đã xong
//thêm logic check thông tin hồ sơ tìm việc đủ thông tin chưa, chưa thì k cho ứng tuyển--xong
//Thêm nếu tin quá hạn thì tin đó k nổi bật--xong
//Thêm nhãn dán cho đăng ký--xong
//Thêm giờ làm việc (2 khoảng thời gian)--xong
//Frontend thêm dòng Địa điểm làm việc, thời gian làm dưới nút ứng tuyển 2--xong
//Sửa lại db của des 23 job j đó rổi--xong
//Đã có xác nhận mail--xong logic mọi thứ xác minh mail.
//Thông báo ngoài trang chủ khi xác minh mail và hướng dẫn người dùng cách xác minh(có thể đóng banner thông báo đó, hiển thị baner thông báo mỗi khi người dùng về trang chủ).

//--Sau bao cao lam
//Thông báo nhà tuyển dụng, ứng viên mới, đăng tin mới, tin hết hạn, xác thực tài khoản thành công.
//ứng tuyển dụng phải thay đổi thông tin của tin đã ứng tuyển. vd: lần 1, lần 2, 2 đè lên 1 trùng giữ nguyên khác lấy 2
//Tìm kiếm trang chủ thêm bảng gợi ý tìm kiếm--xong
//giới hạn ký tự ở des--xong
//Quên mật khẩu backend + frontend, xác thực mail khi người dùng quên mật khẩu.--khoong lam giai thich
//DEPLOY
//SỬA CÁC LINK LOCLAHOST TRONG FRONTEND THÀNH ENV, TATWS ENV KHI ĐƯA LÊN GITHUB

//Sửa lại giao diện thông báo rõ hơn, nội dung gửi mail--xong
//Thêm xác nhận thông tin tài khoản để thêm được hồ sơ công ty của nhà tuyển dụng--
// xác nhận bằng cách Ấn vào nút xác nhận hệ thống sẽ gửi về mail của nhà tuyển dụng(company) nhà tuyển dụng vào mail và ấn xác nhận,
// khi ấn sẽ chuyển hướng lại đến trang chủ và thông báo xác nhận tài khoản thành công.
//Sửa giao diện thông báo
//Sửa phần công ty ngay trang chủ
//rush báo cáo gửi
