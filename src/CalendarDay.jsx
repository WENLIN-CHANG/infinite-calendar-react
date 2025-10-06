function CalendarDay({ day, isSelected, onClick }) {
  return (
    <div
      onClick={!day ? undefined : onClick}
      className={`
    py-3 text-center min-h-[40px] flex items-center justify-center transition-colors duration-200
    ${!day
          ? 'bg-gray-50 cursor-default'
          : isSelected
            ? 'bg-blue-600 text-white cursor-pointer font-semibold'
            : 'bg-white hover:bg-blue-50 cursor-pointer text-gray-800 hover:text-blue-600'
        }
      `}
    >
      {day}
    </div>
  );
}

export default CalendarDay;