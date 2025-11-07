export default function DateCard({ date, dayOfWeek, isBusinessDay = true }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <div className="text-sm text-gray-500 mb-2">오늘</div>
      <div className="flex items-center justify-between">
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
