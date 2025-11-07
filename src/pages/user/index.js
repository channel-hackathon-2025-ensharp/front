import { useMemo, useState } from "react";
import Image from "next/image";
import Header from "../../components/common/Header";
import DateCard from "../../components/user/DateCard";
import TimeSlotList from "../../components/user/TimeSlotList";
import UserPanel from "../../components/user/UserPanel";
import ChangeRequestModal from "../../components/user/ChangeRequestModal";
import useSidePanel from "../../hooks/useSidePanel";
import ShiftChangeList from "../../components/admin/ShiftChangeList";
import channeltalkLogo from "../../assets/logo/channeltalk.png";

// ✅ 추가: 서비스 호출
import { postQuitRequest } from "../../services/user/scheduleService";

export default function UserHome() {
  const { selected, setDate, setSlot } = useSidePanel();
  const currentUserName = "유혁상";

  const handleDateChange = (d) => setDate(d);

  // 전체 타임 슬롯 (기본 템플릿)
  const baseTimeSlots = useMemo(
    () => [
      "09:00-10:00",
      "10:00-11:00",
      "11:00-12:00",
      "12:00-13:00",
      "13:00-14:00",
      "14:00-15:00",
      "15:00-16:00",
      "16:00-17:00",
      "17:00-18:00",
      "18:00-19:00",
      "19:00-20:00",
      "20:00-21:00",
      "21:00-22:00",
    ],
    []
  );

  // ✅ 내 근무 시간(더미)
  const myShiftTimes = useMemo(
    () =>
      new Set([
        "09:00-10:00",
        "10:00-11:00",
        "11:00-12:00",
        "12:00-13:00",
        "13:00-14:00",
        "14:00-15:00",
      ]),
    []
  );

  // 사용자 화면 슬롯 색상
  const userTimeSlots = useMemo(
    () =>
      baseTimeSlots.map((t) => ({
        time: t,
        status: myShiftTimes.has(t) ? "mine" : "other",
      })),
    [baseTimeSlots, myShiftTimes]
  );

  const staffList = [
    { name: "김보빈", type: "new", status: "confirmed" },
    { name: "유혁상", type: "exist", status: "confirmed" },
  ];

  const isMyShift =
    !!(selected?.slot?.time && myShiftTimes.has(selected.slot.time));

  // 모달 제어
  const [isChangeOpen, setChangeOpen] = useState(false);
  const openChange = () => setChangeOpen(true);
  const closeChange = () => setChangeOpen(false);

  // (선택) 로딩 상태
  const [submitting, setSubmitting] = useState(false);

  // 내 변경 내역 (더미)
  const myShiftChanges = [
    { original: "김보빈", substitute: "유혁상", status: "승인 완료" },
  ];

  // ✅ 변경 신청 -> 서비스 호출
  const handleSubmitChange = async () => {
    if (!selected?.date || !selected?.slot?.time) {
      alert("날짜와 시간을 먼저 선택해주세요.");
      return;
    }
    try {
      setSubmitting(true);
      await postQuitRequest({
        date: selected.date,
        time: selected.slot.time,
        userName: currentUserName,
      });
      alert("변경 신청이 접수되었습니다.");
      setChangeOpen(false);
    } catch (err) {
      console.error(err);
      alert("변경 신청 중 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAdmin={false} userName={currentUserName} />

      <div className="p-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
            {/* 좌측: 날짜 + 타임슬롯 */}
            <div className="space-y-6">
              <DateCard onDateChange={handleDateChange} />

              <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-2 text-sm text-gray-500">근무 시간</div>
                <div className="mb-6 flex items-center justify-between">
                  <div className="text-gray-600">09:00-22:00</div>
                  <div className="text-3xl font-bold text-blue-600">6시간</div>
                </div>

                <TimeSlotList
                  timeSlots={userTimeSlots}
                  selectedTime={selected?.slot?.time || null}
                  onSelect={(slot) => setSlot(slot)}
                />

                {/* 색상 범례 */}
                <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-500" />
                    내 근무
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-gray-300" />
                    내 근무 아님
                  </div>
                </div>
              </div>
            </div>

            {/* 우측: 안내 패널 + 유저 패널 + 내 변경 내역 */}
            <div className="space-y-6 min-h-[520px]">
              {/* 내 근무시간 안내 */}
              <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                {selected?.slot?.time ? (
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">{selected.slot.time}</span>
                    {isMyShift ? (
                      <>
                        {" "}
                        는 <span className="font-semibold">{currentUserName}</span>
                        님의 <span className="text-green-600">근무시간</span>입니다.
                      </>
                    ) : (
                      <>
                        {" "}
                        는 <span className="font-semibold">{currentUserName}</span>
                        님의 근무시간이 <span className="text-gray-600">아닙니다.</span>
                      </>
                    )}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">좌측에서 시간을 선택하세요.</p>
                )}
              </div>

              {/* 유저 패널 */}
              <UserPanel
                currentStaff={2}
                totalStaff={3}
                timeSlot={selected?.slot?.time || "-"}
                staffList={staffList}
                currentUserName={currentUserName}
                isMyShift={isMyShift}
                onClickChange={openChange}
              />

              {/* 내 변경 내역 */}
              <ShiftChangeList title="근무 변경 내역" changes={myShiftChanges} />
            </div>
          </div>
        </div>

        {/* 플로팅 채널톡 버튼 */}
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
        onClose={() => !submitting && setChangeOpen(false)}
        date={selected?.date || new Date()}
        timeSlot={selected?.slot?.time || ""}
        jobType={selected?.slot?.status === "shortage" ? "신규 상담" : "기존 상담"}
        onSubmit={handleSubmitChange}
        submitting={submitting}
      />
    </div>
  );
}
