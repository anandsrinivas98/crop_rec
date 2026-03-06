import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaLeaf, FaTemperatureHigh, FaTint, FaCloudRain, FaVial, 
  FaSun, FaMountain, FaCloudSun
} from 'react-icons/fa';
import { GiChemicalDrop, GiWaterDrop } from 'react-icons/gi';
import { BiLayer } from 'react-icons/bi';

const InputField = ({ label, name, value, onChange, icon: Icon, placeholder, min, max, step }) => (
  <motion.div 
    className="flex flex-col gap-1.5 mb-5 relative group"
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
  >
    <label className="text-sm font-semibold text-emerald-100 flex items-center gap-2 transition-colors duration-300 group-focus-within:text-emerald-300">
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Icon className="text-emerald-400 transition-transform duration-300 group-focus-within:scale-110 drop-shadow-sm" />
      </motion.div>
      {label}
    </label>
    <div className="relative">
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        required
        className="w-full px-4 py-3 border border-emerald-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all bg-black/30 text-white placeholder-gray-400 hover:bg-black/40 shadow-inner"
      />
    </div>
  </motion.div>
);

const SelectField = ({ label, name, value, onChange, options, icon: Icon }) => (
  <motion.div 
    className="flex flex-col gap-1.5 mb-5 relative group"
    whileHover={{ scale: 1.02 }}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
  >
    <label className="text-sm font-semibold text-emerald-100 flex items-center gap-2 transition-colors duration-300 group-focus-within:text-emerald-300">
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Icon className="text-emerald-400 transition-transform duration-300 group-focus-within:scale-110 drop-shadow-sm" />
      </motion.div>
      {label}
    </label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full px-4 py-3 appearance-none border border-emerald-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all bg-black/30 text-white hover:bg-black/40 shadow-inner cursor-pointer"
      >
        <option value="" disabled className="bg-slate-900 text-gray-400">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-800 text-white py-2">
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-emerald-400">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  </motion.div>
);

const SectionHeader = ({ title, icon: Icon, children }) => (
  <div className="col-span-1 md:col-span-2 mt-4 mb-2 flex items-center justify-between border-b border-emerald-500/20 pb-2">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30 shadow-inner">
        <Icon size={16} />
      </div>
      <h4 className="text-lg font-bold text-white tracking-wide">{title}</h4>
    </div>
    {children}
  </div>
);

const CropForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    // ML Core
    N: '', P: '', K: '', temperature: '', humidity: '', ph: '', rainfall: '',
    // Extended Soil
    soil_moisture: '', soil_type: '', 
    // Extended Environment
    sunlight_hours: '',
    // Extended Location
    altitude: '', irrigation_availability: ''
  });
  
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {};
    for (let key in formData) {
      if (['soil_type', 'irrigation_availability'].includes(key)) {
        data[key] = formData[key] === '' ? null : formData[key];
      } else {
        data[key] = formData[key] === '' ? null : parseFloat(formData[key]);
      }
    }
    onSubmit(data);
  };

  const fetchWeatherForLocation = async (latitude, longitude) => {
    try {
      const resp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,rain&timezone=auto`);
      if (!resp.ok) throw new Error("Weather API returned an error.");
      const data = await resp.json();
      
      if (data && data.current) {
        setFormData(prev => ({
          ...prev,
          temperature: data.current.temperature_2m,
          humidity: data.current.relative_humidity_2m,
          rainfall: data.current.rain
        }));
      } else {
        throw new Error("Could not parse weather data.");
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
      alert("Failed to reach the weather service: " + error.message);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  const handleFetchWeather = async () => {
    setIsWeatherLoading(true);

    const fallbackToIPLocation = async () => {
      try {
        console.log("Falling back to IP-based location...");
        const ipResp = await fetch("https://ipapi.co/json/");
        if (!ipResp.ok) throw new Error("IP Geolocation failed");
        const ipData = await ipResp.json();
        
        if (ipData.latitude && ipData.longitude) {
          await fetchWeatherForLocation(ipData.latitude, ipData.longitude);
        } else {
          throw new Error("Invalid IP location data");
        }
      } catch (err) {
        setIsWeatherLoading(false);
        alert("Could not determine your location. Please enter weather data manually.");
      }
    };

    if (!navigator.geolocation) {
      // Browser doesn't support geolocation, use IP fallback
      await fallbackToIPLocation();
      return;
    }

    // Try browser geolocation with a 5-second timeout
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherForLocation(latitude, longitude);
      },
      (error) => {
        console.warn("Browser geolocation failed or was denied. Executing fallback.", error);
        fallbackToIPLocation();
      },
      { timeout: 5000, enableHighAccuracy: false } // Wait max 5 seconds before giving up and using IP
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.8 }}
      className="glass-panel p-6 sm:p-10 rounded-3xl w-full max-w-4xl mx-auto relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-green-600 z-10" />
      
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight drop-shadow-md">
          Agricultural Telemetry
        </h2>
        <p className="text-emerald-50/70 font-medium text-sm max-w-lg mx-auto">
          Input your hyper-local environment variables. Our RandomForest model processes extensive farm contexts to deduce the most optimal cultivar.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} id="predict">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0">
          
          {/* Section 1: Soil */}
          <SectionHeader title="Soil Chemistry & Composition" icon={BiLayer} />
          <InputField label="Nitrogen (N) - mg/kg" name="N" value={formData.N} onChange={handleChange} icon={FaLeaf} placeholder="Ratio in mg/kg" min="0" max="140" />
          <InputField label="Phosphorus (P) - mg/kg" name="P" value={formData.P} onChange={handleChange} icon={FaLeaf} placeholder="Ratio in mg/kg" min="5" max="145" />
          <InputField label="Potassium (K) - mg/kg" name="K" value={formData.K} onChange={handleChange} icon={FaLeaf} placeholder="Ratio in mg/kg" min="5" max="205" />
          <InputField label="pH Value (0.0 - 14.0)" name="ph" value={formData.ph} onChange={handleChange} icon={FaVial} placeholder="Soil pH" min="3.5" max="14" step="0.1" />
          <SelectField 
            label="Soil Profile / Type" name="soil_type" value={formData.soil_type} onChange={handleChange} icon={BiLayer}
            options={[
              { value: 'sandy', label: 'Sandy' }, { value: 'clay', label: 'Clay' }, 
              { value: 'loamy', label: 'Loamy' }, { value: 'black', label: 'Black Soil' }, { value: 'red', label: 'Red Soil' }
            ]}
          />
          <InputField label="Soil Moisture (%)" name="soil_moisture" value={formData.soil_moisture} onChange={handleChange} icon={GiWaterDrop} placeholder="Volumetric water content (%)" min="0" max="100" step="0.1" />

          {/* Section 2: Atmosphere */}
          <SectionHeader title="Atmospherics & Weather" icon={FaTemperatureHigh}>
            <motion.button 
              type="button" 
              onClick={handleFetchWeather}
              disabled={isWeatherLoading}
              whileHover={{ scale: isWeatherLoading ? 1 : 1.05 }} 
              whileTap={{ scale: isWeatherLoading ? 1 : 0.95 }}
              className="flex items-center gap-2 text-xs font-bold text-white bg-emerald-600/80 hover:bg-emerald-500 tracking-wide px-3 py-1.5 rounded-full shadow-md transition-colors border border-emerald-400/30 disabled:opacity-70 disabled:cursor-not-allowed min-w-[150px] justify-center"
            >
              {isWeatherLoading ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  Locating...
                </>
              ) : (
                <>
                  <FaCloudSun /> Fetch Local Weather
                </>
              )}
            </motion.button>
          </SectionHeader>
          <InputField label="Temperature (°C)" name="temperature" value={formData.temperature} onChange={handleChange} icon={FaTemperatureHigh} placeholder="Current temp in °C" min="8" max="45" step="0.1" />
          <InputField label="Relative Humidity (%)" name="humidity" value={formData.humidity} onChange={handleChange} icon={FaTint} placeholder="Relative humidity in %" min="14" max="100" step="0.1" />
          <InputField label="Rainfall (mm)" name="rainfall" value={formData.rainfall} onChange={handleChange} icon={FaCloudRain} placeholder="Rainfall in mm" min="20" max="500" step="0.1" />
          <InputField label="Avg. Photoperiod (Hrs/Day)" name="sunlight_hours" value={formData.sunlight_hours} onChange={handleChange} icon={FaSun} placeholder="Exposure in hours" min="0" max="24" step="0.5" />

          {/* Section 3: Geography */}
          <SectionHeader title="Geography & Infrastructure" icon={FaMountain} />
          <InputField label="Altitude (meters)" name="altitude" value={formData.altitude} onChange={handleChange} icon={FaMountain} placeholder="Elevation above sea level" min="-50" max="5000" />
          <SelectField 
            label="Irrigation Infrastructure Availability" name="irrigation_availability" value={formData.irrigation_availability} onChange={handleChange} icon={FaTint}
            options={[ { value: 'none', label: 'None (Rainfed)' }, { value: 'limited', label: 'Limited Supply' }, { value: 'moderate', label: 'Moderate Flow' }, { value: 'high', label: 'High Capacity' } ]}
          />

        </div>

        <motion.button
          whileHover={{ scale: isLoading ? 1 : 1.02, boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.5)" }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full mt-10 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold py-5 px-6 rounded-2xl shadow-lg transition-all flex justify-center items-center gap-3 relative overflow-hidden group border border-emerald-400/50 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {/* Button Shine Effect */}
          <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 animate-shine" />
          
          {isLoading ? (
             <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          ) : (
            <>
              <GiChemicalDrop className="text-2xl drop-shadow-md" /> <span className="text-xl drop-shadow-sm tracking-wide">Engage Telemetry Analysis</span>
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CropForm;
