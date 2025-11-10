'use client';

import React, { useEffectEvent } from 'react';
import { useRouter } from 'next/navigation';

import { POSITION_CHANGE_TO_SWIPE } from '@/utils/constants';

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
   * NOTE: Maybe we should review this method in favor of <Link /> usage.
   * Link enables prefetching and this may improve UX.
   */

  const goPrevious = () => {
    if (currentSlide > 1) {
      router.push(getPathCb(currentSlide - 1));
    }
  };

  const goNext = () => {
    if (currentSlide < totalSlides) {
      router.push(getPathCb(currentSlide + 1));
    }
  };

  const onPrevious = useEffectEvent(() => {
    goPrevious();
  });

  const onNext = useEffectEvent(() => {
    goNext();
  });

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (canGoPrevious) onPrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (canGoNext) onNext();
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
            const threshold = POSITION_CHANGE_TO_SWIPE;
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
                if (canGoNext) onNext();
                clean();
                break;
              case right:
                if (canGoPrevious) onPrevious();
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
  }, [canGoPrevious, canGoNext]);

  return {
    currentSlide,
    totalSlides,
    canGoPrevious,
    canGoNext,
    goPrevious,
    goNext,
    progress,
  };
}
