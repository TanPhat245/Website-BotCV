import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar"; // Thanh điều hướng
import Footer from "../components/Footer"; // Footer
import { FaSearch } from "react-icons/fa"; // Icon tìm kiếm
import { Link } from "react-router-dom";
import axios from "axios";
import JobCardCollect from "../components/JobCardCollect";
import { useSearchParams } from "react-router-dom";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Box,
  Typography,
  Popover,
  Button,
} from "@mui/material";
const CollectionJobs = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedSalary, setSelectedSalary] = useState("");
  const [selectedProvinceCodes, setSelectedProvinceCodes] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedProvinceNames, setSelectedProvinceNames] = useState([]);
  const [allDistricts, setAllDistricts] = useState([]);
  const [careerOptions, setCareerOptions] = useState([]);
  const [provinceAnchorEl, setProvinceAnchorEl] = useState(null);
  const [districtAnchorEl, setDistrictAnchorEl] = useState(null);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const toggleAll = (setter) => setter([]);
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const jobsPerPage = 12;
  //Title
  useEffect(() => {
    document.title = "Danh sách việc làm | BotCV";
  }, []);
  // Toggle chọn ngành
  const handleCategoryToggle = (value) => {
    setSelectedCategories((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };
  // State lọc ngành nghề (nhiều ngành)
  const [selectedCategories, setSelectedCategories] = useState([]);
  //Fetch danh sách job--xong
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND}api/jobs`);
        const data = await res.json();
        if (data.success) {
          setJobs(data.jobs);
        } else {
          console.error("Lỗi lấy dữ liệu job:", data.message);
        }
      } catch (error) {
        console.error("Lỗi gọi API:", error);
      }
    };
    fetchJobs();
  }, [searchKeyword]);
  //parse lại cái lương lấy dưới và trên
  const parseSalaryRange = (rangeStr) => {
    const lower = rangeStr.toLowerCase();

    if (lower.includes("dưới")) {
      const max = parseInt(lower.replace(/[^\d]/g, ""));
      return { min: 0, max };
    }

    if (lower.includes("trên")) {
      const min = parseInt(lower.replace(/[^\d]/g, ""));
      return { min, max: Infinity };
    }

    const [minStr, maxStr] = lower.replace(/[^\d\-]/g, "").split("-");
    return {
      min: parseInt(minStr),
      max: parseInt(maxStr),
    };
  };
  //lấy api tỉn
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await axios.get("https://provinces.open-api.vn/api/p/");
        setProvinces(res.data);
      } catch (err) {
        console.error("Lỗi fetch danh sách tỉnh:", err);
      }
    };
    fetchProvinces();
  }, []);
  //chọn checkbox
  const toggleCheckbox = (value, selectedList, setSelectedList) => {
    if (selectedList.includes(value)) {
      setSelectedList(selectedList.filter((item) => item !== value));
    } else {
      setSelectedList([...selectedList, value]);
    }
  };
  // Chuẩn hóa tên tỉnh
  const cleanProvinceName = (name) =>
    name.replace(/^(Thành Phố|Tỉnh)\s+/i, "").trim();
  // Chuẩn hóa tên huyện
  const cleanDistrictName = (name) =>
    name.replace(/^(Quận|Huyện|Thị xã|Thành phố)\s+/i, "").trim();
  //Logic Lọc danh sách công việc
  const filteredJobs = jobs.filter((jobItem) => {
    //tìm tên
    const matchesKeyword =
      searchKeyword === "" ||
      jobItem.title.toLowerCase().includes(searchKeyword.toLowerCase());
    //Ngành
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.some(
        (c) => c.toLowerCase().trim() === jobItem.category?.toLowerCase().trim()
      );
    //Vi tri
    const matcheslevel =
      selectedLevel === "" || jobItem.level === selectedLevel;
    //Kinh ngịm
    const matchesExperience =
      selectedExperience === "" || jobItem.experiences === selectedExperience;
    //loaij hinh lam
    const matchesType = selectedType === "" || jobItem.type === selectedType;
    // Lọc theo hình thức làm việc
    const matchesTime = selectedTime === "" || jobItem.time === selectedTime;
    //Lương min max là để lọc theo khoảng
    const matchesSalary =
      selectedSalary === "" ||
      (() => {
        const { min, max } = parseSalaryRange(selectedSalary);
        return jobItem.salary?.max >= min && jobItem.salary?.min <= max;
      })();
    // Province: chuẩn hóa trên dữ liệu jobItem.provinceCode (lưu kiểu tên)
    const jobProv = cleanProvinceName(jobItem.provinceCode);
    const matchesProvince =
      selectedProvinceNames.length === 0 ||
      selectedProvinceNames.includes(jobProv);
    // District: chuẩn hóa trên jobItem.district
    const jobDist = cleanDistrictName(jobItem.district);
    const matchesDistrict =
      selectedDistricts.length === 0 || selectedDistricts.includes(jobDist);
    return (
      matchesKeyword &&
      matchesCategory &&
      matchesExperience &&
      matchesSalary &&
      matchesProvince &&
      matchesDistrict &&
      matcheslevel &&
      matchesTime &&
      matchesType
    );
  });
  // Phân trang
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const displayedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  // Fetch huyện khi chọn tỉnh
  useEffect(() => {
    if (selectedProvinceCodes.length > 0) {
      // Nếu đã chọn tỉnh, fetch riêng huyện của từng tỉnh
      const fetchDistrictsForProvinces = async () => {
        try {
          const arr = [];
          for (const code of selectedProvinceCodes) {
            const res = await axios.get(
              `https://provinces.open-api.vn/api/p/${code}?depth=2`
            );
            arr.push(...res.data.districts);
          }
          setDistricts(arr);
        } catch (err) {
          console.error("Lỗi fetch huyện cho tỉnh:", err);
        }
      };
      fetchDistrictsForProvinces();
    } else {
      // Nếu không chọn tỉnh nào → hiển thị full list ban đầu
      setDistricts(allDistricts);
    }
  }, [selectedProvinceCodes, allDistricts]);
  // Fetch tất cả huyện một lần để làm full list
  useEffect(() => {
    const fetchAllDistricts = async () => {
      try {
        // Lấy toàn bộ tỉnh + huyện depth=2
        const res = await axios.get(
          "https://provinces.open-api.vn/api/?depth=2"
        );
        // flatMap ra toàn bộ huyện
        const flat = res.data.flatMap((p) => p.districts);
        setAllDistricts(flat);
        // Khởi tạo districts bằng full list
        setDistricts(flat);
      } catch (err) {
        console.error("Lỗi fetch all districts:", err);
      }
    };
    fetchAllDistricts();
  }, []);
  // xử lý dữ liệu job theo category
  useEffect(() => {
    if (category) {
      axios.get(`/api/jobs?category=${category}`).then((res) => {});
    }
  }, [category]);
  //Api lấy danh sách ngành nghề--xong
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND}api/admin/list`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const formatted = data.data.map((item) => ({
            value: item.name,
            label: item.name,
          }));
          setCareerOptions(formatted);
        } else {
          console.error("Dữ liệu ngành nghề không hợp lệ");
        }
      } catch (err) {
        console.error("Lỗi khi fetch ngành nghề:", err);
      }
    };

    fetchIndustries();
  }, []);
  const scrollToJobList = () => {
    setTimeout(() => {
      const element = document.getElementById("job-list");
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        {/* Thanh điều hướng */}
        <div className="container mx-auto px-4 py-4">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-500">
              Trang chủ
            </Link>
            <span className="mx-2">/</span>
            <Link to="/collection-jobs" className="hover:text-blue-500">
              Cơ hội việc làm
            </Link>
          </nav>
        </div>
        {/*Thanh tìm kiếm thêm logic fetch lại danh sách job khi Xóa từ khóa */}
        <div className="sticky top-16 z-40 px-4 py-3">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-4 cursor-pointer">
              {/* Ô input với nút X */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Nhập từ khóa..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSearchResultCount(null);
                  }}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSearchKeyword("");
                      setCurrentPage(1);
                      setTimeout(() => {
                        const element = document.getElementById("job-list");
                        if (element)
                          element.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
                    title="Xóa từ khóa"
                  >
                    &times;
                  </button>
                )}
              </div>

              {/* Nút tìm kiếm */}
              <button
                onClick={() => {
                  setSearchKeyword(searchTerm);
                  setCurrentPage(1);
                  setTimeout(() => {
                    const element = document.getElementById("job-list");
                    if (element) element.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg flex items-center gap-2"
              >
                <FaSearch />
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 min-h-screen">
          {/* tiêu đề */}
          <div className="bg-white shadow-md py-6">
            <div className="container mx-auto px-4">
              <h1
                className="text-2xl font-bold text-gray-800 mb-4"
                id="job-list"
              >
                Tuyển dụng {jobs.length} việc làm tại Toàn quốc mới nhất năm
                2025
              </h1>
              <div>
                {/* Nút thu gọn/mở rộng bộ lọc */}
                <div className="flex justify-end mb-2">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setFiltersCollapsed((prev) => !prev)}
                  >
                    {filtersCollapsed ? "Mở bộ lọc" : "Thu gọn bộ lọc"}
                  </Button>
                </div>

                {/* Bọc bộ lọc bên trong kiểm tra collapsed */}
                {!filtersCollapsed && (
                  <>
                    {/* Các dropdown & filter của bạn */}
                    <div className="flex flex-wrap gap-4">
                      {/*Các dropdown */}
                      <div className="flex flex-wrap gap-4">
                        <div className="flex flex-wrap gap-4">
                          {/* Checkbox Ngành nghề */}
                          <FormControl component="fieldset" sx={{ mb: 2 }}>
                            <Typography
                              variant="subtitle1"
                              fontWeight={600}
                              gutterBottom
                            >
                              Ngành nghề
                            </Typography>
                            <Box
                              sx={{
                                maxHeight: 250,
                                overflowY: "auto",
                                border: "1px solid #ccc",
                                borderRadius: 2,
                                pl: 2,
                                pr: 1,
                                py: 1,
                              }}
                            >
                              <FormGroup>
                                {careerOptions.map((category) => {
                                  const jobCount = jobs.filter(
                                    (job) =>
                                      job.category?.toLowerCase().trim() ===
                                      category.value.toLowerCase().trim()
                                  ).length;

                                  return (
                                    <FormControlLabel
                                      key={category.value}
                                      control={
                                        <Checkbox
                                          checked={selectedCategories.includes(
                                            category.value
                                          )}
                                          onChange={() => {
                                            handleCategoryToggle(
                                              category.value
                                            );
                                            scrollToJobList();
                                          }}
                                        />
                                      }
                                      label={`${category.label} (${jobCount})`}
                                    />
                                  );
                                })}
                              </FormGroup>
                            </Box>
                          </FormControl>
                          {/* Các dropdown lọc khác */}
                          <Box display="flex" flexWrap="wrap" gap={2}>
                            {/* Cấp bậc */}
                            <FormControl sx={{ minWidth: 160 }} size="small">
                              <InputLabel>Cấp bậc</InputLabel>
                              <Select
                                value={selectedLevel}
                                onChange={(e) => {
                                  setSelectedLevel(e.target.value);
                                  scrollToJobList();
                                }}
                                label="Cấp bậc"
                              >
                                <MenuItem value="">Tất cả</MenuItem>
                                {[
                                  "Thực tập",
                                  "Nhân viên",
                                  "Trưởng nhóm",
                                  "Quản lý",
                                  "Giám đốc",
                                ].map((lvl) => (
                                  <MenuItem key={lvl} value={lvl}>
                                    {lvl}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            {/* Kinh nghiệm */}
                            <FormControl sx={{ minWidth: 160 }} size="small">
                              <InputLabel>Kinh nghiệm</InputLabel>
                              <Select
                                value={selectedExperience}
                                onChange={(e) => {
                                  setSelectedExperience(e.target.value);
                                  scrollToJobList();
                                }}
                                label="Kinh nghiệm"
                              >
                                <MenuItem value="">Tất cả</MenuItem>
                                {[
                                  "Không yêu cầu",
                                  "Dưới 1 năm",
                                  "1 năm",
                                  "2 năm",
                                  "3 năm",
                                  "4 năm",
                                  "Trên 5 năm",
                                ].map((exp) => (
                                  <MenuItem key={exp} value={exp}>
                                    {exp}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            {/* Lương */}
                            <FormControl sx={{ minWidth: 160 }} size="small">
                              <InputLabel>Lương</InputLabel>
                              <Select
                                value={selectedSalary}
                                onChange={(e) => {
                                  setSelectedSalary(e.target.value);
                                  scrollToJobList();
                                }}
                                label="Lương"
                              >
                                <MenuItem value="">Tất cả</MenuItem>
                                {[
                                  "Dưới 10 triệu",
                                  "10 - 15 triệu",
                                  "15 - 20 triệu",
                                  "20 - 25 triệu",
                                  "25 - 30 triệu",
                                  "30 - 35 triệu",
                                  "Trên 35 triệu",
                                ].map((salary) => (
                                  <MenuItem key={salary} value={salary}>
                                    {salary}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            {/* Hình thức làm việc */}
                            <FormControl sx={{ minWidth: 160 }} size="small">
                              <InputLabel>Hình thức</InputLabel>
                              <Select
                                value={selectedTime}
                                onChange={(e) => {
                                  setSelectedTime(e.target.value);
                                  scrollToJobList();
                                }}
                                label="Hình thức"
                              >
                                <MenuItem value="">Tất cả</MenuItem>
                                {[
                                  "Toàn thời gian",
                                  "Bán thời gian",
                                  "Thực tập",
                                  "Freelance",
                                  "Khác",
                                ].map((time) => (
                                  <MenuItem key={time} value={time}>
                                    {time}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>

                            {/* Loại hình làm việc */}
                            <FormControl sx={{ minWidth: 160 }} size="small">
                              <InputLabel>Loại hình</InputLabel>
                              <Select
                                value={selectedType}
                                onChange={(e) => {
                                  setSelectedType(e.target.value);
                                  scrollToJobList();
                                }}
                                label="Loại hình"
                              >
                                <MenuItem value="">Tất cả</MenuItem>
                                {["On-site", "Remote", "Hybrid"].map((type) => (
                                  <MenuItem key={type} value={type}>
                                    {type}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Dropdown Tỉnh điều chỉnh giao diện và bấm mở ngoài toggle vẫn đóng hoặc bấm dropdown huyện */}
                        <Box sx={{ mt: 2 }}>
                          <Button
                            variant="outlined"
                            onClick={(e) =>
                              setProvinceAnchorEl(e.currentTarget)
                            }
                          >
                            {selectedProvinceCodes.length > 0
                              ? `${selectedProvinceCodes.length} tỉnh được chọn`
                              : "Chọn tỉnh"}
                          </Button>

                          <Popover
                            open={Boolean(provinceAnchorEl)}
                            anchorEl={provinceAnchorEl}
                            onClose={() => setProvinceAnchorEl(null)}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "left",
                            }}
                          >
                            <Box sx={{ p: 2, width: 400 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  mb: 1,
                                  alignItems: "center",
                                }}
                              >
                                <Typography fontWeight={600}>
                                  Chọn tỉnh
                                </Typography>
                                <Button
                                  color="error"
                                  size="small"
                                  onClick={() => {
                                    setSelectedProvinceCodes([]);
                                    setSelectedProvinceNames([]);
                                    setDistricts(allDistricts);
                                    setSelectedDistricts([]);
                                  }}
                                >
                                  Xóa tất cả
                                </Button>
                              </Box>

                              <Box sx={{ maxHeight: 250, overflowY: "auto" }}>
                                <FormGroup>
                                  {provinces.map((province) => {
                                    const cleaned = cleanProvinceName(
                                      province.name
                                    );
                                    return (
                                      <FormControlLabel
                                        key={province.code}
                                        control={
                                          <Checkbox
                                            checked={selectedProvinceCodes.includes(
                                              province.code
                                            )}
                                            onChange={() => {
                                              toggleCheckbox(
                                                province.code,
                                                selectedProvinceCodes,
                                                setSelectedProvinceCodes
                                              );
                                              toggleCheckbox(
                                                cleaned,
                                                selectedProvinceNames,
                                                setSelectedProvinceNames
                                              );
                                            }}
                                          />
                                        }
                                        label={province.name}
                                      />
                                    );
                                  })}
                                </FormGroup>
                              </Box>
                            </Box>
                          </Popover>
                        </Box>
                        {/* Dropdown Huyện điều chỉnh giao diện và bấm mở ngoài toggle vẫn đóng hoặc bấm dropdown tỉnh*/}
                        <Box sx={{ mt: 2 }}>
                          <Button
                            variant="outlined"
                            onClick={(e) =>
                              setDistrictAnchorEl(e.currentTarget)
                            }
                          >
                            {selectedDistricts.length > 0
                              ? `${selectedDistricts.length} huyện được chọn`
                              : "Chọn huyện"}
                          </Button>

                          <Popover
                            open={Boolean(districtAnchorEl)}
                            anchorEl={districtAnchorEl}
                            onClose={() => setDistrictAnchorEl(null)}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "left",
                            }}
                          >
                            <Box sx={{ p: 2, width: 300 }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  mb: 1,
                                  alignItems: "center",
                                }}
                              >
                                <Typography fontWeight={600}>
                                  Chọn huyện
                                </Typography>
                                <Button
                                  color="error"
                                  size="small"
                                  onClick={() =>
                                    toggleAll(setSelectedDistricts)
                                  }
                                >
                                  Xóa tất cả
                                </Button>
                              </Box>

                              <Box sx={{ maxHeight: 250, overflowY: "auto" }}>
                                <FormGroup>
                                  {districts.map((district) => {
                                    const cleaned = cleanDistrictName(
                                      district.name
                                    );
                                    return (
                                      <FormControlLabel
                                        key={district.code}
                                        control={
                                          <Checkbox
                                            checked={selectedDistricts.includes(
                                              cleaned
                                            )}
                                            onChange={() =>
                                              toggleCheckbox(
                                                cleaned,
                                                selectedDistricts,
                                                setSelectedDistricts
                                              )
                                            }
                                          />
                                        }
                                        label={district.name}
                                      />
                                    );
                                  })}
                                </FormGroup>
                              </Box>
                            </Box>
                          </Popover>
                        </Box>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* Danh sách công việc */}
          <div className="container mx-auto px-4 py-6">
            {displayedJobs.length > 0 ? (
              <div className="flex flex-col gap-4">
                {displayedJobs.map((job) => (
                  <JobCardCollect key={job._id} job={job} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">
                Không tìm thấy công việc phù hợp.
              </p>
            )}
          </div>
          {/* Phân trang */}
          <div className="container mx-auto px-4 py-6 flex justify-center">
            <nav className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <a href="#job-list" key={index}>
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {index + 1}
                  </button>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CollectionJobs;
