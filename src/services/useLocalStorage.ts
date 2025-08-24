import { useState } from 'react';

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, (newValue: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState(() => {
    const savedValue = localStorage.getItem(key);

    if (savedValue === null) {
      return defaultValue;
    }

    try {
      return JSON.parse(savedValue);
    } catch (error) {
      return defaultValue;
    }
  });

  function saveValue(newValue: T | ((prev: T) => T)) {
    setValue((prev: T) => {
      const valueToReturn =
        typeof newValue === 'function'
          ? (newValue as (prev: T) => T)(prev)
          : newValue;

      localStorage.setItem(key, JSON.stringify(valueToReturn));

      return valueToReturn;
    });
  }

  return [value, saveValue] as const;
}
