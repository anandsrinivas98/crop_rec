import React, { useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useMouse } from 'react-use';

const ParallaxCard = ({ children, className = '' }) => {
  const ref = useRef(null);
  
  // Track mouse position over the card container
  const { docX, docY } = useMouse(ref);
  
  // Create spring-based animated values for smooth easing
  const x = useSpring(0, { stiffness: 150, damping: 15 });
  const y = useSpring(0, { stiffness: 150, damping: 15 });

  // Update bounds efficiently
  React.useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    // Calculate distance from center of card (-1 to 1 range)
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Scale down the effect so it's subtle (e.g., max 15px shift)
    const shiftX = (docX - centerX) / (rect.width / 2);
    const shiftY = (docY - centerY) / (rect.height / 2);
    
    // Clamp values to prevent extreme tilting if mouse moves far away
    x.set(Math.max(-1, Math.min(1, shiftX)) * 8); 
    y.set(Math.max(-1, Math.min(1, shiftY)) * 8);
  }, [docX, docY, x, y]);

  // Map mouse coordinate shifts to CSS rotate transforms
  // Reverse X and Y mapping: moving mouse right tilts card left (showing right edge)
  const rotateX = useTransform(y, [-8, 8], [4, -4]);
  const rotateY = useTransform(x, [-8, 8], [-4, 4]);

  return (
    <div ref={ref} className={`perspective-1000 ${className}`}>
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-full relative group"
      >
        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
          className="w-full h-full relative"
        >
          {/* Subtle gradient border highlight wrapper applied to child bounds */}
          <div className="absolute -inset-[1px] bg-gradient-to-br from-emerald-400/30 via-transparent to-teal-500/10 rounded-3xl z-[-1] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px]" />
          
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ParallaxCard;
