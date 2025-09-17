import clsx from 'clsx';
import React from 'react';

interface LoadingBarProps {
  progress: number;
  loadingText: string;
};

export const LoadingBar: React.FC<LoadingBarProps> = ({
  progress,
  loadingText,
}) => {
  return (
    <div
      className={clsx("space-y-2", 'animate-[slideInUp_0.3s_ease-out_forwards]')}
    >
      <div className="flex justify-between text-sm text-gray-600">
        <span className="animate-pulse">{loadingText}</span>
        <span>{progress}</span></div>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-75 ease-out shadow-sm"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};
