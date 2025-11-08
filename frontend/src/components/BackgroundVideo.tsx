'use client';

import React from 'react';
import { BACKGROUND_VIDEO } from '@/contents/common';

interface BackgroundVideoProps {
  src: string;
  poster?: string;
}

const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  src,
  poster = BACKGROUND_VIDEO.content.defaultPoster,
}) => {
  return (
    <div className='absolute inset-0 h-full w-full' style={{ zIndex: 10 }}>
      <video className='h-full w-full object-cover' autoPlay muted loop playsInline poster={poster}>
        <source src={src} type='video/mp4' />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default BackgroundVideo;
