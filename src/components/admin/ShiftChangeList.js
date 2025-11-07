import React, { useState } from "react";

export default function ShiftChangeList() {
  const [changes, setChanges] = useState([]);

  // 테스트용: 승인 버튼 클릭 시 더미 데이터 추가
  const handleDummyApprove = () => {
    setChanges((prev) => [
      ...prev,
      {
        original: "유혁상",
        substitute: "김보빈",
        status: "승인 완료",
      },
    ]);
  };

  return (
    <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      <h3 className="font-semibold mb-2 text-sm text-gray-700">근무 변경 내역</h3>
      {changes && changes.length > 0 && (
        <ul className="space-y-2">
          {changes.map((change, idx) => (
            <li key={idx} className="text-sm text-gray-800">
              <b>{change.original}</b> → <b>{change.substitute}</b>님이 대신 근무 (상태: {change.status})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
