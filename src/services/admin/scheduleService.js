const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * GET /schedules API 호출
 * @param {string} date - 조회할 날짜 (YYYY-MM-DD 형식)
 * @returns {Promise<Array>} 스케줄 배열
 */
export async function fetchSchedules(date) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/schedules?date=${date}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('스케줄 조회 실패:', error);
    throw error;
  }
}

/**
 * 시간별로 스케줄 데이터를 그룹화
 * @param {Array} schedules - API 응답 스케줄 배열
 * @returns {Object} 시간별로 그룹화된 스케줄 { "09:00": [...], "10:00": [...] }
 */
export function groupSchedulesByTime(schedules) {
  const grouped = {};

  schedules.forEach((schedule) => {
    const { hour, minute } = schedule.time;
    const timeKey = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

    if (!grouped[timeKey]) {
      grouped[timeKey] = [];
    }

    grouped[timeKey].push(schedule);
  });

  return grouped;
}

/**
 * 타임라인 카드용 timeSlots 데이터 생성
 * @param {Array} schedules - API 응답 스케줄 배열
 * @param {number} requiredStaffPerSlot - 시간대별 필요 인원 수
 * @returns {Array} timeSlots 배열
 */
export function transformToTimeSlots(schedules, requiredStaffPerSlot = 3) {
  const grouped = groupSchedulesByTime(schedules);
  const timeSlots = [];

  // 모든 시간대 추출 및 정렬
  const allTimes = Object.keys(grouped).sort();

  allTimes.forEach((time) => {
    const scheduleGroup = grouped[time];
    const activeSchedules = scheduleGroup.filter(
      (s) => s.quitStatus === 'ACTIVE'
    );
    const currentStaff = activeSchedules.length;

    let status;
    if (currentStaff === 0) {
      status = 'empty';
    } else if (currentStaff < requiredStaffPerSlot) {
      status = 'shortage';
    } else {
      status = 'normal';
    }

    timeSlots.push({
      time,
      status,
      currentStaff,
      requiredStaff: requiredStaffPerSlot,
    });
  });

  return timeSlots;
}

/**
 * StaffPanel용 직원 목록 데이터 생성
 * @param {Array} schedules - 특정 시간대의 스케줄 배열
 * @returns {Array} staff 배열 (confirmed, available, unavailable)
 */
export function transformToStaffList(schedules) {
  const staffList = [];

  schedules.forEach((schedule) => {
    const hasReplacements = schedule.replacements && schedule.replacements.length > 0;
    const isActive = schedule.quitStatus === 'ACTIVE';

    let status;
    if (isActive) {
      status = 'confirmed';
    } else if (hasReplacements) {
      status = 'available';
    } else {
      status = 'unavailable';
    }

    staffList.push({
      name: schedule.user.name,
      type: hasReplacements ? 'new' : 'original',
      status,
      userId: schedule.user.id,
      email: schedule.user.email,
      role: schedule.user.role,
      scheduleId: schedule.id,
    });
  });

  return staffList;
}

/**
 * 대체 근무자 목록 생성
 * @param {Array} schedules - 특정 시간대의 스케줄 배열
 * @returns {Array} substitutes 배열
 */
export function transformToSubstitutes(schedules) {
  const substitutes = [];

  schedules.forEach((schedule) => {
    if (schedule.replacements && schedule.replacements.length > 0) {
      schedule.replacements.forEach((replacement) => {
        substitutes.push({
          name: replacement.user.name,
          status: replacement.permitted ? 'approved' : 'pending',
          userId: replacement.user.id,
          email: replacement.user.email,
          replacementId: replacement.id,
          originalScheduleId: schedule.id,
        });
      });
    }
  });

  return substitutes;
}

/**
 * 근무 시간 계산 (전체 타임슬롯 기준)
 * @param {Array} timeSlots - transformToTimeSlots로 생성된 배열
 * @returns {Object} { startTime, endTime, totalHours }
 */
export function calculateWorkingHours(timeSlots) {
  if (timeSlots.length === 0) {
    return {
      startTime: '00:00',
      endTime: '00:00',
      totalHours: 0,
    };
  }

  const startTime = timeSlots[0].time;
  const lastSlot = timeSlots[timeSlots.length - 1];

  // 마지막 슬롯의 시간에 1시간 추가 (종료 시간)
  const [lastHour, lastMinute] = lastSlot.time.split(':').map(Number);
  const endHour = (lastHour + 1) % 24;
  const endTime = `${String(endHour).padStart(2, '0')}:${String(lastMinute).padStart(2, '0')}`;

  const totalHours = timeSlots.length;

  return {
    startTime,
    endTime,
    totalHours,
  };
}

/**
 * 특정 날짜의 현재/필요 인원 수 계산
 * @param {Array} schedules - API 응답 스케줄 배열
 * @param {number} requiredStaffPerSlot - 시간대별 필요 인원 수
 * @returns {Object} { currentStaff, totalStaff }
 */
export function calculateStaffCount(schedules, requiredStaffPerSlot = 3) {
  const activeSchedules = schedules.filter(
    (s) => s.quitStatus === 'ACTIVE'
  );

  const grouped = groupSchedulesByTime(schedules);
  const totalSlots = Object.keys(grouped).length;

  return {
    currentStaff: activeSchedules.length,
    totalStaff: totalSlots * requiredStaffPerSlot,
  };
}

/**
 * 특정 시간대의 스케줄 필터링
 * @param {Array} schedules - API 응답 스케줄 배열
 * @param {string} timeSlot - 시간대 (예: "12:00")
 * @returns {Array} 해당 시간대의 스케줄 배열
 */
export function filterSchedulesByTime(schedules, timeSlot) {
  const [targetHour, targetMinute] = timeSlot.split(':').map(Number);

  return schedules.filter((schedule) => {
    const { hour, minute } = schedule.time;
    return hour === targetHour && minute === targetMinute;
  });
}
