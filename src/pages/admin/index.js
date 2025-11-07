import { useEffect } from "react";
import Header from "../../components/common/Header";
import Image from "next/image";
import DateCard from "../../components/admin/DateCard";
import TimelineCard from "../../components/admin/TimelineCard";
import StaffPanel from "../../components/admin/StaffPanel";
import Legend from "../../components/common/Legend";
import channeltalkLogo from "../../assets/logo/channeltalk.png";
import ShiftChangeList from "../../components/admin/ShiftChangeList";
import FloatingChannelTalkButton from "../../components/common/FloatingChannelTalkButton";
import useScheduleStore from "../../store/scheduleStore";
import { format } from "date-fns";
import { ko } from "date-fns";

export default function AdminHome() {
  // Zustand 스토어 사용
  const {
    selectedDate,
    timeSlots,
    workingHours,
    staffCount,
    selectedTimeSlot,
    isLoading,
    error,
    setSelectedDate,
    setSelectedTimeSlot,
    loadSchedules,
    getStaffListForSelectedTime,
    getSubstitutesForSelectedTime,
    getStaffCountForSelectedTime,
  } = useScheduleStore();

  // 컴포넌트 마운트 시 오늘 날짜의 스케줄 로드
  useEffect(() => {
    loadSchedules(selectedDate);
  }, []);

  // 날짜 포맷팅
  const dateStr = format(selectedDate, "yyyy.MM.dd.");
  const dayOfWeek = format(selectedDate, "eee", { locale: ko });

  // 선택된 시간대의 데이터
  const staffList = getStaffListForSelectedTime();
  const substitutes = getSubstitutesForSelectedTime();
  const timeSlotStaffCount = selectedTimeSlot
    ? getStaffCountForSelectedTime()
    : staffCount;

  // 근무 변경 내역 (TODO: API 연동 필요)
  const shiftChanges = [
    {
      original: "김보빈",
      substitute: "유혁상",
      status: "승인 완료",
    },
  ];

  // 날짜 변경 핸들러
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  // 시간대 클릭 핸들러
  const handleSlotClick = (time) => {
    setSelectedTimeSlot(time);
  };

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">에러 발생: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAdmin={true} userName="관리자" />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* 메인 컨텐츠 영역 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 왼쪽 패널 */}
            <div className="space-y-6">
              <DateCard
                date={dateStr}
                dayOfWeek={dayOfWeek}
                isBusinessDay={true}
                onDateChange={handleDateChange}
              />
              <TimelineCard
                startTime={workingHours.startTime}
                endTime={workingHours.endTime}
                totalHours={workingHours.totalHours}
                timeSlots={timeSlots}
                onSlotClick={handleSlotClick}
              />
            </div>

            {/* 오른쪽 패널 */}
            <div className="space-y-6 min-h-[600px]">
              <StaffPanel
                currentStaff={timeSlotStaffCount.currentStaff}
                totalStaff={timeSlotStaffCount.totalStaff}
                timeSlot={selectedTimeSlot || "시간대를 선택하세요"}
                staffList={staffList}
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
