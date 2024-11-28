/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useDebounce.ts
import { useCallback } from 'react';

export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  wait: number
) {
  let timeoutId: NodeJS.Timeout;

  return useCallback(
    (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => callback(...args), wait);
    },
    [callback, wait]
  );
}