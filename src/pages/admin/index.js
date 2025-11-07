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
  const selectedDate = new Date('2025-11-08');
  const timeSlots = [
    { time: '09:00', status: 'normal', currentStaff: 1, requiredStaff: 3 },
    { time: '10:00', status: 'normal', currentStaff: 1, requiredStaff: 3 },
    { time: '11:00', status: 'normal', currentStaff: 1, requiredStaff: 3 },
    { time: '12:00', status: 'shortage', currentStaff: 2, requiredStaff: 3 },
    { time: '13:00', status: 'break', currentStaff: 1, requiredStaff: 3 },
    { time: '14:00', status: 'normal', currentStaff: 1, requiredStaff: 3 },
    { time: '15:00', status: 'normal', currentStaff: 1, requiredStaff: 3 },
    { time: '16:00', status: 'normal', currentStaff: 1, requiredStaff: 3 },
    { time: '17:00', status: 'normal', currentStaff: 1, requiredStaff: 3 },
    { time: '18:00', status: 'normal', currentStaff: 1, requiredStaff: 3 },
    { time: '19:00', status: 'normal', currentStaff: 1, requiredStaff: 3 },
    { time: '20:00', status: 'normal', currentStaff: 1, requiredStaff: 3 },
    { time: '21:00', status: 'normal', currentStaff: 1, requiredStaff: 3 },
  ];
  const workingHours = { startTime: '09:00', endTime: '22:00', totalHours: 12 };
  const staffCount = { currentStaff: 2, totalStaff: 3 };
  const selectedTimeSlot = '12:00';
  const isLoading = false;
  const error = null;
  const setSelectedDate = () => {};
  const setSelectedTimeSlot = () => {};
  const loadSchedules = () => {};
  // 12:00~13:00에만 2명, 나머지는 1명
  const staffList = [
    { name: '김보빈', status: 'available', userId: 582200 , type: 'new' }, // 변동 있음
    { name: '유혁상', status: 'confirmed', userId: 581861, type: 'original' },
  ];
  const substitutes = [];
  const timeSlotStaffCount = staffCount;

  // 컴포넌트 마운트 시 오늘 날짜의 스케줄 로드
  // useEffect(() => {
  //   loadSchedules(selectedDate);
  // }, []);

  // 날짜 포맷팅
  const dateStr = format(selectedDate, "yyyy.MM.dd.");
  const dayOfWeek = format(selectedDate, "eee", { locale: ko });

  // 선택된 시간대의 데이터
  // ...existing code...

  // ...더미 데이터 삭제됨...

  // 날짜 변경 핸들러
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  // 시간대 클릭 핸들러
  const handleSlotClick = (time) => {
    setSelectedTimeSlot(time);
      const staffList = [
        { name: '김보빈', status: 'available', userId: 582200, type: 'new' }, // 변동 있음
        { name: '유혁상', status: 'confirmed', userId: 581861, type: 'original' },
      ];
      // ShiftChangeModal에 표시될 더미 후보자 데이터
      const substitutes = [
        { name: '서상혁', userId: 582300, status: 'approved', email: 'jiwon@sample.com', replacementId: 1, originalScheduleId: 100 },
        { name: '박준서', userId: 582301, status: 'pending', email: 'sujeong@sample.com', replacementId: 2, originalScheduleId: 100 },
      ];
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
              <ShiftChangeList changes={[]} />
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
