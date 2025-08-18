import React, { useEffect, useState } from 'react';
import { useScrollerStore } from '../../stores/useScrollerStore';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const Background = () => {
  const { 
    background, 
    bgColor, 
    flickerEnabled, 
    flickerSpeed, 
    flickerColors,
    rgbBorderEnabled,
    rgbBorderColors,
    rgbBorderSpeed
  } = useScrollerStore();
  
  const [currentColor, setCurrentColor] = useState(bgColor);
  const [particlesInit, setParticlesInit] = useState(false);

  // Initialize particles
  useEffect(() => {
    const init = async () => {
      await loadFull();
      setParticlesInit(true);
    };
    init();
  }, []);

  // Handle flickering effect
  useEffect(() => {
    if (!flickerEnabled && !rgbBorderEnabled) {
      setCurrentColor(bgColor);
      return;
    }

    let colorIndex = 0;
    const colors = rgbBorderEnabled ? rgbBorderColors : flickerColors;
    const speed = rgbBorderEnabled ? rgbBorderSpeed : flickerSpeed;
    
    const interval = setInterval(() => {
      colorIndex = (colorIndex + 1) % colors.length;
      setCurrentColor(colors[colorIndex]);
    }, 1000 / speed);

    return () => clearInterval(interval);
  }, [
    flickerEnabled, 
    flickerSpeed, 
    flickerColors, 
    bgColor,
    rgbBorderEnabled,
    rgbBorderColors,
    rgbBorderSpeed
  ]);

  // Solid color background
  if (background === 'solid') {
    return (
      <div 
        className="absolute inset-0 z-0 transition-colors duration-300"
        style={{ 
          backgroundColor: currentColor,
          border: rgbBorderEnabled ? `4px solid ${currentColor}` : 'none',
          boxShadow: rgbBorderEnabled ? `0 0 20px ${currentColor}` : 'none'
        }}
      />
    );
  }

  // Particle backgrounds
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div 
        className="absolute inset-0 transition-colors duration-300"
        style={{ 
          backgroundColor: currentColor,
          border: rgbBorderEnabled ? `4px solid ${currentColor}` : 'none',
          boxShadow: rgbBorderEnabled ? `0 0 20px ${currentColor}` : 'none'
        }}
      />
      
      {background === 'matrix' && particlesInit && (
        <Particles
          init={async (engine) => await loadFull(engine)}
          options={{
            particles: {
              number: { value: 80 },
              color: { value: "#00ff00" },
              shape: { type: "char", character: { value: ["0", "1"] } },
              opacity: { value: 0.5, random: true },
              size: { value: 12, random: true },
              links: { 
                enable: true, 
                distance: 150, 
                color: "#00ff00", 
                opacity: 0.4 
              },
              move: { enable: true, speed: 2 }
            }
          }}
          className="absolute inset-0"
        />
      )}
    </div>
  );
};

export default Background;