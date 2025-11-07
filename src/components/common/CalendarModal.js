import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
} from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function CalendarModal({ isOpen, onClose, selectedDate, onDateSelect, highlightedDates = [] }) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // 월의 첫 날이 무슨 요일인지 확인 (0: 일요일, 6: 토요일)
  // 월요일 시작으로 변환 (일요일=6, 월요일=0, ..., 토요일=5)
  const startDayOfWeek = getDay(monthStart);
  const adjustedStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  // 빈 칸 생성 (월의 첫 날 이전)
  const emptyDays = Array(adjustedStartDay).fill(null);

  // 날짜가 강조 표시 목록에 있는지 확인
  const isHighlighted = (date) => {
    return highlightedDates.some((highlightedDate) =>
      isSameDay(date, highlightedDate)
    );
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (date) => {
    onDateSelect(date);
    onClose();
  };

  const isSelectedDate = (date) => {
    return selectedDate && isSameDay(date, selectedDate);
  };

  const isToday = (date) => {
    return isSameDay(date, new Date());
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-8 shadow-2xl z-50 w-[450px]">
          {/* 닫기 버튼 */}
          <Dialog.Close className="absolute top-4 right-4 text-gray-300 hover:text-gray-500">
            <XMarkIcon className="w-6 h-6" />
          </Dialog.Close>

          {/* 월 네비게이션 */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold">
              {format(currentMonth, "yyyy.MM.", { locale: ko })}
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
              <div key={day} className="text-center text-sm text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* 캘린더 날짜 */}
          <div className="grid grid-cols-7 gap-2">
            {/* 빈 칸 */}
            {emptyDays.map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}

            {/* 날짜 */}
            {daysInMonth.map((date) => {
              const isSelected = isSelectedDate(date);
              const isTodayDate = isToday(date);
              const isHighlightedDate = isHighlighted(date);
              const dayOfWeek = getDay(date);
              const isSaturday = dayOfWeek === 6;
              const isSunday = dayOfWeek === 0;

              return (
                <button
                  key={date.toString()}
                  onClick={() => handleDateClick(date)}
                  className={`
                    aspect-square rounded-full flex items-center justify-center text-sm font-medium
                    transition-colors
                    ${
                      isTodayDate
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : isSelected
                        ? "bg-indigo-600 text-white"
                        : isHighlightedDate
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : isSunday
                        ? "bg-gray-300 text-white hover:bg-gray-400"
                        : isSaturday
                        ? "text-gray-400 hover:bg-gray-100"
                        : "hover:bg-gray-100"
                    }
                  `}
                >
                  {format(date, "d")}
                </button>
              );
            })}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
