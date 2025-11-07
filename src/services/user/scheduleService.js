// services/user/scheduleService.js
import http from "../http";

function formatYMD(date) {
    const d = typeof date === "string" ? new Date(date) : date;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

export async function postQuitRequest({ date, time, userName }) {
    const body = { date: formatYMD(date), time, userName };
    console.log("[POST] /schedules/quit-requests payload =>", body); // ✅ 임시 확인용
    const { data } = await http.post("/schedules/quit-requests", body);
    return data ?? {};
}
