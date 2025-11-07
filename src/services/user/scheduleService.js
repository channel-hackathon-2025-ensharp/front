// services/user/scheduleService.js
import http from "../http";

function formatYMD(date) {
    const d = typeof date === "string" ? new Date(date) : date;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

/** 변경 신청 POST (/schedules/quit-requests) */
export async function postQuitRequest({ date, time, userName }) {
    const body = { date: formatYMD(date), time, userName };
    console.log("[POST] /schedules/quit-requests payload =>", body);
    const { data } = await http.post("/schedules/quit-requests", body);
    return data ?? {};
}

/** ✅ 대타 승인 POST (/accept)
 *  payload spec:
 *  {
 *    appliedUserName: "신청자",   // 예: "유혁상"
 *    accepterUserName: "승인자",   // 예: "김보빈"
 *    date: "YYYY-MM-DD",
 *    time: "HH:MM-HH:MM"
 *  }
 */
export async function postAccept({ appliedUserName, accepterUserName, date, time }) {
    const body = {
        appliedUserName,
        accepterUserName,
        date: formatYMD(date),
        time,
    };
    console.log("[POST] /accept payload =>", body);
    const { data } = await http.post("/accept", body);
    return data ?? {};
}
