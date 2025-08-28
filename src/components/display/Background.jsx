import React, { useEffect, useState, useRef } from 'react';
import { useScrollerStore } from '../../stores/useScrollerStore';

const MatrixRain = ({ canvasRef, ctx, bgColor }) => {
  const characters = useRef([]);
  const animationFrameId = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !ctx.current) return;

    characters.current = [];
    for (let i = 0; i < 50; i++) {
      characters.current.push({
        x: Math.random() * canvasRef.current.width,
        y: Math.random() * canvasRef.current.height,
        speed: Math.random() * 2 + 1,
      });
    }

    const animate = () => {
      if (!ctx.current) return;
      ctx.current.fillStyle = `rgba(0, 0, 0, ${bgColor === '#000000' ? 0.05 : 0.1})`;
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
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [canvasRef, ctx, bgColor]);

  return null;
};

const Stars = ({ canvasRef, ctx, bgColor }) => {
  const stars = useRef([]);
  const animationFrameId = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !ctx.current) return;

    stars.current = [];
    for (let i = 0; i < 100; i++) {
      stars.current.push({
        x: Math.random() * canvasRef.current.width,
        y: Math.random() * canvasRef.current.height,
        size: Math.random() * 2 + 1,
      });
    }

    const animate = () => {
      if (!ctx.current) return;
      ctx.current.fillStyle = `rgba(0, 0, 0, ${bgColor === '#000000' ? 0.1 : 0.2})`;
      ctx.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.current.fillStyle = '#ffffff';
      stars.current.forEach((star) => {
        ctx.current.beginPath();
        ctx.current.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.current.fill();
      });
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [canvasRef, ctx, bgColor]);

  return null;
};

const CircuitBoard = ({ canvasRef, ctx, bgColor }) => {
  const lines = useRef([]);
  const animationFrameId = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !ctx.current) return;

    lines.current = [];
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
      ctx.current.fillStyle = `rgba(0, 0, 0, ${bgColor === '#000000' ? 0.05 : 0.1})`;
      ctx.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.current.strokeStyle = '#00ff00';
      ctx.current.lineWidth = 1;
      lines.current.forEach((line) => {
        ctx.current.beginPath();
        ctx.current.moveTo(line.x1, line.y1);
        ctx.current.lineTo(line.x2, line.y2);
        ctx.current.stroke();
      });
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [canvasRef, ctx, bgColor]);

  return null;
};

const CyberGrid = ({ canvasRef, ctx, bgColor }) => {
  const animationFrameId = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !ctx.current) return;

    const animate = () => {
      if (!ctx.current) return;
      ctx.current.fillStyle = `rgba(0, 0, 0, ${bgColor === '#000000' ? 0.05 : 0.1})`;
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
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [canvasRef, ctx, bgColor]);

  return null;
};

const Background = () => {
  const { 
    background, 
    bgColor, 
    backgroundImage,
    flickerEnabled,
    rgbBorderEnabled,
    rgbBorderColors,
    rgbBorderSpeed
  } = useScrollerStore();
  
  const [currentColor, setCurrentColor] = useState(bgColor);
  const [isClient, setIsClient] = useState(false);
  const [imageOpacity, setImageOpacity] = useState(0.5);
  const canvasRef = useRef(null);
  const ctx = useRef(null);
  const componentKey = useRef(Date.now() + Math.random()).current;

  useEffect(() => {
    setIsClient(true);
    console.log('Background initialized with key:', componentKey);
  }, [componentKey]);

  useEffect(() => {
    console.log('Background updated - background:', background, 'bgColor:', bgColor, 'backgroundImage:', backgroundImage);
    if (!canvasRef.current) return;
    ctx.current = null;
    const newCtx = canvasRef.current.getContext('2d');
    if (newCtx) {
      newCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      const parent = canvasRef.current.parentElement;
      canvasRef.current.width = parent ? parent.clientWidth : window.innerWidth;
      canvasRef.current.height = parent ? parent.clientHeight : window.innerHeight;
      ctx.current = newCtx;
    }
  }, [background, bgColor, backgroundImage, flickerEnabled, rgbBorderEnabled, rgbBorderColors, rgbBorderSpeed]);

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

  const backgroundImages = {
    space: 'https://media.istockphoto.com/id/2160750393/photo/a-stunning-view-of-a-spiral-galaxy-in-the-vastness-of-space.jpg?s=2048x2048&w=is&k=20&c=3tLf6pptAIJTAhEdCHflCliCXRQz4xZ2YbFCWjEUUlY=',
    forest: 'https://media.istockphoto.com/id/2213600004/photo/90-degree-view-of-eucalyptus-plantation.jpg?s=2048x2048&w=is&k=20&c=bxu1jGpYoD5sjPvfY0Rh5jQc4fzpAloUTkRKcMwNkMI=',
    cityscape: 'https://media.istockphoto.com/id/2193523753/photo/san-francisco.jpg?s=2048x2048&w=is&k=20&c=IFQiqpigLAsEuIJisKyAOcO7GfMnLYxcgtQIGZ7wbao=',
    abstract: 'https://media.istockphoto.com/id/2171946409/photo/futuristic-digital-geology-terrain-digital-data-telemetry-and-engineer-topography-with.jpg?s=2048x2048&w=is&k=20&c=HnB2aTRKPXCKAiAWyU3zNVqDpBN-faQqxPPHR9vazoY='
  };

  if (backgroundImage && backgroundImages[backgroundImage]) {
    const imgSrc = backgroundImages[backgroundImage];
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => console.log('Image loaded:', imgSrc);
    img.onerror = () => console.error('Image failed to load:', imgSrc);

    console.log('Rendering image:', backgroundImage);
    return (
      <div className="absolute inset-0 z-[-1] overflow-hidden" style={{ width: '100%', height: '100%' }} key={componentKey}>
        <div
          key={backgroundImage}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
          style={{
            backgroundImage: `url(${imgSrc})`,
            opacity: imageOpacity,
            border: rgbBorderEnabled ? `4px solid ${currentColor}` : 'none',
            boxShadow: rgbBorderEnabled ? `0 0 20px ${currentColor}` : 'none',
            backgroundColor: 'rgba(0, 0, 255, 0.2)', // Debug blue tint
            outline: '2px solid red' // Debug red border
          }}
        />
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={imageOpacity}
          onChange={(e) => setImageOpacity(parseFloat(e.target.value))}
          className="absolute bottom-4 left-4 w-1/3 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
        />
      </div>
    );
  }

  if (background === 'solid') {
    console.log('Rendering solid color:', currentColor);
    return (
      <div 
        key={componentKey}
        className="absolute inset-0 z-[-1] overflow-hidden transition-colors duration-300"
        style={{ 
          backgroundColor: currentColor,
          border: rgbBorderEnabled ? `4px solid ${currentColor}` : 'none',
          boxShadow: rgbBorderEnabled ? `0 0 20px ${currentColor}` : 'none',
          outline: '2px solid blue' // Debug blue border
        }}
      />
    );
  }

  if (!isClient) {
    return (
      <div 
        className="absolute inset-0 z-[-1] overflow-hidden transition-colors duration-300"
        style={{ backgroundColor: bgColor }}
      />
    );
  }

  console.log('Rendering canvas for:', background);
  return (
    <div className="absolute inset-0 z-[-1] overflow-hidden" style={{ width: '100%', height: '100%' }} key={componentKey}>
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