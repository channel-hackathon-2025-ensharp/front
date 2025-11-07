// 사용법:
//  - timeSlots: [{ time: "09:00-10:00", status: "mine" | "other" }]
//  - selectedTime: string | null
//  - onSelect: (slot) => void

export default function TimeSlotList({ timeSlots = [], selectedTime = null, onSelect }) {
    return (
        <ul className="space-y-3">
            {timeSlots.map((slot) => {
                const isSelected = selectedTime === slot.time;
                const isMine = slot.status === "mine";   // ✅ 초록/회색 구분

                return (
                    <li key={slot.time}>
                        <button
                            type="button"
                            onClick={() => onSelect?.(slot)}
                            className={[
                                "w-full rounded-2xl px-4 py-3 flex items-center justify-between",
                                "border transition-colors",
                                isSelected ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200",
                                "bg-white",
                            ].join(" ")}
                        >
                            <span className="text-sm text-gray-700">{slot.time}</span>

                            {/* 막대 표시 */}
                            <span
                                className={[
                                    "ml-4 h-3 flex-1 rounded-full",
                                    isMine ? "bg-green-500/90" : "bg-gray-300",
                                ].join(" ")}
                            />
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}
