import { useState, useEffect } from "react";

function Calendar() {
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(10);
  const [selectedDate, setSelectedDate] = useState(null);
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = [];

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

  const nextMonth = () => {
    setSelectedDate(null);
    if (month === 12) {
      setYear(year + 1);
      setMonth(1);
    } else {
      setMonth(month + 1);
    }
  };

  const prevMonth = () => {
    setSelectedDate(null);
    if (month === 1) {
      setYear(year - 1);
      setMonth(12);
    } else {
      setMonth(month - 1);
    }
  };

  const handleDateClick = (dayNumber) => {
    if (dayNumber === '') return;
    
    const clickedDate = new Date(year, month - 1, dayNumber);
    setSelectedDate(clickedDate);
  }

  for (let i = 0; i < firstDay; i++) {
    days.push('');
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }
  
  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* 月份導航 */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="px-4 py-2 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 hover:border-blue-400 transition-colors duration-200 font-medium"
        >
          上個月
        </button>
        <h2 className="text-xl font-bold text-gray-800">
          {year} 年{month}月
        </h2>
        <button
          onClick={nextMonth}
          className="px-4 py-2 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 hover:border-blue-400 transition-colors duration-200 font-medium"
        >
          下個月
        </button>
      </div>

      {/* 選中日期顯示 */}
      {selectedDate && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-800 font-medium">
            選中日期：{selectedDate.getFullYear()}年{selectedDate.getMonth() + 1}月{selectedDate.getDate()}日
          </p>
        </div>
      )}

      {/* 星期標題 */}
      <div className="grid grid-cols-7 gap-px bg-gray-300 mb-px rounded-t-md overflow-hidden">
        {['日', '一', '二', '三', '四', '五', '六'].map(weekDay => (
          <div key={weekDay} className="bg-gray-100 py-3 text-center text-sm font-semibold text-gray-700">
            {weekDay}
          </div>
        ))}
      </div>

      {/* 日期格子 */}
      <div className="grid grid-cols-7 gap-px bg-gray-300 rounded-b-md overflow-hidden">
        {days.map((dayNumber, index) => {
          const isSelected = selectedDate && dayNumber !== '' && selectedDate.getDate() === dayNumber && selectedDate.getMonth() === month - 1 && selectedDate.getFullYear() === year;
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