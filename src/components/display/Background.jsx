import React, { useEffect, useState, useRef } from 'react';
import { useScrollerStore } from '../../stores/useScrollerStore';

const MatrixRain = ({ canvasRef, ctx, bgColor }) => {
  const characters = useRef([]);

  useEffect(() => {
    if (!canvasRef.current || !ctx.current) return;
    for (let i = 0; i < 50; i++) {
      characters.current.push({
        x: Math.random() * canvasRef.current.width,
        y: Math.random() * canvasRef.current.height,
        speed: Math.random() * 2 + 1,
      });
    }

    const animate = () => {
      if (!ctx.current) return;
      ctx.current.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.current.fillStyle = '#00ff00';
      ctx.current.font = '16px monospace';

      characters.current.forEach((char) => {
        ctx.current.fillText('0', char.x, char.y);
        char.y += char.speed;
        if (char.y > canvasRef.current.height) {
          char.y = 0;
          char.x = Math.random() * canvasRef.current.width;
        }
      });
      requestAnimationFrame(animate);
    };
    animate();
  }, [canvasRef, ctx]);

  return null; // No direct rendering, handled by canvas
};

const Stars = ({ canvasRef, ctx, bgColor }) => {
  const stars = useRef([]);

  useEffect(() => {
    if (!canvasRef.current || !ctx.current) return;
    for (let i = 0; i < 100; i++) {
      stars.current.push({
        x: Math.random() * canvasRef.current.width,
        y: Math.random() * canvasRef.current.height,
        size: Math.random() * 2 + 1,
      });
    }

    const animate = () => {
      if (!ctx.current) return;
      ctx.current.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.current.fillStyle = '#ffffff';

      stars.current.forEach((star) => {
        ctx.current.beginPath();
        ctx.current.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.current.fill();
      });
      requestAnimationFrame(animate);
    };
    animate();
  }, [canvasRef, ctx]);

  return null;
};

const CircuitBoard = ({ canvasRef, ctx, bgColor }) => {
  const lines = useRef([]);

  useEffect(() => {
    if (!canvasRef.current || !ctx.current) return;
    for (let i = 0; i < 20; i++) {
      lines.current.push({
        x1: Math.random() * canvasRef.current.width,
        y1: Math.random() * canvasRef.current.height,
        x2: Math.random() * canvasRef.current.width,
        y2: Math.random() * canvasRef.current.height,
      });
    }

    const animate = () => {
      if (!ctx.current) return;
      ctx.current.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.current.strokeStyle = '#00ff00';
      ctx.current.lineWidth = 1;

      lines.current.forEach((line) => {
        ctx.current.beginPath();
        ctx.current.moveTo(line.x1, line.y1);
        ctx.current.lineTo(line.x2, line.y2);
        ctx.current.stroke();
      });
      requestAnimationFrame(animate);
    };
    animate();
  }, [canvasRef, ctx]);

  return null;
};

const CyberGrid = ({ canvasRef, ctx, bgColor }) => {
  useEffect(() => {
    if (!canvasRef.current || !ctx.current) return;

    const animate = () => {
      if (!ctx.current) return;
      ctx.current.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.current.strokeStyle = '#00ff00';
      ctx.current.lineWidth = 0.5;

      const gridSize = 50;
      for (let x = 0; x < canvasRef.current.width; x += gridSize) {
        ctx.current.beginPath();
        ctx.current.moveTo(x, 0);
        ctx.current.lineTo(x, canvasRef.current.height);
        ctx.current.stroke();
      }
      for (let y = 0; y < canvasRef.current.height; y += gridSize) {
        ctx.current.beginPath();
        ctx.current.moveTo(0, y);
        ctx.current.lineTo(canvasRef.current.width, y);
        ctx.current.stroke();
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, [canvasRef, ctx]);

  return null;
};

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
  const canvasRef = useRef(null);
  const ctx = useRef(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    ctx.current = canvasRef.current.getContext('2d');
    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;
  }, []);

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

  if (!isClient) {
    return (
      <div 
        className="absolute inset-0 z-0 transition-colors duration-300"
        style={{ backgroundColor: bgColor }}
      />
    );
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden" style={{ height: '100vh', width: '100vw' }}>
      <canvas ref={canvasRef} className="w-full h-full" />
      {background === 'matrix' && <MatrixRain canvasRef={canvasRef} ctx={ctx} bgColor={bgColor} />}
      {background === 'stars' && <Stars canvasRef={canvasRef} ctx={ctx} bgColor={bgColor} />}
      {background === 'circuit' && <CircuitBoard canvasRef={canvasRef} ctx={ctx} bgColor={bgColor} />}
      {background === 'cyber' && <CyberGrid canvasRef={canvasRef} ctx={ctx} bgColor={bgColor} />}
      <div 
        className="absolute inset-0"
        style={{ 
          backgroundColor: currentColor,
          opacity: 0.1,
          border: rgbBorderEnabled ? `4px solid ${currentColor}` : 'none',
          boxShadow: rgbBorderEnabled ? `0 0 20px ${currentColor}` : 'none'
        }}
      />
    </div>
  );
};

export default Background;