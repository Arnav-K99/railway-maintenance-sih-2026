import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const BackButton = ({ onClick, label, className = '' }) => {
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white hover:bg-slate-100 border border-slate-300 text-xs font-semibold text-slate-800 shadow-2xs transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700 ${className}`}
      aria-label={label || t('back', 'Back')}
    >
      <ArrowLeft size={14} className="text-slate-600 dark:text-slate-400" />
      <span>{label || t('back', 'Back')}</span>
    </button>
  );
};
