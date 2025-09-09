import React from 'react';

export function useTransitionTrigger(delay: number) {
  const [isTriggered, setTrigger] = React.useState(false);
  React.useEffect(() => {
    window.setTimeout(() => {
      setTrigger(true);
    }, delay);
  });

  return {
    isTriggered
  }
}
