'use client';

import React from 'react';

interface VideoSectionProps {
  children: React.ReactNode;
  wide?: boolean;
}

const VideoSection: React.FC<VideoSectionProps> = ({ children, wide = true }) => {
  const getHeight = () => {
    return wide ? 'min-h-[76vh]' : 'h-56';
  };
  return (
    <div
      className={`relative flex items-center justify-center rounded-3xl overflow-hidden ${getHeight()}`}
    >
      {children}
    </div>
  );
};

export default VideoSection;
