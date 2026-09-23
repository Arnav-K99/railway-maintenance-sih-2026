import React from 'react';
import { GovBadge } from '../common/GovBadge';
import { formatTaskId, formatAssetId } from '../../utils/formatters';
import { Clock, MapPin, Wrench, Building2, AlertCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const BlockHoverPopover = ({ blockData, position = { x: 0, y: 0 } }) => {
  const { t } = useLanguage();

  if (!blockData) return null;

  return (
    <div
      className="fixed z-50 pointer-events-none w-72 p-3.5 rounded-lg bg-white/95 dark:bg-[#161A22]/95 backdrop-blur-md border border-slate-300 dark:border-white/[0.14] shadow-mac text-xs space-y-2 animate-in fade-in zoom-in-95 duration-150"
      style={{
        left: `${Math.min(position.x + 15, window.innerWidth - 310)}px`,
        top: `${Math.max(position.y - 40, 70)}px`,
      }}
    >
      {/* Header with Block ID and Status */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/[0.08] pb-2">
        <div>
          <div className="font-mono font-bold text-slate-900 dark:text-white text-sm">
            {blockData.blockId}
          </div>
          {blockData.taskId && (
            <div className="text-[10px] font-mono font-semibold text-macblue-500">
              Task: {formatTaskId(blockData.taskId)}
            </div>
          )}
        </div>
        <GovBadge status={blockData.status} />
      </div>

      {/* Specifications */}
      <div className="space-y-1.5 text-[11px]">
        <div className="flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400">{t('section', 'Section')}:</span>
          <span className="font-semibold text-slate-900 dark:text-white">{blockData.section}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400">{t('date', 'Date & Time')}:</span>
          <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
            {blockData.date} • {blockData.time}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400">{t('maintType', 'Maintenance')}:</span>
          <span className="font-medium text-slate-900 dark:text-white truncate max-w-[160px]">
            {blockData.maintenanceType}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500 dark:text-slate-400">{t('department', 'Department')}:</span>
          <span className="text-slate-700 dark:text-slate-300">{blockData.department}</span>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-white/[0.06]">
          <span className="text-slate-500 dark:text-slate-400">{t('risk', 'Risk')}:</span>
          <GovBadge status={blockData.risk} type="risk" />
        </div>

        {/* Rescheduled Information */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-white/[0.06]">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Rescheduled:</span>
          <span className={`font-mono font-bold ${blockData.isRescheduled ? 'text-orange-600 dark:text-orange-400' : 'text-slate-600'}`}>
            {blockData.isRescheduled ? t('rescheduledYes', 'YES') : t('rescheduledNo', 'NO')}
          </span>
        </div>

        {blockData.isRescheduled && blockData.previousBlock && (
          <div className="p-2 rounded bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-800/80 text-[10px] text-orange-900 dark:text-orange-200">
            <span className="font-bold block uppercase tracking-wider">
              {t('previousBlock', 'Previous Block')}:
            </span>
            <span className="font-mono font-medium block mt-0.5">
              {blockData.previousBlock}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
