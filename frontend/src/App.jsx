import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import CropForm from './components/CropForm';
import ResultCard from './components/ResultCard';
import AnimatedBackground from './components/AnimatedBackground';
import ParallaxCard from './components/ParallaxCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Animation variants for page-level structural staggering
const appStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const appItem = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handlePredict = async (formData) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const response = await axios.post(`${API_URL}/predict`, formData);
      setResult(response.data);
    } catch (err) {
      console.error("Prediction error:", err);
      setError(
        err.response?.data?.detail || 
        "Failed to connect to the prediction server. Please ensure the backend is running."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatedBackground />
      {/* Extract Navbar to the highest z-index plane to avoid masking */}
      <div className="fixed top-0 left-0 w-full z-[100] pointer-events-none">
        <div className="pointer-events-auto">
          <Navbar />
        </div>
      </div>
      
      <div className="min-h-screen px-4 py-8 md:px-8 relative z-10 w-full overflow-hidden mt-28 md:mt-32">
        <motion.main 
          variants={appStagger}
          initial="hidden"
          animate="show"
          className="max-w-7xl mx-auto"
        >
          {/* Header section */}
          <motion.div variants={appItem} className="text-center mb-10 mt-4 relative">
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-5 drop-shadow-lg tracking-tight leading-tight">
              AI Smart Crop<br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-emerald-500">Recommendation</span>
            </h2>
            <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto font-medium drop-shadow-md">
              Discover the perfect crop for your land using our advanced machine learning algorithm.
            </p>
            
            {/* AI Status Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mt-6 flex flex-wrap justify-center gap-4"
            >
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-sm text-sm font-semibold text-emerald-50 hover:bg-white/10 transition-colors">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                AI Model Online
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-sm text-sm font-semibold text-emerald-50 hover:bg-white/10 transition-colors">
                <span>⚡</span> <span className="opacity-80">Infer Time : </span> &lt; 1s
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-sm text-sm font-semibold text-emerald-50 hover:bg-white/10 transition-colors">
                <span>🧠</span> <span className="opacity-80">Model : </span> Random Forest
              </div>
            </motion.div>
          </motion.div>

          <motion.div variants={appItem} className="flex flex-col lg:flex-row gap-8 items-stretch justify-center relative mt-6">
            <ParallaxCard className="w-full lg:w-[60%] flex relative z-20">
              <CropForm onSubmit={handlePredict} isLoading={isLoading} />
            </ParallaxCard>
            
            <div className="w-full lg:w-[40%] flex flex-col justify-center min-h-[500px] relative z-20 h-auto min-h-full">
              <AnimatePresence mode="wait">
                {isLoading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center p-8 glass-panel rounded-3xl w-full h-full relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                    <div className="relative w-24 h-24">
                      <div className="absolute inset-0 border-4 border-emerald-900/50 rounded-full shadow-inner"></div>
                      <div className="absolute inset-0 border-4 border-emerald-400 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <motion.div 
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="mt-8 text-center"
                    >
                      <p className="text-white font-bold tracking-wide text-2xl">Analyzing Telemetry...</p>
                      <p className="text-emerald-100/70 text-base mt-2">Correlating 13 environmental factors</p>
                    </motion.div>
                  </motion.div>
                )}

                {!isLoading && (result || error) && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 40, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="w-full h-full"
                  >
                    <ParallaxCard className="h-full">
                      <ResultCard result={result} error={error} />
                    </ParallaxCard>
                  </motion.div>
                )}

                {!isLoading && !result && !error && (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, filter: "blur(10px)" }}
                    whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.3)" }}
                    className="glass-panel p-10 rounded-3xl w-full text-center flex flex-col items-center justify-center h-full min-h-[500px] relative overflow-hidden transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none z-0" />
                    
                    <motion.div 
                      animate={{ y: [-5, 5, -5] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="w-32 h-32 bg-white/5 backdrop-blur-xl rounded-3xl rotate-3 flex items-center justify-center mb-8 shadow-2xl border border-white/10 z-10"
                    >
                      <span className="text-6xl drop-shadow-lg -rotate-3">🌱</span>
                    </motion.div>
                    
                    <h3 className="text-3xl font-bold text-white mb-4 z-10 tracking-tight drop-shadow-sm">
                      Awaiting Data Scan
                    </h3>
                    <p className="text-emerald-100/90 text-xl z-10 font-medium max-w-xs mx-auto">
                      Provide environment parameters to trigger the AI analysis engine.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.main>
      </div>
    </>
  );
}

export default App;
