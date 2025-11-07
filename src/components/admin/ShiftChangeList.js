import React from "react";

export default function ShiftChangeList({ changes }) {
  if (!changes || changes.length === 0) return null;
  return (
    <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      <h3 className="font-semibold mb-2 text-sm text-gray-700">근무 변경 내역</h3>
      <ul className="space-y-2">
        {changes.map((change, idx) => (
          <li key={idx} className="text-sm text-gray-800">
            <b>{change.original}</b> → <b>{change.substitute}</b>님이 대신 근무 (상태: {change.status})
          </li>
        ))}
      </ul>
    </div>
  );
}
