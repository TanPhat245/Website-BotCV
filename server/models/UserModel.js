  import mongoose from "mongoose";
  // models/UserModel.js
  const userSchema = new mongoose.Schema(
    {
    //field thuộc tài khoản, riêng field name và phone sẽ dùng chung cho cả 2
    name: { type: String, required: [true, 'Vui lòng nhập tên']},
    email: { type: String, required: [true, 'Vui lòng nhập email'], unique: true, lowercase: true },
    phone: { type: String, required: [true, 'Vui lòng nhập số điện thoại']},
    password: { type: String, required: [true, 'Vui lòng nhập mật khẩu']},
    //field thuộc hồ sơ
    degree: {type: String,enum: ["Trung học", "Phổ thông", "Cử nhân", "Kỹ sư", "Thạc sĩ", "Tiến sĩ"], default: null},
    field: {type: String, default: null},
    level: {type: String, default: null},
    cvUrl: {type: String, default: null},
    address: {type: String, default: null}
  }, { timestamps: true }

  );

  const User =  mongoose.model("User", userSchema);
  export default User