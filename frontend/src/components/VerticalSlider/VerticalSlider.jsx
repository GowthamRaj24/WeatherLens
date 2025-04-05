import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const VerticalSlider = ({ options, selectedOption, setSelectedOption, isNight }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Dynamic styles based on day/night mode
  const containerBg = isNight ? "bg-gray-900/40" : "bg-white/40";
  const selectedBg = isNight ? "bg-blue-600" : "bg-blue-light";
  const baseTextColor = isNight ? "text-gray-300" : "text-gray-600";
  const selectedTextColor = isNight ? "text-white" : "text-white";

  return (
    <motion.div
      className={`fixed top-3/5 left-6 sm:left-10 transform -translate-y-1/2 flex flex-col items-center p-3 rounded-full backdrop-blur-sm ${containerBg} shadow-lg border border-gray-200/20`}
      style={{ zIndex: 1000 }}
      initial={{ x: -60 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="flex flex-col space-y-5">
        {options.map((option, index) => (
          <div key={index} className="relative">
            <motion.div
              className="relative w-12 h-12 flex items-center justify-center cursor-pointer"
              onClick={() => setSelectedOption(index)}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Background circle */}
              <motion.div
                className={`absolute w-full h-full rounded-full flex items-center justify-center ${
                  index === selectedOption ? selectedBg : "bg-transparent"
                }`}
                initial={{ scale: 1 }}
                animate={{
                  scale: index === selectedOption ? 1 : 1,
                  opacity: index === selectedOption ? 1 : 0.7,
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
              
              {/* Icon */}
              <motion.div
                className={`z-10 ${
                  index === selectedOption ? selectedTextColor : baseTextColor
                }`}
                animate={{
                  scale: index === selectedOption ? 1.2 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              >
                {option.icon}
              </motion.div>
              
              {/* Selection indicator */}
              {index === selectedOption && (
                <motion.div
                  className="absolute -right-2 h-6 w-1.5 rounded-full bg-blue-400"
                  layoutId="activeIndicator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </motion.div>
            
            {/* Tooltip */}
            <AnimatePresence>
              {hoveredIndex === index && option.label && (
                <motion.div
                  className={`absolute left-16 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-md ${
                    isNight ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"
                  } shadow-lg whitespace-nowrap text-sm z-20`}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  {option.label}
                  <div 
                    className={`absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 rotate-45 ${
                      isNight ? "bg-gray-800" : "bg-white"
                    }`}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default VerticalSlider;
