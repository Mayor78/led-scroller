import React, { useEffect, useState, useRef } from 'react';
import { useScrollerStore } from '../../stores/useScrollerStore';

const Background = () => {
  const { 
    background, 
    bgColor, 
    backgroundImage,
    flickerEnabled,
    rgbBorderEnabled,
    rgbBorderColors,
    rgbBorderSpeed,
    color: textColor,
    setColor
  } = useScrollerStore();
  
  const [currentColor, setCurrentColor] = useState(bgColor || '#0000FF'); // Default to blue
  const [imageOpacity, setImageOpacity] = useState(0.5);
  const canvasRef = useRef(null);
  const ctx = useRef(null);
  const componentKey = useRef(Date.now() + Math.random()).current;

  useEffect(() => {
    console.log('Background initialized with key:', componentKey);
  }, [componentKey]);

  useEffect(() => {
    console.log('Background updated - background:', background, 'bgColor:', bgColor, 'backgroundImage:', backgroundImage, 'flickerEnabled:', flickerEnabled);
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
      setCurrentColor(bgColor || '#0000FF'); // Reset to bgColor or blue
      setColor(bgColor || '#000000'); // Default text color to black if no flicker
      return;
    }

    let colorIndex = 0;
    const flickerColors = flickerEnabled ? ['#FFFFFF', '#000000'] : rgbBorderColors; // Use white/black for flicker, or rgbBorderColors
    const speed = rgbBorderEnabled ? rgbBorderSpeed : 5;
    
    const interval = setInterval(() => {
      colorIndex = (colorIndex + 1) % flickerColors.length;
      const newBgColor = flickerColors[colorIndex];
      setCurrentColor(newBgColor);

      // Adjust text color based on background
      const newTextColor = newBgColor === '#000000' ? '#FFFFFF' : '#000000';
      setColor(newTextColor);
    }, 1000 / speed);

    return () => clearInterval(interval);
  }, [flickerEnabled, bgColor, rgbBorderEnabled, rgbBorderColors, rgbBorderSpeed, setColor]);

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

  if (background === 'solid' || !background) {
    console.log('Rendering solid color:', currentColor);
    return (
      <div 
        key={componentKey}
        className="absolute inset-0 z-[-1] overflow-hidden transition-colors duration-300"
        style={{ 
          backgroundColor: currentColor,
          border: rgbBorderEnabled ? `4px solid ${currentColor}` : 'none',
          boxShadow: rgbBorderEnabled ? `0 0 20px ${currentColor}` : 'none',
        }}
      />
    );
  }

  return null; // Fallback for undefined background
};

export default Background;