// components/EnhancedBackground.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useScrollerStore } from '../../stores/useScrollerStore';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles, Cloud, Sky, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Matrix Rain Effect
const MatrixRain = () => {
  const meshRef = useRef();
  const { bgColor } = useScrollerStore();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y -= 0.02;
      if (meshRef.current.position.y < -10) {
        meshRef.current.position.y = 10;
      }
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={[0, 0, -5]}>
        <planeGeometry args={[8, 10]} />
        <meshBasicMaterial color={bgColor} transparent opacity={0.1} />
      </mesh>
      {Array.from({ length: 100 }, (_, i) => (
        <mesh key={i} position={[Math.random() * 8 - 4, Math.random() * 10 - 5, -4.9]}>
          <boxGeometry args={[0.1, 0.3, 0.1]} />
          <meshBasicMaterial color="#00ff00" />
        </mesh>
      ))}
    </group>
  );
};

// Neural Network Effect
const NeuralNetwork = () => {
  const pointsRef = useRef();
  const linesRef = useRef();
  const { bgColor } = useScrollerStore();

  useFrame((state) => {
    if (pointsRef.current && linesRef.current) {
      pointsRef.current.rotation.y += 0.001;
      linesRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <sphereGeometry args={[3, 32, 32]} />
        <pointsMaterial color={bgColor} size={0.05} />
      </points>
      <lineSegments ref={linesRef}>
        <edgesGeometry args={[new THREE.SphereGeometry(3, 16, 16)]} />
        <lineBasicMaterial color="#00ff00" />
      </lineSegments>
    </group>
  );
};

// Cyber Grid Effect
const CyberGrid = () => {
  const gridRef = useRef();
  
  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      gridRef.current.rotation.z += 0.001;
    }
  });

  return (
    <group>
      <gridHelper ref={gridRef} args={[10, 20, '#00ff00', '#003300']} />
      <gridHelper args={[10, 20, '#00ff00', '#003300']} rotation={[Math.PI / 2, 0, 0]} />
      <gridHelper args={[10, 20, '#00ff00', '#003300']} rotation={[0, 0, Math.PI / 2]} />
    </group>
  );
};

// Main Background Component
const EnhancedBackground = () => {
  const { 
    background, 
    bgColor, 
    flickerEnabled,
    rgbBorderEnabled,
    rgbBorderColors,
    rgbBorderSpeed
  } = useScrollerStore();
  
  const [currentColor, setCurrentColor] = useState(bgColor);

  // Handle color effects
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
      
      <Canvas className="absolute inset-0">
        <color attach="background" args={[currentColor]} />
        <ambientLight intensity={0.5} />
        
        {background === 'matrix' && <MatrixRain />}
        {background === 'stars' && (
          <>
            <Stars radius={100} depth={50} count={5000} factor={4} />
            <Sparkles count={200} scale={10} size={2} speed={0.4} />
          </>
        )}
        {background === 'circuit' && <NeuralNetwork />}
        {background === 'cyber' && <CyberGrid />}
        
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};

export default EnhancedBackground;