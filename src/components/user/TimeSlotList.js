export default function TimeSlotList({
    timeSlots,             // [{ time, status }]
    selectedTime,          // "12:00-13:00" | null
    onSelect,              // (slot) => void
}) {
    const color = (status) =>
        status === "normal" ? "bg-indigo-400" :
            status === "shortage" ? "bg-red-500" :
                status === "break" ? "bg-red-300" :
                    "bg-gray-200";

    return (
        <div className="space-y-2">
            {timeSlots.map((slot, idx) => {
                const isSelected = selectedTime === slot.time;
                return (
                    <button
                        key={idx}
                        onClick={() => onSelect(slot)}
                        className={`flex w-full items-center gap-3 rounded-xl p-1 transition
                          ${isSelected ? "bg-indigo-50" : "hover:bg-gray-50"}`}
                    >
                        <div
                            className={`text-xs w-24 ${slot.status === "empty" ? "text-gray-300" : "text-gray-500"
                                }`}
                        >
                            {slot.time}
                        </div>
                        <div
                            className={`flex-1 h-6 rounded-full ${color(slot.status)}
                            ${isSelected ? "ring-2 ring-indigo-400 ring-offset-2" : ""}`}
                        />
                    </button>
                );
            })}
        </div>
    );
}
