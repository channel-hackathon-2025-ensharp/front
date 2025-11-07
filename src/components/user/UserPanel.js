// src/components/user/UserPanel.js
export default function UserPanel({
    currentStaff = 0,
    totalStaff = 0,
    timeSlot = "-",
    staffList = [],
    onClickChange,
    currentUserName = "김보빈",
    isMyShift = false,
}) {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            {/* 상단: 선택된 시간 + 내 근무 여부 배지 */}
            <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-500 flex items-center gap-2">
                    선택된 시간
                    {timeSlot && timeSlot !== "-" && (
                        <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs
                  ${isMyShift ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                        >
                            {isMyShift ? "내 근무 시간" : "내 근무 아님"}
                        </span>
                    )}
                </div>
                <div className="text-sm font-medium text-gray-900">{timeSlot}</div>
            </div>

            {/* 현재 인원 */}
            <div className="flex items-center justify-between mb-6">
                <div className="text-gray-600">현재 인원</div>
                <div className="text-2xl font-bold text-blue-600">
                    {currentStaff}/{totalStaff}
                </div>
            </div>

            {/* 직원 리스트 */}
            <div className="divide-y">
                {staffList.map((person, idx) => {
                    const isMe = person.name === currentUserName;
                    return (
                        <div key={idx} className="flex items-center justify-between py-5">
                            <div className="text-lg font-semibold text-gray-900">
                                {person.name}
                            </div>

                            {isMe ? (
                                <button
                                    type="button"
                                    className="text-gray-700 hover:text-gray-900 underline underline-offset-4"
                                    onClick={() => onClickChange?.(person)}
                                >
                                    변경하기
                                </button>
                            ) : (
                                null
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
