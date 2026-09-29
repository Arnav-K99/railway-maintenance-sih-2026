import React, { useState, useMemo, useRef, useEffect } from 'react';
import { BlockHoverPopover } from './BlockHoverPopover';
import { DayDetailDrawer } from './DayDetailDrawer';
import { useLanguage } from '../../context/LanguageContext';
import { usePlan } from '../../context/PlanContext';
import { formatTaskId } from '../../utils/formatters';
import { 
  getWeekDaysForAnchor, 
  getMonthGrid, 
  getHeroDates,
  getMaxFutureDate
} from '../../utils/dateUtils';
import { 
  TIME_SLOTS, 
  getBlocksForWeek, 
  getBlocksForDate, 
  getDayPossessionSummary 
} from '../../utils/calendarData';
import { 
  Calendar, 
  CalendarDays, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
  Palette
} from 'lucide-react';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const WeeklyBlockCalendar = () => {
  const { isReplanned } = usePlan();
  const { t } = useLanguage();

  // View state: 'weekly' | 'monthly'
  const [viewMode, setViewMode] = useState('weekly');

  // Discreet Color Signification Guide expansion state (collapsed by default to keep page clean)
  const [showColorGuide, setShowColorGuide] = useState(false);

  // Currently focused date anchor (defaults to live present time)
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  // Drawer & Popover states
  const [hoveredBlock, setHoveredBlock] = useState(null);
  const [popoverPos, setPopoverPos] = useState({ x: 0, y: 0 });
  const [selectedDayDrawer, setSelectedDayDrawer] = useState(null);

  // Interactive Month & Year Flyout Picker state (replaces bulky dropdown)
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [pickerYear, setPickerYear] = useState(() => selectedDate.getFullYear());
  const monthPickerRef = useRef(null);

  const maxFutureYear = useMemo(() => getMaxFutureDate().getFullYear(), []);

  // Sync pickerYear when selectedDate changes
  useEffect(() => {
    setPickerYear(selectedDate.getFullYear());
  }, [selectedDate]);

  // Click outside to dismiss month picker popover
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (monthPickerRef.current && !monthPickerRef.current.contains(event.target)) {
        setShowMonthPicker(false);
      }
    };
    if (showMonthPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMonthPicker]);

  const handleSelectMonthYear = (year, mIdx) => {
    const maxFuture = getMaxFutureDate();
    const isBeyond =
      year > maxFuture.getFullYear() ||
      (year === maxFuture.getFullYear() && mIdx > maxFuture.getMonth());
    if (isBeyond) return;

    const newDate = new Date(selectedDate);
    newDate.setFullYear(year);
    newDate.setMonth(mIdx);
    newDate.setDate(1);
    setSelectedDate(newDate);
    setShowMonthPicker(false);
  };

  // Compute Weekly state for the anchor date
  const weekData = useMemo(() => {
    return getWeekDaysForAnchor(selectedDate);
  }, [selectedDate]);

  // Compute Week Blocks for the active 7 days
  const calendarBlocks = useMemo(() => {
    return getBlocksForWeek(weekData.days, isReplanned);
  }, [weekData.days, isReplanned]);

  // Compute Monthly state for the anchor date's year & month
  const monthData = useMemo(() => {
    const year = selectedDate.getFullYear();
    const monthIndex = selectedDate.getMonth();
    return getMonthGrid(year, monthIndex);
  }, [selectedDate]);

  // Determine if forward navigation is disabled based on the 1-week future planning horizon
  const isNextDisabled = useMemo(() => {
    const maxFutureDate = getMaxFutureDate();
    if (viewMode === 'weekly') {
      const weekEndDate = weekData.days[6]?.rawDate;
      if (!weekEndDate) return false;
      const endOfCheckDay = new Date(weekEndDate);
      endOfCheckDay.setHours(23, 59, 59, 999);
      return endOfCheckDay >= maxFutureDate;
    }
    // In monthly view: disabled if viewing the month containing maxFutureDate or beyond
    return (
      selectedDate.getFullYear() > maxFutureDate.getFullYear() ||
      (selectedDate.getFullYear() === maxFutureDate.getFullYear() &&
        selectedDate.getMonth() >= maxFutureDate.getMonth())
    );
  }, [viewMode, weekData.days, selectedDate]);

  // Navigation handlers
  const handlePrev = () => {
    const nextDate = new Date(selectedDate);
    if (viewMode === 'weekly') {
      nextDate.setDate(selectedDate.getDate() - 7);
    } else {
      nextDate.setMonth(selectedDate.getMonth() - 1);
    }
    setSelectedDate(nextDate);
  };

  const handleNext = () => {
    if (isNextDisabled) return;
    const nextDate = new Date(selectedDate);
    if (viewMode === 'weekly') {
      nextDate.setDate(selectedDate.getDate() + 7);
    } else {
      nextDate.setMonth(selectedDate.getMonth() + 1);
    }
    setSelectedDate(nextDate);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };


  // Switch from monthly day click to full week (constrained to max future horizon)
  const handleSwitchToWeek = (targetDate) => {
    const target = new Date(targetDate);
    const maxFuture = getMaxFutureDate();
    if (target > maxFuture) {
      setSelectedDate(new Date(maxFuture));
    } else {
      setSelectedDate(target);
    }
    setViewMode('weekly');
  };

  // Mouse hover handlers for rich popover
  const handleMouseEnter = (block, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPopoverPos({ x: rect.right, y: rect.top });
    setHoveredBlock(block);
  };

  const handleMouseLeave = () => {
    setHoveredBlock(null);
  };

  // Operational styling: Light grey for Done (past/completed), alert colors for active/scheduled
  const getBlockStyle = (block, isDayPast = false) => {
    // Common sense guard: Work can ONLY be completed/Done if the date is strictly in the PAST!
    // Future dates and Today can NEVER be marked Done under any circumstance!
    const isCompleted = Boolean(isDayPast && (block.status === 'Completed' || block.status === 'Verified' || block.isPast));
    const isRescheduled = block.isRescheduled;
    const isCritical = block.risk === 'CRITICAL' || block.category === 'critical';
    const isHigh = block.risk === 'HIGH' || block.category === 'high';

    // 1. DONE possessions -> Clean Light Grey color (both weekly and monthly)
    if (isCompleted) {
      if (isRescheduled) {
        // Rescheduled & completed: Light grey with dashed orange border
        return 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-2 border-dashed border-orange-400 dark:bg-slate-800/70 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-orange-500/80 shadow-2xs font-semibold';
      }
      // Standard completed: Clean light grey with slate border
      return 'bg-slate-100 hover:bg-slate-200/90 text-slate-800 border border-slate-300 dark:bg-slate-800/60 dark:hover:bg-slate-800 dark:text-slate-200 dark:border-slate-700 shadow-2xs font-medium';
    }

    // 2. ACTIVE & UPCOMING possessions:
    if (isRescheduled) {
      return 'bg-orange-100 text-orange-950 border-2 border-dashed border-orange-500 dark:bg-orange-950/80 dark:text-orange-200 dark:border-orange-400 font-bold shadow-xs';
    }

    if (isCritical) {
      return 'bg-red-800 hover:bg-red-900 text-white border border-red-900 dark:bg-red-950/90 dark:hover:bg-red-900 dark:border-red-700 shadow-xs';
    }

    if (isHigh) {
      return 'bg-amber-600 hover:bg-amber-700 text-white border border-amber-700 dark:bg-amber-800/90 dark:hover:bg-amber-700 dark:border-amber-600 shadow-xs';
    }

    // Standard / Routine Upcoming Possessions
    return 'bg-slate-700 hover:bg-slate-800 text-white border border-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-600 shadow-xs';
  };


  // Header day label list for Monthly table
  const weekDayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-3 relative w-full">
      {/* Top Toolbar: View Toggles, Month Selector, Navigation, and Today button */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-2.5 rounded-xl bg-white dark:bg-[#14171d] border border-slate-200 dark:border-white/[0.08] shadow-xs">
        
        {/* Left: View Mode Switcher (Weekly vs Monthly) */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg p-1 bg-slate-100 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/[0.08]">
            <button
              type="button"
              onClick={() => setViewMode('weekly')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'weekly'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CalendarDays size={13} />
              <span>Weekly</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('monthly')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === 'monthly'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calendar size={13} />
              <span>Monthly</span>
            </button>
          </div>
        </div>

        {/* Right: Date Navigation (< Prev | Interactive Month Picker | Next > | Today) */}
        <div className="flex items-center gap-1.5 relative" ref={monthPickerRef}>
          <button
            type="button"
            onClick={handlePrev}
            title={viewMode === 'weekly' ? 'Previous Week' : 'Previous Month'}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/[0.08] transition-colors"
          >
            <ChevronLeft size={15} />
          </button>

          {/* Interactive Date Range & Month Flyout Trigger */}
          <button
            type="button"
            onClick={() => setShowMonthPicker((prev) => !prev)}
            title="Click to jump to any past month or year"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
              showMonthPicker
                ? 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-700 shadow-xs'
                : 'text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-white/[0.08] hover:bg-slate-100 dark:hover:bg-white/[0.08]'
            }`}
          >
            <Calendar size={13} className="text-blue-600 dark:text-blue-400 shrink-0" />
            <span>{viewMode === 'weekly' ? weekData.shortLabel : monthData.monthLabel}</span>
            <ChevronDown
              size={12}
              className={`text-slate-400 transition-transform ${showMonthPicker ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''}`}
            />
          </button>

          {/* Floating Modern Month & Year Popover */}
          {showMonthPicker && (
            <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white dark:bg-[#161a22] rounded-xl shadow-2xl border border-slate-200 dark:border-white/[0.12] p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* Header: Year Selector */}
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200 dark:border-white/[0.08]">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Jump to Month & Year
                </span>

                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg p-0.5 border border-slate-200 dark:border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setPickerYear((y) => y - 1)}
                    title="Previous Year"
                    className="p-1 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    <ChevronLeft size={13} />
                  </button>
                  <span className="font-mono font-bold text-xs px-2 text-slate-900 dark:text-white">
                    {pickerYear}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPickerYear((y) => y + 1)}
                    disabled={pickerYear >= maxFutureYear}
                    title={pickerYear >= maxFutureYear ? 'Future years capped at 1-week horizon' : 'Next Year'}
                    className={`p-1 rounded transition-colors ${
                      pickerYear >= maxFutureYear
                        ? 'opacity-30 cursor-not-allowed text-slate-400'
                        : 'hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>

              {/* Quick Jump Shortcuts */}
              <div className="flex items-center gap-1.5 pb-2.5 mb-2.5 border-b border-slate-200 dark:border-white/[0.08] overflow-x-auto text-[10px]">
                <button
                  type="button"
                  onClick={() => {
                    handleToday();
                    setShowMonthPicker(false);
                  }}
                  className="px-2 py-1 rounded bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200 font-bold border border-amber-300 dark:border-amber-700/60 whitespace-nowrap shrink-0 hover:bg-amber-200 transition-colors"
                >
                  ⚡ Present
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const now = new Date();
                    const lastM = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                    setSelectedDate(lastM);
                    setShowMonthPicker(false);
                  }}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] dark:text-slate-300 font-semibold border border-slate-200 dark:border-white/[0.08] whitespace-nowrap shrink-0 transition-colors"
                >
                  ⏮ Last Month
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const now = new Date();
                    const m3 = new Date(now.getFullYear(), now.getMonth() - 3, 1);
                    setSelectedDate(m3);
                    setShowMonthPicker(false);
                  }}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] dark:text-slate-300 font-semibold border border-slate-200 dark:border-white/[0.08] whitespace-nowrap shrink-0 transition-colors"
                >
                  ⏮ 3M Ago
                </button>
              </div>

              {/* 12 Months Grid */}
              <div className="grid grid-cols-4 gap-1.5">
                {MONTH_NAMES.map((name, mIdx) => {
                  const maxFuture = getMaxFutureDate();
                  const isBeyond =
                    pickerYear > maxFuture.getFullYear() ||
                    (pickerYear === maxFuture.getFullYear() && mIdx > maxFuture.getMonth());

                  const now = new Date();
                  const isPresentMonth = pickerYear === now.getFullYear() && mIdx === now.getMonth();
                  const isSelected =
                    pickerYear === selectedDate.getFullYear() && mIdx === selectedDate.getMonth();
                  const isPast =
                    pickerYear < now.getFullYear() ||
                    (pickerYear === now.getFullYear() && mIdx < now.getMonth());

                  return (
                    <button
                      key={name}
                      type="button"
                      disabled={isBeyond}
                      onClick={() => handleSelectMonthYear(pickerYear, mIdx)}
                      title={isBeyond ? 'Future planning horizon capped at 1 week ahead' : `${name} ${pickerYear}`}
                      className={`py-2 px-1 rounded-lg text-xs font-semibold text-center transition-all relative ${
                        isSelected
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm font-bold ring-2 ring-blue-500/50'
                          : isPresentMonth
                          ? 'bg-amber-100 text-amber-950 dark:bg-amber-950/60 dark:text-amber-200 border border-amber-400 dark:border-amber-600 font-bold'
                          : isBeyond
                          ? 'opacity-30 cursor-not-allowed bg-slate-100/50 dark:bg-white/[0.02] text-slate-400 dark:text-slate-600'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:text-slate-300 border border-slate-200/80 dark:border-white/[0.06]'
                      }`}
                    >
                      <div className="leading-none">{name}</div>
                      {isPresentMonth && (
                        <span className="block text-[8px] font-mono text-amber-700 dark:text-amber-400 font-extrabold uppercase mt-1 leading-none">
                          Current
                        </span>
                      )}
                      {isPast && !isSelected && (
                        <span className="block text-[8px] font-mono text-emerald-600 dark:text-emerald-400 font-medium mt-1 leading-none">
                          Done
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Footer Note */}
              <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-white/[0.08] flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Audit Archive: 2024–2026</span>
                <span className="text-blue-500 font-semibold">Max +1 Wk Horizon</span>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={isNextDisabled}
            title={
              isNextDisabled
                ? 'Future planning horizon capped at 1 week ahead (Rolling 7-day operational window)'
                : viewMode === 'weekly'
                ? 'Next Week'
                : 'Next Month'
            }
            className={`p-1.5 rounded-lg border transition-colors ${
              isNextDisabled
                ? 'text-slate-300 dark:text-slate-600 border-slate-200/50 dark:border-white/[0.04] cursor-not-allowed bg-slate-50/50 dark:bg-white/[0.02]'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.08] border-slate-200 dark:border-white/[0.08]'
            }`}
          >
            <ChevronRight size={15} />
          </button>

          <button
            type="button"
            onClick={handleToday}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-amber-900 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/60 hover:bg-amber-200/90 dark:hover:bg-amber-900/60 transition-all shadow-2xs"
          >
            <RotateCcw size={11} />
            <span>Today</span>
          </button>
        </div>
      </div>

      {/* Sleek, Compact 1-Line Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-white/[0.08]">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px]">
          <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
            Legend:
          </span>
          <span className="inline-flex items-center gap-1" title="Critical: Severe defect requiring night possession priority">
            <span className="h-2.5 w-2.5 rounded bg-red-800 border border-red-900 inline-block" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">Critical</span>
          </span>
          <span className="inline-flex items-center gap-1" title="High Risk: Rapid wear requiring servicing within 24–48h">
            <span className="h-2.5 w-2.5 rounded bg-amber-600 border border-amber-700 inline-block" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">High</span>
          </span>
          <span className="inline-flex items-center gap-1" title="Standard: Routine periodic maintenance inside headway gaps">
            <span className="h-2.5 w-2.5 rounded bg-slate-700 border border-slate-800 inline-block" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">Standard</span>
          </span>
          <span className="inline-flex items-center gap-1" title="Rescheduled: Dynamically moved by CP-SAT solver">
            <span className="h-2.5 w-2.5 rounded bg-orange-100 border-2 border-dashed border-orange-500 inline-block" />
            <span className="font-semibold text-orange-800 dark:text-orange-300">Rescheduled</span>
          </span>
          <span className="inline-flex items-center gap-1" title="Done: Executed past maintenance possession (Light Grey)">
            <span className="h-2.5 w-2.5 rounded bg-slate-200 dark:bg-slate-700 border border-slate-400 dark:border-slate-500 inline-block" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">✓ Done (Light Grey)</span>
          </span>
          <span className="inline-flex items-center gap-1 pl-1.5 border-l border-slate-200 dark:border-white/[0.08]" title="Today: Current active 24h operational cycle">
            <span className="h-2.5 w-2.5 rounded bg-amber-300 border border-amber-500 inline-block" />
            <span className="font-bold text-amber-900 dark:text-amber-200">Today</span>
          </span>
        </div>

        <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400 hidden xl:flex items-center gap-2">
          <span>Horizon: <strong className="text-slate-800 dark:text-slate-200">{viewMode === 'weekly' ? weekData.label : monthData.monthLabel}</strong></span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60">
            Max +1 Wk Future
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: WEEKLY VIEW (Fits 100% horizontally - Zero horizontal scroll) */}
      {/* ========================================================================= */}
      {viewMode === 'weekly' && (
        <div className="w-full bg-white dark:bg-[#14171d] rounded-xl shadow-sm border border-slate-200 dark:border-white/[0.08] overflow-hidden">
          <table className="w-full table-fixed border-collapse text-left">
            {/* Column Width Distribution: Exact 1/7 for each day, compact time column */}
            <colgroup>
              <col className="w-14 sm:w-16 md:w-20" />
              <col className="w-[calc((100%-3.5rem)/7)] sm:w-[calc((100%-4rem)/7)] md:w-[calc((100%-5rem)/7)]" />
              <col className="w-[calc((100%-3.5rem)/7)] sm:w-[calc((100%-4rem)/7)] md:w-[calc((100%-5rem)/7)]" />
              <col className="w-[calc((100%-3.5rem)/7)] sm:w-[calc((100%-4rem)/7)] md:w-[calc((100%-5rem)/7)]" />
              <col className="w-[calc((100%-3.5rem)/7)] sm:w-[calc((100%-4rem)/7)] md:w-[calc((100%-5rem)/7)]" />
              <col className="w-[calc((100%-3.5rem)/7)] sm:w-[calc((100%-4rem)/7)] md:w-[calc((100%-5rem)/7)]" />
              <col className="w-[calc((100%-3.5rem)/7)] sm:w-[calc((100%-4rem)/7)] md:w-[calc((100%-5rem)/7)]" />
              <col className="w-[calc((100%-3.5rem)/7)] sm:w-[calc((100%-4rem)/7)] md:w-[calc((100%-5rem)/7)]" />
            </colgroup>

            {/* Day Header Row */}
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-300 dark:border-slate-800">
                <th className="p-1 sm:p-2 text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Clock size={11} className="text-slate-500" />
                    <span className="hidden sm:inline">Time</span>
                  </div>
                </th>

                {weekData.days.map((d) => {
                  const isToday = d.isToday;
                  const isFriHero = d.key === 'fri' && !isReplanned;
                  const isSatHero = d.key === 'sat' && isReplanned;

                  return (
                    <th
                      key={d.key}
                      className={`p-1 sm:p-2 text-center border-r border-slate-200 dark:border-slate-800 last:border-r-0 transition-colors overflow-hidden ${
                        isToday
                          ? 'bg-amber-100/90 dark:bg-amber-950/45 border-b-2 border-amber-400 dark:border-amber-500'
                          : isFriHero
                          ? 'bg-blue-50/70 dark:bg-blue-950/30'
                          : isSatHero
                          ? 'bg-orange-50/70 dark:bg-orange-950/30'
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider truncate ${isToday ? 'text-amber-950 dark:text-amber-200 font-extrabold' : 'text-slate-900 dark:text-white'}`}>
                          <span className="md:hidden">{d.shortDay}</span>
                          <span className="hidden md:inline">{d.dayName}</span>
                        </span>
                        {isToday && (
                          <span className="px-1 py-0.2 rounded text-[8px] font-mono font-bold bg-amber-400 text-amber-950 uppercase shrink-0">
                            TODAY
                          </span>
                        )}
                      </div>
                      <div className={`text-[10px] sm:text-[11px] font-mono font-semibold mt-0.5 truncate ${isToday ? 'text-amber-800 dark:text-amber-300 font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                        {d.date}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Time Slot Rows */}
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {TIME_SLOTS.map((slot) => (
                <tr key={slot.id} className="h-13 sm:h-14 hover:bg-slate-50/30 dark:hover:bg-slate-900/20">
                  {/* Time Label (Stacked vertically for maximum space efficiency) */}
                  <td className="p-1 sm:p-1.5 text-[9px] sm:text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 bg-slate-50/70 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800 text-center whitespace-nowrap">
                    <div className="leading-tight">{slot.label.split('–')[0]?.trim()}</div>
                    <div className="text-[8px] sm:text-[9px] text-slate-400 dark:text-slate-500 leading-tight">{slot.label.split('–')[1]?.trim()}</div>
                  </td>

                  {/* 7 Day Columns */}
                  {weekData.days.map((day) => {
                    const block = calendarBlocks.find((b) => b.day === day.key && b.slot === slot.id);
                    const isToday = day.isToday;
                    const isHighlightDay = (day.key === 'fri' && !isReplanned) || (day.key === 'sat' && isReplanned);

                    return (
                      <td
                        key={day.key}
                        className={`p-1 sm:p-1.5 align-top border-r border-slate-200 dark:border-slate-800 last:border-r-0 relative transition-colors overflow-hidden ${
                          isToday
                            ? 'bg-amber-50/60 dark:bg-amber-950/20'
                            : isHighlightDay
                            ? 'bg-slate-50/30 dark:bg-slate-900/10'
                            : ''
                        }`}
                      >
                        {block && (
                          <div
                            onMouseEnter={(e) => handleMouseEnter(block, e)}
                            onMouseLeave={handleMouseLeave}
                            className={`p-1 sm:p-1.5 rounded-md cursor-pointer transition-all hover:scale-[1.02] select-none ${getBlockStyle(
                              block,
                              day.isPast
                            )}`}
                          >
                            <div className="flex items-center justify-between gap-0.5 leading-none">
                              <span className="font-mono font-bold text-[9px] sm:text-[10px] truncate">
                                {formatTaskId(block.taskId)}
                              </span>
                              <span className="text-[8px] sm:text-[9px] font-mono opacity-90 truncate">
                                {block.section}
                              </span>
                            </div>

                            <div className="text-[10px] sm:text-[11px] font-bold truncate mt-0.5 leading-tight">
                              {block.maintenanceType}
                            </div>

                            <div className="flex items-center justify-between text-[8px] sm:text-[9px] font-medium opacity-90 mt-1 pt-0.5 border-t border-current/20">
                              <span className="truncate">{block.risk}</span>
                              {day.isPast && (block.status === 'Completed' || block.status === 'Verified') ? (
                                <span className="font-bold text-emerald-700 dark:text-emerald-400 shrink-0">✓ Done</span>
                              ) : (
                                <span className="shrink-0">{block.time.split('–')[0]?.trim()}</span>
                              )}
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
      )}

      {/* ========================================================================= */}
      {/* MODE 2: MONTHLY VIEW (Full Calendar Matrix with Days & Possessions) */}
      {/* ========================================================================= */}
      {viewMode === 'monthly' && (
        <div className="w-full bg-white dark:bg-[#14171d] rounded-xl shadow-sm border border-slate-200 dark:border-white/[0.08] overflow-hidden">
          {/* Day of Week Header */}
          <div className="grid grid-cols-7 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-center font-bold text-xs text-slate-700 dark:text-slate-300">
            {weekDayNames.map((name) => (
              <div key={name} className="py-2.5 border-r border-slate-200 dark:border-slate-800 last:border-r-0">
                {name}
              </div>
            ))}
          </div>

          {/* Month Weeks Matrix */}
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {monthData.weeks.map((week, wIdx) => (
              <div key={wIdx} className="grid grid-cols-7 divide-x divide-slate-200 dark:divide-slate-800 min-h-[105px]">
                {week.map((day) => {
                  const summary = getDayPossessionSummary(day.fullDate, isReplanned);
                  const isToday = day.isToday;
                  const isCurrentMonth = day.isCurrentMonth;

                  return (
                    <div
                      key={day.fullDate}
                      onClick={() => {
                        setSelectedDayDrawer({
                          dayData: day,
                          blocks: summary.blocks,
                        });
                      }}
                      className={`p-1.5 flex flex-col justify-between transition-all cursor-pointer group hover:bg-slate-50 dark:hover:bg-white/[0.03] ${
                        isToday
                          ? 'bg-amber-100/75 dark:bg-amber-950/35 border-2 border-amber-400 dark:border-amber-600 ring-1 ring-amber-400/40 shadow-sm'
                          : day.isBeyondFutureHorizon
                          ? 'bg-slate-50/40 dark:bg-white/[0.01] opacity-75'
                          : !isCurrentMonth
                          ? 'opacity-40 bg-slate-50/50 dark:bg-white/[0.01]'
                          : ''
                      }`}
                    >
                      {/* Top Row: Date Number and Badges */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                            isToday
                              ? 'bg-amber-400 text-amber-950 font-extrabold shadow-2xs'
                              : isCurrentMonth
                              ? 'text-slate-900 dark:text-white'
                              : 'text-slate-400'
                          }`}
                        >
                          {day.dayNum}
                        </span>

                        {isToday ? (
                          <span className="text-[9px] font-mono font-extrabold text-amber-900 dark:text-amber-300 uppercase tracking-tight">
                            TODAY
                          </span>
                        ) : day.isPast ? (
                          <span className="text-[9px] font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 bg-emerald-100/70 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-300/60 dark:border-emerald-800/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 inline-block"></span>
                            ✓ Done
                          </span>
                        ) : day.isBeyondFutureHorizon ? (
                          <span className="text-[8px] font-mono text-slate-400 dark:text-slate-500 italic">
                            Unscheduled
                          </span>
                        ) : summary.totalBlocks > 0 ? (
                          <span className="text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400">
                            {summary.totalBlocks} blk{summary.totalBlocks > 1 ? 's' : ''}
                          </span>
                        ) : null}
                      </div>

                      {/* Middle: Possession Chips (Color-coded with full variety and Done status) */}
                      {day.isBeyondFutureHorizon ? (
                        <div className="py-2.5 px-1.5 my-1 text-center rounded border border-dashed border-slate-200 dark:border-white/[0.06] bg-slate-50/60 dark:bg-white/[0.01]">
                          <span className="text-[9px] font-mono font-medium text-slate-400 dark:text-slate-500 block leading-tight">
                            Outside Horizon
                          </span>
                          <span className="text-[8px] text-slate-400 dark:text-slate-600 block leading-tight mt-0.5">
                            Rolling 7d Window
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-1 my-1">
                          {summary.blocks.slice(0, 2).map((b) => {
                            const isReplan = b.isRescheduled;
                            const isComp = Boolean(day.isPast && (b.status === 'Completed' || b.status === 'Verified' || b.isPast));
                            const chipStyle = getBlockStyle(b, day.isPast);

                            return (
                              <div
                                key={b.id}
                                onMouseEnter={(e) => {
                                  e.stopPropagation();
                                  handleMouseEnter(b, e);
                                }}
                                onMouseLeave={handleMouseLeave}
                                className={`p-1 rounded text-[10px] font-medium truncate flex items-center justify-between transition-all hover:scale-[1.02] ${chipStyle}`}
                              >
                                <span className="truncate font-semibold flex items-center gap-1">
                                  {isReplan && <span className="text-[9px] shrink-0">🔄</span>}
                                  <span className="truncate">{b.maintenanceType}</span>
                                </span>
                                {isComp ? (
                                  <span className="text-[8px] font-mono text-emerald-700 dark:text-emerald-400 font-bold ml-1 shrink-0 bg-emerald-50 dark:bg-emerald-950/60 px-1 py-0.2 rounded border border-emerald-300 dark:border-emerald-700/60">
                                    ✓ Done
                                  </span>
                                ) : isReplan ? (
                                  <span className="text-[8px] font-mono font-bold text-orange-950 dark:text-orange-200 ml-1 shrink-0">
                                    Replan
                                  </span>
                                ) : (
                                  <span className="text-[8px] font-mono ml-1 opacity-80 shrink-0">
                                    {b.section}
                                  </span>
                                )}
                              </div>
                            );
                          })}

                          {summary.totalBlocks > 2 && (
                            <div className="text-[9px] font-mono font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 pl-0.5">
                              +{summary.totalBlocks - 2} more...
                            </div>
                          )}
                        </div>
                      )}

                      {/* Bottom Action: Click Hint on hover */}
                      <div className="text-[9px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between pt-0.5 border-t border-slate-100 dark:border-white/[0.04]">
                        <span>Inspect</span>
                        <ArrowRight size={10} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popover on Card Hover */}
      <BlockHoverPopover blockData={hoveredBlock} position={popoverPos} />

      {/* Detailed Slide-out Drawer for Day Inspection in Monthly View */}
      <DayDetailDrawer
        isOpen={Boolean(selectedDayDrawer)}
        dayData={selectedDayDrawer?.dayData}
        blocks={selectedDayDrawer?.blocks || []}
        onClose={() => setSelectedDayDrawer(null)}
        onSwitchToWeek={handleSwitchToWeek}
      />

      {/* Discreet Footer Reference for Operational Color Protocol (Shifted to bottom as requested) */}
      <div className="pt-2 border-t border-slate-200 dark:border-white/[0.08]">
        <button
          type="button"
          onClick={() => setShowColorGuide((prev) => !prev)}
          className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <Info size={13} className="text-slate-500" />
          <span className="font-medium underline underline-offset-2">
            {showColorGuide ? 'Hide Operational Color Protocol Guide' : 'What do these colors signify? (Operational Protocol Guide)'}
          </span>
          {showColorGuide ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        {showColorGuide && (
          <div className="mt-2.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.08] text-[11px] text-slate-600 dark:text-slate-400 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 animate-in fade-in duration-150">
            <div className="p-2 rounded bg-white dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06]">
              <strong className="text-red-700 dark:text-red-400 flex items-center gap-1">🔴 Critical Risk (Deep Red)</strong>
              <p className="mt-0.5 text-[10px]">Safety-critical defect (rail corrugation, contact wire thinning). Demands urgent night possession priority.</p>
            </div>
            <div className="p-2 rounded bg-white dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06]">
              <strong className="text-amber-600 dark:text-amber-400 flex items-center gap-1">🟠 High Risk (Amber)</strong>
              <p className="mt-0.5 text-[10px]">Rapid asset wear flagged by predictive ML (catenary sag, track modulus). 24–48h servicing window.</p>
            </div>
            <div className="p-2 rounded bg-white dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06]">
              <strong className="text-slate-700 dark:text-slate-300 flex items-center gap-1">🔘 Standard (Dark Slate)</strong>
              <p className="mt-0.5 text-[10px]">Routine periodic maintenance, ultrasonic scans, greasing inside regular traffic headway gaps.</p>
            </div>
            <div className="p-2 rounded bg-white dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06]">
              <strong className="text-orange-600 dark:text-orange-400 flex items-center gap-1">🟧 Rescheduled (Dashed Orange)</strong>
              <p className="mt-0.5 text-[10px]">Dynamically re-optimized by CP-SAT solver following a real-time train priority collision.</p>
            </div>
            <div className="p-2 rounded bg-white dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06]">
              <strong className="text-slate-700 dark:text-slate-300 flex items-center gap-1">◻️ Completed / Past (✓ Done Light Grey)</strong>
              <p className="mt-0.5 text-[10px]">Executed past maintenance possession. On-track work completed, field gang reported track clearance.</p>
            </div>
            <div className="p-2 rounded bg-white dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06]">
              <strong className="text-amber-700 dark:text-amber-300 flex items-center gap-1">🟡 Today Highlight (Light Yellow Tint)</strong>
              <p className="mt-0.5 text-[10px]">Active 24h operational cycle currently live, anchoring situational awareness for dispatchers.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
