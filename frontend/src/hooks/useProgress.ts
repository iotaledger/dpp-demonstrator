'use client';

import React from 'react';

type IntervalId = number | null;

export const useProgress = () => {
  const maxLimit = 100;
  const frequencyMs = 60;
  const maxLatencyMs = 1500;
  const timeoutBufferMs = 5 * frequencyMs;
  // Increase by 4% every 60ms (100% in 1500ms, matching server delay)
  const increment = maxLimit * frequencyMs / maxLatencyMs;

  const internalProgressRef = React.useRef(0);
  const [progress, setProgress] = React.useState(0);
  const [isComplete, setIsComplete] = React.useState(false);
  const [isTimedout, setIsTimedout] = React.useState(false);
  let intervalId: IntervalId = null;

  const resetProgress = () => {
    internalProgressRef.current = 0;
    setProgress(0);
    setIsComplete(false);
    setIsTimedout(false);
    intervalId = null;
  };

  const runProgress = (resolve?: (value: boolean) => void) => {
    if (intervalId == null) {
      resolve && resolve(false);
      return;
    }

    const nextInternalProgress = internalProgressRef.current + increment;

    if (nextInternalProgress < 100) {
      internalProgressRef.current = nextInternalProgress;
      setProgress(nextInternalProgress);
    } else {
      internalProgressRef.current = maxLimit;
      setProgress(maxLimit);
      setIsComplete(true);
      intervalId && window.clearInterval(intervalId);
      intervalId = null;
      resolve && resolve(true);
    }
  };

  const startProgress = async (): Promise<boolean> => {
    // Avoid start a new interval while in progress.
    if (intervalId != null) {
      return Promise.resolve(false);
    }

    return new Promise((resolve, _) => {
      intervalId = window.setInterval(() => runProgress(resolve), frequencyMs);

      window.setTimeout(() => {
        console.log('progress timeout');
        intervalId && window.clearInterval(intervalId);
        intervalId = null;
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
}
