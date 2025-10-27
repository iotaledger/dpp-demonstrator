'use client';

import React from 'react';

interface BackgroundVideoProps {
  src: string;
  poster?: string;
}

const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  src,
  poster = "/src/lib/assets/intro/placeholder-poster.jpg"
}) => {
  return (
    <div className="absolute inset-0 w-full h-full" style={{ zIndex: 10 }}>
      <video
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default BackgroundVideo;
