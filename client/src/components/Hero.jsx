import React, { useContext, useRef } from "react";
import { assets } from "../assets/assets";
import { WebContext } from "../context/WebContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import StatisticsBar from "./StatisticsBar";
import { useEffect } from "react";
import { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Paper,
  List,
  ListItem,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
const Hero = () => {
  const { setSearchFilter, setIsSearched, setSearchResults } =
    useContext(WebContext);
  const titleRef = useRef(null);
  const locationRef = useRef(null);
  const navigate = useNavigate();
  const [jobSuggestions, setJobSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  //logic search công việc--xong
  const onSearch = async () => {
    const title = titleRef.current.value.trim();
    const location = locationRef.current.value.trim();
    const token = localStorage.getItem("userToken");
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND
        }api/user/search?title=${encodeURIComponent(
          title
        )}&provinceCode=${encodeURIComponent(location)}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        const results = data.data || [];
        setSearchFilter({ title, location });
        setIsSearched(true);
        setSearchResults(results);
        toast.success(`Tìm thấy ${results.length} công việc phù hợp!`);
        const jobListElement = document.getElementById("job-list");
        if (jobListElement) {
          jobListElement.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        toast.error(data.message || "Không tìm thấy công việc phù hợp.");
      }
    } catch (err) {
      toast.error("Lỗi khi tìm kiếm công việc.");
      console.error("Lỗi khi tìm kiếm công việc:", err);
    }
  };
  //Lấy danh sách công việc từ API--xong
  useEffect(() => {
    const fetchJobTitles = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND}api/jobs/`);
        const data = await res.json();
        if (res.ok && Array.isArray(data.jobs)) {
          const titles = data.jobs.map((job) => job.title);
          setJobSuggestions(titles);
        }
      } catch (err) {
        console.error("Không thể lấy danh sách job:", err);
      }
    };

    fetchJobTitles();
  }, []);

  return (
    <div className="container 2xl:px-20 mx-auto my-10">
      {/* Banner */}
      <div className="bg-gradient-to-r from-green-600 to-purple-900 text-white py-16 text-center mx-2 rounded-xl">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-4">
          Tìm việc khó, có{" "}
          <b className="text-green-400 underline italic">botCV</b> lo
        </h2>
        <p className="mb-8 max-w-xl mx-auto text-sm font-light px-5">
          Hãy để botCV đồng hành cùng bạn trên hành trình chinh phục sự nghiệp.
        </p>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            backgroundColor: "#fff",
            borderRadius: 2,
            color: "text.secondary",
            maxWidth: "600px",
            px: 2,
            py: 1,
            mx: { xs: 2, sm: "auto" },
          }}
        >
          {/* Vị trí tuyển dụng */}
          <Box position="relative" flex={1} mr={2}>
            <TextField
              fullWidth
              size="small"
              placeholder="Vị trí tuyển dụng"
              inputRef={titleRef}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
              onChange={(e) => {
                const value = e.target.value;
                const filtered = jobSuggestions.filter((title) =>
                  title.toLowerCase().includes(value.toLowerCase())
                );
                setFilteredSuggestions(filtered);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            {showSuggestions && filteredSuggestions.length > 0 && (
              <Paper
                sx={{
                  position: "absolute",
                  zIndex: 10,
                  mt: 0.5,
                  width: "100%",
                  maxHeight: 192,
                  overflowY: "auto",
                }}
              >
                <List dense>
                  {filteredSuggestions.map((suggestion, index) => (
                    <ListItem
                      button
                      key={index}
                      onMouseDown={() => {
                        titleRef.current.value = suggestion;
                        setShowSuggestions(false);
                      }}
                    >
                      {suggestion}
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Box>

          {/* Địa điểm */}
          <Box flex={1} mr={2}>
            <TextField
              fullWidth
              size="small"
              placeholder="Địa điểm"
              inputRef={locationRef}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Nút Tìm kiếm */}
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ fontSize: 11, whiteSpace: "nowrap", px: 3, py: 1 }}
            onClick={onSearch}
          >
            Tìm kiếm
          </Button>
        </Box>
      </div>

      {/* Thống kê */}
      <StatisticsBar />
    </div>
  );
};

export default Hero;
