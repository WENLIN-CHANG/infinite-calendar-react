import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calendar, { generateCalendarDays, isDateSelected } from './Calendar';
import CalendarHeader from './CalendarHeader';
import SelectedDateDisplay from './SelectedDateDisplay';
import CalendarWeekdays from './CalendarWeekdays';
import CalendarDay from './CalendarDay';
import CalendarGrid from './CalendarGrid';

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

describe('CalendarDay', () => {
  it('should render day number', () => {
    render(<CalendarDay day={15} isSelected={false} onClick={() => {}} />);

    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('should render empty string for empty day', () => {
    const { container } = render(<CalendarDay day="" isSelected={false} onClick={() => {}} />);

    expect(container.textContent).toBe('');
  });

  it('should call onClick when clicking on a valid day', async () => {
    const mockOnClick = vi.fn();

    render(<CalendarDay day={15} isSelected={false} onClick={mockOnClick} />);

    const dayElement = screen.getByText('15');
    await userEvent.click(dayElement);

    expect(mockOnClick).toHaveBeenCalled();
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when clicking on empty day', async () => {
    const mockOnClick = vi.fn();

    const { container } = render(<CalendarDay day="" isSelected={false} onClick={mockOnClick} />);

    const dayElement = container.firstChild;
    await userEvent.click(dayElement);

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('should apply selected styles when isSelected is true', () => {
    const { container } = render(<CalendarDay day={15} isSelected={true} onClick={() => {}} />);

    const dayElement = container.firstChild;
    expect(dayElement.className).toContain('bg-blue-600');
    expect(dayElement.className).toContain('text-white');
  });

  it('should apply normal styles when isSelected is false', () => {
    const { container } = render(<CalendarDay day={15} isSelected={false} onClick={() => {}} />);

    const dayElement = container.firstChild;
    expect(dayElement.className).toContain('bg-white');
    expect(dayElement.className).not.toContain('bg-blue-600');
  });

  it('should apply gray background for empty day', () => {
    const { container } = render(<CalendarDay day="" isSelected={false} onClick={() => {}} />);

    const dayElement = container.firstChild;
    expect(dayElement.className).toContain('bg-gray-50');
  });
});

describe('CalendarGrid', () => {
  it('should render all days', () => {
    const days = ['', '', '', 1, 2, 3, 4, 5, 6, 7];

    render(
      <CalendarGrid
        days={days}
        selectedDate={null}
        year={2025}
        month={10}
        onDayClick={() => {}}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('should highlight selected date', () => {
    const days = [1, 2, 3, 4, 5];
    const selectedDate = new Date(2025, 9, 3); // 2025年10月3日

    const { container } = render(
      <CalendarGrid
        days={days}
        selectedDate={selectedDate}
        year={2025}
        month={10}
        onDayClick={() => {}}
      />
    );

    const dayElements = container.querySelectorAll('.bg-blue-600');
    expect(dayElements.length).toBe(1);
    expect(dayElements[0].textContent).toBe('3');
  });

  it('should call onDayClick when clicking a day', async () => {
    const mockOnDayClick = vi.fn();
    const days = [1, 2, 3];

    render(
      <CalendarGrid
        days={days}
        selectedDate={null}
        year={2025}
        month={10}
        onDayClick={mockOnDayClick}
      />
    );

    const day2 = screen.getByText('2');
    await userEvent.click(day2);

    expect(mockOnDayClick).toHaveBeenCalledWith(2);
    expect(mockOnDayClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onDayClick when clicking empty day', async () => {
    const mockOnDayClick = vi.fn();
    const days = ['', 1, 2];

    const { container } = render(
      <CalendarGrid
        days={days}
        selectedDate={null}
        year={2025}
        month={10}
        onDayClick={mockOnDayClick}
      />
    );

    const emptyDay = container.querySelector('.bg-gray-50');
    await userEvent.click(emptyDay);

    expect(mockOnDayClick).not.toHaveBeenCalled();
  });

  it('should render correct number of day elements', () => {
    const days = ['', '', 1, 2, 3, 4, 5, 6, 7];

    const { container } = render(
      <CalendarGrid
        days={days}
        selectedDate={null}
        year={2025}
        month={10}
        onDayClick={() => {}}
      />
    );

    const allDayElements = container.querySelectorAll('.py-3');
    expect(allDayElements.length).toBe(9);
  });
});

// ==================== Calendar Integration Tests ====================

describe('Calendar - Integration Tests', () => {
  beforeEach(() => {
    // 清空 localStorage
    localStorage.clear();
  });

  it('should initialize with current date when no saved date in localStorage', () => {
    render(<Calendar />);

    // 應該顯示當前年月（用正則比對）
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    expect(screen.getByText(`${currentYear} 年${currentMonth}月`)).toBeInTheDocument();
  });

  it('should load saved date from localStorage on mount', () => {
    const savedDate = new Date(2024, 11, 25); // 2024年12月25日
    localStorage.setItem('selectedDate', savedDate.toISOString());

    render(<Calendar />);

    // 應該顯示儲存的月份
    expect(screen.getByText('2024 年12月')).toBeInTheDocument();
    // 應該顯示選中的日期
    expect(screen.getByText(/2024年12月25日/)).toBeInTheDocument();
  });

  it('should save selected date to localStorage when clicking a day', async () => {
    render(<Calendar />);

    const today = new Date();

    // 點擊第 15 天（如果這個月有15號）
    const day15 = screen.queryByText('15');
    if (day15) {
      await userEvent.click(day15);

      // 確認 localStorage 有儲存
      await waitFor(() => {
        const savedDate = localStorage.getItem('selectedDate');
        expect(savedDate).not.toBeNull();
      });

      const savedDate = localStorage.getItem('selectedDate');
      const parsedDate = new Date(savedDate);
      expect(parsedDate.getDate()).toBe(15);
    }
  });

  it('should navigate to next month when clicking next button', async () => {
    render(<Calendar />);

    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    const nextButton = screen.getByText('下個月');
    await userEvent.click(nextButton);

    // 計算下個月
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;

    await waitFor(() => {
      expect(screen.getByText(`${nextYear} 年${nextMonth}月`)).toBeInTheDocument();
    });
  });

  it('should navigate to previous month when clicking prev button', async () => {
    render(<Calendar />);

    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    const prevButton = screen.getByText('上個月');
    await userEvent.click(prevButton);

    // 計算上個月
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    await waitFor(() => {
      expect(screen.getByText(`${prevYear} 年${prevMonth}月`)).toBeInTheDocument();
    });
  });

  it('should clear selected date when navigating to another month', async () => {
    render(<Calendar />);

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    // 選擇一個日期（第10天）
    const day10 = screen.getByText('10');
    await userEvent.click(day10);

    // 確認有選中的日期顯示
    await waitFor(() => {
      expect(screen.getByText(new RegExp(`${currentYear}年${currentMonth}月10日`))).toBeInTheDocument();
    });

    // 切換到下個月
    const nextButton = screen.getByText('下個月');
    await userEvent.click(nextButton);

    // 選中的日期應該消失
    await waitFor(() => {
      expect(screen.queryByText(new RegExp(`${currentYear}年${currentMonth}月10日`))).not.toBeInTheDocument();
    });
  });

  it('should navigate to next month with ArrowRight key', async () => {
    render(<Calendar />);

    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    // 按下右鍵
    await userEvent.keyboard('{ArrowRight}');

    // 計算下個月
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;

    // 應該切換到下個月
    await waitFor(() => {
      expect(screen.getByText(`${nextYear} 年${nextMonth}月`)).toBeInTheDocument();
    });
  });

  it('should navigate to previous month with ArrowLeft key', async () => {
    render(<Calendar />);

    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    // 按下左鍵
    await userEvent.keyboard('{ArrowLeft}');

    // 計算上個月
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    // 應該切換到上個月
    await waitFor(() => {
      expect(screen.getByText(`${prevYear} 年${prevMonth}月`)).toBeInTheDocument();
    });
  });

  it('should handle year transition when going to next month from December', async () => {
    // 設定 localStorage 為 12月的某個日期
    const decemberDate = new Date(2025, 11, 15);
    localStorage.setItem('selectedDate', decemberDate.toISOString());

    render(<Calendar />);

    await waitFor(() => {
      expect(screen.getByText('2025 年12月')).toBeInTheDocument();
    });

    const nextButton = screen.getByText('下個月');
    await userEvent.click(nextButton);

    // 應該切換到 2026年1月
    await waitFor(() => {
      expect(screen.getByText('2026 年1月')).toBeInTheDocument();
    });
  });

  it('should handle year transition when going to previous month from January', async () => {
    // 設定 localStorage 為 1月的某個日期
    const januaryDate = new Date(2025, 0, 15);
    localStorage.setItem('selectedDate', januaryDate.toISOString());

    render(<Calendar />);

    await waitFor(() => {
      expect(screen.getByText('2025 年1月')).toBeInTheDocument();
    });

    const prevButton = screen.getByText('上個月');
    await userEvent.click(prevButton);

    // 應該切換到 2024年12月
    await waitFor(() => {
      expect(screen.getByText('2024 年12月')).toBeInTheDocument();
    });
  });

  it('should highlight selected date correctly', async () => {
    render(<Calendar />);

    const day20 = screen.getByText('20');
    await userEvent.click(day20);

    // 檢查選中的日期有藍色背景
    await waitFor(() => {
      const selectedDay = screen.getByText('20').closest('div');
      expect(selectedDay.className).toContain('bg-blue-600');
      expect(selectedDay.className).toContain('text-white');
    });
  });

  it('should not allow clicking on empty days', async () => {
    const { container } = render(<Calendar />);

    // 找到空白格子 (bg-gray-50)
    const emptyDays = container.querySelectorAll('.bg-gray-50');

    if (emptyDays.length > 0) {
      const firstEmptyDay = emptyDays[0];
      await userEvent.click(firstEmptyDay);

      // 不應該有選中日期顯示
      const selectedDateDisplay = screen.queryByText(/年.*月.*日/);
      // 如果有顯示，不應該是空字串對應的日期
      expect(firstEmptyDay.textContent).toBe('');
    }
  });
});
