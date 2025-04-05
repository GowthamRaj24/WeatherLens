import React, { useEffect, useState } from "react";
import WeatherCard from "@/components/WeatherCard/WeatherCard";
import {
  convertTemperature,
  getTemperatureUnit,
} from "@/services/convertTemperature";
import { motion } from "framer-motion";

const TemperaturePage = ({ isNight, weatherData, userPreferences }) => {
  const [timeOfDay, setTimeOfDay] = useState("");
  const name = userPreferences?.name || "User";
  const tempUnit = userPreferences?.temperatureUnit || "celsius";

  useEffect(() => {
    const now = new Date();
    const hours = now.getUTCHours() + 5;
    if (hours < 12) setTimeOfDay("Good Morning");
    else if (hours < 17) setTimeOfDay("Good Afternoon");
    else setTimeOfDay("Good Evening");
  }, []);

  const weatherCondition = weatherData?.weather?.[0]?.main?.toLowerCase() || "clear";
  
  // Enhanced theme classes with weather condition specific styling
  const themeClasses = {
    text: isNight ? "text-base-light" : "text-base-dark",
    container: isNight ? "bg-white/20" : "bg-white/30",
    accent: getWeatherAccentColor(weatherCondition, isNight),
    icon: getWeatherIcon(weatherCondition, isNight),
  };

  const unit = getTemperatureUnit(tempUnit);

  return (
    <div className="relative min-h-[68vh] w-full flex justify-center items-center overflow-hidden">
      {/* Enhanced weather-specific background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {/* Weather condition specific background elements */}
        {renderWeatherBackground(weatherCondition, isNight)}
        
        {/* Ambient floating elements */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${getFloatingElementClass(weatherCondition, isNight, i)}`}
            style={{
              width: `${Math.random() * 300 + 50}px`,
              height: `${Math.random() * 300 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.05 + Math.random() * 0.05,
            }}
            animate={{
              x: [0, Math.random() * 50 - 25],
              y: [0, Math.random() * 50 - 25],
              scale: [1, 1 + Math.random() * 0.1],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content container with improved spacing */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left side - Greeting and Weather Details */}
        <motion.div 
          className="relative flex flex-col justify-center items-start text-white w-full md:w-3/5"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Visual weather indicator icon */}
          <motion.div
            className="absolute -left-14 -top-10 opacity-10 text-7xl hidden md:block"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            {themeClasses.icon}
          </motion.div>
          
          <motion.div
            className={`w-20 h-1 mb-4 rounded-full ${themeClasses.accent}`}
            initial={{ width: 0 }}
            animate={{ width: "5rem" }}
            transition={{ delay: 0.1, duration: 0.4 }}
          />
          
          <motion.h1 
            className={`${themeClasses.text} text-4xl md:text-5xl font-bold tracking-tight mb-4`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {`${timeOfDay}, ${name}`}
          </motion.h1>
          
          <motion.p 
            className={`${themeClasses.text} text-lg md:text-xl mb-8`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {weatherData?.name
              ? `Weather update at ${weatherData.name}, ${
                  weatherData.weather?.[0]?.description || ""
                }`
              : "Here's your update for the day!"}
          </motion.p>
          
          <motion.div
            className={`${themeClasses.container} backdrop-blur-md p-6 md:p-8 rounded-xl 
            shadow-[0_10px_50px_rgba(0,0,0,0.1)] w-full 
            bg-gradient-to-br from-white/20 to-white/10
            border border-white/30 transition-all duration-300
            ${themeClasses.accent.replace('bg-', 'hover:border-')}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{ 
              scale: 1.02, 
              boxShadow: '0 15px 60px rgba(0,0,0,0.12)',
              backdropFilter: 'blur(12px)'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <motion.h3 
                className={`${themeClasses.text} text-xl font-semibold tracking-wide`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                Current Conditions
              </motion.h3>
              
              <motion.div 
                className={`px-3 py-1 rounded-full text-sm ${themeClasses.accent} ${isNight ? 'text-white' : 'text-white'} font-medium`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </motion.div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
              <EnhancedWeatherInfoItem 
                title="Feels Like" 
                value={weatherData?.main?.feels_like
                  ? `${convertTemperature(
                      weatherData.main.feels_like,
                      tempUnit
                    )}${unit}`
                  : "--"}
                icon={<FeelsLikeIcon isNight={isNight} />}
                accent={themeClasses.accent}
                delay={0.5}
                isNight={isNight}
                textClass={themeClasses.text}
              />
              
              <EnhancedWeatherInfoItem 
                title="Humidity" 
                value={`${weatherData?.main?.humidity || "--"}%`}
                icon={<HumidityIcon isNight={isNight} />}
                accent={themeClasses.accent}
                delay={0.6}
                isNight={isNight}
                textClass={themeClasses.text}
              />
              
              <EnhancedWeatherInfoItem 
                title="Wind Speed" 
                value={`${weatherData?.wind?.speed || "--"} km/h`}
                icon={<WindIcon isNight={isNight} />}
                accent={themeClasses.accent}
                delay={0.7}
                isNight={isNight}
                textClass={themeClasses.text}
              />
              
              <EnhancedWeatherInfoItem 
                title="Pressure" 
                value={`${weatherData?.main?.pressure || "--"} hPa`}
                icon={<PressureIcon isNight={isNight} />}
                accent={themeClasses.accent}
                delay={0.8}
                isNight={isNight}
                textClass={themeClasses.text}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Right side - Weather Card */}
        <motion.div 
          className="relative flex justify-center items-center w-full md:w-2/5"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            whileHover={{ scale: 1.03, rotate: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`${isNight ? 'drop-shadow-[0_0_20px_rgba(138,43,226,0.4)]' : 'drop-shadow-[0_0_20px_rgba(14,165,233,0.5)]'} 
              ${getCardGlow(weatherCondition, isNight)}`}
          >
            <WeatherCard
              temperature={
                weatherData?.main?.temp
                  ? `${convertTemperature(weatherData.main.temp, tempUnit)}${unit}`
                  : "--"
              }
              weatherCode={weatherData?.weather?.[0]?.icon || "01d"}
              weatherType={weatherData?.weather?.[0]?.main || "Unknown"}
              currentWeather={weatherCondition}
              city={weatherData?.name || "Unknown"}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

// Updated EnhancedWeatherInfoItem with better icon presentation
const EnhancedWeatherInfoItem = ({ title, value, icon, accent, delay, isNight, textClass }) => {
  const hexagonPath = "M16,0 L30,8 L30,24 L16,32 L2,24 L2,8 Z";
  
  return (
    <motion.div 
      className="p-4 rounded-xl backdrop-blur-sm hover:bg-white/15 transition-all duration-300
      border border-white/10 hover:border-white/30 relative overflow-hidden group"
      whileHover={{ 
        scale: 1.05,
        y: -5,
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      {/* Background accent gradient */}
      <motion.div 
        className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl ${accent.replace('/80', '')}`} 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.2, duration: 0.5 }}
      />
      
      {/* Icon with animated hexagon background */}
      <div className="flex justify-center mb-3 relative">
        <motion.div
          className="relative w-16 h-16 flex items-center justify-center"
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: delay + 0.1, 
            type: "spring", 
            stiffness: 200 
          }}
        >
          {/* Decorative outer ring */}
          <motion.div 
            className="absolute inset-0 opacity-30 scale-110" 
            whileHover={{ scale: 1.2, opacity: 0.4 }}
          >
            <svg width="100%" height="100%" viewBox="0 0 32 32">
              <defs>
                <linearGradient id={`hexGradient-${title}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" className={`${accent.replace('bg-', 'stop-color-')} stop-opacity-50`} />
                  <stop offset="100%" className={`${accent.replace('bg-', 'stop-color-')} stop-opacity-80`} />
                </linearGradient>
              </defs>
              <path 
                d={hexagonPath} 
                stroke={`url(#hexGradient-${title})`} 
                strokeWidth="1" 
                fill="none"
                strokeDasharray="60"
                strokeDashoffset="0"
              >
                <animate 
                  attributeName="stroke-dashoffset" 
                  values="60;0" 
                  dur="1.5s"
                  begin={delay + 0.3}
                  fill="freeze"
                />
              </path>
            </svg>
          </motion.div>
          
          {/* Main hexagon background */}
          <div className="absolute inset-0">
            <svg width="100%" height="100%" viewBox="0 0 32 32">
              <path 
                d={hexagonPath} 
                className={`${accent} fill-current opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
              />
            </svg>
          </div>
          
          {/* Icon in the center */}
          <div className="relative z-10 scale-[0.65]">
            {icon}
          </div>
        </motion.div>
      </div>
      
      <p className={`${textClass} font-semibold text-sm md:text-base opacity-90 mb-1`}>{title}</p>
      <p className={`${textClass} text-xl md:text-2xl font-bold`}>
        {value}
      </p>
      
      {/* Animated underline on hover */}
      <motion.div 
        className={`h-0.5 w-0 group-hover:w-20 mx-auto mt-2 rounded-full ${accent} transition-all duration-300`}
        initial={{ width: 0 }}
        animate={{ width: "2rem" }}
        transition={{ delay: delay + 0.3, duration: 0.4 }}
      />
    </motion.div>
  );
};

// Custom SVG icons for weather information
const FeelsLikeIcon = ({ isNight }) => {
  const iconColor = isNight ? "#ffffff" : "#794144";
  
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="32" 
      height="32" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={iconColor}
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
      <circle cx="11.5" cy="18" r="0.5" fill={iconColor} />
    </svg>
  );
};

const HumidityIcon = ({ isNight }) => {
  const iconColor = isNight ? "#ffffff" : "#794144";
  
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="32" 
      height="32" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={iconColor}
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        from="0 12 12"
        to="360 12 12"
        dur="60s"
        repeatCount="indefinite"
      />
    </svg>
  );
};

const WindIcon = ({ isNight }) => {
  const iconColor = isNight ? "#ffffff" : "#794144";
  
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="32" 
      height="32" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={iconColor}
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
    </svg>
  );
};

const PressureIcon = ({ isNight }) => {
  const iconColor = isNight ? "#ffffff" : "#794144";
  
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="32" 
      height="32" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={iconColor}
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
};

// Helper functions for weather-specific styling
function getWeatherAccentColor(condition, isNight) {
  if (isNight) {
    switch(condition) {
      case 'rain': 
      case 'drizzle': return 'bg-blue-400/80';
      case 'thunderstorm': return 'bg-purple-500/80';
      case 'snow': return 'bg-blue-200/80';
      case 'fog':
      case 'mist':
      case 'haze': return 'bg-gray-400/80';
      case 'clouds': return 'bg-indigo-400/80';
      default: return 'bg-indigo-500/80';
    }
  } else {
    switch(condition) {
      case 'rain': 
      case 'drizzle': return 'bg-blue-500/80';
      case 'thunderstorm': return 'bg-yellow-400/80';
      case 'snow': return 'bg-blue-300/80';
      case 'fog':
      case 'mist':
      case 'haze': return 'bg-gray-300/80';
      case 'clouds': return 'bg-sky-400/80';
      default: return 'bg-yellow-500/80';
    }
  }
}

function getWeatherIcon(condition, isNight) {
  switch(condition) {
    case 'rain': 
    case 'drizzle': return '🌧️';
    case 'thunderstorm': return '⛈️';
    case 'snow': return '❄️';
    case 'fog':
    case 'mist':
    case 'haze': return '🌫️';
    case 'clouds': return isNight ? '☁️' : '⛅';
    default: return isNight ? '🌙' : '☀️';
  }
}

function getFloatingElementClass(condition, isNight, index) {
  if (isNight) {
    switch(condition) {
      case 'rain': 
      case 'drizzle': return 'bg-blue-500';
      case 'thunderstorm': return index % 2 === 0 ? 'bg-purple-500' : 'bg-yellow-300';
      case 'snow': return 'bg-blue-200';
      case 'clouds': return 'bg-indigo-300';
      default: return 'bg-indigo-500';
    }
  } else {
    switch(condition) {
      case 'rain': 
      case 'drizzle': return 'bg-blue-400';
      case 'thunderstorm': return index % 2 === 0 ? 'bg-gray-500' : 'bg-yellow-400';
      case 'snow': return 'bg-sky-100';
      case 'clouds': return 'bg-sky-300';
      default: return 'bg-yellow-300';
    }
  }
}

function getCardGlow(condition, isNight) {
  switch(condition) {
    case 'rain': 
    case 'drizzle': return isNight ? 'drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]';
    case 'thunderstorm': return isNight ? 'drop-shadow-[0_0_10px_rgba(124,58,237,0.6)]' : 'drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]';
    case 'snow': return 'drop-shadow-[0_0_15px_rgba(186,230,253,0.7)]';
    case 'clouds': return isNight ? 'drop-shadow-[0_0_10px_rgba(99,102,241,0.4)]' : 'drop-shadow-[0_0_10px_rgba(14,165,233,0.4)]';
    default: return isNight ? 'drop-shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 'drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]';
  }
}

function renderWeatherBackground(condition, isNight) {
  // This function adds specific background elements based on weather
  switch(condition) {
    case 'rain':
    case 'drizzle':
      return [...Array(20)].map((_, i) => (
        <motion.div
          key={`rain-${i}`}
          className="absolute w-0.5 bg-blue-400/20 rounded-full"
          style={{
            height: `${Math.random() * 20 + 10}px`,
            left: `${Math.random() * 100}%`,
            top: `-20px`,
          }}
          animate={{
            y: ["0vh", "100vh"],
          }}
          transition={{
            duration: Math.random() * 1.5 + 0.7,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "linear",
          }}
        />
      ));
    case 'snow':
      return [...Array(15)].map((_, i) => (
        <motion.div
          key={`snow-${i}`}
          className="absolute w-1.5 h-1.5 rounded-full bg-white/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-10px`,
          }}
          animate={{
            y: ["0vh", "100vh"],
            x: [0, Math.random() * 100 - 50],
          }}
          transition={{
            duration: Math.random() * 5 + 3,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "linear",
          }}
        />
      ));
    case 'thunderstorm':
      return [...Array(3)].map((_, i) => (
        <motion.div
          key={`thunder-${i}`}
          className="absolute bg-yellow-200/5 w-1/3 h-full"
          style={{
            left: `${Math.random() * 100}%`,
            translateX: "-50%",
          }}
          animate={{
            opacity: [0, 0, 0.3, 0, 0, 0],
          }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            repeatDelay: Math.random() * 10 + 5,
            ease: "linear",
          }}
        />
      ));
    case 'clouds':
      return [...Array(8)].map((_, i) => (
        <motion.div
          key={`cloud-${i}`}
          className={`absolute rounded-full ${isNight ? 'bg-indigo-500/5' : 'bg-sky-400/5'}`}
          style={{
            width: `${Math.random() * 400 + 200}px`,
            height: `${Math.random() * 200 + 100}px`,
            borderRadius: '100%',
            left: `${Math.random() * 150 - 25}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 50 - 25],
          }}
          transition={{
            duration: Math.random() * 60 + 30,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ));
    default:
      return isNight ? (
        [...Array(10)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute bg-white rounded-full"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))
      ) : (
        [...Array(3)].map((_, i) => (
          <motion.div
            key={`sunray-${i}`}
            className="absolute rounded-full bg-yellow-500/5"
            style={{
              width: `${Math.random() * 300 + 200}px`,
              height: `${Math.random() * 300 + 200}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.02, 0.06, 0.02],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))
      );
  }
}

export default TemperaturePage;
