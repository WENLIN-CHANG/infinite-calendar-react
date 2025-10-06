import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import useKeyboardNavigation from './useKeyboardNavigation';

describe('useKeyboardNavigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should call handler when matching key is pressed', () => {
    const mockHandler = vi.fn();
    const keyMap = { 'ArrowLeft': mockHandler };

    renderHook(() => useKeyboardNavigation(keyMap));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    });

    expect(mockHandler).toHaveBeenCalled();
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  it('should not call handler when non-matching key is pressed', () => {
    const mockHandler = vi.fn();
    const keyMap = { 'ArrowLeft': mockHandler };

    renderHook(() => useKeyboardNavigation(keyMap));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    });

    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('should handle multiple key mappings', () => {
    const mockHandlerLeft = vi.fn();
    const mockHandlerRight = vi.fn();
    const keyMap = {
      'ArrowLeft': mockHandlerLeft,
      'ArrowRight': mockHandlerRight
    };

    renderHook(() => useKeyboardNavigation(keyMap));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    });

    expect(mockHandlerLeft).toHaveBeenCalledTimes(1);
    expect(mockHandlerRight).not.toHaveBeenCalled();

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    });

    expect(mockHandlerRight).toHaveBeenCalledTimes(1);
  });

  it('should pass keyboard event to handler', () => {
    const mockHandler = vi.fn();
    const keyMap = { 'Enter': mockHandler };

    renderHook(() => useKeyboardNavigation(keyMap));

    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      window.dispatchEvent(event);
    });

    expect(mockHandler).toHaveBeenCalledWith(expect.any(KeyboardEvent));
  });

  it('should update handlers when keyMap changes', () => {
    const mockHandler1 = vi.fn();
    const mockHandler2 = vi.fn();

    const { rerender } = renderHook(
      ({ keyMap }) => useKeyboardNavigation(keyMap),
      { initialProps: { keyMap: { 'ArrowLeft': mockHandler1 } } }
    );

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    });

    expect(mockHandler1).toHaveBeenCalledTimes(1);
    expect(mockHandler2).not.toHaveBeenCalled();

    // 更新 keyMap
    rerender({ keyMap: { 'ArrowLeft': mockHandler2 } });

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    });

    expect(mockHandler1).toHaveBeenCalledTimes(1); // 不再增加
    expect(mockHandler2).toHaveBeenCalledTimes(1); // 新的 handler 被呼叫
  });

  it('should remove event listener on unmount', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const mockHandler = vi.fn();

    const { unmount } = renderHook(() => useKeyboardNavigation({ 'ArrowLeft': mockHandler }));

    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it('should handle empty keyMap', () => {
    const { result } = renderHook(() => useKeyboardNavigation({}));

    expect(() => {
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      });
    }).not.toThrow();

    expect(result.current).toBeNull();
  });

  it('should handle special keys', () => {
    const mockEscapeHandler = vi.fn();
    const mockEnterHandler = vi.fn();
    const mockSpaceHandler = vi.fn();

    const keyMap = {
      'Escape': mockEscapeHandler,
      'Enter': mockEnterHandler,
      ' ': mockSpaceHandler
    };

    renderHook(() => useKeyboardNavigation(keyMap));

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    });

    expect(mockEscapeHandler).toHaveBeenCalledTimes(1);
    expect(mockEnterHandler).toHaveBeenCalledTimes(1);
    expect(mockSpaceHandler).toHaveBeenCalledTimes(1);
  });
});
