/**
 * Copyright (c) IOTA Stiftung
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { useEffect, useState } from 'react';

export const usePortalTarget = (targetId: string): HTMLElement | null => {
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Wait for DOM to be ready
    const findOrCreateTarget = () => {
      let element = document.getElementById(targetId);

      if (!element) {
        // If element doesn't exist, create it
        element = document.createElement('div');
        element.id = targetId;
        document.body.appendChild(element);
      }

      setTarget(element);
    };

    // Check if document is already loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', findOrCreateTarget);
    } else {
      findOrCreateTarget();
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', findOrCreateTarget);
    };
  }, [targetId]);

  return target;
};
