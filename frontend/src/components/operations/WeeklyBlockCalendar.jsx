import React, { useState } from 'react';
import { BlockHoverPopover } from './BlockHoverPopover';
import { useLanguage } from '../../context/LanguageContext';
import { usePlan } from '../../context/PlanContext';
import { Calendar, Clock, Layers, RefreshCw, CheckCircle2 } from 'lucide-react';

export const WeeklyBlockCalendar = () => {
  const { isReplanned } = usePlan();
  const { t } = useLanguage();

  const [hoveredBlock, setHoveredBlock] = useState(null);
  const [popoverPos, setPopoverPos] = useState({ x: 0, y: 0 });

  // 7 Days of the Planning Horizon
  const days = [
    { key: 'mon', date: '03 Sep', dayName: 'Monday', fullDate: '2026-09-03' },
    { key: 'tue', date: '04 Sep', dayName: 'Tuesday', fullDate: '2026-09-04' },
    { key: 'wed', date: '05 Sep', dayName: 'Wednesday', fullDate: '2026-09-05' },
    { key: 'thu', date: '06 Sep', dayName: 'Thursday', fullDate: '2026-09-06' },
    { key: 'fri', date: '07 Sep', dayName: 'Friday', fullDate: '2026-09-07' },
    { key: 'sat', date: '08 Sep', dayName: 'Saturday', fullDate: '2026-09-08' },
    { key: 'sun', date: '09 Sep', dayName: 'Sunday', fullDate: '2026-09-09' },
  ];

  // 2-Hour Time Slots
  const timeSlots = [
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

  // Master possessions placed directly onto calendar grid
  // Notice the dynamic replanning of TASK-000005:
  // When !isReplanned: Placed on Friday 07 Sep (00-02 and 02-04)
  // When isReplanned: Placed on Saturday 08 Sep (18-20 and 20-22)
  const calendarBlocks = [
    // 07 Sep (Friday)
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
            date: '07 Sep',
            time: '00:00 – 03:20',
            maintenanceType: 'Rail Grinding (Bundled)',
            department: 'Electrical / TRD',
            risk: 'CRITICAL',
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
            date: '07 Sep',
            time: '00:00 – 03:20',
            maintenanceType: 'Track Inspection (Joint)',
            department: 'Track / Civil Engineering',
            risk: 'HIGH',
            status: 'Scheduled',
            isRescheduled: false,
            previousBlock: null,
            isSecondary: true,
          },
        ]
      : []),

    // 08 Sep (Saturday) - Replanned slot for TASK-000005
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
            date: '08 Sep',
            time: '18:00 – 21:20',
            maintenanceType: 'Rail Grinding',
            department: 'Electrical / TRD',
            risk: 'CRITICAL',
            status: 'Rescheduled',
            isRescheduled: true,
            previousBlock: '07 Sep • 00:00–03:20 (BLK-009637+38)',
          },
        ]
      : []),

    // Other days
    {
      id: 'b-mon-1',
      day: 'mon',
      slot: '02-04',
      blockId: 'BLK-001042',
      taskId: 'TASK-000109',
      section: 'SEC-0012',
      date: '03 Sep',
      time: '02:00 – 04:00',
      maintenanceType: 'Axle Detector Scan',
      department: 'Mechanical',
      risk: 'LOW',
      status: 'Completed',
      isRescheduled: false,
    },
    {
      id: 'b-tue-1',
      day: 'tue',
      slot: '12-14',
      blockId: 'BLK-002891',
      taskId: 'TASK-000214',
      section: 'SEC-0003',
      date: '04 Sep',
      time: '12:00 – 14:00',
      maintenanceType: 'OHE Isolator Test',
      department: 'Electrical / TRD',
      risk: 'MODERATE',
      status: 'Completed',
      isRescheduled: false,
    },
    {
      id: 'b-wed-1',
      day: 'wed',
      slot: '02-04',
      blockId: 'BLK-007120',
      taskId: 'TASK-000421',
      section: 'SEC-0002',
      date: '05 Sep',
      time: '01:00 – 04:00',
      maintenanceType: 'Track Realignment',
      department: 'Track / Civil',
      risk: 'MODERATE',
      status: 'Verified',
      isRescheduled: false,
    },
    {
      id: 'b-thu-1',
      day: 'thu',
      slot: '10-12',
      blockId: 'BLK-005912',
      taskId: 'TASK-000388',
      section: 'SEC-0009',
      date: '06 Sep',
      time: '10:00 – 12:00',
      maintenanceType: 'Point Machine Service',
      department: 'Signal & Telecom',
      risk: 'HIGH',
      status: 'Completed',
      isRescheduled: false,
    },
    {
      id: 'b-fri-2',
      day: 'fri',
      slot: '04-06',
      blockId: 'BLK-009630',
      taskId: 'TASK-000210',
      section: 'SEC-0002',
      date: '07 Sep',
      time: '04:00 – 05:30',
      maintenanceType: 'Ballast Tamp Gang',
      department: 'Track / Civil',
      risk: 'MODERATE',
      status: 'Scheduled',
      isRescheduled: false,
    },
    {
      id: 'b-sun-1',
      day: 'sun',
      slot: '00-02',
      blockId: 'BLK-014201',
      taskId: 'TASK-000951',
      section: 'SEC-0001',
      date: '09 Sep',
      time: '00:30 – 02:30',
      maintenanceType: 'Catenary Wire Pull',
      department: 'Electrical / TRD',
      risk: 'HIGH',
      status: 'Scheduled',
      isRescheduled: false,
    },
  ];

  const handleMouseEnter = (block, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPopoverPos({ x: rect.right, y: rect.top });
    setHoveredBlock(block);
  };

  const handleMouseLeave = () => {
    setHoveredBlock(null);
  };

  // Color helper according to Section 16 & 27
  const getBlockStyle = (block) => {
    const isCritical = block.risk === 'CRITICAL';
    const isHigh = block.risk === 'HIGH';
    const isRescheduled = block.isRescheduled;
    const isCompleted = block.status === 'Completed' || block.status === 'Verified';

    if (isRescheduled) {
      return 'bg-orange-100 text-orange-950 border-2 border-dashed border-orange-500 dark:bg-orange-950/60 dark:text-orange-200 dark:border-orange-600 shadow-xs';
    }

    if (isCompleted) {
      return 'bg-emerald-50 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800 opacity-80';
    }

    if (isCritical) {
      return 'bg-red-800 text-white border border-red-900 dark:bg-red-900 dark:border-red-700 shadow-2xs';
    }

    if (isHigh) {
      return 'bg-amber-700 text-white border border-amber-800 dark:bg-amber-800 dark:border-amber-700 shadow-2xs';
    }

    // Moderate / Low
    return 'bg-govnavy-800 text-white border border-govnavy-900 dark:bg-govnavy-700 dark:border-govnavy-600';
  };

  return (
    <div className="space-y-3 relative">
      {/* Calendar Legend & Accessibility Guide */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">
            Visual Legend:
          </span>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-red-800 border border-red-900 inline-block" />
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Critical Risk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-amber-700 border border-amber-800 inline-block" />
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">High Risk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-govnavy-800 border border-govnavy-900 inline-block" />
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Standard Possessions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-orange-100 border-2 border-dashed border-orange-500 inline-block" />
            <span className="text-[11px] font-semibold text-orange-800 dark:text-orange-300">Rescheduled (Replanned)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-emerald-100 border border-emerald-400 inline-block" />
            <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">Completed / Verified</span>
          </div>
        </div>

        <div className="font-mono text-[11px] text-slate-500">
          Horizon: <strong>03 Sep – 09 Sep 2026</strong>
        </div>
      </div>

      {/* Full-Week Calendar Grid (Section 16 requirement) */}
      <div className="gov-panel overflow-hidden border border-slate-300 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left min-w-[750px]">
            {/* Day Header Row */}
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-300 dark:border-slate-800">
                <th className="w-28 p-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-1">
                    <Clock size={12} className="text-slate-500" />
                    <span>Time Window</span>
                  </div>
                </th>
                {days.map((d) => (
                  <th
                    key={d.key}
                    className={`p-2.5 text-center border-r border-slate-200 dark:border-slate-800 last:border-r-0 ${
                      d.date === '07 Sep' && !isReplanned
                        ? 'bg-blue-50/70 dark:bg-blue-950/30'
                        : d.date === '08 Sep' && isReplanned
                        ? 'bg-orange-50/70 dark:bg-orange-950/30'
                        : ''
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      {d.dayName}
                    </div>
                    <div className="text-[11px] font-mono font-semibold text-govnavy-700 dark:text-govnavy-300 mt-0.5">
                      {d.date}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Time Slot Rows */}
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {timeSlots.map((slot) => (
                <tr key={slot.id} className="h-14 hover:bg-slate-50/30 dark:hover:bg-slate-900/20">
                  {/* Time Label */}
                  <td className="p-2 text-[11px] font-mono font-bold text-slate-600 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800 whitespace-nowrap">
                    {slot.label}
                  </td>

                  {/* 7 Day Columns */}
                  {days.map((day) => {
                    const block = calendarBlocks.find((b) => b.day === day.key && b.slot === slot.id);
                    const isHighlightDay =
                      (day.date === '07 Sep' && !isReplanned) || (day.date === '08 Sep' && isReplanned);

                    return (
                      <td
                        key={day.key}
                        className={`p-1.5 align-top border-r border-slate-200 dark:border-slate-800 last:border-r-0 relative ${
                          isHighlightDay ? 'bg-slate-50/30 dark:bg-slate-900/10' : ''
                        }`}
                      >
                        {block && (
                          <div
                            onMouseEnter={(e) => handleMouseEnter(block, e)}
                            onMouseLeave={handleMouseLeave}
                            className={`p-1.5 rounded cursor-pointer transition-all hover:scale-[1.02] select-none ${getBlockStyle(
                              block
                            )}`}
                          >
                            <div className="flex items-center justify-between gap-1 leading-none">
                              <span className="font-mono font-bold text-[10px] truncate">
                                {block.blockId}
                              </span>
                              <span className="text-[9px] font-mono font-semibold opacity-90">
                                {block.section}
                              </span>
                            </div>

                            <div className="text-[11px] font-bold truncate mt-1">
                              {block.maintenanceType}
                            </div>

                            <div className="flex items-center justify-between text-[9px] font-medium opacity-85 mt-1 pt-0.5 border-t border-white/20">
                              <span>{block.risk}</span>
                              <span>{block.time.split('–')[0]}</span>
                            </div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rich Hover Popover Card */}
      <BlockHoverPopover blockData={hoveredBlock} position={popoverPos} />
    </div>
  );
};
