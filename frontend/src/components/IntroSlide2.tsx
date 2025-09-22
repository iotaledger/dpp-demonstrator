import React from 'react';

import VideoSection from './VideoSection';
import BackgroundVideo from './BackgroundVideo';
import OverlayText from './OverlayText';

const IntroSlide2: React.FC = () => {
  return (
    <>
      {/* Video Section */}
      <VideoSection>
        <BackgroundVideo
          src="/assets/intro/placeholder-video.mp4"
          poster="/assets/intro/placeholder-poster.jpg"
        />
        <OverlayText
          description={(
            <span dangerouslySetInnerHTML={{ __html: "Today, you’ll see how IOTA makes this possible through <strong>a hands-on Digital Product Passport (DPP) example.</strong>" }} />
          )}
          opacity={100}
          translateY={0}
        />
      </VideoSection>
    </>
  );
};

export default IntroSlide2;
