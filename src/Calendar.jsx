function Calendar() {
  const year = 2025;
  const month = 10;
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push('')
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }
  
  return (
    <div>
      <h2>{year} 年{month}月</h2>

      {/* 星期標題 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: '#ccc' }}>
        {['日', '一', '二', '三', '四', '五', '六'].map(weekDay => (
          <div key={weekDay} style={{ padding: '10px', backgroundColor: 'white', textAlign: 'center' }}>
            {weekDay}
          </div>
        ))}
      </div>

      {/* 日期格子  */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',gap: '1px', backgroundColor: '#ccc' }}>
        {days.map((dayNumber, index) => (
          <div key={index} style={{ padding: '10px', backgroundColor: 'white', textAlign: 'center', minHeight: '40px' }}>
            {dayNumber}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Calendar;