import React, { useState, useEffect } from 'react';
import IntroSlide from './IntroSlide';
import ProgressBar from './ProgressBar';
import SlideCounter from './SlideCounter';
import NavigationButtons from './NavigationButtons';
import RecapSlide1 from './RecapSlide1';
import RecapSlide2 from './RecapSlide2';
import RecapSlide3 from './RecapSlide3';
import RecapSlide4 from './RecapSlide4';

export const RECAP_SLIDES_MAP = new Map([
  [1, <RecapSlide1
    opacity={100}
    delay={0.2}
  />],
  [2, <RecapSlide2
    opacity={100}
    delay={0.3}
  />],
  [3, <RecapSlide3
    opacity={100}
    delay={0.3}
  />],
  [4, <RecapSlide4
    opacity={100}
    delay={0.3}
  />],
]);

const initialSlide = 1;

interface RecapSlideManagerProps {
  currentSlide?: number;
}

const RecapSlideManager: React.FC<RecapSlideManagerProps> = ({
  currentSlide: externalCurrentSlide,
}) => {
  const [currentSlide, setInternalCurrentSlide] = useState(externalCurrentSlide ?? initialSlide);

  const renderComponent = (currentSlide: number) => {
    if (RECAP_SLIDES_MAP.has(currentSlide)) {
      return RECAP_SLIDES_MAP.get(currentSlide);
    }
    return <span>No slides</span>;
  }

  return (
    <>
      {renderComponent(currentSlide)}
    </>
  );
};

export default RecapSlideManager;
