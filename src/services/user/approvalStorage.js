// services/user/approvalStorage.js
const KEY_PREFIX = "shiftApproval";

// ⬇️ 플래그는 prefix 밖(지우지 않을 키)으로 둔다
const INIT_VERSION = "v1";
const INIT_FLAG_KEY = `__app_init__:${KEY_PREFIX}:${INIT_VERSION}`;

function hasWindow() {
    return typeof window !== "undefined";
}

function buildKey({ dateYmd, time, fromUser, toUser }) {
    return `${KEY_PREFIX}:${dateYmd}:${time}:${fromUser}->${toUser}`;
}

export function formatYMD(date) {
    const d = typeof date === "string" ? new Date(date) : date;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

/** 네임스페이스(shiftApproval:)만 정밀 삭제 */
export function clearApprovalNamespace() {
    if (!hasWindow()) return;
    const prefix = KEY_PREFIX + ":";
    const rm = [];
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) rm.push(k);
    }
    rm.forEach((k) => localStorage.removeItem(k));
}

/** 최초 1회만 초기화 */
export function initApprovalsOnce() {
    if (!hasWindow()) return false;
    if (localStorage.getItem(INIT_FLAG_KEY)) return false; // 이미 초기화됨
    clearApprovalNamespace();                               // 네임스페이스만 삭제
    localStorage.setItem(INIT_FLAG_KEY, new Date().toISOString());
    return true;
}

export function saveApproval({ date, time, fromUser, toUser }) {
    if (!hasWindow()) return false;
    const dateYmd = formatYMD(date);
    const key = buildKey({ dateYmd, time, fromUser, toUser });
    const payload = { date: dateYmd, time, fromUser, toUser, approvedAt: new Date().toISOString() };
    localStorage.setItem(key, JSON.stringify(payload));
    return true;
}

export function isApproved({ date, time, fromUser, toUser }) {
    if (!hasWindow()) return false;
    const dateYmd = formatYMD(date);
    const key = buildKey({ dateYmd, time, fromUser, toUser });
    return !!localStorage.getItem(key);
}

export function listApprovals({ date, fromUser }) {
    if (!hasWindow()) return [];
    const dateYmd = formatYMD(date);
    const prefix = `${KEY_PREFIX}:${dateYmd}:`;
    const results = [];
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k || !k.startsWith(prefix)) continue;
        try {
            const v = localStorage.getItem(k);
            if (!v) continue;
            const obj = JSON.parse(v);
            if (obj.fromUser === fromUser) results.push(obj);
        } catch { }
    }
    return results.sort((a, b) => (a.time > b.time ? 1 : -1));
}

/** (옵션) 완전 삭제가 필요할 때만 사용 */
export function clearAllApprovals() {
    if (!hasWindow()) return;
    const prefix = KEY_PREFIX + ":";
    const rm = [];
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(prefix)) rm.push(k);
    }
    rm.forEach((k) => localStorage.removeItem(k));
}
