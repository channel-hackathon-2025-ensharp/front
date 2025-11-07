// src/components/user/UserPanel.js
export default function UserPanel({
    currentStaff = 0,
    totalStaff = 0,
    timeSlot = "-",
    staffList = [],
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
                    <div key={idx} className="flex items-center justify-between py-5">
                        <div className="text-lg font-semibold text-gray-900">
                            {person.name}
                        </div>
                        <button
                            type="button"
                            className="text-gray-500 hover:text-gray-700 underline underline-offset-4"
                            onClick={() => onClickChange?.(person)}
                        >
                            변경하기
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
