import React, { useState, useEffect } from "react";
import "./App.css";
import Home_page from "./pages/Home/Home";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, Sun, Moon, Thermometer, User, Cloud } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Scenario from "@/components/Scenario/scenario";
import SunAnimation from "@/components/SunAnimation/SunAnimation";

function App() {
  const [userPreferences, setUserPreferences] = useState(null);
  const [name, setName] = useState("");
  const [tempUnit, setTempUnit] = useState("celsius");
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    const hours = new Date().getHours();
    setIsNight(hours < 6 || hours >= 18);
  }, []);

  useEffect(() => {
    // This effect will only run when isNight is not null
    if (isNight !== null) {
      // Toggle the day/night mode for scenario
      document.documentElement.classList.toggle("container-night", isNight);
      document.querySelector(".sky-night")?.classList.toggle("sky-night-fade", isNight);
      document.querySelectorAll("p, h1").forEach((el) => el.classList.toggle("text-color", isNight));
      document.querySelector(".ocean-night")?.classList.toggle("ocean-night-fade", isNight);
      document.querySelector(".moon")?.classList.toggle("moon-fade", isNight);
      document.querySelector(".ocean")?.classList.toggle("animation-stop", isNight);
      document.querySelectorAll(".bird").forEach((el) => el.classList.toggle("birds-fly", isNight));
      document.querySelector(".boat")?.classList.toggle("boat-sail", isNight);
      document.querySelectorAll(".mountain-top, .mountain-top > *").forEach((el) => el.classList.toggle("mountain-top-night", isNight));
      document.querySelectorAll(".mountain-middle, .mountain-middle > *").forEach((el) => el.classList.toggle("mountain-middle-night", isNight));
      document.querySelectorAll(".mountain-back, .mountain-back > *").forEach((el) => el.classList.toggle("mountain-back-night", isNight));
      document.querySelector(".stars")?.classList.toggle("stars-fade", isNight);
      document.querySelector(".shooting-star")?.classList.toggle("shooting", isNight);
    }
  }, [isNight]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserPreferences({
      name: name,
      temperatureUnit: tempUnit
    });
  };

  if (userPreferences) {
    return <Home_page userPreferences={userPreferences} />;
  }

  const themeClasses = {
    text: isNight ? "text-white" : "text-gray-800",
    container: isNight ? "bg-gray-900/60" : "bg-white/60",
    accent: isNight ? "bg-indigo-500" : "bg-blue-500",
    input: isNight 
      ? "bg-gray-800/30 border-gray-700 text-white placeholder-gray-400 focus:border-indigo-500" 
      : "bg-white/30 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500",
    button: isNight
      ? "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
      : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Scenario Background */}
      <div className="absolute inset-0 z-0">
        <Scenario />
      </div>

      {/* Sun Animation */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <SunAnimation isNight={isNight} setIsNight={setIsNight} />
      </div>

      {/* Content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            {/* App Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-6"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Cloud className={`h-8 w-8 ${isNight ? 'text-indigo-400' : 'text-blue-500'}`} />
                <h1 className={`text-4xl font-bold tracking-tight ${themeClasses.text}`}>
                  WeatherLens
                </h1>
              </div>
              <p className={`text-sm ${themeClasses.text} opacity-80`}>
                Your personal weather companion
              </p>
            </motion.div>

            <Alert className={`mb-4 ${isNight ? 'bg-indigo-900/30' : 'bg-blue-50/30'} border-none backdrop-blur-sm`}>
              {isNight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <AlertDescription className={`flex items-center gap-2 ${themeClasses.text}`}>
                <span className="font-semibold">Welcome to WeatherLens!</span>
              </AlertDescription>
            </Alert>

            <Card className={`backdrop-blur-md border-0 shadow-2xl ${themeClasses.container}`}>
              <CardHeader>
                <CardTitle className={`text-center ${themeClasses.text}`}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="flex justify-center mb-4"
                  >
                    <Thermometer className={`h-12 w-12 ${isNight ? 'text-indigo-400' : 'text-blue-500'}`} />
                  </motion.div>
                  Set Your Weather Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <label htmlFor="name" className={`block text-sm font-medium ${themeClasses.text}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4" />
                        Your Name
                      </div>
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full rounded-lg border p-3 transition-all duration-300 outline-none
                        ${themeClasses.input} backdrop-blur-sm`}
                      placeholder="Enter your name"
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-2"
                  >
                    <label htmlFor="tempUnit" className={`block text-sm font-medium ${themeClasses.text}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Thermometer className="h-4 w-4" />
                        Preferred Temperature Unit
                      </div>
                    </label>
                    <select
                      id="tempUnit"
                      value={tempUnit}
                      onChange={(e) => setTempUnit(e.target.value)}
                      className={`w-full rounded-lg border p-3 transition-all duration-300 outline-none
                        ${themeClasses.input} backdrop-blur-sm`}
                    >
                      <option value="celsius">Celsius (°C)</option>
                      <option value="fahrenheit">Fahrenheit (°F)</option>
                      <option value="kelvin">Kelvin (K)</option>
                    </select>
                  </motion.div>

                  <motion.button
                    type="submit"
                    className={`w-full p-3 text-white rounded-lg font-medium transition-all duration-300
                      ${themeClasses.button} focus:outline-none focus:ring-2 focus:ring-offset-2
                      transform hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm`}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue to Weather Dashboard
                  </motion.button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;