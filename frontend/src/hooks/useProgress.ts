'use client';

import React from 'react';

export const useProgress = () => {
  const maxLimit = 100;
  const frequencyMs = 60;
  const maxLatencyMs = 1500;
  const timeoutBufferMs = 5 * frequencyMs;
  // Increase by 4% every 60ms (100% in 1500ms, matching server delay)
  const increment = (maxLimit * frequencyMs) / maxLatencyMs;

  const internalControlRef = React.useRef<{ intervalId: number | null; progress: number }>({
    intervalId: null,
    progress: 0,
  });
  const [progress, setProgress] = React.useState(0);
  const [isComplete, setIsComplete] = React.useState(false);
  const [isTimedout, setIsTimedout] = React.useState(false);

  const resetProgress = () => {
    internalControlRef.current.progress = 0;
    setProgress(0);
    setIsComplete(false);
    setIsTimedout(false);
    internalControlRef.current.intervalId = null;
  };

  const runProgress = (resolve?: (value: boolean) => void) => {
    if (internalControlRef.current.intervalId == null) {
      if (resolve) {
        resolve(false);
      }
      return;
    }

    const nextInternalProgress = internalControlRef.current.progress + increment;

    if (nextInternalProgress < maxLimit) {
      internalControlRef.current.progress = nextInternalProgress;
      setProgress(nextInternalProgress);
    } else {
      internalControlRef.current.progress = maxLimit;
      setProgress(maxLimit);
      setIsComplete(true);
      if (internalControlRef.current.intervalId && window) {
        window.clearInterval(internalControlRef.current.intervalId);
      }
      internalControlRef.current.intervalId = null;
      if (resolve) {
        resolve(true);
      }
    }
  };

  const startProgress = async (): Promise<boolean> => {
    // Avoid start a new interval while in progress.
    if (internalControlRef.current.intervalId != null) {
      return Promise.resolve(false);
    }

    return new Promise((resolve) => {
      internalControlRef.current.intervalId = window.setInterval(
        () => runProgress(resolve),
        frequencyMs,
      );

      window.setTimeout(() => {
        if (internalControlRef.current.intervalId && window) {
          window.clearInterval(internalControlRef.current.intervalId);
        }
        internalControlRef.current.intervalId = null;
        setIsTimedout(true);
        resolve(false);
      }, maxLatencyMs + timeoutBufferMs);
    });
  };

  return {
    progress,
    isComplete,
    isTimedout,
    startProgress,
    resetProgress,
  };
};
