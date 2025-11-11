/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React from 'react';

export function useTransitionTrigger(delay: number) {
  const [isTriggered, setTrigger] = React.useState(false);
  React.useEffect(() => {
    if (window != null && window?.setTimeout != null) {
      window.setTimeout(() => {
        setTrigger(true);
      }, delay);
    } else {
      setTrigger(true);
    }
  }, [delay]);

  return {
    isTriggered,
  };
}
