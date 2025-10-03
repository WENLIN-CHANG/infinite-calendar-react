function CalendarHeader({ year, month, onPrev, onNext }) {
  return (
    < div className="flex items-center justify-between mb-6" >
      {/* 月份導航 */ }
        <button
          onClick={onPrev}
          className="px-4 py-2 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 hover:border-blue-400 transition-colors duration-200 font-medium"
        >
          上個月
        </button>
        <h2 className="text-xl font-bold text-gray-800">
          {year} 年{month}月
        </h2>
        <button
          onClick={onNext}
          className="px-4 py-2 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 hover:border-blue-400 transition-colors duration-200 font-medium"
        >
          下個月
        </button>
      </div>
    );
}

export default CalendarHeader;