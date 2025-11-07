/**
 * GET /schedules API 호출
 * @param {string} date - 조회할 날짜 (YYYY-MM-DD 형식)
 * @returns {Promise<Array>} 스케줄 배열
 */
export async function fetchSchedules(date) {
  try {
    // Next.js rewrites: /api/schedules -> http://ngrok-url/schedules
    const url = `/api/schedules?date=${date}`;
    console.log('API 요청 URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true', // ngrok 경고 페이지 건너뛰기
      },
    });

    console.log('API 응답 상태:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 에러 응답:', errorText);
      throw new Error(`API 요청 실패: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('API 응답 데이터:', data);
    return data;
  } catch (error) {
    console.error('스케줄 조회 실패:', error);
    console.error('에러 상세:', {
      message: error.message,
      stack: error.stack,
    });
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
    // ACTIVE 상태만 근무 가능한 인원으로 카운트
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
  // ...더미 데이터 삭제됨...

  schedules.forEach((schedule) => {
    const hasReplacements = schedule.replacements && schedule.replacements.length > 0;
    const quitStatus = schedule.quitStatus; // ACTIVE, PENDING, INACTIVE

    // 상태 매핑
    // ACTIVE: 확정 근무
    // PENDING: 승인 대기 중 (가능)
    // INACTIVE: 근무 불가
    let status;
    if (quitStatus === 'ACTIVE') {
      status = 'confirmed';
    } else if (quitStatus === 'PENDING') {
      status = 'available';
    } else if (quitStatus === 'INACTIVE') {
      status = 'unavailable';
    } else {
      status = 'unavailable'; // 기본값
    }

    // admins 필드 사용
    staffList.push({
      name: schedule.admins.name,
      type: hasReplacements ? 'new' : 'original',
      status,
      userId: schedule.admins.id,
      email: schedule.admins.email,
      role: schedule.admins.role,
      scheduleId: schedule.id,
      quitStatus: schedule.quitStatus,
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
  // ...더미 데이터 삭제됨...

  schedules.forEach((schedule) => {
    if (schedule.replacements && schedule.replacements.length > 0) {
      schedule.replacements.forEach((replacement) => {
        substitutes.push({
          name: replacement.admins.name,
          status: replacement.permitted ? 'approved' : 'pending',
          userId: replacement.admins.id,
          email: replacement.admins.email,
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
