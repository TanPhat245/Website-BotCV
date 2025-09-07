import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import { JobExperiences, JobLevels, JobTypes } from "../../assets/assets";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddJob = () => {
  const [title, setTitle] = useState("");
  const [salary, setSalary] = useState({ min: "", max: "", negotiable: false });
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("Thực tập");
  const [type, setType] = useState("On-site");
  const [experiences, setExperiences] = useState("Không yêu cầu");
  const [slots, setSlots] = useState(1);
  const [time, setTime] = useState("Toàn thời gian");
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [deadline, setDeadline] = useState("");
  const [address, setAddress] = useState("");
  const [workingHours, setWorkingHours] = useState([{ from: "", to: "" }]);
  const token = localStorage.getItem("companyToken");
  const [industryList, setIndustryList] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [companyInfo, setCompanyInfo] = useState(null);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();
  const [hasProfile, setHasProfile] = useState(true);

  // Fetch tỉnh
  useEffect(() => {
    axios
      .get("https://provinces.open-api.vn/api/p/")
      .then((res) => setProvinces(res.data))
      .catch((err) => console.error(err));
  }, []);
  // Fetch huyện theo tỉnh
  useEffect(() => {
    if (selectedProvinceCode) {
      axios
        .get(
          `https://provinces.open-api.vn/api/p/${selectedProvinceCode}?depth=2`
        )
        .then((res) => setDistricts(res.data.districts))
        .catch((err) => console.error(err));
    }
  }, [selectedProvinceCode]);
  // Khởi tạo Quill
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (editorRef.current && !quillRef.current) {
        quillRef.current = new Quill(editorRef.current, {
          theme: "snow",
          placeholder: "Nhập mô tả chi tiết công việc...",
        });
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);
  //Hàm xử lý chuỗi của của nợ tỉnh và huyện
  const removePrefix = (name) => {
    return name
      .replace(/^Tỉnh\s+/i, "")
      .replace(/^Thành phố\s+/i, "")
      .replace(/^Huyện\s+/i, "")
      .replace(/^Quận\s+/i, "")
      .replace(/^Thị xã\s+/i, "");
  };
  //Kết nối api
  const handleSubmit = async (e) => {
    e.preventDefault();
    const description = quillRef.current.root.innerHTML;
    const selectedProvince = provinces.find(
      (p) => p.code === Number(selectedProvinceCode)
    );
    const provinceName = selectedProvince
      ? removePrefix(selectedProvince.name)
      : "";
    const districtName = removePrefix(selectedDistrict);
    //kiểm tra deadline
    const now = new Date();
    const selectedDeadline = new Date(deadline);
    const threeDaysLater = new Date();
    threeDaysLater.setDate(now.getDate() + 3);

    if (selectedDeadline < now) {
      toast.warning("Hạn nộp hồ sơ không được nhỏ hơn ngày hiện tại.");
      return;
    }

    if (selectedDeadline < threeDaysLater) {
      toast.warning("Hạn nộp hồ sơ phải cách ngày hiện tại ít nhất 3 ngày.");
      return;
    }
    //tạo jobdata
    const jobData = {
      title,
      description,
      salary: {
        min: salary.negotiable ? 0 : Number(salary.min),
        max: salary.negotiable ? 0 : Number(salary.max),
        negotiable: salary.negotiable,
      },
      category,
      level,
      type,
      experiences,
      time,
      provinceCode: provinceName,
      district: districtName,
      visible: true,
      slot: Number(slots),
      degree: "Không yêu cầu",
      deadline,
      address,
      workingHours: workingHours.map((w) => `${w.from} - ${w.to}`),
    };
    //gọi api
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND}api/company/post-job`,
        jobData,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Kiểm tra ngành nghề đã có chưa (Có thì thôi, chưa thì tạo mới)
      try {
        if (
          !industryList.some(
            (name) =>
              name.trim().toLowerCase() === category.trim().toLowerCase()
          )
        ) {
          await axios.post(
            `${import.meta.env.VITE_BACKEND}api/company/create-industry`,
            { name: category.trim() },
            {
              headers: {
                Authorization: token,
                "Content-Type": "application/json",
              },
            }
          );
        }
      } catch (err) {
        console.error("Không thể tạo ngành mới:", err);
        toast.error("Tạo ngành nghề mới thất bại!");
        return;
      }

      //Xong thông báo
      toast.success("Đăng tin thành công!");
      navigate("/dashboard/manage-jobs");
      scrollTo(0, 0);
    } catch (err) {
      console.error("Lỗi:", err);
      toast.error("Đăng tin thất bại!");
    }
    console.log("Đăng tin:", jobData);
  };
  //API lấy danh sách ngành nghề dang có ở hệ thống
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND}api/admin/list`)
      .then((res) => {
        setIndustryList(res.data.data.map((item) => item.name));
      })
      .catch((err) => console.error("Lỗi tải ngành nghề:", err));
  });
  // Đóng gợi ý khi click ra ngoài(đồ local ăn trộm)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //API lấy thông tin nhà tuyển dụng sử dụng cho check xác minh tk chưa
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      const token = localStorage.getItem("companyToken");
      const res = await axios.get(`${import.meta.env.VITE_BACKEND}api/company/profile`, {
        headers: { Authorization: token },
      });
      setCompanyInfo(res.data);
    };
    fetchCompanyInfo();
  }, []);

  // Gọi API để lấy thoiong tin công ty
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND}api/recruiter/my-info`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        if (res.data && res.data.recruiter) {
          setHasProfile(true);
        } else {
          setHasProfile(false);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin công ty:", error);
        setHasProfile(false);
      }
    };
    fetchCompanyInfo();
  }, []);
  return (
    <div className="p-4">
      {/*Kiểm tra nhà tuyển dụng xác thực mail chưa*/}
      {!companyInfo?.verified ? (
        <div className="text-red-600 bg-red-50 border border-red-200 rounded p-4 space-y-2">
          <p className="font-semibold text-lg">
            Không thể đăng tin tuyển dụng do bạn chưa xác minh tài khoản.
          </p>
          {!companyInfo?.verified && <p>- Vui lòng xác minh email.</p>}
          <div className="pt-2">
            <button
              onClick={() => navigate("/dashboard/verify")}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
            >
              Xác minh ngay
            </button>
          </div>
        </div>
      ) : !hasProfile ? (
        <div className="text-orange-600 bg-orange-50 border border-orange-200 rounded p-4 space-y-2">
          <p className="font-semibold text-lg">
            Hồ sơ công ty của bạn chưa hoàn thiện.
          </p>
          <p>- Vui lòng cập nhật hồ sơ trước khi đăng tin tuyển dụng.</p>
          <div className="pt-2">
            <button
              onClick={() => navigate("/dashboard/add-info-company")}
              className="mt-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition duration-200"
            >
              Cập nhật hồ sơ ngay
            </button>
          </div>
        </div>
      ) : (
        <form
          className="max-w-6xl mx-auto px-4 py-6 bg-white rounded-xl shadow-md space-y-6"
          onSubmit={handleSubmit}
        >
          {/*Tên công việc */}
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Tên công việc</label>
            <input
              type="text"
              className="border border-gray-300 p-2 rounded"
              placeholder="Nhập tên..."
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              required
            />
          </div>
          {/*Mô tả */}
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Mô tả</label>
            <div
              ref={editorRef}
              className="bg-white border border-gray-300 rounded min-h-[200px] px-2 py-1"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Ngành nghề */}
            <div className="flex flex-col relative" ref={wrapperRef}>
              <label className="mb-1 font-semibold">Ngành nghề</label>
              <input
                type="text"
                className="border p-2 rounded z-10 relative"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="Nhập ngành nghề..."
                required
                autoComplete="off"
              />
              {showSuggestions && category && (
                <ul className="absolute top-full left-0 right-0 bg-white border mt-1 rounded shadow max-h-40 overflow-y-auto z-50">
                  {industryList
                    .filter((name) =>
                      name.toLowerCase().includes(category.toLowerCase())
                    )
                    .slice(0, 5)
                    .map((name, idx) => (
                      <li
                        key={idx}
                        onClick={() => {
                          setCategory(name);
                          setShowSuggestions(false);
                        }}
                        className="px-3 py-1 hover:bg-gray-200 cursor-pointer"
                      >
                        {name}
                      </li>
                    ))}
                </ul>
              )}
            </div>
            {/*Tỉnh */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Tỉnh</label>
              <select
                onChange={(e) => setSelectedProvinceCode(e.target.value)}
                className="border p-2 rounded"
                required
              >
                <option value="">Chọn tỉnh</option>
                {provinces.map((province) => (
                  <option key={province.code} value={province.code}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>
            {/*Huyện */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Huyện</label>
              <select
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="border p-2 rounded"
                disabled={!districts.length}
                required
              >
                <option value="">Chọn huyện</option>
                {districts.map((d) => (
                  <option key={d.code} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            {/*Hình thức làm việc */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Hình thức làm việc</label>
              <select
                onChange={(e) => setTime(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="Toàn thời gian">Toàn thời gian</option>
                <option value="Bán thời gian">Bán thời gian</option>
                <option value="Thực tập">Thực tập</option>
                <option value="Freelance">Freelance</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            {/*Kinh nghiệm */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Kinh nghiệm</label>
              <select
                onChange={(e) => setExperiences(e.target.value)}
                className="border p-2 rounded"
              >
                {JobExperiences.map((exp, index) => (
                  <option value={exp} key={index}>
                    {exp}
                  </option>
                ))}
              </select>
            </div>
            {/*Loại hình */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Loại hình</label>
              <select
                onChange={(e) => setType(e.target.value)}
                className="border p-2 rounded"
              >
                {JobTypes.map((t, index) => (
                  <option value={t} key={index}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            {/*Chức vụ */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Vị trí</label>
              <select
                onChange={(e) => setLevel(e.target.value)}
                className="border p-2 rounded"
              >
                {JobLevels.map((lvl, index) => (
                  <option value={lvl} key={index}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
            {/*Số lượng cần tuyển */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Số lượng cần tuyển</label>
              <input
                type="number"
                placeholder="Số lượng"
                className="border p-2 rounded"
                onChange={(e) => setSlots(e.target.value)}
                value={slots}
              />
            </div>
            {/*Lương */}
            <div className="flex flex-col md:col-span-2">
              <label className="mb-1 font-semibold">Lương</label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  placeholder="Tối thiểu (triệu)"
                  className="border p-2 rounded w-40"
                  disabled={salary.negotiable}
                  onChange={(e) =>
                    setSalary({ ...salary, min: e.target.value })
                  }
                  value={salary.min}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Tối đa (triệu)"
                  className="border p-2 rounded w-40"
                  disabled={salary.negotiable}
                  onChange={(e) =>
                    setSalary({ ...salary, max: e.target.value })
                  }
                  value={salary.max}
                />
                <label className="flex items-center gap-2 ml-4">
                  <input
                    type="checkbox"
                    checked={salary.negotiable}
                    onChange={() =>
                      setSalary((prev) => ({
                        ...prev,
                        negotiable: !prev.negotiable,
                      }))
                    }
                  />
                  Thỏa thuận
                </label>
                <div className="flex flex-col ml-2">
                  <label className="mb-1 font-semibold">Hạn nộp hồ sơ</label>
                  <input
                    type="date"
                    className="border p-2 rounded"
                    onChange={(e) => setDeadline(e.target.value)}
                    value={deadline}
                    required
                  />
                </div>
              </div>
            </div>
            {/* Địa chỉ cụ thể */}
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Địa chỉ cụ thể</label>
              <input
                type="text"
                placeholder="Ví dụ: Tòa nhà ABC, số 123 Đường XYZ..."
                className="border p-2 rounded"
                onChange={(e) => setAddress(e.target.value)}
                value={address}
                required
              />
            </div>
            {/* Giờ làm việc */}
            <div>
              <label className="font-semibold mb-1 block">Giờ làm việc</label>
              {workingHours.map((item, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="time"
                    value={item.from}
                    onChange={(e) => {
                      const updated = [...workingHours];
                      updated[index].from = e.target.value;
                      setWorkingHours(updated);
                    }}
                    className="border p-2 rounded"
                    required
                  />
                  <span>-</span>
                  <input
                    type="time"
                    value={item.to}
                    onChange={(e) => {
                      const updated = [...workingHours];
                      updated[index].to = e.target.value;
                      setWorkingHours(updated);
                    }}
                    className="border p-2 rounded"
                    required
                  />
                  {workingHours.length > 1 && (
                    <button
                      type="button"
                      className="text-red-600 ml-2"
                      onClick={() => {
                        setWorkingHours(
                          workingHours.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      X
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setWorkingHours([...workingHours, { from: "", to: "" }])
                }
                className="text-blue-600 text-sm underline"
              >
                + Thêm khoảng giờ
              </button>
            </div>
          </div>
          {/*Nút đăng tin */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Đăng tin
          </button>
        </form>
      )}
    </div>
  );
};

export default AddJob;
