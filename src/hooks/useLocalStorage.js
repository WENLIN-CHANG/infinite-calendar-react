import { useState, useEffect, useRef, useCallback } from 'react';

// Pure function: 讀取 localStorage
function getStoredValue(key, initialValue) {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return initialValue;
  }
}

// Pure function: 寫入 localStorage
function setStoredValueToStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
}

function useLocalStorage(key, initialValue) {
  const prevKeyRef = useRef(key);

  // 初始化：只在 mount 時執行一次
  const [storedValue, setStoredValue] = useState(() =>
    getStoredValue(key, initialValue)
  );

  // 當 key 改變時，重新讀取（用新的 initialValue）
  useEffect(() => {
    if (prevKeyRef.current !== key) {
      setStoredValue(getStoredValue(key, initialValue));
      prevKeyRef.current = key;
    }
  }, [key, initialValue]);

  // 自訂 setValue：在設值的同時寫入 localStorage
  const setValue = useCallback((value) => {
    setStoredValue(value);
    setStoredValueToStorage(key, value);
  }, [key]);

  // 監聽其他 tab 的 storage 變更
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key) {
        if (e.newValue === null) {
          // key 被刪除，恢復成 initialValue
          setStoredValue(initialValue);
        } else {
          try {
            setStoredValue(JSON.parse(e.newValue));
          } catch (error) {
            console.error(`Error parsing storage event for key "${key}":`, error);
            setStoredValue(initialValue);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue];
}

export default useLocalStorage;
export { getStoredValue, setStoredValueToStorage };
