import { useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import CalendarModal from "../common/CalendarModal";

export default function DateCard({ date, dayOfWeek, isBusinessDay = true, onDateChange }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateSelect = (newDate) => {
    setSelectedDate(newDate);
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  return (
    <>
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative">
        {/* 우측 상단 화살표 아이콘 */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>

        <div className="text-sm text-gray-500 mb-2">오늘</div>
        <div className="flex items-center justify-between pr-8">
          <div className="text-gray-600">
            {date} ({dayOfWeek})
          </div>
          <div className="text-3xl font-bold text-blue-600">
            {isBusinessDay ? "영업일" : "휴무일"}
          </div>
        </div>
      </div>

      <CalendarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        highlightedDates={[
          new Date(2025, 10, 1), // 11월 1일 (월은 0부터 시작)
          new Date(2025, 10, 3),
          new Date(2025, 10, 4),
          new Date(2025, 10, 5),
          new Date(2025, 10, 6),
          new Date(2025, 10, 7),
          new Date(2025, 10, 8), // 11월 8일 추가
          new Date(2025, 10, 10),
          new Date(2025, 10, 11),
          new Date(2025, 10, 12),
          new Date(2025, 10, 13),
          new Date(2025, 10, 14),
          new Date(2025, 10, 15),
          new Date(2025, 10, 17),
          new Date(2025, 10, 18),
          new Date(2025, 10, 19),
          new Date(2025, 10, 20),
          new Date(2025, 10, 21),
          new Date(2025, 10, 22),
          new Date(2025, 10, 24),
          new Date(2025, 10, 25),
          new Date(2025, 10, 26),
          new Date(2025, 10, 27),
          new Date(2025, 10, 28),
          new Date(2025, 10, 29),
        ]}
      />
    </>
  );
}
