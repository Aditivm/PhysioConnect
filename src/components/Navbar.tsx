import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Activity, 
  LogOut, 
  Search, 
  Calendar, 
  Clock, 
  User, 
  Sliders, 
  ShieldAlert, 
  CheckCircle,
  Menu,
  FileCheck
} from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { user, physioProfile, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-zinc-200/80 backdrop-blur-md" id="global-navbar">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <button
          onClick={() => onNavigate(user ? (user.role === 'patient' ? '/patient/search' : '/physio/dashboard') : '/')}
          className="flex items-center gap-2.5 focus:outline-none group text-left"
          id="navbar-brand-btn"
        >
          <div className="p-2 bg-zinc-950 text-white rounded-xl transition-transform group-hover:scale-105 shadow-xs" id="brand-logo-container">
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <span className="font-display font-bold text-lg text-zinc-950 tracking-tight block">PhysioConnect</span>
            <span className="text-[10px] text-zinc-400 font-mono block tracking-wider uppercase leading-none">Home Care Network</span>
          </div>
        </button>

        {/* Dynamic Contextual Navigation */}
        <nav className="hidden md:flex items-center gap-1.5" id="navbar-links">
          {user ? (
            user.role === 'patient' ? (
              <>
                <button
                  onClick={() => onNavigate('/patient/search')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPath === '/patient/search'
                      ? 'bg-zinc-50 text-zinc-950'
                      : 'text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50/50'
                  }`}
                >
                  <Search className="w-4 h-4" /> Search Physios
                </button>
                <button
                  onClick={() => onNavigate('/patient/bookings')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPath === '/patient/bookings'
                      ? 'bg-zinc-50 text-zinc-950'
                      : 'text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50/50'
                  }`}
                >
                  <Calendar className="w-4 h-4" /> Active Bookings
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('/physio/dashboard')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPath === '/physio/dashboard'
                      ? 'bg-zinc-50 text-zinc-950'
                      : 'text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50/50'
                  }`}
                >
                  <Sliders className="w-4 h-4" /> Inbox Board
                </button>
                {physioProfile?.status === 'approved' && (
                  <button
                    onClick={() => onNavigate('/physio/schedule')}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPath === '/physio/schedule'
                        ? 'bg-zinc-50 text-zinc-950'
                        : 'text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50/50'
                    }`}
                  >
                    <Clock className="w-4 h-4" /> Weekly Schedule
                  </button>
                )}
              </>
            )
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('/login')}
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 px-3 py-2"
                id="nav-login-btn"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('/onboarding')}
                className="inline-flex items-center justify-center px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium rounded-lg transition-colors shadow-xs"
                id="nav-register-btn"
              >
                Create Account
              </button>
            </div>
          )}
        </nav>

        {/* User Session Badges & Actions */}
        <div className="flex items-center gap-3" id="navbar-session-panel">
          {user && (
            <div className="flex items-center gap-3 border-l border-zinc-200 pl-4">
              <div className="hidden sm:flex flex-col items-end text-right">
                <span className="text-xs font-semibold text-zinc-900 block leading-tight">{user.fullName}</span>
                <span className="text-[10px] text-zinc-400 block font-mono capitalize leading-tight">
                  {user.role} {user.role === 'physio' && `• ${physioProfile?.status}`}
                </span>
              </div>
              
              <div className="relative group">
                <div className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center overflow-hidden" id="nav-user-avatar">
                  {user.profilePhoto ? (
                    <img src={user.profilePhoto} alt={user.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-zinc-500" />
                  )}
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  logout();
                  onNavigate('/login');
                }}
                className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-colors"
                title="Sign Out Session"
                id="nav-logout-btn"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
