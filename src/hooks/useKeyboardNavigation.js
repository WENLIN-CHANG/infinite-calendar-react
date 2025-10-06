import { useEffect, useRef } from 'react';

function useKeyboardNavigation(keyMap) {
  // 用 ref 避免 stale closure，handlers 可以動態變化
  const keyMapRef = useRef(keyMap);

  useEffect(() => {
    keyMapRef.current = keyMap;
  }, [keyMap]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      const handler = keyMapRef.current[e.key];
      if (handler) {
        handler(e);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return null;
}

export default useKeyboardNavigation;
