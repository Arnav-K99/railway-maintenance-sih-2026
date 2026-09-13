import React, { useState } from 'react';
import { WeeklyBlockCalendar } from '../../components/operations/WeeklyBlockCalendar';
import { RerouteDiagram } from '../../components/operations/RerouteDiagram';
import { DecisionFlowDiagram } from '../../components/operations/DecisionFlowDiagram';
import { SihModePlayer } from '../../components/operations/SihModePlayer';
import { useLanguage } from '../../context/LanguageContext';
import { usePlan } from '../../context/PlanContext';
import { 
  Radio, 
  CalendarDays, 
  GitFork, 
  Layers, 
  Play, 
  ShieldCheck, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

export const Operations = () => {
  const { t } = useLanguage();
  const { isReplanned, toggleReplan } = usePlan();

  const [isSihModeActive, setIsSihModeActive] = useState(false);
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar' | 'rerouting' | 'decision-flow'

  return (
    <div className="space-y-5">
      {/* Operations Page Header with Top-Right [ ▶ SIH MODE ] Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-govnavy-700 dark:text-govnavy-300 uppercase tracking-wider">
            <Radio size={14} className="text-govnavy-700 animate-pulse" />
            <span>{t('operations', 'Operations Command Center')}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            {t('weeklyBlockCalendar', 'Master Weekly Block Planning & Operations')}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            {t('calendarSubtitle', 'Master 7-day rolling horizon with conflict-free possession allocations and dynamic operational loop.')}
          </p>
        </div>

        {/* Top Right: [ ▶ SIH MODE ] Button (Section 15 & 18) */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsSihModeActive(!isSihModeActive)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded font-bold text-xs uppercase tracking-wider transition-all shadow-2xs ${
              isSihModeActive
                ? 'bg-saffron text-govnavy-950 ring-2 ring-saffron-dark'
                : 'bg-govnavy-800 hover:bg-govnavy-700 text-white dark:bg-govnavy-700 dark:hover:bg-govnavy-600'
            }`}
          >
            <Play size={13} className={isSihModeActive ? 'fill-current' : ''} />
            <span>{t('sihModeBtn', '▶ SIH MODE')}</span>
          </button>
        </div>
      </div>

      {/* SIH Mode Player Stepper (When active) */}
      {isSihModeActive && (
        <SihModePlayer onClose={() => setIsSihModeActive(false)} />
      )}

      {/* View Switcher Tabs: Calendar, Rerouting Schematic, Operational Decision Flow */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
              activeTab === 'calendar'
                ? 'bg-govnavy-800 text-white dark:bg-govnavy-700 shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            <CalendarDays size={13} />
            <span>{t('weeklyBlockCalendar', 'Weekly Block Calendar')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rerouting')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
              activeTab === 'rerouting'
                ? 'bg-govnavy-800 text-white dark:bg-govnavy-700 shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            <GitFork size={13} />
            <span>{t('rerouteSchematicTitle', 'Train Rerouting Schematic')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('decision-flow')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
              activeTab === 'decision-flow'
                ? 'bg-govnavy-800 text-white dark:bg-govnavy-700 shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            <Layers size={13} />
            <span>{t('operationalDecisionFlow', 'Decision Closed Loop')}</span>
          </button>
        </div>

        {/* Schedule Mode Indicator Toggle */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 text-[11px] font-medium">Demonstrated Slot:</span>
          <button
            type="button"
            onClick={() => toggleReplan()}
            className={`px-2.5 py-0.5 rounded text-xs font-bold font-mono transition-colors border ${
              isReplanned
                ? 'bg-orange-50 text-orange-900 border-orange-300 dark:bg-orange-950 dark:text-orange-200 dark:border-orange-800'
                : 'bg-blue-50 text-blue-900 border-blue-300 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800'
            }`}
          >
            {isReplanned ? 'Replanned State (08 Sep)' : 'Original State (07 Sep)'}
          </button>
        </div>
      </div>

      {/* Tab Content Display */}
      <div>
        {activeTab === 'calendar' && <WeeklyBlockCalendar />}
        {activeTab === 'rerouting' && (
          <div className="space-y-4">
            <RerouteDiagram trainId="TRN-SIM-001" section="SEC-0004" isBlocked={false} />
            <RerouteDiagram trainId="TRN-SIM-002" section="SEC-0004" isBlocked={true} />
          </div>
        )}
        {activeTab === 'decision-flow' && <DecisionFlowDiagram />}
      </div>
    </div>
  );
};
