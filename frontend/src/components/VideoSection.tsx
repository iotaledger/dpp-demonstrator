import React from 'react';

interface VideoSectionProps {
  children: React.ReactNode;
}

const VideoSection: React.FC<VideoSectionProps> = ({ children }) => {
  return (
    <div className="relative flex items-center justify-center rounded-3xl overflow-hidden h-56 mb-8">
      {children}
    </div>
  );
};

export default VideoSection;