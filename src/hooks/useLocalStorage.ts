/**
 * Custom hook for generic localStorage operations with error handling.
 * Provides a React-friendly interface for localStorage with automatic
 * serialization, deserialization, and error recovery.
 * 
 * Requirements: 3.3, 7.5
 */

import { useState, useEffect, useCallback } from 'react';

export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (newValue: T | ((prev: T) => T)) => void;
  removeValue: () => void;
  error: Error | null;
  isLoading: boolean;
}

/**
 * Hook for managing localStorage with automatic serialization and error handling.
 * Syncs state with localStorage and handles quota exceeded errors gracefully.
 * 
 * @param key - localStorage key
 * @param initialValue - Default value if key doesn't exist
 * @returns Current value, setter, remover, error state, and loading state
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> {
  const [value, setValueState] = useState<T>(initialValue);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Reads value from localStorage on mount.
   */
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        const parsed = JSON.parse(item) as T;
        setValueState(parsed);
      }
      setError(null);
    } catch (err) {
      console.error(`Error reading localStorage key "${key}":`, err);
      setError(
        err instanceof Error ? err : new Error('Failed to read from localStorage')
      );
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  /**
   * Sets a new value in both state and localStorage.
   * Supports both direct values and updater functions.
   */
  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      try {
        // Allow value to be a function for functional updates
        const valueToStore =
          newValue instanceof Function ? newValue(value) : newValue;

        // Update state
        setValueState(valueToStore);

        // Save to localStorage
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        setError(null);
      } catch (err) {
        console.error(`Error writing to localStorage key "${key}":`, err);

        // Handle quota exceeded error
        if (err instanceof DOMException && err.name === 'QuotaExceededError') {
          setError(
            new Error(
              'Penyimpanan penuh. Beberapa data mungkin tidak tersimpan.'
            )
          );
        } else {
          setError(
            err instanceof Error
              ? err
              : new Error('Failed to write to localStorage')
          );
        }
      }
    },
    [key, value]
  );

  /**
   * Removes the value from localStorage and resets to initial value.
   */
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setValueState(initialValue);
      setError(null);
    } catch (err) {
      console.error(`Error removing localStorage key "${key}":`, err);
      setError(
        err instanceof Error ? err : new Error('Failed to remove from localStorage')
      );
    }
  }, [key, initialValue]);

  return {
    value,
    setValue,
    removeValue,
    error,
    isLoading,
  };
}

/**
 * Hook for managing localStorage with custom serialization/deserialization.
 * Useful for complex types like Date objects that need special handling.
 * 
 * @param key - localStorage key
 * @param initialValue - Default value if key doesn't exist
 * @param serialize - Custom serialization function
 * @param deserialize - Custom deserialization function
 * @returns Current value, setter, remover, error state, and loading state
 */
export function useLocalStorageWithSerializer<T>(
  key: string,
  initialValue: T,
  serialize: (value: T) => string,
  deserialize: (value: string) => T
): UseLocalStorageReturn<T> {
  const [value, setValueState] = useState<T>(initialValue);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Reads value from localStorage on mount using custom deserializer.
   */
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        const deserialized = deserialize(item);
        setValueState(deserialized);
      }
      setError(null);
    } catch (err) {
      console.error(`Error reading localStorage key "${key}":`, err);
      setError(
        err instanceof Error ? err : new Error('Failed to read from localStorage')
      );
    } finally {
      setIsLoading(false);
    }
  }, [key, deserialize]);

  /**
   * Sets a new value using custom serializer.
   */
  const setValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          newValue instanceof Function ? newValue(value) : newValue;

        setValueState(valueToStore);

        const serialized = serialize(valueToStore);
        window.localStorage.setItem(key, serialized);
        setError(null);
      } catch (err) {
        console.error(`Error writing to localStorage key "${key}":`, err);

        if (err instanceof DOMException && err.name === 'QuotaExceededError') {
          setError(
            new Error(
              'Penyimpanan penuh. Beberapa data mungkin tidak tersimpan.'
            )
          );
        } else {
          setError(
            err instanceof Error
              ? err
              : new Error('Failed to write to localStorage')
          );
        }
      }
    },
    [key, value, serialize]
  );

  /**
   * Removes the value from localStorage.
   */
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setValueState(initialValue);
      setError(null);
    } catch (err) {
      console.error(`Error removing localStorage key "${key}":`, err);
      setError(
        err instanceof Error ? err : new Error('Failed to remove from localStorage')
      );
    }
  }, [key, initialValue]);

  return {
    value,
    setValue,
    removeValue,
    error,
    isLoading,
  };
}
