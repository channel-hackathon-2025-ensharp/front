export default function Legend() {
  return (
    <div className="mt-8 flex justify-center gap-8">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
        <span className="text-sm text-gray-600">정상</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
        <span className="text-sm text-gray-600">브레이크 타임 / 휴무</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <span className="text-sm text-gray-600">인원 부족</span>
      </div>
    </div>
  );
}
