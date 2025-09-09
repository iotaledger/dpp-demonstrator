import React, { useState, useEffect } from 'react';
import IntroSlide from './IntroSlide';
import ProgressBar from './ProgressBar';
import SlideCounter from './SlideCounter';
import NavigationButtons from './NavigationButtons';
import PostExperience1 from './PostExperience1';
import PostExperience2 from './PostExperience2';
import PostExperience3 from './PostExperience3';
import PostExperience4 from './PostExperience4';

export const RECAP_SLIDES_MAP = new Map([
  [1, <PostExperience1
    opacity={100}
    delay={0.2}
  />],
  [2, <PostExperience2
    opacity={100}
    delay={0.3}
  />],
  [3, <PostExperience3
    opacity={100}
    delay={0.3}
  />],
  [4, <PostExperience4
    opacity={100}
    delay={0.3}
  />],
]);

const initialSlide = 1;

interface PostExperienceRecapProps {
  currentSlide?: number;
}

const PostExperienceRecap: React.FC<PostExperienceRecapProps> = ({
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

export default PostExperienceRecap;
