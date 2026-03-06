import React, { useState, useEffect } from 'react';
import { GiFarmTractor } from 'react-icons/gi';
import { motion, useScroll, useTransform } from 'framer-motion';

const NavLink = ({ href, children }) => {
  return (
    <motion.a 
      href={href} 
      className="relative font-medium text-emerald-50 hover:text-white transition-colors py-2 group drop-shadow-sm"
      whileHover="hover"
    >
      {children}
      <motion.span
        className="absolute left-0 bottom-0 w-full h-0.5 bg-emerald-400 origin-left"
        initial={{ scaleX: 0 }}
        variants={{
          hover: { scaleX: 1 }
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </motion.a>
  );
};

const Navbar = () => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 20);
    });
  }, [scrollY]);

  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`px-6 py-4 rounded-b-3xl mx-auto max-w-7xl transition-all duration-300 border-b ${
        isScrolled 
          ? 'bg-black/40 backdrop-blur-xl shadow-lg border-white/10' 
          : 'bg-transparent shadow-none border-transparent'
      } mb-8`}
    >
      <div className="flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-3 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="bg-gradient-to-br from-emerald-500 to-teal-400 p-2 rounded-full text-white shadow-xl border border-white/20">
            <GiFarmTractor size={28} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-md">
            AgriBrain
          </h1>
        </motion.div>
        <div className="hidden md:flex space-x-8">
          <NavLink href="#">Home</NavLink>
          <NavLink href="#predict">Predict</NavLink>
          <NavLink href="#about">About</NavLink>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
