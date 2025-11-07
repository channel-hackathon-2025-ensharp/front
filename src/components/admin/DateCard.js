import { ChevronRightIcon } from "@heroicons/react/24/outline";

export default function DateCard({ date, dayOfWeek, isBusinessDay = true }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative">
      {/* 우측 상단 화살표 아이콘 */}
      <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
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
  );
}
