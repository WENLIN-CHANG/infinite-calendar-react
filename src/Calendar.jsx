import { useState, useEffect, useCallback, useMemo } from "react";
import CalendarHeader from './CalendarHeader';
import SelectedDateDisplay from "./SelectedDateDisplay";
import CalendarWeekdays from "./CalendarWeekdays";

function generateCalendarDays(year ,month) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push('');
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return days
}

function isDateSelected(selectedDate, year ,month, dayNumber) {
  if(!selectedDate || dayNumber === '') return false;

  return selectedDate.getDate() === dayNumber && selectedDate.getMonth() === month - 1 && selectedDate.getFullYear() === year;
}

function Calendar() { 
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(10);
  const [selectedDate, setSelectedDate] = useState(null);

  const days = useMemo(() => {
    return generateCalendarDays(year, month)
  }, [year, month])

  useEffect(() => {
    const savedDate = localStorage.getItem('selectedDate');
    if(savedDate){
      const date = new Date(savedDate);
      setSelectedDate(date);
      setYear(date.getFullYear());
      setMonth(date.getMonth() + 1);
    } else {
      const today = new Date();
      setYear(today.getFullYear());
      setMonth(today.getMonth() + 1);
    }
  }, []);

  useEffect(() => {
    if(selectedDate){
      localStorage.setItem('selectedDate', selectedDate.toISOString());
    }
  }, [selectedDate]);

  const nextMonth = useCallback(() => {
    setSelectedDate(null);
    if (month === 12) {
      setYear(year + 1);
      setMonth(1);
    } else {
      setMonth(month + 1);
    }
  }, [year, month]);

  const prevMonth = useCallback(() => {
    setSelectedDate(null);
    if (month === 1) {
      setYear(year - 1);
      setMonth(12);
    } else {
      setMonth(month - 1);
    }
  }, [year, month]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if(e.key === 'ArrowLeft') {
        prevMonth();
      }
      if (e.key === 'ArrowRight') {
        nextMonth();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    }
  }, [prevMonth, nextMonth]);

  const handleDateClick = useCallback((dayNumber) => {
    if (dayNumber === '') return;

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

      {/* 日期格子 */}
      <div className="grid grid-cols-7 gap-px bg-gray-300 rounded-b-md overflow-hidden">
        {days.map((dayNumber, index) => {
          const isSelected = isDateSelected(selectedDate, year, month, dayNumber)
          return (
            <div
              key={index}
              onClick={() => handleDateClick(dayNumber)}
              className={`
                py-3 text-center min-h-[40px] flex items-center justify-center transition-colors duration-200
                ${
                  dayNumber === ''
                    ? 'bg-gray-50 cursor-default'
                    : isSelected
                      ? 'bg-blue-600 text-white cursor-pointer font-semibold'
                      : 'bg-white hover:bg-blue-50 cursor-pointer text-gray-800 hover:text-blue-600'
                }
              `}
            >
              {dayNumber}
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default Calendar;
export { generateCalendarDays, isDateSelected };