import Header from "../../components/common/Header";
import DateCard from "../../components/admin/DateCard";
import TimelineCard from "../../components/admin/TimelineCard";
import StaffPanel from "../../components/admin/StaffPanel";
import Legend from "../../components/common/Legend";

export default function AdminHome() {
  // 시간대별 데이터 (09:00-22:00, 1시간 단위, 올바른 형식)
  const timeSlots = [
    { time: "09:00-10:00", status: "normal" },
    { time: "10:00-11:00", status: "normal" },
    { time: "11:00-12:00", status: "normal" },
    { time: "12:00-13:00", status: "shortage" }, // 인원 부족
    { time: "13:00-14:00", status: "break" }, // 브레이크
    { time: "14:00-15:00", status: "empty" },
    { time: "15:00-16:00", status: "normal" },
    { time: "16:00-17:00", status: "normal" },
    { time: "17:00-18:00", status: "normal" },
    { time: "18:00-19:00", status: "normal" },
    { time: "19:00-20:00", status: "normal" },
    { time: "20:00-21:00", status: "normal" },
    { time: "21:00-22:00", status: "normal" },
  ];

  // 직원 목록
  const staff = [
    { name: "김보빈", type: "new", status: "confirmed" }, // 신규 상담
    { name: "유혁상", type: "existing", status: "confirmed" }, // 기존 상담
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAdmin={true} userName="관리자1" />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* 메인 컨텐츠 영역 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 왼쪽 패널 */}
            <div className="space-y-6">
              <DateCard
                date="2025.11.08."
                dayOfWeek="토"
                isBusinessDay={true}
              />
              <TimelineCard
                startTime="09:00"
                endTime="22:00"
                totalHours={12}
                timeSlots={timeSlots}
              />
            </div>

            {/* 오른쪽 패널 */}
            <StaffPanel
              currentStaff={2}
              totalStaff={3}
              timeSlot="12:00-13:00"
              staffList={staff}
            />
          </div>

          {/* 하단 범례 */}
          <Legend />
        </div>

        {/* 플로팅 채널톡 버튼 */}
        <button className="fixed bottom-8 right-8 w-16 h-16 bg-indigo-600 rounded-full shadow-2xl flex items-center justify-center hover:bg-indigo-700 transition-colors">
          <svg
            className="w-8 h-8 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2 22l5.71-.97C9 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.38 0-2.69-.28-3.88-.78l-.28-.15-2.91.49.49-2.91-.15-.28C4.78 14.69 4.5 13.38 4.5 12c0-4.14 3.36-7.5 7.5-7.5s7.5 3.36 7.5 7.5-3.36 7.5-7.5 7.5z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
