import { describe, it, expect } from 'vitest';
import { generateCalendarDays, isDateSelected } from './Calendar';

describe('generateCalendarDays', () => {
  it('should generate 31 days for January 2025', () => {
    const year = 2025;
    const month = 1;

    const days = generateCalendarDays(year, month);

    const actualDays = days.filter(day => day !== '');
    expect(actualDays.length).toBe(31);
  });

  it('should generate 28 days for February 2025', () => {
    const year = 2025;
    const month = 2;

    const days = generateCalendarDays(year, month);

    const actualDays = days.filter(day => day !== '');
    expect(actualDays.length).toBe(28);
  });

  it('should generate 29 days for February 2024 (leap year)', () => {
    const year = 2024;
    const month = 2;

    const days = generateCalendarDays(year, month);

    const actualDays = days.filter(day => day !== '');
    expect(actualDays.length).toBe(29);
  });

  it('should generate correct empty days before first day of month', () => {
    // 2025-01-01 是星期三 (weekday = 3)
    const year = 2025;
    const month = 1;

    const days = generateCalendarDays(year, month);

    const emptyDays = days.filter(day => day === '');
    expect(emptyDays.length).toBe(3);
  });

  it('should have no empty days when month starts on Sunday', () => {
    // 2023-01-01 是星期日 (weekday = 0)
    const year = 2023;
    const month = 1;

    const days = generateCalendarDays(year, month);

    const emptyDays = days.filter(day => day === '');
    expect(emptyDays.length).toBe(0);
  });

  it('should have 6 empty days when month starts on Saturday', () => {
    // 2025-02-01 是星期六 (weekday = 6)
    const year = 2025;
    const month = 2;

    const days = generateCalendarDays(year, month);

    const emptyDays = days.filter(day => day === '');
    expect(emptyDays.length).toBe(6);
  });

  it('should generate 30 days for September 2025', () => {
    const year = 2025;
    const month = 9;

    const days = generateCalendarDays(year, month);

    const actualDays = days.filter(day => day !== '');
    expect(actualDays.length).toBe(30);
  });

  it('should start with 1 and end with last day of month', () => {
    const year = 2025;
    const month = 1;

    const days = generateCalendarDays(year, month);

    const actualDays = days.filter(day => day !== '');
    expect(actualDays[0]).toBe(1);
    expect(actualDays[actualDays.length - 1]).toBe(31);
  });
});

describe('isDateSelected', () => {
  it('should return true when date matches', () => {
    const selectedDate = new Date(2025, 9, 15);

    const result = isDateSelected(selectedDate, 2025, 10, 15);

    expect(result).toBe(true);
  });

  it('should return false when selectedDate is null', () => {
    const result = isDateSelected(null, 2025, 10, 15);

    expect(result).toBe(false);
  });

  it('should return false when dayNumber is empty string', () => {
    const selectedDate = new Date(2025, 9, 15);

    const result = isDateSelected(selectedDate, 2025, 10, '');

    expect(result).toBe(false);
  });

  it('should return false when year does not match', () => {
    const selectedDate = new Date(2025, 9, 15);

    const result = isDateSelected(selectedDate, 2024, 10, 15);

    expect(result).toBe(false);
  });

  it('should return false when month does not match', () => {
    const selectedDate = new Date(2025, 9, 15);

    const result = isDateSelected(selectedDate, 2025, 9, 15);

    expect(result).toBe(false);
  });

  it('should return false when day does not match', () => {
    const selectedDate = new Date(2025, 9, 15);

    const result = isDateSelected(selectedDate, 2025, 10, 14);

    expect(result).toBe(false);
  });
});
