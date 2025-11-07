import Header from "../../components/common/Header";
import Image from "next/image";
import DateCard from "../../components/admin/DateCard";
import TimelineCard from "../../components/admin/TimelineCard";
import StaffPanel from "../../components/admin/StaffPanel";
import Legend from "../../components/common/Legend";
import channeltalkLogo from "../../assets/logo/channeltalk.png";
import ShiftChangeList from "../../components/admin/ShiftChangeList";
import FloatingChannelTalkButton from "../../components/common/FloatingChannelTalkButton";
import useSidePanel from "../../hooks/useSidePanel";

export default function AdminHome() {
  const { selected, setSlot } = useSidePanel();
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

  // 근무 변경 후보자 리스트 (모달에서 사용)
  const substitutes = [
    { name: "서상혁", status: "승인 대기" },
    { name: "유혁상", status: "승인 완료" },
  ];

  // 근무 변경 내역 (실제 승인된 변경만 기록)
  const shiftChanges = [
    {
      original: "김보빈",
      substitute: "유혁상",
      status: "승인 완료",
    },
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
                onSlotClick={setSlot}
              />
            </div>

            {/* 오른쪽 패널 */}
            <div className="space-y-6 min-h-[600px]">
              <StaffPanel
                currentStaff={2}
                totalStaff={3}
                timeSlot={selected.slot || "12:00-13:00"}
                staffList={staff}
                substitutes={substitutes}
              />
              <ShiftChangeList changes={shiftChanges} />
            </div>
          </div>

          {/* 하단 범례 */}
          <Legend />
        </div>

        {/* 플로팅 채널톡 버튼 */}
        <FloatingChannelTalkButton />
      </div>
    </div>
  );
}
