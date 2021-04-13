import { useState } from 'react';

export const useLocaleStorage = (key, initialValue) => {
  const [storedValue, setValue] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key)) || initialValue;
    } catch {
      return initialValue;
    }
  });

  const save = (value) => {
    setValue(value);
    localStorage.setItem(key, JSON.stringify(value));
  };

  return [storedValue, save];
};
