import { useState, useCallback } from 'react';

export interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

export function useApi<T, P extends unknown[]>(
  apiFn: (...args: P) => Promise<T>,
  initialData: T | null = null
) {
  const [data, setData] = useState<T | null>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async (...args: P): Promise<T | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await apiFn(...args);
        setData(result);
        return result;
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setError(errorObj);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [apiFn]
  );

  return {
    data,
    isLoading,
    error,
    execute,
    setData,
  };
}

export default useApi;
