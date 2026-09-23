import React, { useState } from 'react';
import { WeeklyBlockCalendar } from '../../components/operations/WeeklyBlockCalendar';
import { RerouteDiagram } from '../../components/operations/RerouteDiagram';
import { DecisionFlowDiagram } from '../../components/operations/DecisionFlowDiagram';
import { useLanguage } from '../../context/LanguageContext';
import { usePlan } from '../../context/PlanContext';
import { 
  Radio, 
  CalendarDays, 
  GitFork, 
  Layers, 
  ShieldCheck, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

export const Operations = () => {
  const { t } = useLanguage();
  const { isReplanned, toggleReplan } = usePlan();

  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar' | 'rerouting' | 'decision-flow'

  return (
    <div className="space-y-5">
      {/* Operations Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/[0.08] pb-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <Radio size={14} className="text-blue-600 animate-pulse" />
            <span>{t('operations', 'Operations Command Center')}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {t('weeklyBlockCalendar', 'Master Weekly Block Planning & Operations')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t('calendarSubtitle', 'Master 7-day rolling horizon with conflict-free possession allocations and dynamic operational loop.')}
          </p>
        </div>

        {/* Schedule Mode Indicator Toggle */}
        <div className="flex items-center gap-2 text-xs shrink-0 self-start sm:self-auto">
          <span className="text-slate-400 text-xs font-medium">Slot State:</span>
          <button
            type="button"
            onClick={() => toggleReplan()}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all border shadow-xs ${
              isReplanned
                ? 'bg-orange-50 text-orange-900 border-orange-300 dark:bg-orange-950/60 dark:text-orange-200 dark:border-orange-800'
                : 'bg-blue-50 text-blue-900 border-blue-300 dark:bg-blue-950/60 dark:text-blue-200 dark:border-blue-800'
            }`}
          >
            {isReplanned ? 'Replanned State (08 Sep)' : 'Original State (07 Sep)'}
          </button>
        </div>
      </div>

      {/* View Switcher Tabs: Calendar, Rerouting Schematic, Operational Decision Flow */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-white/[0.08] pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs transition-all ${
              activeTab === 'calendar'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/[0.06] dark:text-slate-300 dark:hover:bg-white/[0.12] font-medium'
            }`}
          >
            <CalendarDays size={13} />
            <span>{t('weeklyBlockCalendar', 'Weekly Block Planning Calendar')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rerouting')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs transition-all ${
              activeTab === 'rerouting'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/[0.06] dark:text-slate-300 dark:hover:bg-white/[0.12] font-medium'
            }`}
          >
            <GitFork size={13} />
            <span>{t('rerouteSchematicTitle', 'Train Rerouting Topological Schematic')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('decision-flow')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs transition-all ${
              activeTab === 'decision-flow'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/[0.06] dark:text-slate-300 dark:hover:bg-white/[0.12] font-medium'
            }`}
          >
            <Layers size={13} />
            <span>{t('operationalDecisionFlow', 'Operational Decision Closed Loop')}</span>
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
