import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Terminal, 
  User, 
  ShieldCheck, 
  Clock, 
  AlertOctagon, 
  RefreshCw,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';

interface DashboardSimulationProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const DashboardSimulation: React.FC<DashboardSimulationProps> = ({ currentPath, onNavigate }) => {
  const { 
    user, 
    physioProfile, 
    switchSimulationState, 
    adminSetPhysioStatus 
  } = useAuth();

  return (
    <div className="bg-zinc-950 text-zinc-100 border-b border-zinc-800 py-3.5 px-4 md:px-6" id="test-simulation-panel">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Title */}
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-zinc-800 rounded-lg text-emerald-400 font-mono animate-pulse">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-wider uppercase font-mono text-zinc-400">Architectural Test Harness</span>
              <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-mono font-medium px-1.5 py-0.5 rounded border border-emerald-500/20">Milestone 1 Active</span>
            </div>
            <h4 className="font-display font-medium text-sm text-zinc-200 tracking-tight">Automated Role Routing & Isolation Validator</h4>
          </div>
        </div>

        {/* Quick Toggles */}
        <div className="flex flex-wrap items-center gap-2" id="sim-toggles-container">
          <span className="text-xs text-zinc-400 font-mono hidden xl:inline">Test Identities:</span>
          
          {/* Guest */}
          <button
            onClick={() => {
              switchSimulationState('guest');
              onNavigate('/login');
            }}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-all border ${
              !user 
                ? 'bg-zinc-800 border-zinc-700 text-white font-medium shadow-sm' 
                : 'bg-zinc-900/50 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
            }`}
            id="sim-guest-btn"
          >
            Guest (Logged Out)
          </button>

          {/* Patient */}
          <button
            onClick={() => {
              switchSimulationState('patient');
              onNavigate('/patient/search');
            }}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-all border ${
              user?.role === 'patient' 
                ? 'bg-blue-950/40 border-blue-800/60 text-blue-300 font-medium' 
                : 'bg-zinc-900/50 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
            }`}
            id="sim-patient-btn"
          >
            Patient: Priya Menon
          </button>

          {/* Physio - Pending */}
          <button
            onClick={() => {
              switchSimulationState('physio', 'pending');
              onNavigate('/physio/dashboard');
            }}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-all border ${
              user?.role === 'physio' && physioProfile?.status === 'pending'
                ? 'bg-amber-950/40 border-amber-800/60 text-amber-300 font-medium' 
                : 'bg-zinc-900/50 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
            }`}
            id="sim-physio-pending-btn"
          >
            Physio: Pending Verification
          </button>

          {/* Physio - Approved */}
          <button
            onClick={() => {
              switchSimulationState('physio', 'approved');
              onNavigate('/physio/dashboard');
            }}
            className={`px-3 py-1.5 rounded text-xs font-mono transition-all border ${
              user?.role === 'physio' && physioProfile?.status === 'approved'
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 font-medium' 
                : 'bg-zinc-900/50 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
            }`}
            id="sim-physio-approved-btn"
          >
            Physio: Approved (Dr. Rina)
          </button>
        </div>

        {/* Live Router Context Details */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 flex items-center gap-4 text-xs font-mono w-full lg:w-auto overflow-x-auto" id="sim-telemetry">
          <div className="flex items-center gap-1.5 shrink-0" id="sim-active-path">
            <span className="text-zinc-500">Route:</span>
            <span className="text-zinc-200 bg-zinc-800/60 px-1.5 py-0.5 rounded text-[11px] font-medium border border-zinc-800">
              {currentPath}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0" id="sim-active-user">
            <span className="text-zinc-500">Claims:</span>
            {user ? (
              <span className="text-zinc-200 flex items-center gap-1">
                {user.role === 'patient' ? (
                  <span className="text-blue-400 flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> Patient
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Physio 
                    <span className={`text-[10px] px-1 rounded uppercase font-bold ${
                      physioProfile?.status === 'approved' 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      ({physioProfile?.status})
                    </span>
                  </span>
                )}
              </span>
            ) : (
              <span className="text-zinc-500">Guest (Anonymous)</span>
            )}
          </div>

          {/* Admin Live Controls */}
          {user?.role === 'physio' && physioProfile && (
            <div className="flex items-center gap-2 border-l border-zinc-800 pl-4 shrink-0" id="sim-admin-controls">
              <span className="text-zinc-500 text-[11px]">Set Status:</span>
              <button
                onClick={() => adminSetPhysioStatus(physioProfile.uid, 'approved')}
                className={`px-1.5 py-0.5 rounded text-[10px] ${
                  physioProfile.status === 'approved' 
                    ? 'bg-emerald-500 text-black font-semibold' 
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                Approve
              </button>
              <button
                onClick={() => adminSetPhysioStatus(physioProfile.uid, 'pending')}
                className={`px-1.5 py-0.5 rounded text-[10px] ${
                  physioProfile.status === 'pending' 
                    ? 'bg-amber-500 text-black font-semibold' 
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => adminSetPhysioStatus(physioProfile.uid, 'rejected')}
                className={`px-1.5 py-0.5 rounded text-[10px] ${
                  physioProfile.status === 'rejected' 
                    ? 'bg-red-500 text-white font-semibold' 
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
