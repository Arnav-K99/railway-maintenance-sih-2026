import React, { useState, useMemo, useEffect } from 'react';
import { usePlan } from '../../context/PlanContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { GovBadge } from '../../components/common/GovBadge';
import { 
  HeartPulse, 
  Send, 
  Save, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Users, 
  Clock, 
  Wrench,
  Sparkles,
  Calendar
} from 'lucide-react';

export const NeevPredictions = () => {
  const { taskRequirements, saveTaskRequirement } = usePlan();
  const { t } = useLanguage();

  // Curated list of high-priority predictions from Neev ML
  const predictions = [
    {
      taskId: 'TASK-000005',
      assetId: 'AST-120005',
      assetType: 'Traction Power Transformer / OHE Contact Wire',
      department: 'Electrical / TRD',
      section: 'SEC-0004',
      corridor: 'COR-001 (Delhi–Agra)',
      riskScore: 81.0,
      riskLevel: 'CRITICAL',
      failureRisk30Day: '81.0% (Severe)',
      forecastDegradation: '71.1 mm/wear index (Rapid loss of contact wire cross-section)',
      aiDiagnosis: 'Accelerated thermal fatigue and contact wire thinning detected between km 45/2 and 48/6. Recommend immediate rail grinding & catenary height adjustment to avert live wire rupture.',
    },
    {
      taskId: 'TASK-000018',
      assetId: 'AST-120018',
      assetType: 'Switch Expansion Joint (SEJ) & Turnout 42B',
      department: 'Track / Civil Engineering',
      section: 'SEC-0012',
      corridor: 'COR-001 (Delhi–Agra)',
      riskScore: 72.0,
      riskLevel: 'HIGH',
      failureRisk30Day: '72.4% (Elevated)',
      forecastDegradation: '64.5 mm track geometric deviation index',
      aiDiagnosis: 'High gauge face corner wear and dynamic track modulus anomaly detected by ultrasonic testing vehicle.',
    },
    {
      taskId: 'TASK-000031',
      assetId: 'AST-120031',
      assetType: 'Electronic Interlocking Q-Series Relay Rack',
      department: 'Signal & Telecommunications',
      section: 'SEC-0041',
      corridor: 'COR-001 (Delhi–Agra)',
      riskScore: 64.0,
      riskLevel: 'HIGH',
      failureRisk30Day: '64.0% (Elevated)',
      forecastDegradation: '58.0 milliohms contact resistance degradation',
      aiDiagnosis: 'Relay chatter and intermittent voltage drop recorded during peak headway operations.',
    },
    {
      taskId: 'TASK-000044',
      assetId: 'AST-120044',
      assetType: 'Air Brake Distributor Valve & Brake Cylinders',
      department: 'Mechanical / Rolling Stock',
      section: 'SEC-0021',
      corridor: 'COR-001 (Delhi–Agra)',
      riskScore: 58.0,
      riskLevel: 'MODERATE',
      failureRisk30Day: '58.0% (Medium)',
      forecastDegradation: '51.2 kPa/min pressure loss under test',
      aiDiagnosis: 'Wayside acoustic sensor detected partial brake binding on freight wagon rake.',
    },
  ];

  const { selectedDept } = useAuth();

  const filteredPredictions = useMemo(() => {
    if (!selectedDept || selectedDept === 'All Departments') return predictions;
    const deptPrefix = selectedDept.split('/')[0].trim().toLowerCase();
    const matched = predictions.filter((p) => p.department.toLowerCase().includes(deptPrefix));
    return matched.length > 0 ? matched : predictions;
  }, [selectedDept]);

  const [selectedPrediction, setSelectedPrediction] = useState(filteredPredictions[0]);

  useEffect(() => {
    if (filteredPredictions.length > 0) {
      setSelectedPrediction(filteredPredictions[0]);
    }
  }, [filteredPredictions]);

  // Form state initialized from PlanContext requirements or sensible defaults
  const currentReq = (selectedPrediction && taskRequirements[selectedPrediction.taskId]) || {
    maintType: 'Rail Grinding',
    duration: 200,
    personnel: 5,
    teamType: 'OHE / TRD Special Gang',
    equipment: 'Rail Grinding Train (RGM-02), OHE Tower Car',
    preferredWindow: '00:00 – 04:00 (Night Possession)',
    deadline: '2026-09-08',
    canCollaborate: true,
    collaboratingDept: 'Track / Civil Engineering',
    canBundle: true,
  };

  const [formData, setFormData] = useState(currentReq);
  const [saveNotification, setSaveNotification] = useState(false);

  // When selected prediction changes, update form data
  const handleSelectPrediction = (pred) => {
    setSelectedPrediction(pred);
    setFormData(
      taskRequirements[pred.taskId] || {
        maintType: pred.department.includes('Electrical') ? 'Rail Grinding' : 'Track Inspection & Alignment',
        duration: 180,
        personnel: 5,
        teamType: `${pred.department} Technical Gang`,
        equipment: 'Standard Track Testing Equipment',
        preferredWindow: '00:00 – 04:00',
        deadline: '2026-09-08',
        canCollaborate: false,
        collaboratingDept: 'None',
        canBundle: false,
      }
    );
    setSaveNotification(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveTaskRequirement(selectedPrediction.taskId, formData);
    setSaveNotification(true);
    setTimeout(() => setSaveNotification(false), 4500);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[11px] font-bold text-govnavy-700 dark:text-govnavy-300 uppercase tracking-wider">
          <HeartPulse size={14} />
          <span>{t('predictions', 'Neev Predictive Analytics')}</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
          {t('neevInboxTitle', 'Neev AI Diagnostic Inbox')}
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
          {t('neevInboxSubtitle', 'AI failure risk forecast inbox. Field engineers inspect diagnostic signals, define physical requirements and submit for block optimization.')}
        </p>
      </div>

      {/* Two-Pane Government Work Inbox (Section 10) */}
      <div className="grid lg:grid-cols-12 gap-5">
        {/* Left: Prediction Inbox List (4 cols) */}
        <div className="lg:col-span-4 gov-panel overflow-hidden flex flex-col">
          <div className="gov-panel-header">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Diagnostic Queue
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {filteredPredictions.length} High Risks Flagged
            </span>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800 overflow-y-auto max-h-[620px]">
            {filteredPredictions.map((p) => {
              const isSelected = p.taskId === selectedPrediction.taskId;
              return (
                <button
                  key={p.taskId}
                  type="button"
                  onClick={() => handleSelectPrediction(p)}
                  className={`w-full p-3.5 text-left transition-colors flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-govnavy-50/80 border-l-4 border-l-govnavy-800 dark:bg-slate-800/80 dark:border-l-govnavy-500'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <GovBadge status={p.riskLevel} type="risk" />
                    <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                      {p.taskId}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {p.assetId} — {p.assetType.split('/')[0]}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {p.department} • {p.section}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-slate-500">Risk Score:</span>
                    <span className="font-mono font-bold text-red-600 dark:text-red-400">
                      {p.riskScore}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Asset Detail & Editable Maintenance Requirement (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Top Panel: Neev AI Diagnosis & Failure Risk */}
          <div className="gov-panel p-4 space-y-3">
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-govnavy-700 dark:text-govnavy-300">
                    {selectedPrediction.assetId}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    {selectedPrediction.section} ({selectedPrediction.corridor})
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedPrediction.assetType}
                </h3>
              </div>
              <GovBadge status={selectedPrediction.riskLevel} type="risk" />
            </div>

            {/* Failure Risk & Degradation Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  {t('riskScore', 'Risk Score')}
                </span>
                <span className="text-base font-bold font-mono text-red-600 dark:text-red-400">
                  {selectedPrediction.riskScore}%
                </span>
              </div>

              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  {t('failureRisk30Day', '30-Day Failure Risk')}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 block">
                  {selectedPrediction.failureRisk30Day}
                </span>
              </div>

              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  {t('forecastDegradation', 'Degradation Forecast')}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 block truncate">
                  {selectedPrediction.forecastDegradation}
                </span>
              </div>
            </div>

            {/* AI Diagnosis Text */}
            <div className="p-3 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs">
              <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5 mb-1">
                <Sparkles size={13} className="text-amber-600 dark:text-amber-400" />
                <span>{t('diagnosis', 'Neev Diagnostic Analysis')}</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedPrediction.aiDiagnosis}
              </p>
            </div>
          </div>

          {/* Bottom Panel: EDITABLE Maintenance Requirement Form (Section 10) */}
          <form onSubmit={handleSubmit} className="gov-panel p-4 space-y-4">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Wrench size={14} className="text-govnavy-700 dark:text-govnavy-300" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  {t('maintRequirement', 'MAINTENANCE REQUIREMENT DEFINITION')}
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Maintenance engineering decides duration, team size and machinery. The CP-SAT optimizer determines schedule placement.
              </p>
            </div>

            {saveNotification && (
              <div className="p-3 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-semibold">
                  {t('requirementUpdatedMsg', 'Maintenance requirement saved and submitted to Block Planning Optimizer.')}
                </span>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              {/* Maintenance Type */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {t('maintType', 'Maintenance Type')}
                </label>
                <input
                  type="text"
                  name="maintType"
                  value={formData.maintType}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>

              {/* Duration (minutes) */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {t('duration', 'Duration (Minutes)')}
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  min="30"
                  max="480"
                  className="w-full font-mono font-bold"
                />
              </div>

              {/* Personnel Required */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {t('personnelRequired', 'Personnel Required')}
                </label>
                <input
                  type="number"
                  name="personnel"
                  value={formData.personnel}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="30"
                  className="w-full font-mono font-bold"
                />
              </div>

              {/* Team Specialization */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {t('teamType', 'Team Specialization')}
                </label>
                <input
                  type="text"
                  name="teamType"
                  value={formData.teamType}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>

              {/* Preferred Time Window */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {t('preferredWindow', 'Preferred Time Window')}
                </label>
                <select
                  name="preferredWindow"
                  value={formData.preferredWindow}
                  onChange={handleInputChange}
                  className="w-full font-medium"
                >
                  <option value="00:00 – 04:00 (Night Possession)">00:00 – 04:00 (Night Possession)</option>
                  <option value="04:00 – 08:00 (Early Morning)">04:00 – 08:00 (Early Morning)</option>
                  <option value="11:00 – 14:00 (Midday Headway)">11:00 – 14:00 (Midday Headway)</option>
                  <option value="14:00 – 18:00 (Afternoon)">14:00 – 18:00 (Afternoon)</option>
                  <option value="18:00 – 22:00 (Evening Siding)">18:00 – 22:00 (Evening Siding)</option>
                </select>
              </div>

              {/* Completion Deadline */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {t('deadline', 'Completion Deadline')}
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  required
                  className="w-full font-mono"
                />
              </div>

              {/* Equipment & Machinery (Full width) */}
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {t('equipment', 'Equipment / Machinery Required')}
                </label>
                <input
                  type="text"
                  name="equipment"
                  value={formData.equipment}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>

              {/* Cross-Department Collaboration & Bundling */}
              <div className="sm:col-span-2 p-3 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="canBundle"
                    name="canBundle"
                    checked={formData.canBundle}
                    onChange={handleInputChange}
                    className="rounded border-slate-300 text-govnavy-700 focus:ring-govnavy-600"
                  />
                  <label htmlFor="canBundle" className="font-bold text-slate-800 dark:text-slate-200">
                    {t('canBundle', 'Allow Possession Bundling on Same Track Section')}
                  </label>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-5">
                  {t('bundleNotice', 'Compatible maintenance activities are coordinated within the same possession window.')}
                </p>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center gap-2 pl-5">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {t('collaboration', 'Cross-Department Collaboration')}:
                  </span>
                  <input
                    type="text"
                    name="collaboratingDept"
                    value={formData.collaboratingDept}
                    onChange={handleInputChange}
                    placeholder="e.g. Track / Civil Engineering"
                    className="flex-1 py-1 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Save & Send Action Button */}
            <div className="pt-2 flex items-center justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 rounded bg-govnavy-800 hover:bg-govnavy-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-2xs dark:bg-govnavy-700 dark:hover:bg-govnavy-600"
              >
                <Save size={14} />
                <span>{t('saveAndSend', 'SAVE & SEND FOR BLOCK PLANNING')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
