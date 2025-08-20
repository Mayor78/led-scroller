import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { useScrollerStore } from '../../stores/useScrollerStore';
import * as THREE from 'three';

const MatrixRain = () => {
  const meshRef = useRef();
  const { bgColor } = useScrollerStore();
  const characters = useRef([]);
  const font = useRef();

  useEffect(() => {
    const loader = new FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (loadedFont) => {
      font.current = loadedFont;
      characters.current = Array.from({ length: 200 }, () => ({
        x: Math.random() * 8 - 4,
        y: Math.random() * 10 - 5,
        z: -4.9,
        speed: 0.02 + Math.random() * 0.03,
        char: Math.random() > 0.5 ? '0' : '1'
      }));
    });
  }, []);

  useFrame(() => {
    if (meshRef.current && font.current) {
      characters.current.forEach((char) => {
        char.y -= char.speed;
        if (char.y < -5) {
          char.y = 5;
          char.x = Math.random() * 8 - 4;
        }
      });
      meshRef.current.position.y = 0;
    }
  });

  if (!font.current) return null;

  return (
    <group ref={meshRef}>
      <mesh position={[0, 0, -5]}>
        <planeGeometry args={[8, 10]} />
        <meshBasicMaterial color={bgColor} transparent opacity={0.1} />
      </mesh>
      {characters.current.map((char, index) => (
        <mesh key={index} position={[char.x, char.y, char.z]}>
          <textGeometry args={[char.char, { font: font.current, size: 0.3, height: 0.1 }]} />
          <meshBasicMaterial color="#00ff00" />
        </mesh>
      ))}
    </group>
  );
};

export default MatrixRain;