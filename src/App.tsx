import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { OnboardingForm } from './components/OnboardingForm';
import { DashboardSimulation } from './components/DashboardSimulation';
import { 
  Activity, 
  MapPin, 
  ShieldCheck, 
  Sliders, 
  Clock, 
  Award, 
  Search, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  Clock3, 
  FileText, 
  Lock, 
  ExternalLink,
  Users,
  Check
} from 'lucide-react';

// ==========================================
// LANDING PAGE VIEW (Unauthenticated)
// ==========================================
const LandingView: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="space-y-20 py-12 md:py-16" id="landing-page-view">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200/60 rounded-full" id="tagline-badge">
          <Activity className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-emerald-700">Clinical Home Care Network</span>
        </div>
        
        <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-zinc-950 tracking-tight leading-[1.05]" id="hero-heading">
          Restoring Mobility, Comfort, &amp; Independence
        </h1>
        
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-500 leading-relaxed" id="hero-subheading">
          PhysioConnect bridges the gap between premium, licensed physical therapists and patients needing tailored, at-home orthopedic and sports rehabilitation across Mumbai.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4" id="hero-ctas">
          <button
            onClick={() => onNavigate('/login')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-950 hover:bg-zinc-800 text-white font-medium rounded-xl text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2"
          >
            Book Home Therapy <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('/onboarding')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-zinc-50 text-zinc-800 font-medium rounded-xl text-sm border border-zinc-200 transition-colors"
          >
            Register as Provider <ExternalLink className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="border-t border-zinc-200/80 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="features-grid">
            <div className="space-y-3 p-6 bg-white rounded-2xl border border-zinc-100 shadow-xs">
              <div className="p-2.5 bg-zinc-950 text-white w-fit rounded-xl">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-display font-semibold text-lg text-zinc-900">100% Certified Clinicians</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Every physical therapist registers their clinical license, identity, and degree certificates for comprehensive credential verification.
              </p>
            </div>

            <div className="space-y-3 p-6 bg-white rounded-2xl border border-zinc-100 shadow-xs">
              <div className="p-2.5 bg-zinc-950 text-white w-fit rounded-xl">
                <MapPin className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-display font-semibold text-lg text-zinc-900">Geographical Radius Match</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Our smart matching engine computes exact straight-line distance bounds to ensure your therapist operates directly in your neighborhood.
              </p>
            </div>

            <div className="space-y-3 p-6 bg-white rounded-2xl border border-zinc-100 shadow-xs">
              <div className="p-2.5 bg-zinc-950 text-white w-fit rounded-xl">
                <Clock className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-display font-semibold text-lg text-zinc-900">Locked Pricing Models</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Clear pricing models with no hidden fees. Complete your rehabilitation home visit and settle payments seamlessly under certified audits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Quote / Stats Section */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-6 bg-zinc-50 rounded-2xl border border-zinc-200/60 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <img className="w-8 h-8 rounded-full border-2 border-zinc-50 object-cover" src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop" alt="physio-1" />
            <img className="w-8 h-8 rounded-full border-2 border-zinc-50 object-cover" src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=80&h=80&fit=crop" alt="physio-2" />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-900">Join Over 120+ Verified Partners</p>
            <p className="text-[11px] text-zinc-400">Certified by the Indian Association of Physiotherapists</p>
          </div>
        </div>
        <div className="h-px w-full md:w-px md:h-10 bg-zinc-200" />
        <div className="flex gap-8 text-center md:text-left">
          <div>
            <span className="text-xl font-bold font-display text-zinc-950">98%</span>
            <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">Patient Recovery</p>
          </div>
          <div>
            <span className="text-xl font-bold font-display text-zinc-950">15 min</span>
            <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">Avg Match Speed</p>
          </div>
        </div>
      </section>
    </div>
  );
};

// ==========================================
// LOGIN VIEW (Authentication & Presets)
// ==========================================
const LoginView: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { login, allUsers } = useAuth();
  const [emailInput, setEmailInput] = useState<string>('');
  const [alertMsg, setAlertMsg] = useState<string>('');

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMsg('');
    if (!emailInput.trim()) {
      setAlertMsg('Please enter an email address.');
      return;
    }
    const success = await login(emailInput.trim());
    if (success) {
      // Find user role to navigate correctly
      const loggedUser = allUsers.find((u) => u.email.toLowerCase() === emailInput.trim().toLowerCase());
      if (loggedUser) {
        if (loggedUser.role === 'patient') {
          onNavigate('/patient/search');
        } else {
          onNavigate('/physio/dashboard');
        }
      }
    } else {
      setAlertMsg('User email not registered. Please sign up or select a quick credential.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4" id="login-view-container">
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
        <div className="text-center space-y-1">
          <h2 className="font-display font-bold text-2xl text-zinc-900 tracking-tight">Welcome Back</h2>
          <p className="text-sm text-zinc-500">Sign in to manage your medical requests</p>
        </div>

        {alertMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{alertMsg}</span>
          </div>
        )}

        <form onSubmit={handleManualLogin} className="space-y-4" id="login-form">
          <div>
            <label className="block text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-1.5" htmlFor="login-email">
              Email Address
            </label>
            <input
              type="email"
              id="login-email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="e.g. priya@example.com"
              className="w-full px-3.5 py-2.5 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950/15 focus:border-zinc-950 bg-zinc-50/20 font-mono"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white font-medium rounded-lg text-sm transition-colors shadow-xs"
          >
            Sign In with Email
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-zinc-200"></div>
          <span className="flex-shrink mx-4 text-xs font-mono text-zinc-400 uppercase tracking-wider">Quick Testing Accounts</span>
          <div className="flex-grow border-t border-zinc-200"></div>
        </div>

        {/* Diagnostic Presets List for Rapid Review */}
        <div className="space-y-2.5" id="testing-account-presets">
          {/* Preset A: Priya Patient */}
          <button
            onClick={async () => {
              await login('priya@example.com');
              onNavigate('/patient/search');
            }}
            className="w-full p-3 border border-zinc-200/80 hover:border-zinc-300 hover:bg-zinc-50 text-left rounded-xl transition-all flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-bold text-zinc-900">Priya Menon</p>
              <p className="text-[10px] text-zinc-400 font-mono">priya@example.com • Patient Account</p>
            </div>
            <span className="text-[10px] bg-blue-50 text-blue-700 font-mono font-medium px-2 py-0.5 rounded border border-blue-200/40">Patient</span>
          </button>

          {/* Preset B: Rina Approved Physio */}
          <button
            onClick={async () => {
              await login('rina@example.com');
              onNavigate('/physio/dashboard');
            }}
            className="w-full p-3 border border-zinc-200/80 hover:border-zinc-300 hover:bg-zinc-50 text-left rounded-xl transition-all flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-bold text-zinc-900">Dr. Rina Shah</p>
              <p className="text-[10px] text-zinc-400 font-mono">rina@example.com • Certified Provider</p>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-mono font-medium px-2 py-0.5 rounded border border-emerald-200/40">Approved</span>
          </button>

          {/* Preset C: Sanjay Pending Physio */}
          <button
            onClick={async () => {
              await login('sanjay@example.com');
              onNavigate('/physio/dashboard');
            }}
            className="w-full p-3 border border-zinc-200/80 hover:border-zinc-300 hover:bg-zinc-50 text-left rounded-xl transition-all flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-bold text-zinc-900">Dr. Sanjay Mehta</p>
              <p className="text-[10px] text-zinc-400 font-mono">sanjay@example.com • Under Verification</p>
            </div>
            <span className="text-[10px] bg-amber-50 text-amber-700 font-mono font-medium px-2 py-0.5 rounded border border-amber-200/40">Pending</span>
          </button>
        </div>

        <p className="text-center text-xs text-zinc-400">
          New to the platform?{' '}
          <button onClick={() => onNavigate('/onboarding')} className="text-zinc-900 font-semibold hover:underline">
            Register a new profile
          </button>
        </p>
      </div>
    </div>
  );
};

// ==========================================
// PATIENT VIEW (Search & Discovery Profile)
// ==========================================
const PatientSearchView: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { allPhysios, allUsers } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');

  // Filter approved physiotherapists only (to ensure status quarantine matches criteria)
  const approvedPhysios = allPhysios.filter(p => p.status === 'approved');

  const filteredPhysios = approvedPhysios.filter((p) => {
    const userDetail = allUsers.find((u) => u.uid === p.uid);
    if (!userDetail) return false;

    const matchesSearch = userDetail.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.serviceArea.landmark.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || p.specialization === selectedSpecialty;

    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="space-y-8 py-8" id="patient-search-dashboard">
      <div className="space-y-1">
        <h2 className="font-display font-bold text-2xl text-zinc-950 tracking-tight">Find Certified Physiotherapists</h2>
        <p className="text-sm text-zinc-500">Locate licensed home care providers operating in your spatial radius.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-xs grid grid-cols-1 md:grid-cols-3 gap-3" id="filters-container">
        <div className="relative col-span-1 md:col-span-2">
          <span className="absolute left-3 top-3 text-zinc-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by physician name or neighborhood (e.g. Khar West)..."
            className="w-full pl-9 pr-4 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-zinc-950/20 focus:border-zinc-950 bg-zinc-50/10"
          />
        </div>

        <div>
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950/20 focus:border-zinc-950"
          >
            <option value="All">All Specializations</option>
            <option value="Sports Rehab">Sports Rehab</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Geriatric Care">Geriatric Care</option>
          </select>
        </div>
      </div>

      {/* Results Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="physio-results-grid">
        {filteredPhysios.length > 0 ? (
          filteredPhysios.map((p) => {
            const userDetail = allUsers.find((u) => u.uid === p.uid);
            if (!userDetail) return null;

            return (
              <div key={p.uid} className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-zinc-300 hover:shadow-xs transition-all duration-200">
                <div className="space-y-4">
                  {/* Photo & Name */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-full border border-zinc-200 bg-zinc-50 overflow-hidden shrink-0">
                      {userDetail.profilePhoto ? (
                        <img src={userDetail.profilePhoto} alt={userDetail.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400 bg-zinc-100 font-bold">
                          {userDetail.fullName[0]}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-display font-semibold text-base text-zinc-950 leading-tight truncate">{userDetail.fullName}</h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-mono font-medium bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded">
                          {p.specialization}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {p.experienceYears} Years Exp
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-500 line-clamp-3 leading-relaxed">
                    {p.bio}
                  </p>

                  {/* Pricing / Location bounds */}
                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500 font-mono">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{p.serviceArea.landmark} ({p.serviceArea.radiusKm}km radius)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-zinc-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-400 font-mono block">STARTING AT</span>
                    <span className="text-sm font-bold text-zinc-950">₹{p.services[0]?.price || 1000} / visit</span>
                  </div>

                  <button
                    onClick={() => alert(`Booking flow will trigger in Milestone 5 for ${userDetail.fullName}`)}
                    className="inline-flex items-center justify-center px-3.5 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
                  >
                    Request Appointment
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center space-y-2 border border-dashed border-zinc-200 bg-zinc-50/50 rounded-2xl" id="search-empty-state">
            <Users className="w-8 h-8 text-zinc-400 mx-auto" />
            <h4 className="font-display font-medium text-sm text-zinc-900">No Therapists Found</h4>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">Try altering your specialization selection or broaden your search input terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// PHYSIO WORKSPACE (Verified & Quarantine states)
// ==========================================
const PhysioDashboardView: React.FC = () => {
  const { user, physioProfile } = useAuth();

  if (!physioProfile) return null;

  // Render Quarantine State if the clinician has not been approved
  if (physioProfile.status === 'pending') {
    return (
      <div className="max-w-xl mx-auto py-12 px-4" id="quarantine-pending-view">
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
          <div className="text-center space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
              <Clock3 className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h2 className="font-display font-bold text-xl text-zinc-950 tracking-tight">Credentials Under Review</h2>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Your medical registration is quarantined in our secure validation queue.
              </p>
            </div>
          </div>

          {/* Educational Clinical Verification Checkpoint List */}
          <div className="p-4 bg-zinc-50 border border-zinc-150 rounded-xl space-y-3 text-xs" id="quarantine-checkpoints">
            <h4 className="font-semibold text-zinc-800 uppercase tracking-wider font-mono text-[10px]">Verification Checklist Status</h4>
            
            <div className="flex items-start gap-2.5">
              <span className="p-0.5 bg-emerald-50 text-emerald-600 rounded mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </span>
              <div>
                <p className="font-medium text-zinc-900">Account Identity Form Created</p>
                <p className="text-[11px] text-zinc-400 font-mono">Completed: ISO {user?.createdAt.slice(0, 10)}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="p-0.5 bg-emerald-50 text-emerald-600 rounded mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </span>
              <div>
                <p className="font-medium text-zinc-900">Clinical License ID Submitted</p>
                <p className="text-[11px] text-zinc-400 font-mono">Detected Code: {physioProfile.licenseNumber || 'PENDING'}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="p-0.5 bg-emerald-50 text-emerald-600 rounded mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </span>
              <div>
                <p className="font-medium text-zinc-900">Degree Accreditation PDF Received</p>
                <p className="text-[11px] text-zinc-400 font-mono truncate max-w-[280px]">Attached: {physioProfile.certificationFileName || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="p-0.5 bg-zinc-100 text-zinc-500 rounded mt-0.5">
                <Clock3 className="w-3.5 h-3.5" />
              </span>
              <div>
                <p className="font-medium text-zinc-500">Manual Background Check Pending</p>
                <p className="text-[11px] text-zinc-400">Verifying qualifications with the Indian Association of Physiotherapists (IAP).</p>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-zinc-50 border border-zinc-150 rounded-xl text-[11px] text-zinc-500 flex items-center gap-2">
            <Lock className="w-4 h-4 text-zinc-400 shrink-0" />
            <span>While pending review, scheduler registries and patient map discovery portals remain inaccessible.</span>
          </div>

          <p className="text-center text-[11px] text-zinc-400 font-mono">
            Protip: Use the **Test Harness** above to click "Approve" and verify the layout transition.
          </p>
        </div>
      </div>
    );
  }

  // Render Rejected State if the clinician has been rejected
  if (physioProfile.status === 'rejected') {
    return (
      <div className="max-w-xl mx-auto py-12 px-4" id="quarantine-rejected-view">
        <div className="bg-white border border-red-100 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
          <div className="text-center space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-50 text-red-600 border border-red-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="font-display font-bold text-xl text-zinc-950 tracking-tight">Credentials Verification Rejected</h2>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Our verification administrators were unable to validate your submitted medical license or qualifications.
              </p>
            </div>
          </div>

          <div className="p-4 bg-red-50/50 border border-red-100 rounded-xl text-xs text-red-800 space-y-2">
            <h4 className="font-semibold uppercase tracking-wider font-mono text-[10px]">Rejection Reason</h4>
            <p className="leading-relaxed">
              License code `{physioProfile.licenseNumber}` could not be matched against current registrations in the state association council databases. Attached certificate image is illegible.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => alert('Appeal process triggers in future milestone')}
              className="flex-1 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold text-center"
            >
              Submit Appeal
            </button>
            <button
              onClick={() => alert('Clinical support portal')}
              className="flex-1 py-2 border border-zinc-200 text-zinc-600 rounded-lg text-xs font-semibold hover:bg-zinc-50 text-center"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active / Approved State View
  return (
    <div className="space-y-8 py-8" id="physio-approved-dashboard">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-2xl text-zinc-950 tracking-tight">Physiotherapist Clinical Board</h2>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Fully Verified
            </span>
          </div>
          <p className="text-sm text-zinc-500">Manage home therapy schedules, client details, and pending session requests.</p>
        </div>
      </div>

      {/* Grid containing Clinical Stats & Schedules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="physio-dashboard-layout">
        {/* Main column: Active inbox */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-display font-semibold text-lg text-zinc-900">Active Requests Inbox</h3>
            
            <div className="py-12 text-center space-y-2 border border-dashed border-zinc-150 rounded-xl">
              <Sliders className="w-8 h-8 text-zinc-300 mx-auto" />
              <p className="text-sm font-medium text-zinc-700">Inbox is empty</p>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">No patients have submitted booking requests inside your `{physioProfile.serviceArea.radiusKm} KM` radius yet.</p>
            </div>
          </div>
        </div>

        {/* Sidebar: Profile Overview and Boundaries */}
        <div className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h4 className="font-display font-semibold text-sm text-zinc-900">Coverage Boundary Details</h4>
            
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-400">Specialty</span>
                <span className="text-zinc-900 font-semibold">{physioProfile.specialization}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-400">License ID</span>
                <span className="text-zinc-900 font-semibold">{physioProfile.licenseNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-400">Center Area</span>
                <span className="text-zinc-900 font-semibold">{physioProfile.serviceArea.landmark}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-400">Service Radius</span>
                <span className="text-emerald-600 font-semibold">{physioProfile.serviceArea.radiusKm} KM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// CORE APP ROUTER & WRAPPER
// ==========================================
const AppContent: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const { user, physioProfile } = useAuth();

  // Unified Route Guards to enforce dashboard isolation & verification quarantine
  const handleNavigate = (path: string) => {
    // 1. Guard Guest Paths
    if (!user && (path.startsWith('/patient') || path.startsWith('/physio'))) {
      setCurrentPath('/login');
      return;
    }

    // 2. Guard Patient Paths from Physicians
    if (user && user.role !== 'patient' && path.startsWith('/patient')) {
      setCurrentPath('/physio/dashboard');
      return;
    }

    // 3. Guard Physician Paths from Patients
    if (user && user.role !== 'physio' && path.startsWith('/physio')) {
      setCurrentPath('/patient/search');
      return;
    }

    setCurrentPath(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50/50">
      {/* Test Simulation Panel visible in header */}
      <DashboardSimulation currentPath={currentPath} onNavigate={handleNavigate} />

      {/* Primary Navigation Header */}
      <Navbar currentPath={currentPath} onNavigate={handleNavigate} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-6" id="app-view-stage">
        {(() => {
          // Unauthenticated view
          if (currentPath === '/') {
            return <LandingView onNavigate={handleNavigate} />;
          }

          // Registration/Onboarding step form
          if (currentPath === '/onboarding') {
            return (
              <div className="py-8">
                <OnboardingForm onSuccess={() => handleNavigate(user?.role === 'patient' ? '/patient/search' : '/physio/dashboard')} />
              </div>
            );
          }

          // Sign In
          if (currentPath === '/login') {
            return <LoginView onNavigate={handleNavigate} />;
          }

          // PATIENT SEARCH DIRECTORY (Protected)
          if (currentPath === '/patient/search') {
            if (user?.role !== 'patient') {
              return <div className="text-center py-12 text-zinc-500 font-mono text-sm">Access Denied: Patient role required.</div>;
            }
            return <PatientSearchView onNavigate={handleNavigate} />;
          }

          // PHYSIO WORKSPACE (Protected & Quarantined)
          if (currentPath === '/physio/dashboard') {
            if (user?.role !== 'physio') {
              return <div className="text-center py-12 text-zinc-500 font-mono text-sm">Access Denied: Physio role required.</div>;
            }
            return <PhysioDashboardView />;
          }

          // Fallback Default
          return <LandingView onNavigate={handleNavigate} />;
        })()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-200/80 py-8 text-center text-xs text-zinc-400 font-mono mt-16">
        <p>© 2026 PhysioConnect Medical Network. All Rights Reserved.</p>
        <p className="mt-1">ISO-27001 Certified • National Health Authority Integrated</p>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
