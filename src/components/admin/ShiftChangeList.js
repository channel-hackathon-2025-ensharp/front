// components/admin/ShiftChangeList.jsx
import React from "react";

/**
 * @param {{ title?: string, changes: Array<{original:string, substitute:string, status:string, time?:string, date?:string}> }} props
 */
export default function ShiftChangeList({ title = "근무 변경 내역", changes = [] }) {
  return (
    <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      <h3 className="font-semibold mb-2 text-sm text-gray-700">{title}</h3>

      {changes.length > 0 ? (
        <ul className="space-y-2">
          {changes.map((c, idx) => (
            <li key={idx} className="text-sm text-gray-800">
              <b>{c.original}</b> → <b>{c.substitute}</b>님이 대신 근무
              {c.time ? <> (<span className="text-gray-600">{c.time}</span>)</> : null}
              {c.status ? <> — <span className="text-green-700">{c.status}</span></> : null}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-sm text-gray-500">변경 내역이 없습니다.</div>
      )}
    </div>
  );
}
