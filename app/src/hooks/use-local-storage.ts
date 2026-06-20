import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValues: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValues;
    } catch (error) {
      console.error(error);
      return initialValues;
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);
  return [storedValue, setStoredValue] as const;
}
