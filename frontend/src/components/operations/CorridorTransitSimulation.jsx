import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  AlertTriangle, 
  CheckCircle2, 
  Wrench, 
  ArrowRight, 
  TrainTrack, 
  GitFork, 
  Gauge, 
  ShieldCheck, 
  Radio, 
  X,
  Compass,
  Sliders
} from 'lucide-react';

// Static Network Stations (Schematic Coordinates matching the Corridor)
const STATIONS = [
  { id: 'SEC-0001', name: 'Delhi', x: 80, y: 220, code: 'SEC-0001', isMaint: false },
  { id: 'SEC-0002', name: 'Sonipat', x: 230, y: 120, code: 'SEC-0002', isMaint: false },
  { id: 'SEC-0003', name: 'Rohtak', x: 230, y: 320, code: 'SEC-0003', isMaint: false },
  { id: 'SEC-0004', name: 'Panipat', x: 430, y: 220, code: 'SEC-0004', isMaint: true, maintDesc: 'Track 1: OHE Catenary & Rail Grinding Window' },
  { id: 'SEC-0005', name: 'Karnal', x: 600, y: 120, code: 'SEC-0005', isMaint: false },
  { id: 'SEC-0007', name: 'Jind', x: 600, y: 320, code: 'SEC-0007', isMaint: true, maintDesc: 'Loop Siding Possession' },
  { id: 'SEC-0006', name: 'Kurukshetra', x: 760, y: 120, code: 'SEC-0006', isMaint: false },
  { id: 'SEC-0008', name: 'Ambala', x: 760, y: 220, code: 'SEC-0008', isMaint: true, maintDesc: 'Track 4: Ballast Tamping & Switch Service' },
  { id: 'SEC-0009', name: 'Kaithal', x: 760, y: 340, code: 'SEC-0009', isMaint: false },
  { id: 'SEC-0010', name: 'Chandigarh', x: 920, y: 220, code: 'SEC-0010', isMaint: false, isTerminal: true },
];

// Network Tracks
const TRACK_SEGMENTS = [
  { from: 'SEC-0001', to: 'SEC-0002' },
  { from: 'SEC-0001', to: 'SEC-0003' },
  { from: 'SEC-0002', to: 'SEC-0003' },
  { from: 'SEC-0002', to: 'SEC-0004' },
  { from: 'SEC-0003', to: 'SEC-0004' },
  { from: 'SEC-0004', to: 'SEC-0005' },
  { from: 'SEC-0004', to: 'SEC-0007' },
  { from: 'SEC-0005', to: 'SEC-0006' },
  { from: 'SEC-0005', to: 'SEC-0008' },
  { from: 'SEC-0006', to: 'SEC-0008' },
  { from: 'SEC-0007', to: 'SEC-0009' },
  { from: 'SEC-0008', to: 'SEC-0010' },
  { from: 'SEC-0009', to: 'SEC-0010' },
];

// Corridor Route Ordered Waypoints: Delhi -> Sonipat -> Rohtak -> Panipat -> Karnal -> Kurukshetra -> Ambala -> Chandigarh
const ROUTE_LEGS = [
  {
    legIndex: 0,
    fromId: 'SEC-0001',
    toId: 'SEC-0002',
    fromName: 'Delhi',
    toName: 'Sonipat',
    durationMs: 4500,
    hasEventAtEnd: false,
  },
  {
    legIndex: 1,
    fromId: 'SEC-0002',
    toId: 'SEC-0003',
    fromName: 'Sonipat',
    toName: 'Rohtak',
    durationMs: 4200,
    hasEventAtEnd: false,
  },
  {
    legIndex: 2,
    fromId: 'SEC-0003',
    toId: 'SEC-0004',
    fromName: 'Rohtak',
    toName: 'Panipat',
    durationMs: 4600,
    hasEventAtEnd: true,
    eventType: 'panipat',
  },
  {
    legIndex: 3,
    fromId: 'SEC-0004',
    toId: 'SEC-0005',
    fromName: 'Panipat',
    toName: 'Karnal',
    durationMs: 4400,
    hasEventAtEnd: false,
  },
  {
    legIndex: 4,
    fromId: 'SEC-0005',
    toId: 'SEC-0006',
    fromName: 'Karnal',
    toName: 'Kurukshetra',
    durationMs: 4200,
    hasEventAtEnd: false,
  },
  {
    legIndex: 5,
    fromId: 'SEC-0006',
    toId: 'SEC-0008',
    fromName: 'Kurukshetra',
    toName: 'Ambala',
    durationMs: 4600,
    hasEventAtEnd: true,
    eventType: 'ambala',
  },
  {
    legIndex: 6,
    fromId: 'SEC-0008',
    toId: 'SEC-0010',
    fromName: 'Ambala',
    toName: 'Chandigarh',
    durationMs: 4800,
    hasEventAtEnd: false,
    isFinal: true,
  },
];

export const CorridorTransitSimulation = () => {
  const { t } = useLanguage();

  // Transit Animation State (starts moving automatically!)
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [currentLegIndex, setCurrentLegIndex] = useState(0);
  const [legProgress, setLegProgress] = useState(0); // 0 to 1
  const [isCompleted, setIsCompleted] = useState(false);

  // Active Station Yard Modal ('panipat' | 'ambala' | null)
  const [activeModal, setActiveModal] = useState(null);
  const [modalProgress, setModalProgress] = useState(0); // 0 to 100% inside modal
  const [modalCountdown, setModalCountdown] = useState(12);
  const [modalPaused, setModalPaused] = useState(false);
  const [modalSpeed, setModalSpeed] = useState(1);

  // Event Log
  const [logs, setLogs] = useState([
    {
      id: 1,
      time: '08:00',
      type: 'info',
      msg: 'Express Service 01 departed Delhi (SEC-0001). Automatic Block Signalling active.',
    },
  ]);

  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(null);
  const logContainerRef = useRef(null);

  const addLog = (msg, type = 'info') => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    setLogs((prev) => [
      { id: Date.now() + Math.random(), time: timeStr, type, msg },
      ...prev.slice(0, 30),
    ]);
  };

  // Station coordinate map helper
  const stationMap = useMemo(() => {
    const map = {};
    STATIONS.forEach((s) => {
      map[s.id] = s;
    });
    return map;
  }, []);

  // Current train position interpolation on the main corridor
  const currentLeg = ROUTE_LEGS[currentLegIndex] || ROUTE_LEGS[0];
  const fromStation = stationMap[currentLeg.fromId];
  const toStation = stationMap[currentLeg.toId];

  // Helper to compute point and heading angle along current leg
  const getTrainPointOnMap = (offsetProgress = 0) => {
    if (isCompleted) {
      const chd = stationMap['SEC-0010'];
      return { x: chd.x, y: chd.y, angle: 0 };
    }
    if (!fromStation || !toStation) return { x: 80, y: 220, angle: 0 };

    const p = Math.max(0, Math.min(1, legProgress - offsetProgress));
    const curX = fromStation.x + (toStation.x - fromStation.x) * p;
    const curY = fromStation.y + (toStation.y - fromStation.y) * p;
    const angle = Math.atan2(toStation.y - fromStation.y, toStation.x - fromStation.x) * (180 / Math.PI);
    return { x: curX, y: curY, angle };
  };

  const trainPos = useMemo(() => getTrainPointOnMap(0), [fromStation, toStation, legProgress, isCompleted]);
  const coach1Pos = useMemo(() => getTrainPointOnMap(0.04), [fromStation, toStation, legProgress, isCompleted]);
  const coach2Pos = useMemo(() => getTrainPointOnMap(0.08), [fromStation, toStation, legProgress, isCompleted]);

  // Main Corridor Animation Loop
  useEffect(() => {
    if (!isPlaying || activeModal || isCompleted) {
      lastTimeRef.current = null;
      return;
    }

    const step = (now) => {
      if (!lastTimeRef.current) lastTimeRef.current = now;
      const delta = (now - lastTimeRef.current) * speedMultiplier;
      lastTimeRef.current = now;

      const legDuration = currentLeg.durationMs;
      const progressDelta = delta / legDuration;

      setLegProgress((prev) => {
        const next = prev + progressDelta;
        if (next >= 1) {
          // Arrived at destination station of current leg
          if (currentLeg.hasEventAtEnd) {
            // Trigger Station Yard Popup!
            setIsPlaying(false);
            setActiveModal(currentLeg.eventType);
            setModalProgress(0);
            setModalCountdown(12);
            setModalPaused(false);
            setModalSpeed(1);

            if (currentLeg.eventType === 'panipat') {
              addLog('Approaching Panipat (SEC-0004): Track 1 blocked by ongoing maintenance. Actuating switch crossover to Track 3.', 'warning');
            } else if (currentLeg.eventType === 'ambala') {
              addLog('Approaching Ambala (SEC-0008): Track 4 blocked by ongoing maintenance. Actuating switch crossover to Track 2.', 'warning');
            }
            return 1;
          }

          // Move to next leg if available
          if (currentLegIndex < ROUTE_LEGS.length - 1) {
            setCurrentLegIndex((c) => c + 1);
            addLog(`Express Service 01 passed ${toStation.name} (${toStation.code}). Signal aspect green for next section.`, 'success');
            return 0;
          } else {
            // Reached final destination
            setIsCompleted(true);
            setIsPlaying(false);
            addLog('Express Service 01 safely arrived at Chandigarh Terminal (SEC-0010). Mission accomplished on time.', 'success');
            return 1;
          }
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [isPlaying, activeModal, isCompleted, currentLegIndex, currentLeg, speedMultiplier, toStation]);

  // Station Modal Animation Loop (Smooth 60fps with slower, deliberate switching)
  useEffect(() => {
    if (!activeModal || modalPaused) return;

    let last = performance.now();
    let frameId;

    const modalStep = (now) => {
      const dt = (now - last) / 1000; // in seconds
      last = now;

      setModalProgress((prev) => {
        // Full transition takes ~6.8 seconds total at 1x speed (14.8% per second)
        const next = prev + (dt * 14.8 * modalSpeed);
        if (next >= 100) return 100;
        return next;
      });

      frameId = requestAnimationFrame(modalStep);
    };

    frameId = requestAnimationFrame(modalStep);
    return () => cancelAnimationFrame(frameId);
  }, [activeModal, modalPaused, modalSpeed]);

  // Once the transition is shown (100%), automatically close modal and continue the journey!
  useEffect(() => {
    if (!activeModal || modalPaused) return;

    if (modalProgress >= 100) {
      const autoCloseTimer = setTimeout(() => {
        handleCloseModal();
      }, 450);
      return () => clearTimeout(autoCloseTimer);
    }
  }, [activeModal, modalProgress, modalPaused]);

  const handleCloseModal = () => {
    if (activeModal === 'panipat') {
      addLog('Panipat Yard: Transition complete via Track 3. Modal closed automatically; continuing journey towards Karnal.', 'success');
    } else if (activeModal === 'ambala') {
      addLog('Ambala Yard: Transition complete via Track 2. Modal closed automatically; continuing final leg to Chandigarh.', 'success');
    }

    setActiveModal(null);
    setModalProgress(0);

    // Advance to next leg and immediately continue transit!
    if (currentLegIndex < ROUTE_LEGS.length - 1) {
      setCurrentLegIndex((c) => c + 1);
      setLegProgress(0);
      setIsPlaying(true);
    }
  };

  const handlePlayPause = () => {
    if (isCompleted) {
      handleRestart();
      return;
    }
    setIsPlaying((p) => !p);
  };

  const handleRestart = () => {
    setIsPlaying(true);
    setActiveModal(null);
    setCurrentLegIndex(0);
    setLegProgress(0);
    setIsCompleted(false);
    setModalProgress(0);
    addLog('Simulation reset to Delhi (SEC-0001). Express Service 01 departs on schedule.', 'info');
  };

  const handleSkipNext = () => {
    if (activeModal) {
      handleCloseModal();
      return;
    }

    // Jump to Panipat
    if (currentLegIndex < 2) {
      setCurrentLegIndex(2);
      setLegProgress(0.98);
      setIsPlaying(true);
    } 
    // Jump to Ambala
    else if (currentLegIndex < 5) {
      setCurrentLegIndex(5);
      setLegProgress(0.98);
      setIsPlaying(true);
    } 
    // Jump to Chandigarh
    else {
      setCurrentLegIndex(6);
      setLegProgress(1);
      setIsCompleted(true);
      setIsPlaying(false);
      addLog('Fast forwarded to final destination: Express Service 01 berthed at Chandigarh (SEC-0010).', 'success');
    }
  };

  // Operational velocity
  const currentSpeed = isCompleted 
    ? 0 
    : activeModal 
      ? 24 
      : isPlaying 
        ? Math.round(98 + Math.sin(legProgress * Math.PI) * 22) 
        : 0;

  const currentStatusBadge = isCompleted
    ? { text: 'Arrived • Complete', bg: 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800' }
    : activeModal === 'panipat'
      ? { text: 'Panipat: Yard Crossover to Track 3', bg: 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800' }
      : activeModal === 'ambala'
        ? { text: 'Ambala: Yard Crossover to Track 2', bg: 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800' }
        : isPlaying
          ? { text: `In Transit • ${fromStation?.name || 'Delhi'} ➜ ${toStation?.name || 'Sonipat'}`, bg: 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800' }
          : { text: 'Paused', bg: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-white/[0.08] dark:text-slate-300 dark:border-white/[0.12]' };

  return (
    <div className="space-y-4">
      {/* Top Banner Control Bar (Matches user screenshot) */}
      <div className="mac-panel p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest block font-mono">
              OPERATIONAL CORRIDOR TRANSIT
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LIVE SIMULATION
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Express Service 01
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Delhi → Chandigarh (8 Waypoints)
            </span>
          </div>
        </div>

        {/* Action Buttons & Status */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold font-mono border ${currentStatusBadge.bg}`}>
            {currentStatusBadge.text}
          </span>

          {/* Speed Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-white/[0.06] p-0.5 rounded-lg border border-slate-200 dark:border-white/[0.08] text-xs font-mono font-bold">
            {[1, 2, 4].map((mult) => (
              <button
                key={mult}
                type="button"
                onClick={() => setSpeedMultiplier(mult)}
                className={`px-2 py-1 rounded-md transition-colors ${
                  speedMultiplier === mult
                    ? 'bg-white text-slate-900 shadow-2xs dark:bg-slate-800 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
                title={`Playback speed ${mult}x`}
              >
                {mult}x
              </button>
            ))}
          </div>

          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={handlePlayPause}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? 'Pause' : isCompleted ? 'Replay' : 'Play'}</span>
          </button>

          {/* Skip to Next Event */}
          <button
            type="button"
            onClick={handleSkipNext}
            disabled={isCompleted}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-white/[0.08] transition-colors disabled:opacity-50 cursor-pointer"
            title="Skip to next station or yard event"
          >
            <FastForward size={14} />
            <span className="hidden sm:inline">Skip to Next Event</span>
          </button>

          {/* Restart Button */}
          <button
            type="button"
            onClick={handleRestart}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] dark:text-slate-300 border border-slate-200 dark:border-white/[0.08] transition-colors cursor-pointer"
            title="Restart Corridor Transit"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Main Railway Schematic Canvas Panel (Matches user screenshot) */}
      <div className="mac-panel p-5 space-y-3 relative overflow-hidden">
        {/* Schematic Header and Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-white/[0.06] pb-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Railway schematic & dynamic train paths
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Monitored corridor: Delhi → Sonipat → Rohtak → Panipat → Karnal → Kurukshetra → Ambala → Chandigarh
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-700 border border-slate-400 dark:border-slate-500" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-500 border border-amber-600 shadow-2xs" />
              <span>Maintenance possession</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-1.5 rounded bg-blue-600 dark:bg-blue-400" />
              <span>Route adjustment</span>
            </div>
          </div>
        </div>

        {/* SVG Network Schematic */}
        <div className="relative w-full overflow-x-auto custom-scrollbar">
          <svg
            viewBox="0 0 1000 420"
            className="w-full min-w-[780px] h-[350px] select-none"
          >
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" className="text-slate-200/40 dark:text-white/[0.02]" strokeWidth="0.8" />
              </pattern>
              {/* Pulsating glow for train */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              {/* Headlight beam gradient */}
              <linearGradient id="headlightCone" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </linearGradient>
            </defs>

            <rect width="1000" height="420" fill="url(#grid)" />

            {/* 1. Inactive/Available Track Lines (Base Network) */}
            {TRACK_SEGMENTS.map((seg, idx) => {
              const s1 = stationMap[seg.from];
              const s2 = stationMap[seg.to];
              if (!s1 || !s2) return null;
              return (
                <line
                  key={`track-${idx}`}
                  x1={s1.x}
                  y1={s1.y}
                  x2={s2.x}
                  y2={s2.y}
                  stroke="#cbd5e1"
                  strokeWidth="6"
                  strokeLinecap="round"
                  className="dark:stroke-slate-700/80 transition-colors"
                />
              );
            })}

            {/* 2. Traversed Route Segments (Glowing Blue Active Track Path) */}
            {ROUTE_LEGS.slice(0, currentLegIndex).map((leg, idx) => {
              const s1 = stationMap[leg.fromId];
              const s2 = stationMap[leg.toId];
              return (
                <line
                  key={`done-leg-${idx}`}
                  x1={s1.x}
                  y1={s1.y}
                  x2={s2.x}
                  y2={s2.y}
                  stroke="#2563eb"
                  strokeWidth="7"
                  strokeLinecap="round"
                  className="dark:stroke-blue-500 opacity-90"
                />
              );
            })}

            {/* Currently Active Leg Progress Line */}
            {!isCompleted && fromStation && toStation && (
              <line
                x1={fromStation.x}
                y1={fromStation.y}
                x2={trainPos.x}
                y2={trainPos.y}
                stroke="#2563eb"
                strokeWidth="7"
                strokeLinecap="round"
                className="dark:stroke-blue-400"
                filter="url(#glow)"
              />
            )}

            {/* 3. Station Nodes (Matching user screenshot nodes) */}
            {STATIONS.map((station) => {
              const isCurrent = (fromStation?.id === station.id) || (toStation?.id === station.id && legProgress > 0.8);
              const isVisited = ROUTE_LEGS.slice(0, currentLegIndex).some(l => l.fromId === station.id) || (isCompleted && station.id === 'SEC-0010');

              return (
                <g key={station.id} className="transition-transform duration-300">
                  {/* Outer Station Box */}
                  <rect
                    x={station.x - 42}
                    y={station.y - 28}
                    width="84"
                    height="54"
                    rx="8"
                    className={`transition-all duration-300 ${
                      station.isMaint
                        ? 'fill-amber-50 stroke-amber-500 dark:fill-amber-950/40 dark:stroke-amber-500 stroke-2'
                        : isCurrent
                          ? 'fill-blue-50 stroke-blue-500 dark:fill-blue-950/40 dark:stroke-blue-400 stroke-2'
                          : isVisited
                            ? 'fill-slate-100 stroke-slate-300 dark:fill-slate-800/80 dark:stroke-slate-600 stroke-1'
                            : 'fill-white stroke-slate-300 dark:fill-[#16191E] dark:stroke-white/[0.12] stroke-1'
                    }`}
                  />

                  {/* Station Active Dot */}
                  <circle
                    cx={station.x - 28}
                    cy={station.y - 12}
                    r="4"
                    className={
                      station.isMaint
                        ? 'fill-amber-500 animate-pulse'
                        : isVisited || isCurrent
                          ? 'fill-blue-600 dark:fill-blue-400'
                          : 'fill-slate-400'
                    }
                  />

                  {/* Station Name */}
                  <text
                    x={station.x - 18}
                    y={station.y - 8}
                    className="text-[12px] font-bold fill-slate-900 dark:fill-white font-sans select-none"
                  >
                    {station.name}
                  </text>

                  {/* Section Identifier Code */}
                  <text
                    x={station.x}
                    y={station.y + 12}
                    textAnchor="middle"
                    className="text-[10px] font-mono font-semibold fill-slate-400 dark:fill-slate-500 select-none"
                  >
                    {station.code}
                  </text>

                  {/* Maintenance Hazard Badge for Panipat / Jind / Ambala */}
                  {station.isMaint && (
                    <g transform={`translate(${station.x + 24}, ${station.y - 28})`}>
                      <circle cx="6" cy="6" r="8" className="fill-amber-500 shadow-md" />
                      <text x="6" y="9" textAnchor="middle" className="text-[9px] font-bold fill-white select-none">!</text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* 4. Multi-Coach Articulated Moving Train (Locomotive + Coaches) */}
            {/* Trailing Coach 2 */}
            {!isCompleted && legProgress > 0.08 && (
              <g
                transform={`translate(${coach2Pos.x}, ${coach2Pos.y}) rotate(${coach2Pos.angle})`}
                className="pointer-events-none"
              >
                <rect
                  x="-12"
                  y="-6"
                  width="24"
                  height="12"
                  rx="3"
                  className="fill-slate-700 dark:fill-slate-300 stroke-slate-900 dark:stroke-slate-950 stroke-1 shadow-sm"
                />
                <circle cx="-5" cy="0" r="1.5" className="fill-white dark:fill-slate-900" />
                <circle cx="5" cy="0" r="1.5" className="fill-white dark:fill-slate-900" />
              </g>
            )}

            {/* Trailing Coach 1 */}
            {!isCompleted && legProgress > 0.04 && (
              <g
                transform={`translate(${coach1Pos.x}, ${coach1Pos.y}) rotate(${coach1Pos.angle})`}
                className="pointer-events-none"
              >
                <rect
                  x="-12"
                  y="-6"
                  width="24"
                  height="12"
                  rx="3"
                  className="fill-blue-700 dark:fill-blue-500 stroke-slate-900 dark:stroke-slate-950 stroke-1 shadow-sm"
                />
                <circle cx="-5" cy="0" r="1.5" className="fill-white dark:fill-slate-900" />
                <circle cx="5" cy="0" r="1.5" className="fill-white dark:fill-slate-900" />
              </g>
            )}

            {/* Lead Locomotive Engine */}
            <g
              transform={`translate(${trainPos.x}, ${trainPos.y}) rotate(${trainPos.angle})`}
              className="pointer-events-none"
            >
              {/* Forward Headlight Beam Cone illuminating the track ahead */}
              <polygon
                points="12,-4 50,-18 50,18 12,4"
                fill="url(#headlightCone)"
                className="pointer-events-none"
              />

              {/* Pulsing ring beacon */}
              <circle
                r="18"
                className="fill-blue-500/20 dark:fill-blue-400/20 animate-ping"
              />

              {/* Locomotive Body */}
              <rect
                x="-14"
                y="-8"
                width="28"
                height="16"
                rx="4"
                className="fill-slate-900 dark:fill-white stroke-blue-500 stroke-2 shadow-lg"
              />

              {/* Engine Windows */}
              <rect
                x="4"
                y="-5"
                width="6"
                height="10"
                rx="1.5"
                className="fill-cyan-400 dark:fill-cyan-600"
              />
              <circle cx="-4" cy="-4" r="1.5" className="fill-amber-400" />
              <circle cx="-4" cy="4" r="1.5" className="fill-amber-400" />

              {/* Headlight bulb */}
              <circle cx="14" cy="0" r="2.5" className="fill-white shadow-md animate-pulse" />
            </g>

            {/* Floating Black Pill Tag on Top of Train */}
            <g transform={`translate(${trainPos.x}, ${trainPos.y - 28})`} className="pointer-events-none">
              <rect
                x="-60"
                y="-11"
                width="120"
                height="22"
                rx="6"
                className="fill-slate-900/90 dark:fill-slate-950/90 stroke-white/20 stroke-1 shadow-lg backdrop-blur-xs"
              />
              <text
                x="0"
                y="3"
                textAnchor="middle"
                className="text-[10px] font-mono font-bold fill-white tracking-wide select-none"
              >
                Express Service 01
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Floating Modal Overlay: 4-Track Station Yard Zoom (Panipat & Ambala) */}
      {activeModal && (
        <StationYardModal
          stationType={activeModal}
          progress={modalProgress}
          countdown={modalCountdown}
          isPaused={modalPaused}
          onTogglePause={() => setModalPaused((p) => !p)}
          speed={modalSpeed}
          onSetSpeed={setModalSpeed}
          onClose={handleCloseModal}
        />
      )}

      {/* Bottom Telemetry & Corridor Event Log (Matches user screenshot) */}
      <div className="grid md:grid-cols-12 gap-4">
        {/* Left: Operational Status Panel (5 cols) */}
        <div className="md:col-span-5 mac-panel p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] pb-2.5">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                  LIVE TELEMETRY
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Operational status panel
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-500 font-semibold">
                SERVICE: Express Service 01
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5 mt-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase font-semibold">
                  <Gauge size={12} />
                  <span>Velocity</span>
                </div>
                <div className="text-base font-mono font-bold text-slate-900 dark:text-white mt-1">
                  {currentSpeed} <span className="text-[11px] font-normal text-slate-400">km/h</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase font-semibold">
                  <Compass size={12} />
                  <span>Next Waypoint</span>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white mt-1 truncate">
                  {isCompleted ? 'Chandigarh (Arrived)' : toStation?.name || 'Panipat'}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase font-semibold">
                  <GitFork size={12} />
                  <span>Active Track</span>
                </div>
                <div className="text-xs font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">
                  {activeModal === 'panipat' ? 'Track 3 (Crossover Diverted)' : activeModal === 'ambala' ? 'Track 2 (Crossover Diverted)' : 'Main Line (Clear)'}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase font-semibold">
                  <ShieldCheck size={12} />
                  <span>Block Safety</span>
                </div>
                <div className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Clearance Preserved</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] text-[11px] text-slate-500 flex items-center justify-between">
            <span>Interlocking: Electronic (EI-Q4)</span>
            <span className="font-mono">Delay: +00:00 (On-Time)</span>
          </div>
        </div>

        {/* Right: Corridor Transit Event Log (7 cols) */}
        <div className="md:col-span-7 mac-panel p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] pb-2.5">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">
                OPERATIONAL TELEMETRY
              </span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Corridor transit event log
              </h4>
            </div>
            <span className="text-[10px] font-mono text-slate-400 font-semibold">
              {logs.length} events
            </span>
          </div>

          <div
            ref={logContainerRef}
            className="space-y-2 mt-3 overflow-y-auto max-h-[170px] custom-scrollbar pr-1"
          >
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-2.5 text-xs p-2 rounded-lg bg-slate-50/70 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04]"
              >
                <span className="font-mono text-[10px] text-slate-400 shrink-0 mt-0.5">
                  [{log.time}]
                </span>
                <div className="flex-1">
                  <span className={`font-medium ${
                    log.type === 'warning'
                      ? 'text-amber-700 dark:text-amber-300'
                      : log.type === 'success'
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    {log.msg}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Trajectory calculation function for the 4-track yard modal
const getTrainPointInYard = (pVal, isPanipat) => {
  const p = Math.max(0, Math.min(1, pVal));

  if (isPanipat) {
    // Panipat: Track 1 (Y: 65) -> Crossover (X: 180 to 420, Y: 65 to 185) -> Track 3 (Y: 185)
    if (p <= 0.25) {
      // Phase 1: Approach along Track 1
      const sub = p / 0.25;
      const x = 90 + sub * 90; // 90 to 180
      return { x, y: 65, angle: 0 };
    } else if (p <= 0.70) {
      // Phase 2: SLOW, DELIBERATE CROSSOVER SWITCH (45% of total time!)
      const sub = (p - 0.25) / 0.45; // 0 to 1
      const x = 180 + sub * 240; // 180 to 420
      // Smooth S-curve (cubic hermite)
      const smoothSub = sub * sub * (3 - 2 * sub);
      const y = 65 + smoothSub * 120; // 65 to 185
      // Derivative for exact tangent angle
      const dy = 120 * 6 * sub * (1 - sub);
      const dx = 240;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      return { x, y, angle };
    } else {
      // Phase 3: Glide along Track 3
      const sub = (p - 0.70) / 0.30;
      const x = 420 + sub * 360; // 420 to 780
      return { x, y: 185, angle: 0 };
    }
  } else {
    // Ambala: Track 4 (Y: 245) -> Crossover (X: 180 to 420, Y: 245 to 125) -> Track 2 (Y: 125)
    if (p <= 0.25) {
      // Approach along Track 4
      const sub = p / 0.25;
      const x = 90 + sub * 90; // 90 to 180
      return { x, y: 245, angle: 0 };
    } else if (p <= 0.70) {
      // Phase 2: SLOW, DELIBERATE CROSSOVER SWITCH (45% of total time!)
      const sub = (p - 0.25) / 0.45;
      const x = 180 + sub * 240; // 180 to 420
      const smoothSub = sub * sub * (3 - 2 * sub);
      const y = 245 - smoothSub * 120; // 245 to 125
      const dy = -120 * 6 * sub * (1 - sub);
      const dx = 240;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      return { x, y, angle };
    } else {
      // Phase 3: Glide along Track 2
      const sub = (p - 0.70) / 0.30;
      const x = 420 + sub * 360; // 420 to 780
      return { x, y: 125, angle: 0 };
    }
  }
};

// 4-Track Station Yard Modal Component (Panipat & Ambala) with Slower Switching & Controls
const StationYardModal = ({ 
  stationType, 
  progress, 
  countdown, 
  isPaused, 
  onTogglePause, 
  speed, 
  onSetSpeed, 
  onClose 
}) => {
  const isPanipat = stationType === 'panipat';

  // Station specific specifications
  const stationConfig = isPanipat
    ? {
        name: 'PANIPAT JUNCTION',
        section: 'SEC-0004',
        defaultTrack: 'Track 1',
        divertedTrack: 'Track 3',
        blockedTrack: 'Track 1',
        blockedReason: 'OHE Catenary Tensioning & Rail Grinding Window',
        switchLabel: 'Turnout 42B',
        switchDirection: 'Slow Turnout Crossover to Track 3',
      }
    : {
        name: 'AMBALA CANTT JUNCTION',
        section: 'SEC-0008',
        defaultTrack: 'Track 4',
        divertedTrack: 'Track 2',
        blockedTrack: 'Track 4',
        blockedReason: 'Ballast Shoulder Tamping & Point Machine Maintenance',
        switchLabel: 'Turnout 18A',
        switchDirection: 'Slow Turnout Crossover to Track 2',
      };

  // 4 Tracks definition for SVG
  const tracks = [
    { num: 1, label: 'Track 1 (Platform 1)', y: 65, isBlocked: isPanipat, isDiverted: false },
    { num: 2, label: 'Track 2 (Platform 2)', y: 125, isBlocked: false, isDiverted: !isPanipat },
    { num: 3, label: 'Track 3 (Platform 3)', y: 185, isBlocked: false, isDiverted: isPanipat },
    { num: 4, label: 'Track 4 (Platform 4)', y: 245, isBlocked: !isPanipat, isDiverted: false },
  ];

  // Calculate coordinates for multi-coach train
  const pNorm = progress / 100;
  const leadPos = useMemo(() => getTrainPointInYard(pNorm, isPanipat), [pNorm, isPanipat]);
  const coach1Pos = useMemo(() => getTrainPointInYard(Math.max(0, pNorm - 0.055), isPanipat), [pNorm, isPanipat]);
  const coach2Pos = useMemo(() => getTrainPointInYard(Math.max(0, pNorm - 0.11), isPanipat), [pNorm, isPanipat]);

  // Current yard action phase description
  const phaseDescription = useMemo(() => {
    if (pNorm < 0.25) {
      return {
        stage: 'APPROACHING YARD (30 km/h)',
        detail: `Approaching on ${stationConfig.blockedTrack}. Interlocking signal indicates Red Stop aspect ahead due to maintenance.`,
        color: 'text-amber-600 dark:text-amber-400',
      };
    } else if (pNorm < 0.70) {
      return {
        stage: 'TURNOUT SWITCHING IN PROGRESS (15 km/h Slow Speed)',
        detail: `Switch ${stationConfig.switchLabel} actuated. Train smoothly diverting across crossover to ${stationConfig.divertedTrack}.`,
        color: 'text-blue-600 dark:text-blue-400',
      };
    } else {
      return {
        stage: 'CLEARANCE ACHIEVED (45 km/h Accelerating)',
        detail: `Safely traversing ${stationConfig.divertedTrack} past station platform. Resuming mainline clearance.`,
        color: 'text-emerald-600 dark:text-emerald-400',
      };
    }
  }, [pNorm, stationConfig]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl bg-white dark:bg-[#15181E] border border-slate-200 dark:border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-white/[0.08] flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500 text-white shadow-2xs">
                INTERLOCKING DIVERSION
              </span>
              <span className="font-mono text-xs font-semibold text-slate-500">
                {stationConfig.section}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              {stationConfig.name} • 4-Track Yard Topology
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Modal Speed Toggle */}
            <div className="hidden sm:flex items-center bg-slate-100 dark:bg-white/[0.06] p-0.5 rounded-lg border border-slate-200 dark:border-white/[0.08] text-xs font-mono font-bold">
              {[0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onSetSpeed(s)}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    speed === s
                      ? 'bg-white text-slate-900 shadow-2xs dark:bg-slate-800 dark:text-white'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={`${s}x yard playback speed`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Modal Pause / Resume Button */}
            <button
              type="button"
              onClick={onTogglePause}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-white/[0.08] transition-colors cursor-pointer"
              title={isPaused ? 'Resume switching animation' : 'Pause switching animation'}
            >
              {isPaused ? <Play size={13} /> : <Pause size={13} />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>

            <div className="flex items-center gap-1.5 text-xs font-mono">
              {progress >= 98 ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-300 dark:border-emerald-800 animate-pulse">
                  <CheckCircle2 size={13} className="text-emerald-500" />
                  <span>Transition Complete • Resuming Journey...</span>
                </span>
              ) : (
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  Switching Track: <strong className="text-blue-600 dark:text-blue-400 font-bold">{Math.round(progress)}%</strong>
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/[0.08] text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
              title="Close and continue transit immediately"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Real-time Transition Progress Bar */}
        <div className="w-full h-1 bg-slate-100 dark:bg-white/[0.05] overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Warning & Active Switch Info Banner */}
        <div className="px-6 py-2.5 bg-amber-500/10 dark:bg-amber-500/[0.08] border-b border-amber-500/20 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-semibold">
            <AlertTriangle size={15} className="text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              Ongoing Maintenance on <strong>{stationConfig.blockedTrack}</strong>: {stationConfig.blockedReason}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-700 dark:text-blue-300">
            <GitFork size={14} className="text-blue-600 animate-pulse" />
            <span>Switch {stationConfig.switchLabel}: Diverting to {stationConfig.divertedTrack}</span>
          </div>
        </div>

        {/* Dynamic Phase Status Ribbon */}
        <div className="px-6 py-2 bg-slate-100/70 dark:bg-white/[0.03] border-b border-slate-200/60 dark:border-white/[0.06] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className={`font-mono font-bold uppercase tracking-wider text-[11px] ${phaseDescription.color}`}>
              {phaseDescription.stage}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600 dark:text-slate-300">
              {phaseDescription.detail}
            </span>
          </div>
          <span className="font-mono text-[11px] font-semibold text-slate-400">
            {Math.round(progress)}% Complete
          </span>
        </div>

        {/* 4-Track Schematic SVG Canvas */}
        <div className="p-6 bg-slate-50/60 dark:bg-black/35 overflow-x-auto">
          <svg viewBox="0 0 820 310" className="w-full min-w-[740px] h-[270px] select-none">
            <defs>
              {/* Striped hazard pattern for blocked track */}
              <pattern id="hazardStripes" width="20" height="20" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="20" stroke="#f59e0b" strokeWidth="8" strokeOpacity="0.45" />
              </pattern>
              {/* Crossover glow filter */}
              <filter id="switchGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* 4 Parallel Tracks */}
            {tracks.map((t) => {
              return (
                <g key={t.num}>
                  {/* Clean Rail Lines (Segmented so lines NEVER cut through text or platform badges!) */}
                  {t.isBlocked ? (
                    // Blocked Track: Rail from start (68) to turnout start (180), with red buffer stop barrier
                    <>
                      <line
                        x1="68"
                        y1={t.y}
                        x2="190"
                        y2={t.y}
                        stroke="#94a3b8"
                        strokeWidth="4"
                        className="dark:stroke-slate-600"
                      />
                      {/* Red Buffer Stop Barrier on Blocked Track */}
                      <g transform={`translate(190, ${t.y - 11})`}>
                        <rect width="6" height="22" rx="2" className="fill-red-600 shadow-sm" />
                        <line x1="1" y1="6" x2="5" y2="6" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="1" y1="16" x2="5" y2="16" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                      </g>
                    </>
                  ) : t.isDiverted ? (
                    // Diverted Route: Normal approach rail up to crossover junction (420), then GLOWING BLUE ROUTE LINE to platform
                    <>
                      <line
                        x1="68"
                        y1={t.y}
                        x2="420"
                        y2={t.y}
                        stroke="#94a3b8"
                        strokeWidth="4"
                        className="dark:stroke-slate-700"
                      />
                      {/* Active Locked Route to Station Platform */}
                      <line
                        x1="420"
                        y1={t.y}
                        x2="590"
                        y2={t.y}
                        stroke="#2563eb"
                        strokeWidth="5"
                        strokeLinecap="round"
                        filter="url(#switchGlow)"
                      />
                      <line
                        x1="772"
                        y1={t.y}
                        x2="800"
                        y2={t.y}
                        stroke="#2563eb"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                    </>
                  ) : (
                    // Normal Clear Track: Continuous rail up to platform dock (590) and exit (772 to 800)
                    <>
                      <line
                        x1="68"
                        y1={t.y}
                        x2="590"
                        y2={t.y}
                        stroke="#94a3b8"
                        strokeWidth="4"
                        className="dark:stroke-slate-700"
                      />
                      <line
                        x1="772"
                        y1={t.y}
                        x2="800"
                        y2={t.y}
                        stroke="#94a3b8"
                        strokeWidth="4"
                        className="dark:stroke-slate-700"
                      />
                    </>
                  )}

                  {/* Track Pill & Interlocking Signal on Far Left (X: 8 to 64) */}
                  <g transform={`translate(8, ${t.y - 12})`}>
                    <rect
                      x="0"
                      y="0"
                      width="56"
                      height="24"
                      rx="6"
                      className={`stroke-1 ${
                        t.isBlocked
                          ? 'fill-red-50 stroke-red-300 dark:fill-red-950/70 dark:stroke-red-800'
                          : t.isDiverted
                            ? 'fill-emerald-50 stroke-emerald-400 dark:fill-emerald-950/70 dark:stroke-emerald-700'
                            : 'fill-white stroke-slate-200 dark:fill-[#151921] dark:stroke-white/10'
                      } shadow-xs`}
                    />
                    <circle
                      cx="10"
                      cy="12"
                      r="3.5"
                      className={
                        t.isBlocked
                          ? 'fill-red-500 animate-pulse'
                          : t.isDiverted
                            ? 'fill-emerald-500 shadow-sm'
                            : 'fill-slate-400 dark:fill-slate-500'
                      }
                    />
                    <text
                      x="20"
                      y="16"
                      className={`text-[10px] font-mono font-bold select-none ${
                        t.isBlocked
                          ? 'fill-red-600 dark:fill-red-400'
                          : t.isDiverted
                            ? 'fill-emerald-600 dark:fill-emerald-400 font-extrabold'
                            : 'fill-slate-600 dark:fill-slate-400'
                      }`}
                    >
                      Track {t.num}
                    </text>
                  </g>

                  {/* Blocked Track Maintenance Warning Banner (X: 215 to 570, solid background, zero line strikethrough!) */}
                  {t.isBlocked && (
                    <g transform={`translate(215, ${t.y - 15})`}>
                      <rect
                        width="355"
                        height="30"
                        rx="6"
                        className="fill-amber-50 dark:fill-[#1c1409] stroke-amber-500 dark:stroke-amber-500/80 stroke-[1.5] shadow-xs"
                      />
                      {/* Warning Icon Badge */}
                      <rect
                        x="8"
                        y="5"
                        width="20"
                        height="20"
                        rx="4"
                        className="fill-amber-500"
                      />
                      <g transform="translate(11, 8)">
                        <path d="M 7 2 L 1 12 L 13 12 Z M 7 6 L 7 8 M 7 10 L 7 10.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                      </g>
                      <text
                        x="36"
                        y="19"
                        className="text-[10px] font-bold fill-amber-950 dark:fill-amber-200 tracking-wide select-none uppercase"
                      >
                        MAINTENANCE WORK • TRACK {t.num} BLOCKED
                      </text>
                      {/* Right edge hazard stripe accent (35px width) */}
                      <rect
                        x="320"
                        y="2"
                        width="32"
                        height="26"
                        rx="4"
                        fill="url(#hazardStripes)"
                        opacity="0.8"
                      />
                    </g>
                  )}

                  {/* Floating Route Clearance Pill in Corridor Above Assigned Track */}
                  {t.isDiverted && (
                    <g transform={`translate(425, ${t.y - 25})`}>
                      <rect
                        width="180"
                        height="20"
                        rx="10"
                        className="fill-blue-50 dark:fill-[#0c1a2e] stroke-blue-500/70 dark:stroke-blue-400/60 stroke-1 shadow-xs"
                      />
                      <circle cx="10" cy="10" r="3" className="fill-blue-500 animate-pulse" />
                      <text
                        x="18"
                        y="14"
                        className="text-[9.5px] font-mono font-extrabold fill-blue-700 dark:fill-blue-300 tracking-wider select-none uppercase"
                      >
                        ✓ DIVERSION CLEARED ➔ PF {t.num}
                      </text>
                    </g>
                  )}

                  {/* Station Platform Docks (Right Side: X = 590 to 770, solid background, zero line strikethrough!) */}
                  <g transform={`translate(590, ${t.y - 14})`}>
                    <rect
                      width="180"
                      height="28"
                      rx="6"
                      className={`stroke-1 ${
                        t.isBlocked
                          ? 'fill-red-50 dark:fill-[#1e1112] stroke-red-400 dark:stroke-red-900/60'
                          : t.isDiverted
                            ? 'fill-emerald-50 dark:fill-[#0c2419] stroke-emerald-500 dark:stroke-emerald-500/60'
                            : 'fill-white dark:fill-[#151921] stroke-slate-200 dark:stroke-white/10'
                      } shadow-xs`}
                      strokeDasharray={t.isBlocked ? '4 2' : 'none'}
                    />
                    <circle
                      cx="14"
                      cy="14"
                      r="4"
                      className={
                        t.isBlocked
                          ? 'fill-red-500'
                          : t.isDiverted
                            ? 'fill-emerald-500 animate-pulse'
                            : 'fill-slate-400 dark:fill-slate-500'
                      }
                    />
                    <text
                      x="26"
                      y="18"
                      className={`text-[11px] font-mono select-none ${
                        t.isBlocked
                          ? 'font-bold fill-red-600 dark:fill-red-400'
                          : t.isDiverted
                            ? 'font-extrabold fill-emerald-700 dark:fill-emerald-300'
                            : 'font-semibold fill-slate-700 dark:fill-slate-300'
                      }`}
                    >
                      {t.isBlocked
                        ? `Platform ${t.num} (Closed)`
                        : t.isDiverted
                          ? `Platform ${t.num} • Assigned Route`
                          : `Platform ${t.num}`}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Active Turnout Switch Crossover Rail Line (Smooth S-curve) */}
            {isPanipat ? (
              // Panipat Crossover: From Track 1 (Y: 65) to Track 3 (Y: 185)
              <g>
                <path
                  d="M 180 65 C 240 65, 360 185, 420 185"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="6"
                  strokeLinecap="round"
                  filter="url(#switchGlow)"
                  className="animate-pulse"
                />
                <circle cx="180" cy="65" r="5" className="fill-blue-600" />
                <circle cx="420" cy="185" r="5" className="fill-blue-600" />
                <g transform="translate(160, 48)">
                  <rect x="0" y="0" width="85" height="18" rx="4" className="fill-blue-600 text-white" />
                  <text x="42" y="12" textAnchor="middle" className="text-[10px] font-mono font-bold fill-white">
                    Turnout 42B
                  </text>
                </g>
              </g>
            ) : (
              // Ambala Crossover: From Track 4 (Y: 245) to Track 2 (Y: 125)
              <g>
                <path
                  d="M 180 245 C 240 245, 360 125, 420 125"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="6"
                  strokeLinecap="round"
                  filter="url(#switchGlow)"
                  className="animate-pulse"
                />
                <circle cx="180" cy="245" r="5" className="fill-blue-600" />
                <circle cx="420" cy="125" r="5" className="fill-blue-600" />
                <g transform="translate(160, 260)">
                  <rect x="0" y="0" width="85" height="18" rx="4" className="fill-blue-600 text-white" />
                  <text x="42" y="12" textAnchor="middle" className="text-[10px] font-mono font-bold fill-white">
                    Turnout 18A
                  </text>
                </g>
              </g>
            )}

            {/* Animated Train in Yard (Articulated Locomotive + Coaches) */}
            {/* Trailing Coach 2 */}
            {pNorm > 0.11 && (
              <g
                transform={`translate(${coach2Pos.x}, ${coach2Pos.y}) rotate(${coach2Pos.angle})`}
                className="pointer-events-none"
              >
                <rect
                  x="-22"
                  y="-11"
                  width="44"
                  height="22"
                  rx="4"
                  className="fill-slate-800 dark:fill-slate-300 stroke-slate-900 dark:stroke-slate-950 stroke-1 shadow-md"
                />
                <circle cx="-12" cy="0" r="2" className="fill-white dark:fill-slate-900" />
                <circle cx="0" cy="0" r="2" className="fill-white dark:fill-slate-900" />
                <circle cx="12" cy="0" r="2" className="fill-white dark:fill-slate-900" />
              </g>
            )}

            {/* Trailing Coach 1 */}
            {pNorm > 0.055 && (
              <g
                transform={`translate(${coach1Pos.x}, ${coach1Pos.y}) rotate(${coach1Pos.angle})`}
                className="pointer-events-none"
              >
                <rect
                  x="-22"
                  y="-11"
                  width="44"
                  height="22"
                  rx="4"
                  className="fill-blue-700 dark:fill-blue-500 stroke-slate-900 dark:stroke-slate-950 stroke-1 shadow-md"
                />
                <circle cx="-12" cy="0" r="2" className="fill-white dark:fill-slate-900" />
                <circle cx="0" cy="0" r="2" className="fill-white dark:fill-slate-900" />
                <circle cx="12" cy="0" r="2" className="fill-white dark:fill-slate-900" />
              </g>
            )}

            {/* Lead Locomotive */}
            <g
              transform={`translate(${leadPos.x}, ${leadPos.y}) rotate(${leadPos.angle})`}
              className="pointer-events-none"
            >
              {/* Forward headlight illumination cone */}
              <polygon
                points="18,-6 65,-22 65,22 18,6"
                fill="url(#headlightCone)"
                className="pointer-events-none"
              />

              {/* Engine Body */}
              <rect
                x="-26"
                y="-13"
                width="52"
                height="26"
                rx="6"
                className="fill-slate-900 dark:fill-white stroke-blue-500 stroke-2 shadow-xl"
              />

              {/* Locomotive Cab Windows */}
              <rect
                x="8"
                y="-9"
                width="10"
                height="18"
                rx="2"
                className="fill-cyan-400 dark:fill-cyan-600"
              />

              <text
                x="-8"
                y="4"
                textAnchor="middle"
                className="text-[10px] font-mono font-extrabold fill-white dark:fill-slate-950"
              >
                EXP-01
              </text>

              {/* Bright Headlight Bulb */}
              <circle cx="26" cy="0" r="3" className="fill-white shadow-lg animate-pulse" />
            </g>
          </svg>
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-white/[0.08] flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
            <span>
              Interlocking verified: Safe clearance through <strong>{stationConfig.divertedTrack}</strong> without passenger delays.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-xs font-bold transition-colors shadow-2xs cursor-pointer shrink-0"
            >
              <span>Continue Transit</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
