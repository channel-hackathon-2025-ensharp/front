// pages/user/index.js
import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Header from "../../components/common/Header";
import DateCard from "../../components/user/DateCard";
import TimeSlotList from "../../components/user/TimeSlotList";
import UserPanel from "../../components/user/UserPanel";
import ChangeRequestModal from "../../components/user/ChangeRequestModal";
import useSidePanel from "../../hooks/useSidePanel";
import ShiftChangeList from "../../components/admin/ShiftChangeList";
import FloatingChannelTalkButton from "../../components/common/FloatingChannelTalkButton";

import { postQuitRequest } from "../../services/user/scheduleService";
import { isApproved, listApprovals, formatYMD } from "../../services/user/approvalStorage";

export default function UserHome() {
  const { selected, setDate, setSlot } = useSidePanel();
  const currentUserName = "유혁상";

  const handleDateChange = (d) => setDate(d);

  const baseTimeSlots = useMemo(
    () => [
      "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00",
      "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00",
      "17:00-18:00", "18:00-19:00", "19:00-20:00", "20:00-21:00", "21:00-22:00",
    ],
    []
  );

  const myShiftTimes = useMemo(
    () => new Set(["09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00"]),
    []
  );

  const userTimeSlots = useMemo(
    () => baseTimeSlots.map((t) => ({ time: t, status: myShiftTimes.has(t) ? "mine" : "other" })),
    [baseTimeSlots, myShiftTimes]
  );

  const staffList = [
    { name: "김보빈", type: "new", status: "confirmed" },
    { name: "유혁상", type: "exist", status: "confirmed" },
  ];

  const isMyShift = !!(selected?.slot?.time && myShiftTimes.has(selected.slot.time));

  const [isChangeOpen, setChangeOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 승인된 변경 내역 (로컬스토리지 기반)
  const [approvedChanges, setApprovedChanges] = useState([]);

  useEffect(() => {
    if (!selected?.date) return;
    const approvals = listApprovals({ date: selected.date, fromUser: currentUserName });
    const mapped = approvals.map((a) => ({
      original: a.fromUser,
      substitute: a.toUser,
      status: "승인 완료",
      time: a.time,
      date: a.date,
    }));
    setApprovedChanges(mapped);
  }, [selected?.date, currentUserName]);

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

  const approvedForCurrentSlot = selected?.date && selected?.slot?.time
    ? isApproved({
      date: selected.date,
      time: selected.slot.time,
      fromUser: currentUserName,
      toUser: "김보빈",
    })
    : false;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isAdmin={false} userName={currentUserName} />

      <div className="p-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
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

                {approvedForCurrentSlot && (
                  <div className="mt-4 rounded-xl bg-green-50 text-green-700 text-sm px-3 py-2">
                    {formatYMD(selected.date)} {selected?.slot?.time} — 김보빈으로 대타 승인 완료
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6 min-h-[520px]">
              <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                {selected?.slot?.time ? (
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">{selected.slot.time}</span>
                    {isMyShift ? (
                      <> 는 <span className="font-semibold">{currentUserName}</span>님의 <span className="text-green-600">근무시간</span>입니다.</>
                    ) : (
                      <> 는 <span className="font-semibold">{currentUserName}</span>님의 근무시간이 <span className="text-gray-600">아닙니다.</span></>
                    )}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">좌측에서 시간을 선택하세요.</p>
                )}
              </div>

              <UserPanel
                currentStaff={2}
                totalStaff={3}
                timeSlot={selected?.slot?.time || "-"}
                staffList={[
                  { name: "김보빈", type: "new", status: "confirmed" },
                  { name: "유혁상", type: "exist", status: "confirmed" },
                ]}
                currentUserName={currentUserName}
                isMyShift={isMyShift}
                onClickChange={() => setChangeOpen(true)}
              />

              {approvedChanges.length > 0 ? (
                <ShiftChangeList
                  title="근무 변경 내역"
                  changes={approvedChanges.map((c) => ({
                    original: c.original,
                    substitute: c.substitute,
                    status: c.status,
                  }))}
                />
              ) : (
                <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm text-sm text-gray-500">
                  승인된 변경 내역이 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>

        <FloatingChannelTalkButton />
      </div>

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
