// components/LEDDisplay.jsx
import Background from './Background';
import ScrollingText from './ScrollingText';
import LEDEffects from './LEDEffect';
import { useScrollerStore } from '../../stores/useScrollerStore';

export default function LEDDisplay() {
  const { 
    background, 
    bgColor,
    frameStyle,
    cornerLights,
    text,
    color,
    speed,
    isPlaying
  } = useScrollerStore();
  
  return (
    <div className="relative h-64 w-full rounded-xl overflow-hidden border-2 border-gray-700 bg-black">
      {/* Background Layer */}
      <Background type={background} color={bgColor} />
      
      {/* LED Screen Effect */}
      <div className="absolute inset-0 led-screen-effect"></div>
      
      {/* Scrolling Text */}
      <ScrollingText
        text={text}
        color={color}
        speed={speed}
        isPlaying={isPlaying}
      />
      
      {/* Visual Effects */}
      <LEDEffects 
        frameStyle={frameStyle} 
        cornerLights={cornerLights} 
      />
      
      {/* Reflection Effect (if enabled) */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent opacity-50"></div>
    </div>
  );
}