// 간단 버전: 이름과 "변경하기" 버튼만 있는 리스트
// props:
// - currentStaff, totalStaff, timeSlot
// - staffList: [{ name, type, status }]
// - changeLabel: 버튼 라벨 (기본: '변경하기')
// - onClickChange: (person) => void
export default function StaffPanel({
    currentStaff = 0,
    totalStaff = 0,
    timeSlot = "-",
    staffList = [],
    changeLabel = "변경하기",
    onClickChange,
}) {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-500">선택된 시간</div>
                <div className="text-sm font-medium text-gray-900">{timeSlot}</div>
            </div>

            <div className="flex items-center justify-between mb-6">
                <div className="text-gray-600">현재 인원</div>
                <div className="text-2xl font-bold text-blue-600">
                    {currentStaff}/{totalStaff}
                </div>
            </div>

            <div className="divide-y">
                {staffList.map((person, idx) => (
                    <div key={idx} className="flex items-center justify-between py-4">
                        <div className="text-base font-semibold text-gray-900">
                            {person.name}
                        </div>

                        <button
                            type="button"
                            className="text-gray-500 hover:text-gray-700 underline underline-offset-2"
                            onClick={() => onClickChange?.(person)}
                        >
                            {person.changeLabel ?? changeLabel}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
