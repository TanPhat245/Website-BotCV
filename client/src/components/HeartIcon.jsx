import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SaveIcon = ({ isSaved, onClick }) => {
  return (
    <motion.div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`w-8 h-8 flex items-center justify-center rounded-full border ${
        isSaved ? 'border-blue-500 bg-blue-100' : 'border-gray-500 hover:bg-gray-100'
      } transition duration-300 ease-in-out cursor-pointer`}
      whileTap={{ scale: 0.9 }}
    >
      <AnimatePresence mode="wait">
        {isSaved ? (
          <motion.svg
            key="filled"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-blue-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            {/* Filled Save icon */}
            <path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a1 1 0 001-1V7l-5-4zM12 19a2 2 0 110-4 2 2 0 010 4zm2-10H6V5h8v4z" />
          </motion.svg>
        ) : (
          <motion.svg
            key="outline"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {/* Outline Save icon */}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a1 1 0 001-1V7l-5-4zM12 17a2 2 0 100-4 2 2 0 000 4zM6 8h8V5H6v3z"
            />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SaveIcon;
