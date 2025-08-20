import React, { useEffect, useState, useRef } from 'react';
import { useScrollerStore } from '../../stores/useScrollerStore';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Matrix Rain Effect
const MatrixRain = () => {
  const meshRef = useRef();
  const { bgColor } = useScrollerStore();
  const characters = useRef([]);
  
  useEffect(() => {
    // Initialize matrix characters
    characters.current = Array.from({ length: 200 }, () => ({
      x: Math.random() * 8 - 4,
      y: Math.random() * 10 - 5,
      z: -4.9,
      speed: 0.02 + Math.random() * 0.03,
      char: Math.random() > 0.5 ? '0' : '1'
    }));
  }, []);

  useFrame(() => {
    if (meshRef.current) {
      characters.current.forEach((char) => {
        char.y -= char.speed;
        if (char.y < -5) {
          char.y = 5;
          char.x = Math.random() * 8 - 4;
        }
      });
    }
  });

  return (
    <group>
      {/* Background plane */}
      <mesh position={[0, 0, -5]}>
        <planeGeometry args={[8, 10]} />
        <meshBasicMaterial color={bgColor} transparent opacity={0.1} />
      </mesh>
      
      {/* Matrix characters */}
      {characters.current.map((char, index) => (
        <mesh key={index} position={[char.x, char.y, char.z]}>
          <boxGeometry args={[0.1, 0.3, 0.1]} />
          <meshBasicMaterial color="#00ff00" />
        </mesh>
      ))}
    </group>
  );
};

// Stars Effect
const Stars = () => {
  const pointsRef = useRef();
  const { bgColor } = useScrollerStore();
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={1000}
          array={new Float32Array(Array.from({ length: 3000 }, () => (Math.random() - 0.5) * 10))}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.05} sizeAttenuation />
    </points>
  );
};

// Circuit Board Effect
const CircuitBoard = () => {
  const groupRef = useRef();
  const linesRef = useRef([]);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Grid base */}
      <gridHelper args={[8, 20, '#00ff00', '#003300']} />
      
      {/* Circuit lines */}
      {Array.from({ length: 50 }, (_, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([
                Math.random() * 8 - 4, Math.random() * 8 - 4, -5,
                Math.random() * 8 - 4, Math.random() * 8 - 4, -5
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00ff00" />
        </line>
      ))}
    </group>
  );
};

// Cyber Grid Effect
const CyberGrid = () => {
  const gridRef = useRef();
  
  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
      gridRef.current.rotation.z += 0.0005;
    }
  });

  return (
    <group>
      <gridHelper ref={gridRef} args={[10, 20, '#00ff00', '#004400']} />
      <gridHelper args={[10, 20, '#00ff00', '#004400']} rotation={[Math.PI / 2, 0, 0]} />
    </group>
  );
};

// Main Background Component
const Background = () => {
  const { 
    background, 
    bgColor, 
    flickerEnabled,
    rgbBorderEnabled,
    rgbBorderColors,
    rgbBorderSpeed
  } = useScrollerStore();
  
  const [currentColor, setCurrentColor] = useState(bgColor);
  const [isClient, setIsClient] = useState(false);

  // Handle client-side only rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle flickering effect
  useEffect(() => {
    if (!flickerEnabled && !rgbBorderEnabled) {
      setCurrentColor(bgColor);
      return;
    }

    let colorIndex = 0;
    const colors = rgbBorderEnabled ? rgbBorderColors : ['#ff0000', '#00ff00', '#0000ff'];
    const speed = rgbBorderEnabled ? rgbBorderSpeed : 5;
    
    const interval = setInterval(() => {
      colorIndex = (colorIndex + 1) % colors.length;
      setCurrentColor(colors[colorIndex]);
    }, 1000 / speed);

    return () => clearInterval(interval);
  }, [flickerEnabled, bgColor, rgbBorderEnabled, rgbBorderColors, rgbBorderSpeed]);

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

  // Return simple div if not on client side
  if (!isClient) {
    return (
      <div 
        className="absolute inset-0 z-0 transition-colors duration-300"
        style={{ backgroundColor: currentColor }}
      />
    );
  }

  // 3D Backgrounds
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
      
      <Canvas className="absolute inset-0" camera={{ position: [0, 0, 5], fov: 75 }}>
        <color attach="background" args={['transparent']} />
        <ambientLight intensity={0.3} />
        
        {background === 'matrix' && <MatrixRain />}
        {background === 'stars' && <Stars />}
        {background === 'circuit' && <CircuitBoard />}
        {background === 'cyber' && <CyberGrid />}
      </Canvas>
    </div>
  );
};

export default Background;