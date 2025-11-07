// components/admin/ShiftChangeModal.js
import React from "react";

export default function ShiftChangeModal({ isOpen, candidates, onApprove, onClose }) {
  if (!isOpen || !candidates || candidates.length === 0) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 min-w-[320px]">
        <h2 className="text-lg font-bold mb-4">대체 근무자 선택</h2>
        <ul className="space-y-3 mb-4">
          {candidates.map((person, idx) => (
            <li key={idx} className="flex items-center justify-between">
              <span className="font-medium">{person.name}</span>
              <button
                className="px-3 py-1 bg-violet-500 text-white rounded hover:bg-violet-600 text-sm"
                onClick={() => onApprove(person)}
              >
                승인
              </button>
            </li>
          ))}
        </ul>
        <button className="w-full py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}
