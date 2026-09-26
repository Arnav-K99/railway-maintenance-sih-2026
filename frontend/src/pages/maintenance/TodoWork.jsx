import React, { useState, useMemo, useEffect } from 'react';
import { usePlan } from '../../context/PlanContext';
import { useAuth, isDeptMatch } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { GovBadge } from '../../components/common/GovBadge';
import { formatTaskId, formatAssetId } from '../../utils/formatters';
import { 
  CheckSquare, 
  Save, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Users, 
  Clock, 
  Wrench,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export const TodoWork = () => {
  const { taskRequirements, saveTaskRequirement } = usePlan();
  const { selectedDept } = useAuth();
  const { t } = useLanguage();

  const predictions = [
    // Electrical / TRD
    {
      taskId: 'TASK-000005',
      assetId: 'AST-120005',
      assetType: 'Traction Power Transformer & OHE Contact Wire',
      department: 'Electrical / TRD',
      section: 'SEC-0004',
      corridor: 'COR-001',
      horizonDate: '07 Sep (Fri)',
      deadline: '2026-09-08',
      riskScore: 81.0,
      riskLevel: 'CRITICAL',
      failureRisk30Day: '81.0% (Severe)',
      forecastDegradation: '71.1 mm/wear index (Loss of wire cross-section)',
      aiDiagnosis: 'Thermal fatigue & contact wire thinning detected between km 45/2 and 48/6. High risk of wire rupture if rail grinding and tensioning is delayed.',
    },
    {
      taskId: 'TASK-000072',
      assetId: 'AST-120072',
      assetType: 'Catenary Tensioning & Insulator Flashover Inspection',
      department: 'Electrical / TRD',
      section: 'SEC-0003',
      corridor: 'COR-001',
      horizonDate: '08 Sep (Sat)',
      deadline: '2026-09-09',
      riskScore: 68.0,
      riskLevel: 'HIGH',
      failureRisk30Day: '68.0% (Elevated)',
      forecastDegradation: '14.2 mm catenary sag deviation index',
      aiDiagnosis: 'Thermal expansion sag detected on overhead feeder cables. Requires urgent re-tensioning and ceramic insulator wash.',
    },
    // Track / Civil Engineering
    {
      taskId: 'TASK-000018',
      assetId: 'AST-120018',
      assetType: 'Switch Expansion Joint (SEJ) & Turnout 42B',
      department: 'Track / Civil Engineering',
      section: 'SEC-0012',
      corridor: 'COR-001',
      horizonDate: '04 Sep (Tue)',
      deadline: '2026-09-05',
      riskScore: 72.0,
      riskLevel: 'HIGH',
      failureRisk30Day: '72.4% (Elevated)',
      forecastDegradation: '64.5 mm track geometric deviation',
      aiDiagnosis: 'Elevated gauge face wear and dynamic track modulus anomaly detected by ultrasonic scan.',
    },
    {
      taskId: 'TASK-000089',
      assetId: 'AST-120089',
      assetType: 'Ballast Tamping & Continuous Welded Rail (CWR)',
      department: 'Track / Civil Engineering',
      section: 'SEC-0014',
      corridor: 'COR-001',
      horizonDate: '06 Sep (Thu)',
      deadline: '2026-09-07',
      riskScore: 76.0,
      riskLevel: 'HIGH',
      failureRisk30Day: '76.0% (Elevated)',
      forecastDegradation: '8.4 mm cross-level differential',
      aiDiagnosis: 'Track geometry car registered uneven settlement on bridge approach embankment. Heavy tamping and ballast stabilization required.',
    },
    // Signal & Telecommunications
    {
      taskId: 'TASK-000031',
      assetId: 'AST-120031',
      assetType: 'Electronic Interlocking Relay Rack',
      department: 'Signal & Telecommunications',
      section: 'SEC-0041',
      corridor: 'COR-001',
      horizonDate: '05 Sep (Wed)',
      deadline: '2026-09-06',
      riskScore: 64.0,
      riskLevel: 'HIGH',
      failureRisk30Day: '64.0% (Elevated)',
      forecastDegradation: '58.0 mΩ contact resistance drift',
      aiDiagnosis: 'Intermittent voltage fluctuation recorded during peak headway traffic.',
    },
    {
      taskId: 'TASK-000052',
      assetId: 'AST-120052',
      assetType: 'Digital Axle Counter (DAC) & Track Circuit Sensor',
      department: 'Signal & Telecommunications',
      section: 'SEC-0005',
      corridor: 'COR-001',
      horizonDate: '07 Sep (Fri)',
      deadline: '2026-09-08',
      riskScore: 70.0,
      riskLevel: 'HIGH',
      failureRisk30Day: '70.2% (Elevated)',
      forecastDegradation: 'Signal attenuation exceeding 4.2 dB threshold',
      aiDiagnosis: 'Telemetry logs show intermittent pulse dropouts on rail-mounted wheel sensor head at turnout junction.',
    },
    // Mechanical / Rolling Stock
    {
      taskId: 'TASK-000044',
      assetId: 'AST-120044',
      assetType: 'Air Brake Distributor Valve',
      department: 'Mechanical / Rolling Stock',
      section: 'SEC-0021',
      corridor: 'COR-001',
      horizonDate: '06 Sep (Thu)',
      deadline: '2026-09-07',
      riskScore: 58.0,
      riskLevel: 'MODERATE',
      failureRisk30Day: '58.0% (Medium)',
      forecastDegradation: '51.2 kPa/min pressure loss under test',
      aiDiagnosis: 'Wayside acoustic sensor detected partial brake cylinder binding.',
    },
    {
      taskId: 'TASK-000063',
      assetId: 'AST-120063',
      assetType: 'Wheelset Bearing Acoustic Detection & Flange Profile',
      department: 'Mechanical / Rolling Stock',
      section: 'SEC-0021',
      corridor: 'COR-001',
      horizonDate: '05 Sep (Wed)',
      deadline: '2026-09-06',
      riskScore: 66.0,
      riskLevel: 'HIGH',
      failureRisk30Day: '66.5% (Elevated)',
      forecastDegradation: 'High-frequency vibration spike > 2.8 kHz',
      aiDiagnosis: 'Wayside roller bearing sensor identified localized inner-race spalling anomaly during high-speed transit.',
    },
  ];

  const filteredPredictions = useMemo(() => {
    return predictions.filter((p) => isDeptMatch(p.department, selectedDept));
  }, [selectedDept]);

  const [selectedPrediction, setSelectedPrediction] = useState(() => filteredPredictions[0] || predictions[0]);

  useEffect(() => {
    if (filteredPredictions.length > 0) {
      setSelectedPrediction(filteredPredictions[0]);
    }
  }, [filteredPredictions]);

  // Form State
  const [formData, setFormData] = useState({
    maintType: 'Predictive Service',
    duration: 180,
    personnel: 5,
    teamType: 'Specialized Engineering Unit',
    equipment: 'Standard Division Machinery',
    preferredWindow: '00:00 – 04:00 (Night Possession)',
    deadline: '2026-09-08',
    canCollaborate: false,
    collaboratingDept: 'Track / Civil Engineering',
    canBundle: true,
  });

  useEffect(() => {
    if (selectedPrediction) {
      const saved = taskRequirements[selectedPrediction.taskId];
      if (saved) {
        setFormData(saved);
      } else {
        const d = selectedPrediction.department || '';
        const deptPrefix = d.split('/')[0].trim();
        setFormData({
          maintType: selectedPrediction.assetType,
          duration: 180,
          personnel: 5,
          teamType: `${deptPrefix} Specialized Crew`,
          equipment: 'Standard Division Tools & Vehicles',
          preferredWindow: '00:00 – 04:00 (Night Possession)',
          deadline: selectedPrediction.deadline || '2026-09-08',
          canCollaborate: false,
          collaboratingDept: 'Track / Civil Engineering',
          canBundle: true,
        });
      }
    }
  }, [selectedPrediction, taskRequirements]);

  const [saveNotification, setSaveNotification] = useState(false);

  const handleSelectPrediction = (pred) => {
    setSelectedPrediction(pred);
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
    if (selectedPrediction) {
      saveTaskRequirement(selectedPrediction.taskId, formData);
      setSaveNotification(true);
      setTimeout(() => setSaveNotification(false), 4500);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {t('todoWorkTitle', 'Maintenance To-Do Queue')}
          </h2>
          {selectedDept && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60">
              {selectedDept}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {t('todoWorkSubtitle', 'Review incoming work items and define physical requirements for block planning')}
        </p>
      </div>

      {/* Two-Pane Layout */}
      <div className="grid lg:grid-cols-12 gap-5">
        {/* Left: Work Queue List (4 cols) */}
        <div className="lg:col-span-4 mac-panel overflow-hidden flex flex-col">
          <div className="mac-panel-header">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Pending Review Queue
            </span>
            <span className="text-[11px] font-mono font-medium text-slate-500">
              {filteredPredictions.length} Items
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-white/[0.05] overflow-y-auto max-h-[620px]">
            {filteredPredictions.map((p) => {
              const isSelected = p.taskId === selectedPrediction.taskId;
              const shortTaskId = formatTaskId(p.taskId);
              const shortAssetId = formatAssetId(p.assetId);

              return (
                <button
                  key={p.taskId}
                  type="button"
                  onClick={() => handleSelectPrediction(p)}
                  className={`w-full p-3.5 text-left transition-colors flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-slate-100/90 dark:bg-white/[0.08] border-l-3 border-l-macblue-500'
                      : 'hover:bg-slate-50 dark:hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                      {shortTaskId} • {shortAssetId}
                    </span>
                    <GovBadge status={p.riskLevel} type="risk" />
                  </div>

                  <div className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                    {p.assetType}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{p.department.split('/')[0].trim()} • <strong className="text-slate-700 dark:text-slate-300 font-semibold">{p.horizonDate}</strong></span>
                    <span className="font-mono font-semibold text-red-600 dark:text-red-400">{p.riskScore}%</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Work Details & Compact Form (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Top Section: Diagnostic Analysis */}
          <div className="mac-panel p-4 space-y-3">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-white/[0.06] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-macblue-500">
                    {formatTaskId(selectedPrediction.taskId)}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="font-mono text-xs text-slate-500">
                    {formatAssetId(selectedPrediction.assetId)}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {selectedPrediction.section}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedPrediction.assetType}
                </h3>
              </div>
              <GovBadge status={selectedPrediction.riskLevel} type="risk" />
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 rounded-md bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06]">
                <span className="text-[10px] uppercase font-medium text-slate-500 block">Risk Score</span>
                <span className="text-sm font-bold font-mono text-red-600 dark:text-red-400 mt-0.5 block">
                  {selectedPrediction.riskScore}%
                </span>
              </div>

              <div className="p-2.5 rounded-md bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06]">
                <span className="text-[10px] uppercase font-medium text-slate-500 block">Failure Risk</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {selectedPrediction.failureRisk30Day}
                </span>
              </div>

              <div className="p-2.5 rounded-md bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06] col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase font-medium text-slate-500 block">Degradation Forecast</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5 block truncate">
                  {selectedPrediction.forecastDegradation}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50/60 dark:bg-white/[0.02] p-2.5 rounded-md border border-slate-200/50 dark:border-white/[0.05] leading-relaxed">
              {selectedPrediction.aiDiagnosis}
            </p>
          </div>

          {/* Bottom Section: Compact Form with Dropdown Controls (Section 9 & 10) */}
          <form onSubmit={handleSubmit} className="mac-panel p-4 space-y-4">
            <div className="border-b border-slate-100 dark:border-white/[0.06] pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <Wrench size={13} />
                <span>Define Maintenance Requirement</span>
              </h4>
            </div>

            {saveNotification && (
              <div className="p-2.5 rounded-md bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 border border-emerald-300/80 text-xs flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span className="font-medium">{t('requirementUpdatedMsg', 'Requirement submitted for block planning.')}</span>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-3.5 text-xs">
              {/* Maintenance Work Type */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {t('maintType', 'Maintenance Work')}
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
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
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
                  className="w-full font-mono font-medium"
                />
              </div>

              {/* Personnel Required */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
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
                  className="w-full font-mono font-medium"
                />
              </div>

              {/* Team Specialization Dropdown (Section 10 requirement) */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {t('teamType', 'Team Specialization')}
                </label>
                <select
                  name="teamType"
                  value={formData.teamType}
                  onChange={handleInputChange}
                  className="w-full"
                >
                  <option value="Track / Civil Engineering Gang">Track / Civil Engineering Gang</option>
                  <option value="Electrical / TRD Special Gang">Electrical / TRD Special Gang</option>
                  <option value="Signal & Telecommunications Unit">Signal & Telecommunications Unit</option>
                  <option value="Mechanical / Rolling Stock Crew">Mechanical / Rolling Stock Crew</option>
                  <option value="Specialized Track Machine (CSM/USFD) Unit">Specialized Machine (CSM/USFD) Unit</option>
                  <option value="Joint Inspection Special Crew">Joint Inspection Special Crew</option>
                </select>
              </div>

              {/* Preferred Time Window */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {t('preferredWindow', 'Preferred Window')}
                </label>
                <select
                  name="preferredWindow"
                  value={formData.preferredWindow}
                  onChange={handleInputChange}
                  className="w-full"
                >
                  <option value="00:00 – 04:00 (Night Possession)">00:00 – 04:00 (Night Possession)</option>
                  <option value="04:00 – 08:00 (Early Morning)">04:00 – 08:00 (Early Morning)</option>
                  <option value="11:00 – 14:00 (Day Headway)">11:00 – 14:00 (Day Headway)</option>
                  <option value="14:00 – 18:00 (Afternoon)">14:00 – 18:00 (Afternoon)</option>
                  <option value="18:00 – 22:00 (Evening Siding)">18:00 – 22:00 (Evening Siding)</option>
                </select>
              </div>

              {/* Deadline */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
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

              {/* Equipment */}
              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {t('equipment', 'Equipment / Machinery')}
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

              {/* Collaboration & Bundling - Compact Dropdown/Toggle (Section 10 requirement) */}
              <div className="sm:col-span-2 p-3 rounded-md bg-slate-50/70 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06] space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="canBundle"
                      name="canBundle"
                      checked={formData.canBundle}
                      onChange={handleInputChange}
                      className="rounded text-macblue-500 focus:ring-macblue-500"
                    />
                    <label htmlFor="canBundle" className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                      {t('canBundle', 'Allow Possession Bundling on Section')}
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="canCollaborate"
                      name="canCollaborate"
                      checked={formData.canCollaborate}
                      onChange={handleInputChange}
                      className="rounded text-macblue-500 focus:ring-macblue-500"
                    />
                    <label htmlFor="canCollaborate" className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                      Enable Cross-Department Collaboration
                    </label>
                  </div>
                </div>

                {formData.canCollaborate && (
                  <div className="pt-2 border-t border-slate-200/60 dark:border-white/[0.06] flex items-center gap-2">
                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                      Collaborating Department:
                    </span>
                    <select
                      name="collaboratingDept"
                      value={formData.collaboratingDept}
                      onChange={handleInputChange}
                      className="text-xs py-1 flex-1"
                    >
                      <option value="Track / Civil Engineering">Track / Civil Engineering</option>
                      <option value="Electrical / TRD">Electrical / TRD</option>
                      <option value="Signal & Telecommunications">Signal & Telecommunications</option>
                      <option value="Mechanical / Rolling Stock">Mechanical / Rolling Stock</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Action */}
            <div className="pt-2 flex items-center justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-bold text-xs uppercase tracking-wider transition-colors shadow-2xs"
              >
                <Save size={13} />
                <span>{t('saveAndSend', 'SAVE & SEND FOR BLOCK PLANNING')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
