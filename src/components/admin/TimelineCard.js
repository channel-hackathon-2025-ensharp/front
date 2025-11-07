export default function TimelineCard({
  startTime,
  endTime,
  totalHours,
  timeSlots,
  onSlotClick,
  selectedTime, // 선택 강조용(선택)
}) {
  const getStatusColor = (status) => {
    switch (status) {
      case "normal":
        return "bg-indigo-400";
      case "shortage":
        return "bg-red-500";
      case "break":
        return "bg-red-300";
      case "empty":
        return "bg-gray-200";
      default:
        return "bg-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <div className="text-sm text-gray-500 mb-2">근무 시간</div>
      <div className="flex items-center justify-between mb-6">
        <div className="text-gray-600">
          {startTime}-{endTime}
        </div>
        <div className="text-3xl font-bold text-blue-600">{totalHours}시간</div>
      </div>

      {/* 타임라인 */}
      <div className="space-y-2">
        {timeSlots.map((slot, index) => {
          const isSelected = selectedTime && selectedTime === slot.time;
          return (
            <div
              key={index}
              role="button"
              tabIndex={0}
              className={`flex items-center gap-3 cursor-pointer rounded-lg p-1 transition-colors
                hover:bg-gray-50 ${isSelected ? "ring-2 ring-blue-400" : ""}`}
              // ✅ 슬롯 "객체" 자체를 넘긴다!
              onClick={() => onSlotClick && onSlotClick(slot)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onSlotClick && onSlotClick(slot);
              }}
            >
              <div
                className={`text-xs ${slot.status === "empty" ? "text-gray-300" : "text-gray-500"
                  } w-24`}
              >
                {slot.time}
              </div>
              <div
                className={`flex-1 h-6 rounded-full ${getStatusColor(slot.status)} ${isSelected ? "outline outline-2 outline-blue-400" : ""
                  }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
