import LEDDisplay from './components/display/LEDisplay';
import ControlPanel from './components/controls/ControlPannel';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <LEDDisplay />
      <ControlPanel />
    </div>
  );
}