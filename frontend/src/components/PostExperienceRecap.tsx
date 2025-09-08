import React, { useState, useEffect } from 'react';
import IntroSlide from './IntroSlide';
import ProgressBar from './ProgressBar';
import SlideCounter from './SlideCounter';
import NavigationButtons from './NavigationButtons';
import PostExperience1 from './PostExperience1';
import PostExperience2 from './PostExperience2';
import PostExperience3 from './PostExperience3';
import PostExperience4 from './PostExperience4';

interface PostExperienceRecapProps {
  currentSlide?: number;
  onSlideChange?: (slide: number) => void;
  onExit?: () => void;
  onEmailCopy?: (email: string) => void;
}

const PostExperienceRecap: React.FC<PostExperienceRecapProps> = ({
  currentSlide: externalCurrentSlide,
  onSlideChange,
  onExit,
  onEmailCopy
}) => {
  const [internalCurrentSlide, setInternalCurrentSlide] = useState(1);
  const totalSlides = 4;
  
  // Use external slide state if provided, otherwise use internal state
  const currentSlide = externalCurrentSlide ?? internalCurrentSlide;
  
  const handleSlideChange = (newSlide: number) => {
    if (onSlideChange) {
      onSlideChange(newSlide);
    } else {
      setInternalCurrentSlide(newSlide);
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 1) {
      handleSlideChange(currentSlide - 1);
    }
  };

  const handleNext = () => {
    if (currentSlide < totalSlides) {
      handleSlideChange(currentSlide + 1);
    }
  };

  const canGoPrevious = currentSlide > 1;
  const canGoNext = currentSlide < totalSlides;
  const progress = (currentSlide / totalSlides) * 100;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (canGoPrevious) handlePrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (canGoNext) handleNext();
          break;
        case 'Escape':
          event.preventDefault();
          onExit?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, canGoPrevious, canGoNext, onExit]);

  const renderSlideContent = () => {
    switch (currentSlide) {
      case 1:
        return (
          <PostExperience1 
            onButtonClick={onExit}
            opacity={100}
            delay={0.2}
          />
        );
      case 2:
        return (
          <PostExperience2 
            opacity={100}
            delay={0.3}
          />
        );
      case 3:
        return (
          <PostExperience3 
            opacity={100}
            delay={0.3}
          />
        );
      case 4:
        return (
          <PostExperience4 
            onEmailCopy={onEmailCopy}
            opacity={100}
            delay={0.3}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Fullscreen slide container */}
      <div className="fixed inset-0 w-full min-h-dvh overflow-y-scroll overflow-x-hidden bg-slate-100">
        <div className="h-full flex items-center justify-center">
          {renderSlideContent()}
        </div>
      </div>

      {/* Navigation Overlays */}
      <ProgressBar progress={progress} />
      
      <SlideCounter
        current={currentSlide}
        total={totalSlides}
      />
      
      <NavigationButtons
        onPrevious={handlePrevious}
        onNext={handleNext}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
      />
    </>
  );
};

export default PostExperienceRecap;