import { useState } from "react";

function Calendar() {
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(10);
  const [selectedDate, setSelectedDate] = useState(null);
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = [];

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
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={prevMonth}>上個月</button>
        <h2>{year} 年{month}月</h2>
        <button onClick={nextMonth}>下個月</button>
      </div>

      {selectedDate && (
        <p>選中日期：{selectedDate.getFullYear()}年{selectedDate.getMonth() + 1}月{selectedDate.getDate()}日</p>
      )}

      {/* 星期標題 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: '#ccc' }}>
        {['日', '一', '二', '三', '四', '五', '六'].map(weekDay => (
          <div key={weekDay} style={{ padding: '10px', backgroundColor: 'white', textAlign: 'center' }}>
            {weekDay}
          </div>
        ))}
      </div>

      {/* 日期格子  */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: '#ccc' }}>
        {days.map((dayNumber, index) => {
          const isSelected = selectedDate && dayNumber !== '' && selectedDate.getDate() === dayNumber && selectedDate.getMonth() === month - 1 && selectedDate.getFullYear() === year;
          return (
            <div 
              key={index} 
              onClick={() => handleDateClick(dayNumber)} 
              style={{
                padding: '10px',
                backgroundColor: isSelected ? '#007bff' : 'white',
                color: isSelected ? 'white' : 'black',
                textAlign: 'center',
                minHeight: '40px',
                cursor: dayNumber === '' ? 'default' : 'pointer'}}
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