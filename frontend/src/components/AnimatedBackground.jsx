import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useMouse } from 'react-use';

const AnimatedBackground = () => {
  const [elements, setElements] = useState([]);
  const bgRef = useRef(null);
  const { docX, docY } = useMouse(bgRef);

  useEffect(() => {
    // Generate random positions and sizes for floating particles
    const generateElements = () => {
      const newElements = [];
      const numElements = Math.floor(window.innerWidth / 70); // Responsive particle count

      for (let i = 0; i < numElements; i++) {
        newElements.push({
          id: i,
          x: Math.random() * 100, // percentage
          y: Math.random() * 100, // percentage
          size: Math.random() * 40 + 10, // 10px to 50px
          duration: Math.random() * 20 + 15, // 15s to 35s
          delay: Math.random() * 10,
        });
      }
      setElements(newElements);
    };

    generateElements();
    window.addEventListener('resize', generateElements);
    return () => window.removeEventListener('resize', generateElements);
  }, []);

  return (
    <div ref={bgRef} className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Soft cursor-following radial glow */}
      <motion.div 
        className="absolute rounded-full pointer-events-none opacity-40 blur-[100px]"
        style={{
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(91,194,131,0.5) 0%, rgba(229,246,223,0) 70%)',
        }}
        animate={{
          x: docX - 300,
          y: docY - 300,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.5 }}
      />
      
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute rounded-full bg-white mix-blend-overlay"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            width: el.size,
            height: el.size,
            filter: 'blur(8px)',
            opacity: 0.15,
          }}
          animate={{
            y: ['0%', '-100vh'],
            x: ['0%', `${(Math.random() - 0.5) * 50}vw`],
            opacity: [0.1, 0.4, 0],
            scale: [1, 1.5, 0.5],
            rotate: [0, 360],
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            ease: "linear",
            delay: el.delay,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
