import { useState, useEffect, useCallback, useMemo } from "react";
import CalendarHeader from './CalendarHeader';
import SelectedDateDisplay from "./SelectedDateDisplay";
import CalendarWeekdays from "./CalendarWeekdays";
import CalendarGrid from "./CalendarGrid";
import useLocalStorage from "./hooks/useLocalStorage";
import useKeyboardNavigation from "./hooks/useKeyboardNavigation";

function generateCalendarDays(year, month) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return days
}

function isDateSelected(selectedDate, year, month, dayNumber) {
  if(!selectedDate || !dayNumber) return false;

  return selectedDate.getDate() === dayNumber && selectedDate.getMonth() === month - 1 && selectedDate.getFullYear() === year;
}

function Calendar() {
  const [year, setYear] = useState(() => {
    const today = new Date();
    return today.getFullYear();
  });
  const [month, setMonth] = useState(() => {
    const today = new Date();
    return today.getMonth() + 1;
  });

  // 使用 useLocalStorage 儲存 ISO 格式的日期字串
  const [selectedDateISO, setSelectedDateISO] = useLocalStorage('selectedDate', null);

  // 轉換 ISO 字串為 Date 對象
  const selectedDate = selectedDateISO ? new Date(selectedDateISO) : null;

  // 包裝 setter 以處理 Date 對象轉換
  const setSelectedDate = useCallback((date) => {
    setSelectedDateISO(date ? date.toISOString() : null);
  }, [setSelectedDateISO]);

  const days = useMemo(() => {
    return generateCalendarDays(year, month)
  }, [year, month])

  // 初始化：從 localStorage 載入日期並設定年月
  useEffect(() => {
    if(selectedDateISO){
      const date = new Date(selectedDateISO);
      setYear(date.getFullYear());
      setMonth(date.getMonth() + 1);
    }
  }, []);

  // 通用月份切換邏輯：利用 Date 對象自動處理年份轉換
  const changeMonth = useCallback((offset) => {
    setSelectedDate(null);
    const newDate = new Date(year, month - 1 + offset);
    setYear(newDate.getFullYear());
    setMonth(newDate.getMonth() + 1);
  }, [year, month, setSelectedDate]);

  const nextMonth = useCallback(() => changeMonth(1), [changeMonth]);
  const prevMonth = useCallback(() => changeMonth(-1), [changeMonth]);

  // 鍵盤導航
  useKeyboardNavigation({
    'ArrowLeft': prevMonth,
    'ArrowRight': nextMonth
  });

  const handleDateClick = useCallback((dayNumber) => {
    if (!dayNumber) return;

    const clickedDate = new Date(year, month - 1, dayNumber);
    setSelectedDate(clickedDate);
  }, [year, month])
  
  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <CalendarHeader
        year={year}
        month={month}
        onPrev={prevMonth}
        onNext={nextMonth}
      />

      <SelectedDateDisplay
        selectedDate={selectedDate}
      />

      <CalendarWeekdays/>

      <CalendarGrid
        days={days}
        selectedDate={selectedDate}
        year={year}
        month={month}
        onDayClick={handleDateClick}
      />
    </div>
  )
}

export default Calendar;
export { generateCalendarDays, isDateSelected };