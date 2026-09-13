import React from 'react';
import { GovBadge } from '../common/GovBadge';
import { Clock, MapPin, Wrench, Building2, AlertCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const BlockHoverPopover = ({ blockData, position = { x: 0, y: 0 } }) => {
  const { t } = useLanguage();

  if (!blockData) return null;

  return (
    <div
      className="fixed z-50 pointer-events-none w-72 p-3.5 rounded-md bg-white dark:bg-slate-900 border-2 border-govnavy-800 dark:border-govnavy-500 shadow-xl text-xs space-y-2 animate-in fade-in zoom-in-95 duration-150"
      style={{
        left: `${Math.min(position.x + 15, window.innerWidth - 310)}px`,
        top: `${Math.max(position.y - 40, 70)}px`,
      }}
    >
      {/* Header with Block ID and Status */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="font-mono font-bold text-govnavy-800 dark:text-govnavy-300 text-sm">
          {blockData.blockId}
        </div>
        <GovBadge status={blockData.status} />
      </div>

      {/* Specifications */}
      <div className="space-y-1.5 text-[11px]">
        <div className="flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400">{t('section', 'Section')}:</span>
          <span className="font-bold text-slate-900 dark:text-white">{blockData.section}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400">{t('date', 'Date & Time')}:</span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
            {blockData.date} • {blockData.time}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400">{t('maintType', 'Maintenance')}:</span>
          <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[170px]">
            {blockData.maintenanceType}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400">{t('department', 'Department')}:</span>
          <span className="text-slate-800 dark:text-slate-200">{blockData.department}</span>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-slate-500 dark:text-slate-400">{t('risk', 'Risk')}:</span>
          <GovBadge status={blockData.risk} type="risk" />
        </div>

        {/* Rescheduled Information (Section 17 requirement) */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-slate-500 dark:text-slate-400 font-semibold">Rescheduled:</span>
          <span className={`font-mono font-bold ${blockData.isRescheduled ? 'text-orange-600 dark:text-orange-400' : 'text-slate-600'}`}>
            {blockData.isRescheduled ? t('rescheduledYes', 'YES') : t('rescheduledNo', 'NO')}
          </span>
        </div>

        {blockData.isRescheduled && blockData.previousBlock && (
          <div className="p-2 rounded bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-[10px] text-orange-900 dark:text-orange-200">
            <span className="font-bold block uppercase tracking-wider">
              {t('previousBlock', 'Previous Block')}:
            </span>
            <span className="font-mono font-semibold block mt-0.5">
              {blockData.previousBlock}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
