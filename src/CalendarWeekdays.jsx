function CalendarWeekdays() {
  return (
    <div className="grid grid-cols-7 gap-px bg-gray-300 mb-px rounded-t-md overflow-hidden">
      {['日', '一', '二', '三', '四', '五', '六'].map(weekDay => (
        <div key={weekDay} className="bg-gray-100 py-3 text-center text-sm font-semibold text-gray-700">
          {weekDay}
        </div>
      ))}
    </div>
  );
}

export default CalendarWeekdays;