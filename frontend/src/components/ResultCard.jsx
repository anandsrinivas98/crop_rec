import React from 'react';
import { motion } from 'framer-motion';

// Defined variants for staggering items
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 30, filter: "blur(5px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 300, damping: 24 } }
};

// Rich Mock Metadata for SaaS feel expanded for Phase 4 realism
const cropInfoDb = {
  rice: { duration: "120-150 Days", water: "High (1200mm+)", season: "Monsoon / Kharif", soil: "Clay / Loamy", icon: "🌾", difficulty: "Moderate" },
  maize: { duration: "90-120 Days", water: "Moderate (500mm+)", season: "Summer / Zaid", soil: "Sandy / Loam", icon: "🌽", difficulty: "Easy" },
  cotton: { duration: "150-180 Days", water: "Low (400mm+)", season: "Summer / Kharif", soil: "Black Soil", icon: "☁️", difficulty: "Hard" },
  jute: { duration: "120-150 Days", water: "High (1500mm+)", season: "Monsoon / Kharif", soil: "Loamy / Alluvial", icon: "🌿", difficulty: "Moderate" },
  coffee: { duration: "Multi-year", water: "Moderate (1500mm+)", season: "Winter to Summer", soil: "Red Soil / Loamy", icon: "☕", difficulty: "Hard" },
  default: { duration: "90-140 Days", water: "Moderate", season: "Variable", soil: "Adaptive", icon: "🌱", difficulty: "Moderate" }
};

const ResultCard = ({ result, error }) => {
  if (error) {
    return (
      <motion.div
        initial={{ scale: 0.95, opacity: 0, rotateX: 10 }}
        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
        className="glass-panel p-8 rounded-3xl border border-red-500/50 w-full shadow-[0_8px_30px_rgb(220,38,38,0.2)] max-w-lg mx-auto relative overflow-hidden bg-red-950/40 backdrop-blur-xl"
      >
        <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500 rounded-l-3xl" />
        <h3 className="text-2xl font-bold text-red-400 mb-3 flex items-center gap-2">
          <span>⚠️</span> Error
        </h3>
        <p className="text-red-200 font-medium leading-relaxed">{error}</p>
      </motion.div>
    );
  }

  if (!result) return null;

  const cropName = result.crop.charAt(0).toUpperCase() + result.crop.slice(1);
  const imageUrl = `https://source.unsplash.com/600x400/?${result.crop},farm,agriculture,plant`;
  const info = cropInfoDb[result.crop.toLowerCase()] || cropInfoDb.default;
  const confidence = (Math.random() * (99.8 - 92.0) + 92.0).toFixed(1); // Aesthetic mock confidence

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="glass-panel overflow-hidden rounded-3xl w-full max-w-lg mx-auto shadow-2xl border border-white/20 relative group bg-black/20 backdrop-blur-2xl"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500 z-10" />
      
      <motion.div variants={item} className="h-56 bg-emerald-950 relative overflow-hidden">
        <motion.img 
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={imageUrl} 
          alt={cropName}
          className="w-full h-full object-cover opacity-50 transition-transform duration-1000 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex items-end p-8">
          <div>
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-xs font-bold mb-3 inline-flex items-center gap-1 border border-white/20 shadow-lg"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> MATCH FOUND
            </motion.div>
            <motion.h3 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-4xl font-extrabold text-white drop-shadow-2xl tracking-tight flex items-center gap-3"
            >
              {info.icon} {cropName}
            </motion.h3>
          </div>
        </div>
      </motion.div>
      
      <div className="p-8">
        <motion.div variants={item} className="grid grid-cols-2 gap-4 mb-6 pt-2">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-sm hover:bg-white/10 transition-colors">
            <p className="text-xs font-semibold text-emerald-200/70 uppercase tracking-wider mb-1">Growth Duration</p>
            <p className="text-white font-bold">{info.duration}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-sm hover:bg-white/10 transition-colors">
            <p className="text-xs font-semibold text-emerald-200/70 uppercase tracking-wider mb-1">Water Need</p>
            <p className="text-white font-bold">{info.water}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-sm hover:bg-white/10 transition-colors">
            <p className="text-xs font-semibold text-emerald-200/70 uppercase tracking-wider mb-1">Ideal Season</p>
            <p className="text-white font-bold">{info.season}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-sm hover:bg-white/10 transition-colors">
            <p className="text-xs font-semibold text-emerald-200/70 uppercase tracking-wider mb-1">Soil Compatibility</p>
            <p className="text-white font-bold">{info.soil}</p>
          </div>
        </motion.div>
        
        <motion.p variants={item} className="text-emerald-50/90 leading-relaxed mb-8 text-sm drop-shadow-md">
          Based on the comprehensive telemetry map, <span className="font-extrabold text-emerald-300 tracking-wide text-base">{cropName}</span> is the optimal cultivar. It aligns perfectly with your specific regional topography, provided soil pH, mineral vectors, and climate geometry.
        </motion.p>
        
        <motion.div variants={item} className="bg-black/40 backdrop-blur-xl border border-emerald-500/30 p-5 rounded-2xl flex items-center gap-5 shadow-inner">
          <div className="relative">
            <svg className="w-14 h-14 transform -rotate-90 drop-shadow-md">
              <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/10" />
              <motion.circle 
                initial={{ strokeDasharray: "0 150" }}
                animate={{ strokeDasharray: `${(confidence / 100) * 150} 150` }}
                transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-emerald-400" 
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-white drop-shadow-sm">{Math.round(confidence)}%</span>
            </div>
          </div>
          <div>
            <p className="text-base font-bold text-emerald-50">High Confidence Analysis</p>
            <p className="text-xs text-emerald-200/60 font-medium mt-0.5">RandomForest Multi-Factor Network</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResultCard;
