import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import "#/transition.css";
import "./AlertsPage.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Cloud,
  Thermometer,
  Droplets,
  Wind,
  Mail,
  Bell,
  Trash2,
  AlertTriangle,
  AlertCircle,
  Sun,
  CloudLightning,
  Snowflake,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const AlertsPage = ({ isNight, currentCity = "Delhi" }) => {
  const [email, setEmail] = useState("");
  const [alertName, setAlertName] = useState("");
  const [temperature, setTemperature] = useState("");
  const [humidity, setHumidity] = useState("");
  const [windSpeed, setWindSpeed] = useState("");
  const [cloudCoverage, setCloudCoverage] = useState("");
  const [weatherCondition, setWeatherCondition] = useState("");
  const [existingAlerts, setExistingAlerts] = useState([]);
  const [noAlertsMessage, setNoAlertsMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const containerClass = isNight ? "dark" : "light";
  const API_BASE_URL = import.meta.env.VITE_APP_API;

  // Enhanced theme classes with weather condition specific styling
  const themeClasses = {
    text: isNight ? "text-base-light" : "text-base-dark",
    container: isNight ? "bg-white/20" : "bg-white/30",
    accent: getWeatherAccentColor(weatherCondition || "clear", isNight),
    icon: getWeatherIcon(weatherCondition || "clear", isNight),
  };

  // Function to fetch alerts
  const fetchAlerts = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/alerts/${currentCity}`
      );

      const alerts = response.data?.alerts || [];
      if (alerts.length > 0) {
        setExistingAlerts(alerts);
        setNoAlertsMessage("");
      } else {
        setExistingAlerts([]);
        setNoAlertsMessage(`No alerts found for ${currentCity}.`);
      }
    } catch (error) {
      setExistingAlerts([]);
      if (error.response?.status === 404) {
        setNoAlertsMessage(`No alerts found for ${currentCity}.`);
      } else {
        setNoAlertsMessage("Failed to fetch alerts. Please try again.");
        console.error("Error fetching alerts:", error);
      }
    }
  };

  // Fetch existing alerts when the currentCity changes
  useEffect(() => {
    if (currentCity) {
      fetchAlerts();
    }
  }, [currentCity]);

  // Handle form submission to create a new alert
  const handleCreateAlert = async () => {
    if (!alertName || !email || !temperature) {
      alert("Please fill in required fields.");
      return;
    }

    setIsSubmitting(true);

    const newAlert = {
      alertName,
      email,
      cityName: currentCity,
      temperature: parseFloat(temperature),
      humidity: humidity ? parseFloat(humidity) : null,
      windSpeed: windSpeed ? parseFloat(windSpeed) : null,
      cloudCoverage: cloudCoverage ? parseFloat(cloudCoverage) : null,
      weatherCondition,
    };

    try {
      // Create the alert
      await axios.post(`${API_BASE_URL}/api/alerts`, newAlert);

      // Fetch updated alerts after creation
      await fetchAlerts();

      // Show success indicator
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 2000);

      // Clear form fields
      setAlertName("");
      setEmail("");
      setTemperature("");
      setHumidity("");
      setWindSpeed("");
      setCloudCoverage("");
      setWeatherCondition("");
    } catch (error) {
      console.error("Error creating alert:", error);
      setNoAlertsMessage("Failed to create alert. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting an alert
  const handleDeleteAlert = async (alertId) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/api/alerts/${currentCity}/${alertId}`
      );

      // Fetch updated alerts after deletion
      await fetchAlerts();
    } catch (error) {
      console.error("Error deleting alert:", error);
    }
  };

  // Weather condition icons mapping
  const conditionIcons = {
    rain: <Droplets className="h-5 w-5 text-blue-500" />,
    clear: <Sun className="h-5 w-5 text-yellow-500" />,
    clouds: <Cloud className="h-5 w-5 text-gray-500" />,
    snow: <Snowflake className="h-5 w-5 text-blue-300" />,
    thunderstorm: <CloudLightning className="h-5 w-5 text-purple-500" />,
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const alertCardVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.4
      }
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="relative min-h-[68vh] w-full flex justify-center items-center overflow-hidden">
      {/* Weather-specific background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
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

      <motion.div 
        className={`relative z-10 w-full max-w-7xl mx-auto px-6 py-8`}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
      >
        <div className={`transition-all duration-500 backdrop-blur-sm rounded-xl p-6 shadow-lg
          ${isNight ? 'bg-gradient-to-br from-gray-900/50 to-blue-900/30' : 'bg-gradient-to-br from-white/50 to-blue-50/30'}`}>
          
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className={`p-2 rounded-lg ${isNight ? 'bg-blue-800/50' : 'bg-blue-100'} transform hover:scale-110 transition-all duration-300`}>
              <AlertTriangle className={`h-6 w-6 ${isNight ? 'text-blue-300' : 'text-blue-600'}`} />
            </div>
            <h1 className={`text-3xl font-bold bg-gradient-to-r ${
              isNight 
                ? 'from-blue-400 via-purple-400 to-blue-300 text-transparent bg-clip-text' 
                : 'from-blue-600 via-purple-600 to-blue-500 text-transparent bg-clip-text'
            }`}>
              Weather Alerts <span className={`${isNight ? 'text-blue-400' : 'text-blue-600'}`}>for {currentCity}</span>
            </h1>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Side - Alert Configuration */}
            <motion.div 
              className="h-[380px] overflow-y-auto pr-4 transition-all duration-300"
              variants={cardVariants}
            >
              <Card className={`shadow-lg overflow-hidden backdrop-blur-sm transform hover:scale-[1.02] transition-all duration-300
                ${isNight 
                  ? 'bg-gray-800/90 border-gray-700 hover:border-blue-500/50' 
                  : 'bg-white/90 border-gray-200 hover:border-blue-400/50'
                } ${getCardGlow(weatherCondition, isNight)}`}>
                <div className={`h-2 w-full ${isNight 
                  ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800' 
                  : 'bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600'
                }`}></div>
                <CardHeader className="pb-3 pt-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className={`p-1.5 rounded-md ${isNight ? 'bg-blue-800/50' : 'bg-blue-100/50'}`}>
                      <Mail className={`h-4 w-4 ${isNight ? 'text-blue-300' : 'text-blue-600'}`} />
                    </div>
                    <span className={`${isNight ? 'text-white' : 'text-gray-800'}`}>Create Weather Alert</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="space-y-2">
                    <Label className={`text-sm font-medium ${isNight ? 'text-gray-300' : 'text-gray-700'}`}>Alert Name</Label>
                    <Input
                      type="text"
                      placeholder="E.g., High Temperature Alert"
                      value={alertName}
                      onChange={(e) => setAlertName(e.target.value)}
                      className={`${isNight ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-gray-50 border-gray-300 focus:border-blue-400'} transition-all`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className={`text-sm font-medium ${isNight ? 'text-gray-300' : 'text-gray-700'}`}>Notification Email</Label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`${isNight ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-gray-50 border-gray-300 focus:border-blue-400'} transition-all`}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className={`text-sm font-medium ${isNight ? 'text-gray-300' : 'text-gray-700'}`}>Weather Condition</Label>
                    <Select
                      value={weatherCondition}
                      onValueChange={(val) => setWeatherCondition(val)}
                    >
                      <SelectTrigger className={`${isNight ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300'} focus:ring-2 focus:ring-offset-0 focus:ring-blue-500 transition-all`}>
                        <SelectValue placeholder="Select weather condition" />
                      </SelectTrigger>
                      <SelectContent className={`${isNight ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                        <SelectItem value="rain" className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <Droplets className="h-4 w-4 text-blue-500" />
                            <span>Rain</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="clear">
                          <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4 text-yellow-500" />
                            <span>Clear Sky</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="clouds">
                          <div className="flex items-center gap-2">
                            <Cloud className="h-4 w-4 text-gray-500" />
                            <span>Clouds</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="snow">
                          <div className="flex items-center gap-2">
                            <Snowflake className="h-4 w-4 text-blue-300" />
                            <span>Snow</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="thunderstorm">
                          <div className="flex items-center gap-2">
                            <CloudLightning className="h-4 w-4 text-purple-500" />
                            <span>Thunderstorm</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg border-dashed border-2 space-y-2 transition-all hover:border-blue-400 duration-300 group cursor-pointer focus-within:border-blue-500 focus-within:bg-blue-50 dark:focus-within:bg-gray-700/50 dark:focus-within:border-blue-600 dark:hover:border-blue-700 dark:border-gray-600">
                      <div className="flex items-center gap-2">
                        <Thermometer className={`h-4 w-4 ${isNight ? 'text-red-400 group-hover:text-red-300' : 'text-red-500 group-hover:text-red-600'} transition-colors`} />
                        <Label className={`text-sm font-medium ${isNight ? 'text-gray-300' : 'text-gray-700'} group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors`}>
                          Temperature (°C)
                        </Label>
                      </div>
                      <Input
                        type="number"
                        placeholder="°C"
                        value={temperature}
                        onChange={(e) => setTemperature(e.target.value)}
                        className={`${isNight ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} transition-colors border-0 p-0 h-6 focus:ring-0 placeholder:text-gray-500 dark:placeholder:text-gray-400`}
                      />
                    </div>

                    <div className="p-3 rounded-lg border-dashed border-2 space-y-2 transition-all hover:border-blue-400 duration-300 group cursor-pointer focus-within:border-blue-500 focus-within:bg-blue-50 dark:focus-within:bg-gray-700/50 dark:focus-within:border-blue-600 dark:hover:border-blue-700 dark:border-gray-600">
                      <div className="flex items-center gap-2">
                        <Droplets className={`h-4 w-4 ${isNight ? 'text-blue-400 group-hover:text-blue-300' : 'text-blue-500 group-hover:text-blue-600'} transition-colors`} />
                        <Label className={`text-sm font-medium ${isNight ? 'text-gray-300' : 'text-gray-700'} group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors`}>
                          Humidity (%)
                        </Label>
                      </div>
                      <Input
                        type="number"
                        placeholder="%"
                        value={humidity}
                        onChange={(e) => setHumidity(e.target.value)}
                        className={`${isNight ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} transition-colors border-0 p-0 h-6 focus:ring-0 placeholder:text-gray-500 dark:placeholder:text-gray-400`}
                      />
                    </div>

                    <div className="p-3 rounded-lg border-dashed border-2 space-y-2 transition-all hover:border-blue-400 duration-300 group cursor-pointer focus-within:border-blue-500 focus-within:bg-blue-50 dark:focus-within:bg-gray-700/50 dark:focus-within:border-blue-600 dark:hover:border-blue-700 dark:border-gray-600">
                      <div className="flex items-center gap-2">
                        <Wind className={`h-4 w-4 ${isNight ? 'text-teal-400 group-hover:text-teal-300' : 'text-teal-500 group-hover:text-teal-600'} transition-colors`} />
                        <Label className={`text-sm font-medium ${isNight ? 'text-gray-300' : 'text-gray-700'} group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors`}>
                          Wind Speed (km/h)
                        </Label>
                      </div>
                      <Input
                        type="number"
                        placeholder="km/h"
                        value={windSpeed}
                        onChange={(e) => setWindSpeed(e.target.value)}
                        className={`${isNight ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} transition-colors border-0 p-0 h-6 focus:ring-0 placeholder:text-gray-500 dark:placeholder:text-gray-400`}
                      />
                    </div>

                    <div className="p-3 rounded-lg border-dashed border-2 space-y-2 transition-all hover:border-blue-400 duration-300 group cursor-pointer focus-within:border-blue-500 focus-within:bg-blue-50 dark:focus-within:bg-gray-700/50 dark:focus-within:border-blue-600 dark:hover:border-blue-700 dark:border-gray-600">
                      <div className="flex items-center gap-2">
                        <Cloud className={`h-4 w-4 ${isNight ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-600'} transition-colors`} />
                        <Label className={`text-sm font-medium ${isNight ? 'text-gray-300' : 'text-gray-700'} group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors`}>
                          Cloud Coverage (%)
                        </Label>
                      </div>
                      <Input
                        type="number"
                        placeholder="%"
                        value={cloudCoverage}
                        onChange={(e) => setCloudCoverage(e.target.value)}
                        className={`${isNight ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} transition-colors border-0 p-0 h-6 focus:ring-0 placeholder:text-gray-500 dark:placeholder:text-gray-400`}
                      />
                    </div>
                  </div>

                  <Button 
                    className={`w-full ${
                      submitSuccess 
                        ? 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800' 
                        : isNight 
                          ? 'bg-blue-700 hover:bg-blue-800' 
                          : 'bg-blue-600 hover:bg-blue-700'
                    } text-white transition-all duration-300 py-5 shadow-md hover:shadow-lg`}
                    onClick={handleCreateAlert}
                    disabled={isSubmitting || submitSuccess}
                  >
                    {submitSuccess ? (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="h-4 w-4" /> Alert Created!
                      </span>
                    ) : isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Creating...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Bell className="h-4 w-4" /> Create Alert
                      </span>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Side - Existing Alerts */}
            <motion.div 
              className="h-[380px] overflow-y-auto"
              variants={cardVariants}
            >
              <motion.div 
                className={`mb-4 p-3 rounded-lg border transform hover:scale-[1.02] transition-all duration-300
                  ${isNight 
                    ? 'bg-gradient-to-r from-blue-900/80 to-purple-900/80 border-blue-800/50' 
                    : 'bg-gradient-to-r from-blue-50/80 to-purple-50/80 border-blue-200/50'
                  } backdrop-blur-sm`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className={`text-lg font-bold flex items-center gap-2 ${isNight ? 'text-blue-100' : 'text-blue-800'}`}>
                  <Bell className={`h-5 w-5 ${isNight ? 'text-blue-300' : 'text-blue-600'} animate-bounce`} />
                  Active Alerts for {currentCity}
                </h2>
                <p className={`text-sm ${isNight ? 'text-blue-300' : 'text-blue-600'}`}>
                  You'll receive notifications when these conditions are met
                </p>
              </motion.div>

              <AnimatePresence>
                <div className="space-y-4">
                  {existingAlerts && existingAlerts.length > 0 ? (
                    existingAlerts.map((alert, index) => (
                      <motion.div
                        key={alert._id}
                        variants={alertCardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card 
                          className={`transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] group backdrop-blur-sm
                            ${isNight 
                              ? 'bg-gray-800/90 border-gray-700 hover:border-blue-500/50' 
                              : 'bg-white/90 border-gray-200 hover:border-blue-400/50'
                            } ${getCardGlow(alert.weatherCondition || weatherCondition, isNight)}`}
                        >
                          <div className={`h-2 ${getWeatherAccentColor(alert.weatherCondition || weatherCondition, isNight)}`}></div>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <div className={`p-1 rounded-md ${
                                    alert.weatherCondition === 'rain' ? `${isNight ? 'bg-blue-900/70' : 'bg-blue-100'}` :
                                    alert.weatherCondition === 'clear' ? `${isNight ? 'bg-yellow-900/70' : 'bg-yellow-100'}` :
                                    alert.weatherCondition === 'clouds' ? `${isNight ? 'bg-gray-700' : 'bg-gray-100'}` :
                                    alert.weatherCondition === 'snow' ? `${isNight ? 'bg-blue-900/50' : 'bg-blue-50'}` :
                                    alert.weatherCondition === 'thunderstorm' ? `${isNight ? 'bg-purple-900/70' : 'bg-purple-100'}` :
                                    `${isNight ? 'bg-red-900/70' : 'bg-red-100'}`
                                  }`}>
                                    {conditionIcons[alert.weatherCondition] || <Thermometer className={`h-4 w-4 ${isNight ? 'text-red-400' : 'text-red-500'}`} />}
                                  </div>
                                  <span className={`font-medium text-lg ${isNight ? 'text-gray-200 group-hover:text-white' : 'text-gray-800 group-hover:text-blue-700'} transition-colors`}>
                                    {alert.alertName}
                                  </span>
                                </div>
                                
                                <div className="flex flex-wrap gap-2">
                                  {alert.temperature && (
                                    <Badge variant={isNight ? "outline" : "secondary"} className={`flex items-center gap-1 ${isNight ? 'bg-gray-700 hover:bg-gray-600' : 'hover:bg-blue-100'} transition-colors`}>
                                      <Thermometer className="h-3 w-3 text-red-500" />
                                      <span>{alert.temperature}°C</span>
                                    </Badge>
                                  )}
                                  
                                  {alert.humidity && (
                                    <Badge variant={isNight ? "outline" : "secondary"} className={`flex items-center gap-1 ${isNight ? 'bg-gray-700 hover:bg-gray-600' : 'hover:bg-blue-100'} transition-colors`}>
                                      <Droplets className="h-3 w-3 text-blue-500" />
                                      <span>{alert.humidity}%</span>
                                    </Badge>
                                  )}
                                  
                                  {alert.windSpeed && (
                                    <Badge variant={isNight ? "outline" : "secondary"} className={`flex items-center gap-1 ${isNight ? 'bg-gray-700 hover:bg-gray-600' : 'hover:bg-blue-100'} transition-colors`}>
                                      <Wind className="h-3 w-3 text-teal-500" />
                                      <span>{alert.windSpeed} km/h</span>
                                    </Badge>
                                  )}
                                  
                                  {alert.cloudCoverage && (
                                    <Badge variant={isNight ? "outline" : "secondary"} className={`flex items-center gap-1 ${isNight ? 'bg-gray-700 hover:bg-gray-600' : 'hover:bg-blue-100'} transition-colors`}>
                                      <Cloud className="h-3 w-3 text-gray-500" />
                                      <span>{alert.cloudCoverage}%</span>
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-1">
                                    <Mail className={`h-3 w-3 ${isNight ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <span className={`text-xs ${isNight ? 'text-gray-400' : 'text-gray-500'}`}>
                                      {alert.email}
                                    </span>
                                  </div>
                                  
                                  <span className={`text-xs ${isNight ? 'text-gray-500' : 'text-gray-400'}`}>
                                    Created: {new Date(alert.createdAt).toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "2-digit",
                                    })}
                                  </span>
                                </div>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`rounded-full aspect-square h-9 w-9 ${isNight ? 'hover:bg-red-900/60 hover:text-red-400 text-gray-400' : 'hover:bg-red-100 hover:text-red-600 text-gray-500'} opacity-80 hover:opacity-100 transition-all`}
                                onClick={() => handleDeleteAlert(alert._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={`text-center py-10 rounded-lg border border-dashed transition-all duration-300 backdrop-blur-sm
                        ${isNight 
                          ? 'bg-gray-800/80 border-gray-700/50' 
                          : 'bg-blue-50/70 border-blue-200/50'
                        }`}
                    >
                      <div className="flex flex-col items-center gap-3 p-4">
                        <div className={`rounded-full p-4 ${isNight ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                          <Bell className={`h-8 w-8 ${isNight ? 'text-blue-400' : 'text-blue-500'}`} />
                        </div>
                        <p className={`${isNight ? 'text-gray-200' : 'text-gray-700'} font-medium text-lg`}>
                          {noAlertsMessage || `No alerts found for ${currentCity}.`}
                        </p>
                        <p className={`${isNight ? 'text-gray-400' : 'text-gray-500'} text-sm max-w-[300px]`}>
                          Create your first alert by filling out the form on the left.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Helper functions from TemperaturePage
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

export default AlertsPage;
