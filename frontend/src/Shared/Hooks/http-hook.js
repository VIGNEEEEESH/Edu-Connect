import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      const abortController = new AbortController();
      const signal = abortController.signal;

      setIsLoading(true);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal // Attach the signal to the request
        });

        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          reqController => reqController !== abortController
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      // Abort any ongoing requests when the component unmounts
      activeHttpRequests.current.forEach(abortController =>
        abortController.abort()
      );
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
