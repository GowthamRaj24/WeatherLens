import React, { useState, useRef, useEffect } from "react";
import "#/Carousel.css";
import cities from "../cities/cities.js";
import { MapPin, ChevronRight, ChevronLeft, Sun, Moon, Cloud } from "lucide-react";

const Carousel = ({ isNight, currentCity, handleCityClick }) => {
  const scrollContainerRef = useRef(null);
  const [isScrollable, setIsScrollable] = useState(false);
  
  // Check if the container is scrollable
  useEffect(() => {
    if (scrollContainerRef.current) {
      const checkScrollable = () => {
        const { scrollWidth, clientWidth } = scrollContainerRef.current;
        setIsScrollable(scrollWidth > clientWidth);
      };
      checkScrollable();
      window.addEventListener('resize', checkScrollable);
      return () => window.removeEventListener('resize', checkScrollable);
    }
  }, [cities]);

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const themeClasses = {
    text: isNight ? "text-white" : "text-gray-800",
    background: isNight 
      ? "from-slate-900/40 via-slate-800/30 to-slate-900/40" 
      : "from-blue-100/30 via-blue-50/20 to-blue-100/30",
    highlight: isNight ? "bg-blue-600" : "bg-amber-400",
    shadow: isNight ? "shadow-blue-500/20" : "shadow-amber-500/20",
    border: isNight ? "border-blue-400/10" : "border-amber-400/10",
  };

  return (
    <div className={`carousel-main-container bg-gradient-to-r ${themeClasses.background} rounded-xl p-4 mb-5 ${themeClasses.shadow} backdrop-blur-md border ${themeClasses.border} transform transition-all duration-500 glass-morphism compact-carousel`}>
      <div className="carousel-header flex justify-between items-center mb-2">
        <h3 className={`${themeClasses.text} text-sm font-medium`}>Select a City</h3>
        <div className="theme-icon">
          {isNight ? (
            <Moon className="w-4 h-4 text-blue-400 filter drop-shadow animate-pulse-slow" />
          ) : (
            <Sun className="w-5 h-5 text-amber-400 filter drop-shadow animate-spin-very-slow" />
          )}
        </div>
      </div>
      
      <div className="city-carousel-wrapper relative flex items-center">
        <button 
          className={`city-nav-button ${themeClasses.text} ${!isScrollable || 'reveal-left'}`}
          onClick={scrollLeft}
          disabled={!isScrollable}
          style={{ opacity: isScrollable ? 1 : 0.3 }}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <div className="cities-overflow-container" ref={scrollContainerRef}>
          <div className={`city-container ${themeClasses.text}`}>
            {cities.map((city, index) => (
              <div
                key={index}
                className={`city-item ${city.name === currentCity ? "active" : ""}`}
                onClick={() => handleCityClick(city.name)}
              >
                <div className="city-content">
                  <div 
                    className={`city-icon-container ${city.name === currentCity 
                      ? `${themeClasses.highlight} ring-1 ${isNight ? 'ring-blue-400/50' : 'ring-amber-300/70'}` 
                      : 'bg-white/20 backdrop-blur-sm'}`}
                  >
                    <MapPin 
                      className={`city-icon ${city.name === currentCity ? 'text-white' : themeClasses.text}`} 
                      strokeWidth={city.name === currentCity ? 3 : 2}
                    />
                  </div>
                  <h2 className="city-name text-xs">{city.name}</h2>
                </div>
                
                {city.name === currentCity && (
                  <div className={`city-indicator ${themeClasses.highlight}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <button 
          className={`city-nav-button ${themeClasses.text} ${!isScrollable || 'reveal-right'}`}
          onClick={scrollRight}
          disabled={!isScrollable}
          style={{ opacity: isScrollable ? 1 : 0.3 }}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="carousel-decoration">
        {!isNight && (
          <>
            {/* Fewer animated clouds */}
            {[...Array(2)].map((_, i) => (
              <div 
                key={`cloud-${i}`}
                className="cloud-decoration"
                style={{
                  top: `${10 + (i * 20)}%`,
                  left: `${5 + (i * 50)}%`,
                  animationDuration: `${30 + (i * 10)}s`,
                  opacity: (0.3 - (i * 0.1)),
                  transform: `scale(${0.4 + (i * 0.2)})`,
                }}
              ></div>
            ))}
            
            {/* Fewer small floating clouds */}
            {[...Array(2)].map((_, i) => (
              <div 
                key={`small-cloud-${i}`}
                className="small-cloud-float"
                style={{
                  top: `${Math.random() * 70}%`,
                  left: `${Math.random() * 80}%`,
                  animationDuration: `${10 + Math.random() * 8}s`,
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: 0.2,
                }}
              >
                <Cloud className="text-white/30" size={12 + i * 4} />
              </div>
            ))}
          </>
        )}
        
        {isNight && (
          <>
            {/* Fewer stars */}
            {[...Array(10)].map((_, i) => (
              <div 
                key={`star-${i}`}
                className="star-decoration"
                style={{
                  top: `${Math.random() * 80}%`,
                  left: `${Math.random() * 90}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  width: `${1 + Math.random() * 2}px`,
                  height: `${1 + Math.random() * 2}px`,
                }}
              ></div>
            ))}
            
            {/* One shooting star */}
            <div
              key="shooting-star"
              className="shooting-star"
              style={{
                top: `${Math.random() * 50}%`,
                left: `${Math.random() * 70}%`,
                animationDelay: `${3 + Math.random() * 15}s`,
                animationDuration: `${0.7 + Math.random() * 0.5}s`,
              }}
            ></div>
          </>
        )}
        
        {/* Glass reflections effect */}
        <div className="glass-reflection"></div>
      </div>
    </div>
  );
};

export default Carousel;
