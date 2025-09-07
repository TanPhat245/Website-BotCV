import React from 'react';
import '../index.css';

const MarqueeBanner = () => {
  return (
    <div className="w-full bg-yellow-100 py-2 overflow-hidden border-y border-yellow-300">
      <div className="marquee text-sm font-medium whitespace-nowrap">
        Chào mừng người tìm việc và nhà tuyển dụng đến với BotCV, luôn luôn cảnh giác trước những tin tuyển dụng giả. Chúc một ngày tốt lành
      </div>
    </div>
  );
};

export default MarqueeBanner;
