import { useState } from 'react';

export const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = () => {
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  return { isLoading, startLoading, stopLoading };
};
