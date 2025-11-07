import { useState } from "react";
import ShiftChangeModal from "./ShiftChangeModal";
import useModal from "../../hooks/useModal";

export default function StaffPanel({
  currentStaff,
  totalStaff,
  timeSlot,
  staffList,
  substitutes,
}) {
  const [activeTab, setActiveTab] = useState("confirmed");
  const { isOpen: isModalOpen, open: openModal, close: closeModal, data: selectedStaff } = useModal();


  // candidates를 props로 전달받은 substitutes로 대체
  const candidates = substitutes || [];

  const handleChangeClick = (person) => {
    openModal(person);
  };

  const handleApprove = (person) => {
    alert(`${person.name}님이 대체 근무자로 승인되었습니다.`);
    closeModal();
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <div className="mb-6">
        <div className="text-sm text-gray-500 mb-2">근무 인원</div>
        <div className="text-center mb-4">
          <span className="text-4xl font-bold text-red-500">
            {currentStaff}명
          </span>
          <span className="text-2xl text-gray-400"> / </span>
          <span className="text-4xl font-bold text-red-500">
            {totalStaff}명
          </span>
        </div>
        <div className="text-center text-gray-600 mb-4">{timeSlot}</div>

        {/* 탭 */}
        <div className="flex gap-4 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("confirmed")}
            className={`pb-2 px-1 ${
              activeTab === "confirmed"
                ? "text-black font-semibold border-b-2 border-black"
                : "text-gray-400"
            }`}
          >
            확정
          </button>
          <button
            onClick={() => setActiveTab("available")}
            className={`pb-2 px-1 ${
              activeTab === "available"
                ? "text-black font-semibold border-b-2 border-black"
                : "text-gray-400"
            }`}
          >
            가능
          </button>
          <button
            onClick={() => setActiveTab("unavailable")}
            className={`pb-2 px-1 ${
              activeTab === "unavailable"
                ? "text-black font-semibold border-b-2 border-black"
                : "text-gray-400"
            }`}
          >
            불가
          </button>
        </div>

        {/* 직원 목록 */}
        <div className="space-y-4">
          {staffList
            .filter((person) => person.status === activeTab)
            .map((person, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      person.type === "new" ? "bg-red-500" : "bg-indigo-500"
                    }`}
                  ></div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {person.type === "new" ? "변동 있음" : "변동 없음"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{person.name}</span>
                  {person.type === "new" ? (
                    <button
                      onClick={() => handleChangeClick(person)}
                      className="text-sm text-gray-400 hover:text-gray-600 underline"
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

      {/* ShiftChangeModal: 근무 변경 후보 리스트와 승인 버튼 */}
      {selectedStaff && (
        <ShiftChangeModal
          isOpen={isModalOpen}
          candidates={candidates}
          onApprove={handleApprove}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
