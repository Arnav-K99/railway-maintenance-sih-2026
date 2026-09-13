import React from 'react';
import { 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  XCircle, 
  ShieldAlert,
  Calendar,
  Activity
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const GovBadge = ({ status, type = 'status', className = '' }) => {
  const { t } = useLanguage();

  const normalize = (val) => String(val || '').toLowerCase().trim();
  const n = normalize(status);

  // Status Styling Logic
  if (type === 'risk' || n === 'critical' || n === 'high' || n === 'moderate' || n === 'low') {
    if (n.includes('critical') || n.includes('≥80') || n === 'critical') {
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-red-50 text-red-800 border border-red-300 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/60 ${className}`}>
          <AlertCircle size={11} className="text-red-700 dark:text-red-400" />
          <span>{t('critical', 'Critical')}</span>
        </span>
      );
    }
    if (n.includes('high') || n === 'high') {
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase bg-amber-50 text-amber-900 border border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60 ${className}`}>
          <AlertTriangle size={11} className="text-amber-700 dark:text-amber-400" />
          <span>{t('high', 'High')}</span>
        </span>
      );
    }
    if (n.includes('moderate') || n.includes('medium') || n === 'moderate') {
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase bg-yellow-50 text-yellow-900 border border-yellow-300 dark:bg-yellow-950/40 dark:text-yellow-300 dark:border-yellow-900/60 ${className}`}>
          <Clock size={11} className="text-yellow-700 dark:text-yellow-400" />
          <span>{t('moderate', 'Moderate')}</span>
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase bg-emerald-50 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60 ${className}`}>
        <CheckCircle2 size={11} className="text-emerald-700 dark:text-emerald-400" />
        <span>{t('low', 'Low')}</span>
      </span>
    );
  }

  // General Status Styling
  if (n.includes('reschedule') || n.includes('replan')) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-orange-50 text-orange-900 border border-dashed border-orange-400 dark:bg-orange-950/40 dark:text-orange-200 dark:border-orange-800 ${className}`}>
        <RefreshCw size={11} className="text-orange-700 dark:text-orange-400" />
        <span>{t('rescheduled', 'Rescheduled')}</span>
      </span>
    );
  }

  if (n.includes('conflict')) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-900 border border-red-400 dark:bg-red-950/60 dark:text-red-200 dark:border-red-800 ${className}`}>
        <AlertCircle size={11} className="text-red-700 dark:text-red-400" />
        <span>{t('conflictDetected', 'Conflict Detected')}</span>
      </span>
    );
  }

  if (n.includes('complete') || n.includes('verified') || n.includes('approved')) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60 ${className}`}>
        <CheckCircle2 size={11} className="text-emerald-700 dark:text-emerald-400" />
        <span>{n.includes('verified') ? t('verified', 'Verified') : n.includes('approved') ? t('planApproved', 'Plan Approved') : t('completed', 'Completed')}</span>
      </span>
    );
  }

  if (n.includes('in progress') || n.includes('active')) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-900 border border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/60 ${className}`}>
        <Activity size={11} className="text-blue-700 dark:text-blue-400 animate-pulse" />
        <span>{t('inProgress', 'In Progress')}</span>
      </span>
    );
  }

  if (n.includes('reject')) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-900 border border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60 ${className}`}>
        <XCircle size={11} className="text-rose-700 dark:text-rose-400" />
        <span>{t('rejected', 'Rejected')}</span>
      </span>
    );
  }

  if (n.includes('false closure')) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-950 border border-amber-400 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800 ${className}`}>
        <ShieldAlert size={11} className="text-amber-800 dark:text-amber-400" />
        <span>{t('falseClosureReported', 'False Closure Reported')}</span>
      </span>
    );
  }

  if (n.includes('scheduled')) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 ${className}`}>
        <Calendar size={11} className="text-slate-600 dark:text-slate-400" />
        <span>{t('scheduled', 'Scheduled')}</span>
      </span>
    );
  }

  // Default neutral badge
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-50 text-slate-700 border border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700 ${className}`}>
      <span>{status}</span>
    </span>
  );
};
