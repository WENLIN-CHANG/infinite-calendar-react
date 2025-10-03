function SelectedDateDisplay({ selectedDate }) {
  if(!selectedDate) return null;
  return(
    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
      <p className="text-blue-800 font-medium">
        選中日期：{selectedDate.getFullYear()}年{selectedDate.getMonth() + 1}月{selectedDate.getDate()}日
      </p>
    </div>
  )
}

export default SelectedDateDisplay;