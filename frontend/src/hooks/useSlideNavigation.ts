'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const initialSlide = 1;

export function useSlideNavigation(
  externalCurrentSlide: number,
  totalSlides: number,
  getPathCb: (target: number) => string,
) {
  const [currentSlide] = React.useState(externalCurrentSlide ?? initialSlide);
  const router = useRouter();

  const canGoPrevious = currentSlide > 1;
  const canGoNext = currentSlide < totalSlides;
  const progress = (currentSlide / totalSlides) * 100;

  /**
   * NOTE: Maybe we should review this method in favor of <Link /> usage,
   * as the use of the component enables a prefetching, which can improve
   * user experience. However, this change should be measured to confirm
   * its improvement claim.
   */
  const handlePrevious = () => {
    if (currentSlide > 1) {
      router.push(getPathCb(currentSlide - 1));
    }
  };

  const handleNext = () => {
    if (currentSlide < totalSlides) {
      router.push(getPathCb(currentSlide + 1));
    }
  };

  React.useEffect(() => {
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
          break;
      }
    };

    const handleSwipeGestureFactory = () => {
      let startPosX: number | undefined | null;
      let endPosX: number | undefined | null;

      const clean = () => {
        startPosX = null;
        endPosX = null;
      };

      return (event: TouchEvent) => {
        switch (event.type) {
          case 'touchstart':
            // `targetTouches` means a list of active touches.
            // `item(0)` means: get the first touch object, I only care about it,
            //   be it a swipe with 1, 2 or 3 fingers doesn't matter.
            startPosX = event.targetTouches.item(0)?.screenX;
            endPosX = null;
            break;
          case 'touchmove':
            // `changedTouches` means a list of not-active touches.
            endPosX = event.changedTouches.item(0)?.screenX;
            break;
          case 'touchend':
            // Halt if positions doesn't form a pair. It happens in the first start touch.
            if (startPosX == null || endPosX == null) {
              clean();
              return;
            }

            const deltaPosX = endPosX - startPosX;
            // Do not swipe if delta is too small. The user may scroll up and down.
            const threshold = 110;
            if (Math.abs(deltaPosX) < threshold) {
              clean();
              return;
            }

            const swipeDirection = deltaPosX <= 0;
            // Less than or equal 0 means direction points to left.
            const left = true;
            // Greater than 0 means direction points to right.
            const right = false;
            switch (swipeDirection) {
              case left:
                if (canGoNext) handleNext();
                clean();
                break;
              case right:
                if (canGoPrevious) handlePrevious();
                clean();
                break;
            }
            break;
        }
      };
    };
    const handleSwipeGesture = handleSwipeGestureFactory();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleSwipeGesture);
    window.addEventListener('touchmove', handleSwipeGesture);
    window.addEventListener('touchend', handleSwipeGesture);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleSwipeGesture);
      window.removeEventListener('touchmove', handleSwipeGesture);
      window.removeEventListener('touchend', handleSwipeGesture);
    };
    /* eslint-disable-next-line react-hooks/exhaustive-deps --
     * The following functions handleNext, handlePrevious are stable and doesn't
     * require to be dependencies.
     */
  }, [canGoPrevious, canGoNext]);

  return {
    currentSlide,
    totalSlides,
    canGoPrevious,
    canGoNext,
    goPrevious: handlePrevious,
    goNext: handleNext,
    progress,
  };
}
