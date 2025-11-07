// src/utils/date.js

import { format } from "date-fns";
import { ko } from "date-fns/locale";

/**
 * 날짜를 'YYYY.MM.DD.' 형식으로 반환
 */
export function formatDate(date) {
  return format(date, "yyyy.MM.dd.", { locale: ko });
}

/**
 * 날짜를 'YYYY.MM.DD (요일)' 형식으로 반환
 */
export function formatDateWithDay(date) {
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const day = dayNames[date.getDay()];
  return `${formatDate(date)} (${day})`;
}

/**
 * 날짜를 'YYYY-MM-DD' 형식으로 반환 (API 등에서 사용)
 */
export function formatDateDash(date) {
  return format(date, "yyyy-MM-dd", { locale: ko });
}

/**
 * 시간대를 'HH:mm-HH:mm' 형식으로 반환
 * @param {Date} start
 * @param {Date} end
 */
export function formatTimeSlot(start, end) {
  return `${format(start, "HH:mm")}-${format(end, "HH:mm")}`;
}
