import React from 'react';

interface ProgressBarProps {
  value: number; // Value should be between 0 and 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div
        className="bg-[#0d0630] h-3 rounded-full"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
