import React from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/vi";

const JobCardCollect = ({ job }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate(`/apply-job/${job._id}`);
        scrollTo(0, 0);
      }}
      navigate
      className="flex items-start justify-between p-4 bg-white rounded-lg border border-green-600 cursor-pointer hover:shadow-md transition-all"
    >
      {/* Left Section: Logo and Job Details */}
      <div className="flex items-start gap-3">
        {/* Logo */}
        {job.recruiter?.logo && (
          <img
            src={`http://localhost:5000/${job.recruiter.logo.replace(
              /\\/g,
              "/"
            )}`}
            alt="Logo công ty"
            className="w-6 h-6 mr-2 rounded-full object-cover"
          />
        )}

        {/* Job Details */}
        <div className="flex flex-col gap-1">
          {/* Job Title */}
          <h2 className="font-semibold text-gray-800 hover:text-blue-600 transition text-xl mb-2">
            {job.title}
          </h2>

          {/* Company Name */}
          <p className="text-sm text-gray-600 mb-4">
            {job.recruiter?.companyName}
          </p>

          {/* Job */}
          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium text-sm">
              {job.provinceCode}
            </span>
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium text-sm">
              {job.experiences}
            </span>
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium text-sm">
              {job.level}
            </span>
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium text-sm">
              {job.time}
            </span>
          </div>
        </div>
      </div>

      {/* Right Section: Salary and Favorite Button */}
      <div className="flex flex-col items-end gap-1">
        {/* Salary */}
        <span className="text-xl mb-7 font-semibold text-green-600">
          {" "}
          {job.salary?.negotiable
            ? "Thỏa thuận"
            : `${job.salary.min} - ${job.salary.max} triệu`}{" "}
        </span>
        {/* Favorite Button (Heart Icon) */}
        <button className="text-gray-400 hover:text-red-500 transition">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
        <p>Ngày đăng: {dayjs(job.createdAt).fromNow()}</p>
        {/* Hiển thị hạn chót */}
        {job.deadline && (
          <div className="text-sm text-red-600 font-medium">
            Hạn chót: {new Date(job.deadline).toLocaleDateString("vi-VN")}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobCardCollect;
