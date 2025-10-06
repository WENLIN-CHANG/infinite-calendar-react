import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import useLocalStorage from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return initial value when no stored value exists', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    expect(result.current[0]).toBe('initial');
  });

  it('should return stored value when it exists', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'));

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    expect(result.current[0]).toBe('stored-value');
  });

  it('should save value to localStorage when updated', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('new-value'));
    expect(result.current[0]).toBe('new-value');
  });

  it('should handle objects correctly', async () => {
    const testObject = { name: 'test', count: 42 };

    const { result } = renderHook(() => useLocalStorage('test-key', testObject));

    // 初始化時 state 是 initialValue，但不寫入 localStorage
    expect(result.current[0]).toEqual(testObject);
    expect(localStorage.getItem('test-key')).toBeNull();

    // 用戶主動設置時才寫入（用不同的 reference）
    const newObject = { name: 'test', count: 42 };
    act(() => {
      result.current[1](newObject);
    });

    // 等待 useEffect 執行
    await waitFor(() => {
      expect(localStorage.getItem('test-key')).toBe(JSON.stringify(newObject));
    });
  });

  it('should handle storing ISO date strings', () => {
    const testDate = new Date('2025-10-15');
    const isoString = testDate.toISOString();

    const { result } = renderHook(() => useLocalStorage('test-key', null));

    act(() => {
      result.current[1](isoString);
    });

    const storedValue = localStorage.getItem('test-key');
    expect(JSON.parse(storedValue)).toBe(isoString);
  });

  it('should return initial value when localStorage throws error on read', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('localStorage is full');
    });

    const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'));

    expect(result.current[0]).toBe('fallback');
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should handle localStorage errors when setting value', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('localStorage is full');
    });

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    // 值應該更新（在 state 中），但不會存到 localStorage
    expect(result.current[0]).toBe('new-value');
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should handle invalid JSON in localStorage', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem('test-key', 'invalid json {');

    const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'));

    expect(result.current[0]).toBe('fallback');
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should update when key changes', () => {
    localStorage.setItem('key1', JSON.stringify('value1'));
    localStorage.setItem('key2', JSON.stringify('value2'));

    const { result, rerender } = renderHook(
      ({ key }) => useLocalStorage(key, 'default'),
      { initialProps: { key: 'key1' } }
    );

    expect(result.current[0]).toBe('value1');

    rerender({ key: 'key2' });

    expect(result.current[0]).toBe('value2');
  });

  it('should NOT overwrite stored value when initialValue changes', () => {
    localStorage.setItem('test-key', JSON.stringify('stored'));

    const { result, rerender } = renderHook(
      ({ initial }) => useLocalStorage('test-key', initial),
      { initialProps: { initial: 'initial1' } }
    );

    expect(result.current[0]).toBe('stored'); // 應該讀取 stored value

    rerender({ initial: 'initial2' }); // initialValue 改變

    expect(result.current[0]).toBe('stored'); // 不該被覆蓋！
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('stored'));
  });

  it('should handle storage events from other tabs', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    expect(result.current[0]).toBe('initial');

    // 模擬其他 tab 改變 localStorage
    act(() => {
      localStorage.setItem('test-key', JSON.stringify('from-other-tab'));
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'test-key',
        newValue: JSON.stringify('from-other-tab'),
      }));
    });

    expect(result.current[0]).toBe('from-other-tab');
  });

  it('should ignore storage events from other keys', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    const initialValue = result.current[0];

    act(() => {
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'other-key',
        newValue: JSON.stringify('other-value'),
      }));
    });

    expect(result.current[0]).toBe(initialValue);
  });

  it('should use new initialValue when key changes and new key does not exist', () => {
    localStorage.setItem('key1', JSON.stringify('value1'));
    // key2 不存在

    const { result, rerender } = renderHook(
      ({ k, initial }) => useLocalStorage(k, initial),
      { initialProps: { k: 'key1', initial: 'default1' } }
    );

    expect(result.current[0]).toBe('value1');

    rerender({ k: 'key2', initial: 'default2' }); // key 改變，initialValue 也改變

    expect(result.current[0]).toBe('default2'); // 應該用新的 initialValue！
  });

  it('should not write to localStorage on initial mount if value already exists', () => {
    localStorage.setItem('test-key', JSON.stringify('existing'));

    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    renderHook(() => useLocalStorage('test-key', 'default'));

    // 應該只在初始化時讀取，不該寫入
    expect(setItemSpy).not.toHaveBeenCalled();

    setItemSpy.mockRestore();
  });

  it('should reset to initialValue when storage event indicates key deletion', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');

    // 模擬其他 tab 刪除 key
    act(() => {
      localStorage.removeItem('test-key');
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'test-key',
        newValue: null, // key 被刪除
      }));
    });

    expect(result.current[0]).toBe('default'); // 應該恢復成 initialValue
  });
});
