import React, { useState } from 'react';
import { useAuth, ROLES, DEPARTMENTS } from '../context/AuthContext';
import { TrainTrack, ShieldCheck, Lock, User, Sparkles, ArrowRight } from 'lucide-react';

export const Login = ({ onLoginSuccess }) => {
  const { login, selectedDept, setSelectedDept } = useAuth();

  const [username, setUsername] = useState('chief_controller');
  const [password, setPassword] = useState('••••••••');
  const [role, setRole] = useState(ROLES.OCC);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(role, username, selectedDept);
    if (onLoginSuccess) {
      onLoginSuccess(role);
    }
  };

  const handleQuickLogin = (selectedRole) => {
    setRole(selectedRole);
    let u = 'controller';
    if (selectedRole === ROLES.MAINTENANCE) u = 'sse_electrical';
    if (selectedRole === ROLES.GENERAL) u = 'auditor';
    setUsername(u);
    login(selectedRole, u, selectedDept);
    if (onLoginSuccess) {
      onLoginSuccess(selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Graphic Accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 rounded-2xl bg-blue-600 text-white items-center justify-center shadow-xl shadow-blue-600/30">
            <TrainTrack size={28} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white uppercase">
            Railway Maintenance Optimization System
          </h1>
          <p className="text-xs text-blue-300 font-medium">
            AI-Powered Automatic Block Planning for Train Operations
          </p>
          <span className="inline-block bg-slate-800 text-slate-400 text-[10px] px-2.5 py-0.5 rounded-full font-mono border border-slate-700 mt-1">
            Indian Railways • SIH 2026 Innovation
          </span>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
                <User size={13} className="text-slate-400" />
                <span>Username</span>
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
                <Lock size={13} className="text-slate-400" />
                <span>Password</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Select Operational Role:
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value={ROLES.OCC}>ROLE 1 — Operations Control Center</option>
                <option value={ROLES.MAINTENANCE}>ROLE 2 — Maintenance Personnel</option>
                <option value={ROLES.GENERAL}>ROLE 3 — General User / Verification</option>
              </select>
            </div>

            {role === ROLES.MAINTENANCE && (
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Department:
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-md flex items-center justify-center gap-1.5 text-xs mt-2"
            >
              <span>Access Control Portal</span>
              <ArrowRight size={14} />
            </button>
          </form>

          {/* One-Click Quick Demo Switcher (Section 3 requirement) */}
          <div className="pt-3 border-t border-slate-100 space-y-2 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Quick Role Switch for Evaluators:
            </span>
            <div className="grid grid-cols-3 gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={() => handleQuickLogin(ROLES.OCC)}
                className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[11px] font-bold transition-colors"
              >
                Operations Control
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin(ROLES.MAINTENANCE)}
                className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-[11px] font-bold transition-colors"
              >
                Maintenance Portal
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin(ROLES.GENERAL)}
                className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-bold transition-colors"
              >
                General User
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-500">
          Neev AI &bull; Arnav OR-Tools CP-SAT &bull; Ritvik Dynamic Operations Engine
        </div>
      </div>
    </div>
  );
};
