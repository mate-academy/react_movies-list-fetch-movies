import { useState } from 'react';

type SerializableValue =
  | string
  | number
  | boolean
  | null
  | SerializableObject
  | SerializableArray;
type SerializableObject = { [key: string]: SerializableValue };
type SerializableArray = SerializableValue[];

export function useLocalStorage<T extends SerializableValue>(
  key: string,
  defaultValue: T,
): [T, (newValue: T) => void] {
  const [value, setValue] = useState(() => {
    const saveValue = localStorage.getItem(key);

    // eslint-disable-next-line curly
    if (saveValue === null) return defaultValue;

    try {
      return JSON.parse(saveValue);
    } catch (error) {
      localStorage.removeItem(key);

      return defaultValue;
    }
  });

  function save(newValue: T) {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  }

  return [value, save] as const;
}
