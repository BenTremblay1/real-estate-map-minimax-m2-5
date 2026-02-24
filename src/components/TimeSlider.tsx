// @ts-nocheck
import { useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { quarters, getQuarterLabel, getQuarterIndex } from '../data/constants';

interface TimeSliderProps {
  selectedQuarter: string; // Format: "2020-Q1"
  onQuarterChange: (quarter: string) => void;
}

export default function TimeSlider({ selectedQuarter, onQuarterChange }: TimeSliderProps) {
  const currentIndex = quarters.indexOf(selectedQuarter);

  const handlePrev = () => {
    if (currentIndex > 0) {
      onQuarterChange(quarters[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < quarters.length - 1) {
      onQuarterChange(quarters[currentIndex + 1]);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(e.target.value);
    onQuarterChange(quarters[index]);
  };

  // Get year markers for the slider
  const yearMarkers = useMemo(() => {
    const markers: { position: number; year: string }[] = [];
    quarters.forEach((q, i) => {
      if (q.endsWith('-Q1')) {
        markers.push({ position: (i / (quarters.length - 1)) * 100, year: q.split('-')[0] });
      }
    });
    return markers;
  }, []);

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center gap-4">
        {/* Label */}
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 min-w-[100px]">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span>Time Period</span>
        </div>

        {/* Navigation */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Slider Container */}
        <div className="flex-1 relative">
          {/* Year Labels */}
          <div className="absolute -top-1 left-0 right-0 flex justify-between text-xs text-gray-400 pointer-events-none">
            {yearMarkers.map(({ position, year }) => (
              <span
                key={year}
                className="absolute transform -translate-x-1/2"
                style={{ left: `${position}%` }}
              >
                {year}
              </span>
            ))}
          </div>

          {/* Slider */}
          <input
            type="range"
            min={0}
            max={quarters.length - 1}
            value={currentIndex}
            onChange={handleSliderChange}
            className="w-full h-2 mt-4 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
            style={{
              background: `linear-gradient(to right, #10b981 0%, #10b981 ${(currentIndex / (quarters.length - 1)) * 100}%, #e5e7eb ${(currentIndex / (quarters.length - 1)) * 100}%, #e5e7eb 100%)`
            }}
          />

          {/* Tick marks */}
          <div className="absolute top-4 left-0 right-0 flex justify-between pointer-events-none">
            {quarters.map((q, i) => (
              <div
                key={q}
                className={`w-0.5 h-2 ${i === currentIndex ? 'bg-emerald-600' : q.endsWith('-Q1') ? 'bg-gray-400' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === quarters.length - 1}
          className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Current Quarter Display */}
        <div className="min-w-[80px] text-center">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
            {getQuarterLabel(selectedQuarter)}
          </span>
        </div>
      </div>
    </div>
  );
}
