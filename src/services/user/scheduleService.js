
import http from "../http";

/** 날짜 객체 또는 'YYYY-MM-DD' 문자열 -> 'YYYY-MM-DD' */
export function toDateParam(d) {
    if (!d) return "";
    if (typeof d === "string") return d;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

/** 서버 time {hour,minute} -> "HH:MM-HH+1:MM" (1시간 단위 가정) */
export function toTimeRange(t) {
    const startH = t?.hour ?? 0;
    const startM = t?.minute ?? 0;
    const endH = (startH + 1) % 24;
    const z = (n) => String(n).padStart(2, "0");
    return `${z(startH)}:${z(startM)}-${z(endH)}:${z(startM)}`;
}

/**
 * 1) 스케줄 조회
 * GET /schedules?date=YYYY-MM-DD
 * 반환: 원본 배열
 */
export async function fetchSchedulesByDate(date) {
    const { data } = await http.get("/schedules", {
        params: { date: toDateParam(date) },
        headers: { Accept: "*/*" },
    });
    return data || [];
}

/**
 * 2) 대타(퇴근) 신청
 * POST /schedules/{scheduleId}/quit-requests
 */
export async function requestQuit(scheduleId) {
    const { data } = await http.post(`/schedules/${scheduleId}/quit-requests`);
    return data;
}

/**
 * 3) 내 스케줄만 파싱
 * - schedules: fetchSchedulesByDate 결과
 * - currentUserName: "김보빈" 등
 * - mineWhen: quitStatus가 ACTIVE 또는 PENDING이면 '내 근무'로 취급
 *   (INACTIVE이면 대타 완료로 '내 근무 아님')
 *
 * 결과:
 * - myTimes: Set<string> (예: "09:00-10:00")
 * - byTime: Map<timeRange, { items: Array<{ name, quitStatus, isPermitted, scheduleId, replacementName? }> }>
 */
export function parseUserSchedules(schedules, currentUserName) {
    const myTimes = new Set();
    const byTime = new Map();

    for (const row of schedules) {
        const timeRange = toTimeRange(row.time);
        const name = row?.user?.name ?? "";
        const quitStatus = row?.quitStatus ?? "ACTIVE";
        const scheduleId = row?.id;
        const replacements = Array.isArray(row?.replacements) ? row.replacements : [];

        // 시간별 그룹
        if (!byTime.has(timeRange)) byTime.set(timeRange, { items: [] });

        // 기본 엔트리(원 배정자)
        const entry = {
            name,
            quitStatus,           // ACTIVE | PENDING | INACTIVE
            isPermitted: false,   // 기본 false (대타가 승인되어 들어온 사람일 때 true)
            scheduleId,
        };

        // 내 근무 판단: INACTIVE는 '완료'로 간주 → 내 근무 아님
        if (name === currentUserName && quitStatus !== "INACTIVE") {
            myTimes.add(timeRange);
        }

        // 대타 완료 케이스: 원 배정자가 INACTIVE이고, replacements[0]가 대타자 이름이라고 가정
        // (요구사항 5: is_permitted=true인 사람을 패널에 띄움)
        if (quitStatus === "INACTIVE" && replacements.length > 0) {
            const repName = String(replacements[0]);
            // 패널 표시용으로 '대타 승인자' 엔트리를 추가
            byTime.get(timeRange).items.push({
                name: repName,
                quitStatus: "ACTIVE",
                isPermitted: true,
                scheduleId: null,
                replacementName: name, // 누굴 대체했는지 기록(옵션)
            });
            // 원 배정자는 패널에서 숨기고 싶으면 추가하지 않음
            continue;
        }

        byTime.get(timeRange).items.push(entry);
    }

    return { myTimes, byTime };
}
