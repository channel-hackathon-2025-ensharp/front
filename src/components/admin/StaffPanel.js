// components/admin/StaffPanel.js
import { useState } from "react";
import ShiftChangeModal from "./ShiftChangeModal";
import useModal from "../../hooks/useModal";
import { saveApproval } from "../../services/user/approvalStorage";
import { postAccept } from "../../services/user/scheduleService";

/**
 * StaffPanel
 *
 * props:
 * - currentStaff: number
 * - totalStaff: number
 * - timeSlot: string               // "12:00-13:00"
 * - date: Date | string            // Date 객체 또는 "YYYY-MM-DD"
 * - staffList: Array<{name,type,status}>
 * - substitutes: Array<{name:string}>
 * - requestorName: string          // 대타 신청자 (기본: "유혁상")
 * - onApproved?: ({date,time,fromUser,toUser}) => void
 */
export default function StaffPanel({
  currentStaff,
  totalStaff,
  timeSlot,
  date,
  staffList,
  substitutes = [],
  requestorName = "유혁상",
  onApproved,
}) {
  const [activeTab, setActiveTab] = useState("confirmed");
  const { isOpen, open, close } = useModal();
  const [approving, setApproving] = useState(false);

  const handleChangeClick = () => {
    open(true); // "변경하기" → 모달 오픈
  };

  const handleApprove = async (candidate) => {
    if (!timeSlot || !date) {
      alert("날짜 또는 시간 정보가 없습니다. 좌측에서 시간을 먼저 선택하세요.");
      return;
    }

    try {
      setApproving(true);

      // 1) 로컬 저장 (승인 내역)
      saveApproval({
        date,
        time: timeSlot,
        fromUser: requestorName,   // 신청자
        toUser: candidate.name,    // 승인자(대타)
      });

      // 2) 서버로 승인 통지
      await postAccept({
        appliedUserName: requestorName,
        accepterUserName: candidate.name,
        date,
        time: timeSlot,
      });

      // 3) 상위 콜백 알림
      if (typeof onApproved === "function") {
        onApproved({
          date,
          time: timeSlot,
          fromUser: requestorName,
          toUser: candidate.name,
        });
      }

      alert(`대타 승인: ${requestorName} → ${candidate.name} (${timeSlot})`);
      close();
    } catch (e) {
      console.error("Approve failed:", e);
      alert("승인 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setApproving(false);
    }
  };

  return (
    <div
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
      style={{ height: 680, minHeight: 680 }}
    >
      <div className="mb-6">
        <div className="text-sm text-gray-500 mb-2">근무 인원</div>
        <div className="text-center mb-4">
          <span className="text-4xl font-bold text-red-500">{currentStaff}명</span>
          <span className="text-2xl text-gray-400"> / </span>
          <span className="text-4xl font-bold text-red-500">{totalStaff}명</span>
        </div>
        <div className="text-center text-gray-600 mb-4">
          {timeSlot || "시간대를 선택하세요"}
        </div>

        {/* 탭 */}
        <div className="flex gap-4 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("confirmed")}
            className={`pb-2 px-1 ${activeTab === "confirmed"
                ? "text-black font-semibold border-b-2 border-black"
                : "text-gray-400"
              }`}
          >
            확정
          </button>
          <button
            onClick={() => setActiveTab("available")}
            className={`pb-2 px-1 ${activeTab === "available"
                ? "text-black font-semibold border-b-2 border-black"
                : "text-gray-400"
              }`}
          >
            가능
          </button>
          <button
            onClick={() => setActiveTab("unavailable")}
            className={`pb-2 px-1 ${activeTab === "unavailable"
                ? "text-black font-semibold border-b-2 border-black"
                : "text-gray-400"
              }`}
          >
            불가
          </button>
        </div>

        {/* 직원 목록 */}
        <div className="space-y-4 overflow-y-auto" style={{ maxHeight: 350 }}>
          {staffList
            .filter((p) => p.status === activeTab)
            .map((person, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${person.type === "new" ? "bg-red-500" : "bg-indigo-500"
                      }`}
                  />
                  <span className="text-sm text-gray-500">
                    {person.type === "new" ? "변동 있음" : "변동 없음"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{person.name}</span>
                  {person.type === "new" ? (
                    <button
                      onClick={handleChangeClick}
                      className="text-sm text-gray-600 hover:text-black underline disabled:opacity-50"
                      disabled={approving}
                    >
                      변경하기
                    </button>
                  ) : (
                    <button
                      className="text-sm text-gray-300 cursor-not-allowed underline"
                      disabled
                    >
                      변경불가
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* 모달: 후보자 목록 + 승인 버튼 */}
      <ShiftChangeModal
        isOpen={isOpen}
        candidates={substitutes}
        onApprove={handleApprove}
        onClose={close}
      />
    </div>
  );
}
