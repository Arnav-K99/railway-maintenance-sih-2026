/**
 * Dynamic 1-Week Horizon Date & Time Helpers
 * Distributes tasks and possessions across the 7-day operational window (Mon 03 Sep - Sun 09 Sep)
 */

export const PLANNING_HORIZON_DAYS = [
  { dayIndex: 0, dayName: 'Monday', shortDay: 'Mon', date: '03 Sep', fullDate: '2026-09-03' },
  { dayIndex: 1, dayName: 'Tuesday', shortDay: 'Tue', date: '04 Sep', fullDate: '2026-09-04' },
  { dayIndex: 2, dayName: 'Wednesday', shortDay: 'Wed', date: '05 Sep', fullDate: '2026-09-05' },
  { dayIndex: 3, dayName: 'Thursday', shortDay: 'Thu', date: '06 Sep', fullDate: '2026-09-06' },
  { dayIndex: 4, dayName: 'Friday', shortDay: 'Fri', date: '07 Sep', fullDate: '2026-09-07' },
  { dayIndex: 5, dayName: 'Saturday', shortDay: 'Sat', date: '08 Sep', fullDate: '2026-09-08' },
  { dayIndex: 6, dayName: 'Sunday', shortDay: 'Sun', date: '09 Sep', fullDate: '2026-09-09' },
];

/**
 * Returns a deterministic day object for a task index or task ID
 */
export const getTaskHorizonDay = (taskOrId, index = 0) => {
  let hash = index;
  if (typeof taskOrId === 'string') {
    const num = parseInt(taskOrId.replace(/\D/g, ''), 10);
    if (!isNaN(num)) hash = num;
  } else if (taskOrId?.task_id || taskOrId?.taskId) {
    const id = taskOrId.task_id || taskOrId.taskId;
    const num = parseInt(id.replace(/\D/g, ''), 10);
    if (!isNaN(num)) hash = num;
  }
  const dayObj = PLANNING_HORIZON_DAYS[Math.abs(hash) % PLANNING_HORIZON_DAYS.length];
  return dayObj;
};

/**
 * Convert minute offset (0-1440) to clean HH:MM string
 */
export const minutesToTimeString = (minutes) => {
  if (minutes === undefined || minutes === null) return '02:00';
  const totalMins = Math.max(0, minutes % 1440);
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

/**
 * Generates dynamic realistic time window (e.g. "01:30 – 04:45")
 */
export const getTaskTimeWindow = (startMin, durationMin, defaultFallback = '01:00 – 03:30') => {
  if (startMin !== undefined && durationMin !== undefined) {
    const endMin = (startMin + durationMin) % 1440;
    return `${minutesToTimeString(startMin)} – ${minutesToTimeString(endMin)}`;
  }
  return defaultFallback;
};
