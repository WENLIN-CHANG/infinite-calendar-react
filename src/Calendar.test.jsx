import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { generateCalendarDays, isDateSelected } from './Calendar';
import CalendarHeader from './CalendarHeader';
import SelectedDateDisplay from './SelectedDateDisplay';
import CalendarWeekdays from './CalendarWeekdays';

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

// ==================== Component Tests ====================

describe('CalendarHeader', () => {
  it('should display year and month', () => {
    render(
      <CalendarHeader
        year={2025}
        month={10}
        onPrev={() => {}}
        onNext={() => {}}
      />
    );

    expect(screen.getByText('2025 年10月')).toBeInTheDocument();
  });

  it('should call onPrev when clicking previous button', async () => {
    const mockOnPrev = vi.fn();

    render(
      <CalendarHeader
        year={2025}
        month={10}
        onPrev={mockOnPrev}
        onNext={() => {}}
      />
    );

    const prevButton = screen.getByText('上個月');
    await userEvent.click(prevButton);

    expect(mockOnPrev).toHaveBeenCalled();
    expect(mockOnPrev).toHaveBeenCalledTimes(1);
  });

  it('should call onNext when clicking next button', async () => {
    const mockOnNext = vi.fn();

    render(
      <CalendarHeader
        year={2025}
        month={10}
        onPrev={() => {}}
        onNext={mockOnNext}
      />
    );

    const nextButton = screen.getByText('下個月');
    await userEvent.click(nextButton);

    expect(mockOnNext).toHaveBeenCalled();
    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });
});

describe('SelectedDateDisplay', () => {
  it('should render nothing when selectedDate is null', () => {
    const { container } = render(<SelectedDateDisplay selectedDate={null} />);

    expect(container.firstChild).toBeNull();
  });

  it('should display selected date when provided', () => {
    const date = new Date(2025, 9, 15);  // 2025年10月15日

    render(<SelectedDateDisplay selectedDate={date} />);

    expect(screen.getByText(/2025年10月15日/)).toBeInTheDocument();
  });
});

describe('CalendarWeekdays', () => {
  it('should render all 7 weekday names', () => {
    render(<CalendarWeekdays />);

    expect(screen.getByText('日')).toBeInTheDocument();
    expect(screen.getByText('一')).toBeInTheDocument();
    expect(screen.getByText('二')).toBeInTheDocument();
    expect(screen.getByText('三')).toBeInTheDocument();
    expect(screen.getByText('四')).toBeInTheDocument();
    expect(screen.getByText('五')).toBeInTheDocument();
    expect(screen.getByText('六')).toBeInTheDocument();
  });
});
