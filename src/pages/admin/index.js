import React, { useState } from "react";
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
import { format } from "date-fns";
// ✅ 로케일 임포트 경로 수정
import { ko } from "date-fns/locale";

export default function AdminHome() {
  // ✅ setDate 추가로 받아 DateCard와 연결
  const { selected, setSlot, setDate } = useSidePanel();

  // 시간대(09:00~22:00)
  const timeSlots = [
    { time: "09:00-10:00", status: "normal" },
    { time: "10:00-11:00", status: "normal" },
    { time: "11:00-12:00", status: "normal" },
    { time: "12:00-13:00", status: "normal" },
    { time: "13:00-14:00", status: "normal" },
    { time: "14:00-15:00", status: "normal" },
    { time: "15:00-16:00", status: "empty" },
    { time: "16:00-17:00", status: "normal" },
    { time: "17:00-18:00", status: "normal" },
    { time: "18:00-19:00", status: "normal" },
    { time: "19:00-20:00", status: "normal" },
    { time: "20:00-21:00", status: "normal" },
    { time: "21:00-22:00", status: "normal" },
  ];

  // 직원 목록
  const staff = [
    { name: "유혁상", type: "new", status: "confirmed" },
    { name: "서상혁", type: "existing", status: "confirmed" },
  ];

  // 대체 후보자(모달에 표시)
  const substitutes = [
    { name: "김보빈", status: "승인 대기" },
    { name: "박준서", status: "승인 완료" },
  ];

  // 승인 내역
  const [shiftChanges, setShiftChanges] = useState([]);

  // ✅ StaffPanel에서 승인 완료 콜백
  const handleApproved = ({ fromUser, toUser }) => {
    setShiftChanges((prev) => [
      ...prev,
      { original: fromUser || "유혁상", substitute: toUser, status: "승인 완료" },
    ]);
  };

  // 오늘 날짜 표시(우측 상단에 쓰일 수 있음)
  const today = new Date();
  const dateStr = format(today, "yyyy.MM.dd.");
  const dayOfWeek = format(today, "eee", { locale: ko });

  // ✅ StaffPanel로 넘길 안전한 값들
  const selectedDate = selected?.date || new Date();
  const selectedTime = selected?.slot?.time || ""; // 문자열 필요

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAdmin={true} userName="관리자1" />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 왼쪽 패널 */}
            <div className="space-y-6">
              <DateCard
                date={dateStr}
                dayOfWeek={dayOfWeek}
                isBusinessDay={true}
                // ✅ 날짜 선택을 상태에 반영 (있다면)
                onDateChange={(d) => setDate?.(d)}
              />
              <TimelineCard
                startTime="09:00"
                endTime="22:00"
                totalHours={12}
                timeSlots={timeSlots}
                // ✅ 슬롯 객체를 그대로 setSlot에 전달 (내부에서 {time, status})
                onSlotClick={setSlot}
              />
            </div>

            {/* 오른쪽 패널 */}
            <div className="space-y-6 min-h-[600px]">
              <StaffPanel
                currentStaff={2}
                totalStaff={3}
                // ✅ 문자열 time, Date 전달
                timeSlot={selectedTime}
                date={selectedDate}
                requestorName="유혁상"
                staffList={staff}
                substitutes={substitutes}
                // ✅ prop 이름: onApproved (우리 컴포넌트 시그니처와 일치)
                onApproved={handleApproved}
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
