import React, { useEffect, useState } from "react";
import JobCard from "./JobCard";
import { JobLocations } from "../assets/assets";
import { FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { WebContext } from "../context/WebContext";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [searchFilter, setSearchFilter] = useState({
    title: "",
    provinceCode: "",
  });
  const [industries, setIndustries] = useState([]);
  const { isSearched, setIsSearched, searchResults, setSearchResults } =
    useContext(WebContext);
  const navigate = useNavigate();
  //Fetch dữ liệu job từ API--xong
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

    if (!isSearched) {
      fetchJobs();
    } else {
      setJobs(searchResults);
    }
  }, [isSearched, searchResults]);
  //Logic lọc công việc
  useEffect(() => {
    const matchesCategory = (job) =>
      selectedCategories.length === 0 ||
      selectedCategories.some(
        (cat) => cat.toLowerCase().trim() === job.category.toLowerCase().trim()
      );
    const matchesLocation = (job) =>
      selectedLocations.length === 0 ||
      selectedLocations.includes(job.provinceCode);
    const matchesTitle = (job) =>
      searchFilter.title === "" ||
      job.title.toLowerCase().includes(searchFilter.title.toLowerCase());
    const matchesSearchLocation = (job) =>
      searchFilter.provinceCode === "" ||
      job.provinceCode
        .toLowerCase()
        .includes(searchFilter.provinceCode.toLowerCase());

    const result = jobs.filter(
      (job) =>
        matchesCategory(job) &&
        matchesLocation(job) &&
        matchesTitle(job) &&
        matchesSearchLocation(job)
    );
    setFilteredJobs(result);
  }, [jobs, selectedCategories, selectedLocations, searchFilter]);
  //Xóa bộ lọc
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedLocations([]);
    setSelectedTypes([]);
  };
  //API lấy danh sách ngành nghề--xong
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND}api/admin/list`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setIndustries(data.data.map((item) => item.name));
        } else {
          console.error("Dữ liệu ngành nghề không hợp lệ");
        }
      } catch (error) {
        console.error("Lỗi khi fetch ngành nghề:", error);
      }
    };

    fetchIndustries();
  }, []);

  return (
    <div
      id="job-list"
      className="container 2xl:px-20 mx-auto flex flex-col lg:flex-row py-8"
    >
      {/* Sidebar filter */}
      <div className="w-full lg:w-1/4 bg-white px-4 border">
        <div className="flex items-center justify-between p-4 rounded-md">
          <div className="flex items-center gap-2 text-gray-800 font-semibold text-lg mt-2">
            <FaFilter className="text-green-500" />
            <h1>Bộ lọc</h1>
          </div>
          <button
            onClick={clearFilters}
            className="px-4 ml-5 mt-2 py-2 rounded-full font-bold text-lg text-red-600 hover:bg-red-50"
          >
            Xóa lọc ({selectedCategories.length + selectedLocations.length})
          </button>
        </div>
        {/* ngành nghề */}
        <div>
          <h4 className="font-bold text-lg py-4">Ngành nghề</h4>
          <div className="border border-green-500 rounded-md p-3 max-h-60 overflow-y-scroll scrollbar-thin scrollbar-thumb-green-400  scrollbar-track-gray-200">
            <ul className="space-y-3 text-gray-600">
              {industries.map((cat, idx) => (
                <li key={idx} className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    className="scale-125"
                    checked={selectedCategories.includes(cat)}
                    onChange={() =>
                      setSelectedCategories((prev) =>
                        prev.includes(cat)
                          ? prev.filter((c) => c !== cat)
                          : [...prev, cat]
                      )
                    }
                  />
                  {cat}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* địa điểm */}
        <div>
          <h4 className="font-bold text-lg py-4 pt-8">Địa điểm</h4>
          <div className="border border-blue-500 rounded-md p-3 max-h-60 overflow-y-scroll scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-200">
            <ul className="space-y-3 text-gray-600">
              {JobLocations.map((loc, idx) => (
                <li
                  key={idx}
                  className="flex gap-2 cursor-pointer items-center"
                >
                  <input
                    type="checkbox"
                    className="scale-125 cursor-pointer"
                    checked={selectedLocations.includes(loc)}
                    onChange={() =>
                      setSelectedLocations((prev) =>
                        prev.includes(loc)
                          ? prev.filter((l) => l !== loc)
                          : [...prev, loc]
                      )
                    }
                  />
                  {loc}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Job list */}
      <div className="ml-4 w-full lg:w-3/4 text-gray-800">
        <h3 className="font-bold text-3xl py-2">Việc làm mới nhất</h3>
        <p className="mb-8">
          Nơi bạn tìm thấy công việc phù hợp nhất với bản thân
        </p>
        <div>
          <p className="bg-yellow-100 border border-yellow-400 text-yellow-800 text-sm px-4 py-2 rounded-lg shadow w-fit mx-auto mb-4">
            💡 Di chuột và giữ 1 giây để xem mô tả công việc và Ấn xem tất cả
            công việc để hiện đầy đủ danh sách
          </p>
        </div>
        <button
          onClick={() => {
            setIsSearched(false);
            setSearchResults([]);
          }}
          className="text-blue-500 ml-2 mb-3 border-b-2 border-blue-500 hover:bg-blue-50 transition-all px-2 py-1 rounded-lg font-semibold"
        >
          Xem tất cả việc làm
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...filteredJobs]
            .sort(() => 0.5 - Math.random())
            .slice(0, 6)
            .map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => {
              navigate("/collection-jobs");
              scrollTo(0, 0);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-slate-200 hover:text-black transition"
          >
            Xem thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobList;
