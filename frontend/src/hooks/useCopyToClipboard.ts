'use client';

import { useState, useCallback } from 'react';

interface UseCopyToClipboardOptions {
  successMessage?: string;
  duration?: number;
  onSuccess?: (text: string) => void;
  onError?: (error: Error) => void;
}

export const useCopyToClipboard = (options: UseCopyToClipboardOptions = {}) => {
  const { duration = 2000, onSuccess, onError } = options;

  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), duration);

        onSuccess?.(text);

        return true;
      } catch (error) {
        const copyError = error instanceof Error ? error : new Error('Failed to copy text');
        console.error('Failed to copy to clipboard:', copyError);
        onError?.(copyError);
        return false;
      }
    },
    [duration, onSuccess, onError],
  );

  return {
    copied,
    copyToClipboard,
  };
};
