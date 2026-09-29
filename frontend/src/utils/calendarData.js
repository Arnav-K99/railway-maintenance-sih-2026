/**
 * Comprehensive Railway Maintenance Calendar Data Engine
 * Supports:
 * - Current real-time dynamic week (with hero task TASK-000005 replan logic)
 * - Arbitrary weeks & past/future months with deterministic, realistic maintenance possessions
 * - Full monthly and weekly view queries
 */

import { PLANNING_HORIZON_DAYS, getHeroDates, getMaxFutureDate } from './dateUtils.js';

// Standard 2-Hour Time Slots across 24h operational cycle
export const TIME_SLOTS = [
  { id: '00-02', label: '00:00 – 02:00' },
  { id: '02-04', label: '02:00 – 04:00' },
  { id: '04-06', label: '04:00 – 06:00' },
  { id: '06-08', label: '06:00 – 08:00' },
  { id: '08-10', label: '08:00 – 10:00' },
  { id: '10-12', label: '10:00 – 12:00' },
  { id: '12-14', label: '12:00 – 14:00' },
  { id: '14-16', label: '14:00 – 16:00' },
  { id: '16-18', label: '16:00 – 18:00' },
  { id: '18-20', label: '18:00 – 20:00' },
  { id: '20-22', label: '20:00 – 22:00' },
  { id: '22-00', label: '22:00 – 00:00' },
];

// Expanded repertoire of realistic railway maintenance work across all disciplines
export const MAINTENANCE_CATALOG = [
  // 1. Safety-Critical Track & Breaches (Critical Crimson Red)
  {
    type: 'Rail Grinding & Head Profile Restoration',
    shortType: 'Rail Grinding',
    dept: 'Track / Civil Engineering',
    risk: 'CRITICAL',
    category: 'critical',
    defaultDuration: '00:00 – 03:20',
    preferredSlot: '00-02',
  },
  {
    type: 'Turnout Switch Rail & Stock Rail Replacement',
    shortType: 'Switch Rail Swap',
    dept: 'Track / Civil Engineering',
    risk: 'CRITICAL',
    category: 'critical',
    defaultDuration: '01:00 – 03:45',
    preferredSlot: '00-02',
  },
  {
    type: 'S&T Electronic Interlocking Microprocessor Test',
    shortType: 'Interlocking Overhaul',
    dept: 'Signal & Telecommunications',
    risk: 'CRITICAL',
    category: 'critical',
    defaultDuration: '14:00 – 16:30',
    preferredSlot: '14-16',
  },

  // 2. High-Priority Predictive Maintenance (Warm Golden Amber)
  {
    type: 'Track Ultrasonic Testing & Weld Scan (USFD)',
    shortType: 'Ultrasonic Testing',
    dept: 'Safety & Inspection',
    risk: 'HIGH',
    category: 'high',
    defaultDuration: '02:00 – 04:30',
    preferredSlot: '02-04',
  },
  {
    type: 'Continuous Welded Rail (CWR) Restressing',
    shortType: 'CWR Restressing',
    dept: 'Track / Civil Engineering',
    risk: 'HIGH',
    category: 'high',
    defaultDuration: '18:00 – 20:30',
    preferredSlot: '18-20',
  },
  {
    type: 'Traction Substation 25kV Circuit Breaker Overhaul',
    shortType: 'Substation Overhaul',
    dept: 'Electrical / TRD',
    risk: 'HIGH',
    category: 'high',
    defaultDuration: '00:30 – 02:45',
    preferredSlot: '00-02',
  },
  {
    type: 'Diamond Crossing Reconditioning & Build-up',
    shortType: 'Diamond Crossing',
    dept: 'Track / Civil Engineering',
    risk: 'HIGH',
    category: 'high',
    defaultDuration: '04:00 – 06:15',
    preferredSlot: '04-06',
  },

  // 3. Electrical & Traction Distribution (Royal Azure Blue)
  {
    type: 'OHE Catenary Wire Re-tensioning',
    shortType: 'OHE Tensioning',
    dept: 'Electrical / TRD',
    risk: 'MODERATE',
    category: 'electrical',
    defaultDuration: '00:30 – 02:30',
    preferredSlot: '00-02',
  },
  {
    type: 'OHE Isolator Switch Replacement & Drop Arm',
    shortType: 'OHE Isolator Test',
    dept: 'Electrical / TRD',
    risk: 'MODERATE',
    category: 'electrical',
    defaultDuration: '12:00 – 14:00',
    preferredSlot: '12-14',
  },
  {
    type: 'OHE Contact Wire Stagger & Height Calibration',
    shortType: 'Contact Wire Stagger',
    dept: 'Electrical / TRD',
    risk: 'MODERATE',
    category: 'electrical',
    defaultDuration: '06:00 – 08:30',
    preferredSlot: '06-08',
  },
  {
    type: 'Neutral Section Porcelain Insulator Pressure Wash',
    shortType: 'Insulator Wash',
    dept: 'Electrical / TRD',
    risk: 'LOW',
    category: 'electrical',
    defaultDuration: '10:00 – 12:00',
    preferredSlot: '10-12',
  },

  // 4. Signal & Telecommunications (Vibrant Purple)
  {
    type: 'Signal Point Machine Servicing & Motor Lock',
    shortType: 'Point Machine Service',
    dept: 'Signal & Telecommunications',
    risk: 'MODERATE',
    category: 'signal',
    defaultDuration: '10:00 – 12:00',
    preferredSlot: '10-12',
  },
  {
    type: 'Track Circuit Bond Wire Replacement',
    shortType: 'Track Circuit Bond',
    dept: 'Signal & Telecommunications',
    risk: 'MODERATE',
    category: 'signal',
    defaultDuration: '14:00 – 16:30',
    preferredSlot: '14-16',
  },
  {
    type: 'Multi-Section Digital Axle Counter Tuning',
    shortType: 'Axle Counter Tuning',
    dept: 'Signal & Telecommunications',
    risk: 'MODERATE',
    category: 'signal',
    defaultDuration: '02:00 – 04:00',
    preferredSlot: '02-04',
  },
  {
    type: 'Automatic Colour Light Signalling Alignment',
    shortType: 'Signal Optical Align',
    dept: 'Signal & Telecommunications',
    risk: 'LOW',
    category: 'signal',
    defaultDuration: '16:00 – 18:00',
    preferredSlot: '16-18',
  },

  // 5. Track / Civil Engineering (Deep Slate Teal)
  {
    type: 'Ballast Tamp Gang & Dynamic Track Leveling',
    shortType: 'Ballast Tamping',
    dept: 'Track / Civil Engineering',
    risk: 'MODERATE',
    category: 'civil',
    defaultDuration: '04:00 – 06:00',
    preferredSlot: '04-06',
  },
  {
    type: 'Curved Track Realignment & Gauge Tie Fastening',
    shortType: 'Track Realignment',
    dept: 'Track / Civil Engineering',
    risk: 'MODERATE',
    category: 'civil',
    defaultDuration: '01:00 – 04:00',
    preferredSlot: '02-04',
  },
  {
    type: 'Deep Ballast Shoulder Screening & Cleaning',
    shortType: 'Ballast Screening',
    dept: 'Track / Civil Engineering',
    risk: 'LOW',
    category: 'civil',
    defaultDuration: '08:00 – 10:00',
    preferredSlot: '08-10',
  },

  // 6. Mechanical & Rolling Stock (Deep Indigo)
  {
    type: 'Axle Detector Sensor Calibration & Telemetry',
    shortType: 'Axle Detector Scan',
    dept: 'Mechanical / Rolling Stock',
    risk: 'LOW',
    category: 'mechanical',
    defaultDuration: '02:00 – 04:00',
    preferredSlot: '02-04',
  },
  {
    type: 'Wheel Impact Load Detector (WILD) Dynamic Scan',
    shortType: 'WILD Sensor Scan',
    dept: 'Mechanical / Rolling Stock',
    risk: 'LOW',
    category: 'mechanical',
    defaultDuration: '12:00 – 14:00',
    preferredSlot: '12-14',
  },
  {
    type: 'Wheel Lathe Profile & Flange Contour Turning',
    shortType: 'Wheel Lathe Turning',
    dept: 'Mechanical / Rolling Stock',
    risk: 'LOW',
    category: 'mechanical',
    defaultDuration: '18:00 – 20:30',
    preferredSlot: '18-20',
  },
];

const SECTIONS = ['SEC-0001', 'SEC-0002', 'SEC-0003', 'SEC-0004', 'SEC-0005', 'SEC-0007', 'SEC-0009', 'SEC-0012', 'SEC-0014'];

// Simple deterministic hash from string to integer
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Returns the authoritative blocks for the active current week (including hero replanning)
 */
export function getAuthoritativeCurrentWeekBlocks(isReplanned) {
  const days = PLANNING_HORIZON_DAYS;
  const heroDates = getHeroDates();

  const blocks = [
    // Friday - Original slot for TASK-000005 (hero disruption)
    ...(!isReplanned
      ? [
          {
            id: 'b-fri-1',
            day: 'fri',
            slot: '00-02',
            rowSpan: 2,
            blockId: 'BLK-009637+38',
            taskId: 'TASK-000005',
            section: 'SEC-0004',
            date: days[4].date,
            fullDate: days[4].fullDate,
            time: '00:00 – 03:20',
            maintenanceType: 'Rail Grinding (Bundled)',
            department: 'Electrical / TRD',
            risk: 'CRITICAL',
            category: 'critical',
            status: 'Scheduled',
            isRescheduled: false,
            previousBlock: null,
          },
          {
            id: 'b-fri-1b',
            day: 'fri',
            slot: '00-02',
            rowSpan: 2,
            blockId: 'BLK-009637+38',
            taskId: 'TASK-000004',
            section: 'SEC-0004',
            date: days[4].date,
            fullDate: days[4].fullDate,
            time: '00:00 – 03:20',
            maintenanceType: 'Track Inspection (Joint)',
            department: 'Track / Civil Engineering',
            risk: 'HIGH',
            category: 'high',
            status: 'Scheduled',
            isRescheduled: false,
            previousBlock: null,
            isSecondary: true,
          },
        ]
      : []),

    // Saturday - Replanned slot for TASK-000005
    ...(isReplanned
      ? [
          {
            id: 'b-sat-replan',
            day: 'sat',
            slot: '18-20',
            rowSpan: 2,
            blockId: 'BLK-012046+47',
            taskId: 'TASK-000005',
            section: 'SEC-0004',
            date: days[5].date,
            fullDate: days[5].fullDate,
            time: '18:00 – 21:20',
            maintenanceType: 'Rail Grinding',
            department: 'Electrical / TRD',
            risk: 'CRITICAL',
            category: 'rescheduled',
            status: 'Rescheduled',
            isRescheduled: true,
            previousBlock: `${days[4].date} • 00:00–03:20 (BLK-009637+38)`,
          },
        ]
      : []),

    // Monday
    {
      id: 'b-mon-1',
      day: 'mon',
      slot: '02-04',
      blockId: 'BLK-001042',
      taskId: 'TASK-000109',
      section: 'SEC-0012',
      date: days[0].date,
      fullDate: days[0].fullDate,
      time: '02:00 – 04:00',
      maintenanceType: 'Axle Detector Scan',
      department: 'Mechanical / Rolling Stock',
      risk: 'LOW',
      category: 'mechanical',
      status: 'Completed',
      isRescheduled: false,
    },
    // Tuesday
    {
      id: 'b-tue-1',
      day: 'tue',
      slot: '12-14',
      blockId: 'BLK-002891',
      taskId: 'TASK-000214',
      section: 'SEC-0003',
      date: days[1].date,
      fullDate: days[1].fullDate,
      time: '12:00 – 14:00',
      maintenanceType: 'OHE Isolator Test',
      department: 'Electrical / TRD',
      risk: 'MODERATE',
      category: 'electrical',
      status: 'In Progress',
      isRescheduled: false,
    },
    // Wednesday (Future: Scheduled / Rescheduled)
    {
      id: 'b-wed-replan',
      day: 'wed',
      slot: '16-18',
      blockId: 'BLK-006241',
      taskId: 'TASK-000318',
      section: 'SEC-0007',
      date: days[2].date,
      fullDate: days[2].fullDate,
      time: '16:00 – 18:00',
      maintenanceType: 'OHE Isolator Overhaul',
      department: 'Electrical / TRD',
      risk: 'HIGH',
      category: 'rescheduled',
      status: 'Rescheduled',
      isRescheduled: true,
      previousBlock: 'Rescheduled from Tue 14:00 (Traffic Headway Gap)',
    },
    {
      id: 'b-wed-1',
      day: 'wed',
      slot: '02-04',
      blockId: 'BLK-007120',
      taskId: 'TASK-000421',
      section: 'SEC-0002',
      date: days[2].date,
      fullDate: days[2].fullDate,
      time: '01:00 – 04:00',
      maintenanceType: 'Track Realignment',
      department: 'Track / Civil Engineering',
      risk: 'MODERATE',
      category: 'civil',
      status: 'Scheduled',
      isRescheduled: false,
    },
    {
      id: 'b-wed-2',
      day: 'wed',
      slot: '14-16',
      blockId: 'BLK-009650',
      taskId: 'TASK-000512',
      section: 'SEC-0005',
      date: days[2].date,
      fullDate: days[2].fullDate,
      time: '14:00 – 16:30',
      maintenanceType: 'Interlocking Overhaul',
      department: 'Signal & Telecommunications',
      risk: 'CRITICAL',
      category: 'critical',
      status: 'Scheduled',
      isRescheduled: false,
    },
    // Thursday (Future: Scheduled)
    {
      id: 'b-thu-1',
      day: 'thu',
      slot: '10-12',
      blockId: 'BLK-005912',
      taskId: 'TASK-000388',
      section: 'SEC-0009',
      date: days[3].date,
      fullDate: days[3].fullDate,
      time: '10:00 – 12:00',
      maintenanceType: 'Point Machine Service',
      department: 'Signal & Telecommunications',
      risk: 'MODERATE',
      category: 'signal',
      status: 'Scheduled',
      isRescheduled: false,
    },
    {
      id: 'b-thu-2',
      day: 'thu',
      slot: '18-20',
      blockId: 'BLK-007892',
      taskId: 'TASK-000671',
      section: 'SEC-0014',
      date: days[3].date,
      fullDate: days[3].fullDate,
      time: '18:00 – 20:30',
      maintenanceType: 'CWR Restressing',
      department: 'Track / Civil Engineering',
      risk: 'HIGH',
      category: 'high',
      status: 'Scheduled',
      isRescheduled: false,
    },
    // Friday
    {
      id: 'b-fri-2',
      day: 'fri',
      slot: '04-06',
      blockId: 'BLK-009630',
      taskId: 'TASK-000210',
      section: 'SEC-0002',
      date: days[4].date,
      fullDate: days[4].fullDate,
      time: '04:00 – 05:30',
      maintenanceType: 'Ballast Tamp Gang',
      department: 'Track / Civil Engineering',
      risk: 'MODERATE',
      category: 'civil',
      status: 'Scheduled',
      isRescheduled: false,
    },
    // Saturday
    {
      id: 'b-sat-1',
      day: 'sat',
      slot: '06-08',
      blockId: 'BLK-011032',
      taskId: 'TASK-000724',
      section: 'SEC-0003',
      date: days[5].date,
      fullDate: days[5].fullDate,
      time: '06:00 – 08:30',
      maintenanceType: 'Contact Wire Stagger',
      department: 'Electrical / TRD',
      risk: 'MODERATE',
      category: 'electrical',
      status: 'Scheduled',
      isRescheduled: false,
    },
    // Sunday
    {
      id: 'b-sun-1',
      day: 'sun',
      slot: '00-02',
      blockId: 'BLK-014201',
      taskId: 'TASK-000951',
      section: 'SEC-0001',
      date: days[6].date,
      fullDate: days[6].fullDate,
      time: '00:30 – 02:30',
      maintenanceType: 'OHE Tensioning',
      department: 'Electrical / TRD',
      risk: 'MODERATE',
      category: 'electrical',
      status: 'Scheduled',
      isRescheduled: false,
    },
  ];

  return blocks;
}

/**
 * Generates realistic deterministic maintenance possessions for any date (past, present, future)
 * Guaranteed:
 * - NO identical duplicate tasks on the same day
 * - Rich variety of railway disciplines (Civil, TRD, S&T, Mechanical, Critical)
 * - Past blocks marked explicitly completed/done
 * - Regular distribution of rescheduled possessions
 */
export function getBlocksForDate(fullDateStr, isReplanned = false) {
  // If it's a date in the current live week, use authoritative blocks
  const currentWeekDays = PLANNING_HORIZON_DAYS;
  const matchCurrentWeekDay = currentWeekDays.find((d) => d.fullDate === fullDateStr);
  if (matchCurrentWeekDay) {
    const authBlocks = getAuthoritativeCurrentWeekBlocks(isReplanned);
    return authBlocks.filter((b) => b.fullDate === fullDateStr || b.date === matchCurrentWeekDay.date);
  }

  // Parse date components safely to prevent timezone drift
  const [yStr, mStr, dStr] = fullDateStr.split('-');
  const dateObj = new Date(parseInt(yStr, 10), parseInt(mStr, 10) - 1, parseInt(dStr, 10));
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  dateObj.setHours(0, 0, 0, 0);

  const isPast = dateObj < now;
  const isToday = dateObj.getTime() === now.getTime();

  // Operational Constraint: Railway possessions are only scheduled within the 1-week horizon.
  // Beyond Sunday of next week, blocks cannot be placed 2 months ahead of time.
  const maxFutureDate = getMaxFutureDate();
  if (dateObj > maxFutureDate) {
    return [];
  }

  // Deterministically generate 2-4 distinct blocks based on fullDateStr seed
  const hash = hashString(fullDateStr);
  const blockCount = (hash % 3) + 2; // 2 to 4 blocks per day

  const dayShort = dateObj.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
  const dateFormatted = `${String(dateObj.getDate()).padStart(2, '0')} ${dateObj.toLocaleDateString('en-US', { month: 'short' })}`;

  const blocks = [];
  const usedTypes = new Set();
  const usedSlots = new Set();

  for (let i = 0; i < blockCount; i++) {
    // Pick unique catalog items with no duplicate maintenance types on the same day
    let catIdx = (hash * 3 + i * 7 + i * i * 5) % MAINTENANCE_CATALOG.length;
    let attempts = 0;
    while (usedTypes.has(MAINTENANCE_CATALOG[catIdx].shortType) && attempts < MAINTENANCE_CATALOG.length) {
      catIdx = (catIdx + 1) % MAINTENANCE_CATALOG.length;
      attempts++;
    }
    const catalogItem = MAINTENANCE_CATALOG[catIdx];
    usedTypes.add(catalogItem.shortType);

    const section = SECTIONS[(hash + i * 3) % SECTIONS.length];
    const blockNum = String(1000 + ((hash + i * 739) % 9000)).padStart(6, '0');
    const taskNum = String(100 + ((hash * 3 + i * 491) % 900)).padStart(6, '0');

    let slot = catalogItem.preferredSlot;
    if (usedSlots.has(slot)) {
      const altSlots = TIME_SLOTS.map((s) => s.id).filter((s) => !usedSlots.has(s));
      slot = altSlots[(hash + i) % altSlots.length] || '08-10';
    }
    usedSlots.add(slot);

    // Status logic: Past blocks are explicitly Completed / Verified
    let status = 'Scheduled';
    if (isPast) {
      status = (hash + i) % 5 === 0 ? 'Verified' : 'Completed';
    } else if (isToday) {
      status = i === 0 ? 'In Progress' : 'Scheduled';
    }

    blocks.push({
      id: `gen-${fullDateStr}-${i}`,
      day: dayShort,
      slot: slot,
      blockId: `BLK-${blockNum}`,
      taskId: `TASK-${taskNum}`,
      section: section,
      date: dateFormatted,
      fullDate: fullDateStr,
      time: catalogItem.defaultDuration,
      maintenanceType: catalogItem.shortType,
      fullMaintenanceType: catalogItem.type,
      department: catalogItem.dept,
      risk: catalogItem.risk,
      category: catalogItem.category,
      status: status,
      isRescheduled: false,
      isPast: isPast,
      previousBlock: null,
    });
  }

  // Rescheduled logic: exactly ~20% of days have a visible rescheduled possession
  const daySeed = (dateObj.getFullYear() * 372) + (dateObj.getMonth() * 31) + dateObj.getDate();
  const isRescheduledDay = (daySeed % 5 === 2);
  if (isRescheduledDay && blocks.length > 0) {
    blocks[0].isRescheduled = true;
    blocks[0].category = 'rescheduled';
    blocks[0].status = isPast ? 'Completed' : 'Rescheduled';
    blocks[0].previousBlock = `BLK-${String(1000 + ((hash + 813) % 9000)).padStart(6, '0')} (Re-allocated by CP-SAT solver)`;
  }

  return blocks;
}

/**
 * Returns full week blocks for any array of 7 day objects (Monday to Sunday)
 */
export function getBlocksForWeek(weekDays, isReplanned = false) {
  // Check if this week is the current active week
  const currentWeekFirstDay = PLANNING_HORIZON_DAYS[0]?.fullDate;
  const isCurrentLiveWeek = weekDays[0]?.fullDate === currentWeekFirstDay;

  if (isCurrentLiveWeek) {
    return getAuthoritativeCurrentWeekBlocks(isReplanned);
  }

  // Otherwise generate blocks for each day in this custom week
  const weekBlocks = [];
  weekDays.forEach((day) => {
    const dayBlocks = getBlocksForDate(day.fullDate, isReplanned);
    dayBlocks.forEach((b) => {
      weekBlocks.push({
        ...b,
        day: day.key,
        date: day.date,
      });
    });
  });

  return weekBlocks;
}

/**
 * Returns summary stats for a given day in monthly view
 * Sorts rescheduled and high-risk blocks to front so they are guaranteed visible in monthly chips
 */
export function getDayPossessionSummary(fullDateStr, isReplanned = false) {
  const rawBlocks = getBlocksForDate(fullDateStr, isReplanned);

  // Sort blocks for display priority: Rescheduled first, then Critical, then High, then others
  const blocks = [...rawBlocks].sort((a, b) => {
    if (a.isRescheduled && !b.isRescheduled) return -1;
    if (!a.isRescheduled && b.isRescheduled) return 1;
    if (a.risk === 'CRITICAL' && b.risk !== 'CRITICAL') return -1;
    if (a.risk !== 'CRITICAL' && b.risk === 'CRITICAL') return 1;
    if (a.risk === 'HIGH' && b.risk !== 'HIGH') return -1;
    if (a.risk !== 'HIGH' && b.risk === 'HIGH') return 1;
    return 0;
  });

  const criticalCount = blocks.filter((b) => b.risk === 'CRITICAL').length;
  const highCount = blocks.filter((b) => b.risk === 'HIGH').length;
  const hasRescheduled = blocks.some((b) => b.isRescheduled);

  return {
    totalBlocks: blocks.length,
    criticalCount,
    highCount,
    hasRescheduled,
    blocks,
  };
}
