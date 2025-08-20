import React, { useEffect, useState, useRef } from 'react';
import { useScrollerStore } from '../../stores/useScrollerStore';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import * as THREE from 'three';

// Extend R3F namespace
extend({ TextGeometry });

// Matrix Rain Effect (Imported)
import MatrixRain from './MatrixRain'; // Adjust path as needed
// Stars, CircuitBoard, and CyberGrid remain unchanged, imported similarly

// Stars Effect
const Stars = () => {
  const pointsRef = useRef();
  const { bgColor } = useScrollerStore();

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0005;
    }
  });

  const positions = new Float32Array(Array.from({ length: 3000 }, () => (Math.random() - 0.5) * 10));
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={1000}
          array={positions}
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
      <gridHelper args={[8, 20, '#00ff00', '#003300']} />
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
        style={{ backgroundColor: bgColor }}
      />
    );
  }

  // 3D Backgrounds
  return (
    <div className="absolute inset-0 z-0 overflow-hidden" style={{ height: '100vh', width: '100vw' }}>
      <Canvas 
        className="w-full h-full"
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ alpha: true }} // Allow transparency
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 5]} intensity={0.8} />
        {background === 'matrix' && <MatrixRain />}
        {background === 'stars' && <Stars />}
        {background === 'circuit' && <CircuitBoard />}
        {background === 'cyber' && <CyberGrid />}
      </Canvas>
      <div 
        className="absolute inset-0"
        style={{ 
          backgroundColor: currentColor,
          opacity: 0.1, // Slight overlay for depth
          border: rgbBorderEnabled ? `4px solid ${currentColor}` : 'none',
          boxShadow: rgbBorderEnabled ? `0 0 20px ${currentColor}` : 'none'
        }}
      />
    </div>
  );
};

export default Background;