import { create } from 'zustand';
import {
  fetchSchedules,
  transformToTimeSlots,
  transformToStaffList,
  transformToSubstitutes,
  calculateWorkingHours,
  calculateStaffCount,
  filterSchedulesByTime,
} from '../services/admin/scheduleService';

/**
 * 스케줄 관리를 위한 Zustand 스토어
 */
const useScheduleStore = create((set, get) => ({
  // 상태
  selectedDate: new Date(),
  rawSchedules: [], // API로부터 받은 원본 데이터
  timeSlots: [], // TimelineCard용 데이터
  workingHours: { startTime: '00:00', endTime: '00:00', totalHours: 0 },
  staffCount: { currentStaff: 0, totalStaff: 0 },
  selectedTimeSlot: null, // 선택된 시간대
  isLoading: false,
  error: null,

  // 액션: 날짜 선택
  setSelectedDate: (date) => {
    set({ selectedDate: date });
    get().loadSchedules(date);
  },

  // 액션: 시간대 선택
  setSelectedTimeSlot: (timeSlot) => {
    set({ selectedTimeSlot: timeSlot });
  },

  // 액션: 스케줄 데이터 로드
  loadSchedules: async (date) => {
    set({ isLoading: true, error: null });

    try {
      // 날짜를 YYYY-MM-DD 형식으로 변환 (로컬 타임존 사용)
      let dateStr;
      if (date instanceof Date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        dateStr = `${year}-${month}-${day}`;
      } else {
        dateStr = date;
      }

      // API 호출
      const schedules = await fetchSchedules(dateStr);

      // 데이터 변환
      const timeSlots = transformToTimeSlots(schedules);
      const workingHours = calculateWorkingHours(timeSlots);
      const staffCount = calculateStaffCount(schedules);

      set({
        rawSchedules: schedules,
        timeSlots,
        workingHours,
        staffCount,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },

  // 셀렉터: 선택된 시간대의 직원 목록
  getStaffListForSelectedTime: () => {
    const { rawSchedules, selectedTimeSlot } = get();

    if (!selectedTimeSlot || rawSchedules.length === 0) {
      return [];
    }

    const filtered = filterSchedulesByTime(rawSchedules, selectedTimeSlot);
    return transformToStaffList(filtered);
  },

  // 셀렉터: 선택된 시간대의 대체 근무자 목록
  getSubstitutesForSelectedTime: () => {
    const { rawSchedules, selectedTimeSlot } = get();

    if (!selectedTimeSlot || rawSchedules.length === 0) {
      return [];
    }

    const filtered = filterSchedulesByTime(rawSchedules, selectedTimeSlot);
    return transformToSubstitutes(filtered);
  },

  // 셀렉터: 선택된 시간대의 인원 수
  getStaffCountForSelectedTime: () => {
    const { rawSchedules, selectedTimeSlot } = get();

    if (!selectedTimeSlot || rawSchedules.length === 0) {
      return { currentStaff: 0, totalStaff: 0 };
    }

    const filtered = filterSchedulesByTime(rawSchedules, selectedTimeSlot);
    return calculateStaffCount(filtered);
  },

  // 액션: 초기화
  reset: () => {
    set({
      selectedDate: new Date(),
      rawSchedules: [],
      timeSlots: [],
      workingHours: { startTime: '00:00', endTime: '00:00', totalHours: 0 },
      staffCount: { currentStaff: 0, totalStaff: 0 },
      selectedTimeSlot: null,
      isLoading: false,
      error: null,
    });
  },
}));

export default useScheduleStore;
