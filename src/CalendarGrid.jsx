import CalendarDay from "./CalendarDay";
import { isDateSelected } from "./Calendar";

function CalendarGrid({ days, selectedDate, year, month, onDayClick }) {
  return(
    <div className="grid grid-cols-7 gap-px bg-gray-300 rounded-b-md overflow-hidden">
      {days.map((dayNumber, index) => {
        const isSelected = isDateSelected(selectedDate, year, month, dayNumber);

        return (
          <CalendarDay
            key={index}
            day={dayNumber}
            isSelected={isSelected}
            onClick={() => onDayClick(dayNumber)}
          />
        );
      })}
    </div>
  );
}

export default CalendarGrid;