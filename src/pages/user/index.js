
import { useMemo, useState } from "react";
import Image from "next/image";
import Header from "../../components/common/Header";
import DateCard from "../../components/admin/DateCard";
import TimeSlotList from "../../components/user/TimeSlotList";
import UserPanel from "../../components/user/UserPanel";
import ChangeRequestModal from "../../components/user/ChangeRequestModal";
import useSidePanel from "../../hooks/useSidePanel";
import Legend from "../../components/common/Legend";
import channeltalkLogo from "../../assets/logo/channeltalk.png";

export default function UserHome() {
  const { selected, setDate, setSlot } = useSidePanel();

  const handleDateChange = (d) => setDate(d);

  const timeSlots = useMemo(
    () => [
      { time: "09:00-10:00", status: "normal" },
      { time: "10:00-11:00", status: "normal" },
      { time: "11:00-12:00", status: "normal" },
      { time: "12:00-13:00", status: "shortage" },
      { time: "13:00-14:00", status: "break" },
      { time: "14:00-15:00", status: "empty" },
      { time: "15:00-16:00", status: "normal" },
      { time: "16:00-17:00", status: "normal" },
      { time: "17:00-18:00", status: "normal" },
      { time: "18:00-19:00", status: "normal" },
      { time: "19:00-20:00", status: "normal" },
      { time: "20:00-21:00", status: "normal" },
      { time: "21:00-22:00", status: "normal" },
    ],
    []
  );

  const staffList = [
    { name: "김보빈", type: "new", status: "confirmed" },
    { name: "유혁상", type: "exist", status: "confirmed" },
  ];

  // 모달 제어(우측 패널의 “변경하기”로만 오픈)
  const [isChangeOpen, setChangeOpen] = useState(false);
  const openChange = () => setChangeOpen(true);
  const closeChange = () => setChangeOpen(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더: 관리자 페이지와 동일 컴포넌트 사용 */}
      <Header isAdmin={false} userName="사용자A" />

      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
            {/* 좌측: 날짜 + 타임슬롯 */}
            <div className="space-y-6">
              <DateCard onDateChange={handleDateChange} />
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <div className="text-sm text-gray-500 mb-2">근무 시간</div>
                <div className="flex items-center justify-between mb-6">
                  <div className="text-gray-600">09:00-22:00</div>
                  <div className="text-3xl font-bold text-blue-600">6시간</div>
                </div>
                <TimeSlotList
                  timeSlots={timeSlots}
                  selectedTime={selected?.slot?.time || null}
                  onSelect={(slot) => {
                    // 슬롯 클릭 시 선택만 (모달 X)
                    setSlot(slot);
                  }}
                />
              </div>

              {/* 하단 범례 */}
              <Legend />
            </div>

            {/* 우측: 유저 패널 — 여기 “변경하기” 클릭 시 모달 오픈 */}
            <div className="min-h-[520px]">
              <UserPanel
                currentStaff={2}
                totalStaff={3}
                timeSlot={selected?.slot?.time || "-"}
                staffList={staffList}
                onClickChange={() => openChange()}
              />
            </div>
          </div>
        </div>

        {/* 플로팅 채널톡 버튼 (관리자 페이지와 동일) */}
        <button
          className="fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-2xl ring-1 ring-black/10 transition-transform hover:scale-105"
          aria-label="채널톡 열기"
        >
          <Image
            src={channeltalkLogo}
            alt="채널톡 로고"
            width={28}
            height={28}
            className="object-contain"
            priority
          />
        </button>
      </div>

      {/* 변경 신청 모달 */}
      <ChangeRequestModal
        isOpen={isChangeOpen}
        onClose={closeChange}
        date={selected?.date || new Date()}
        timeSlot={selected?.slot?.time || ""}
        jobType={
          selected?.slot?.status === "shortage" ? "신규 상담" : "기존 상담"
        }
        onSubmit={() => {
          // TODO: 실제 신청 API 연결
          console.log("변경 신청 완료:", selected);
        }}
      />
    </div>
  );
}
