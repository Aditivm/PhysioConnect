import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole, PhysioProfile } from '../types';
import { 
  Shield, 
  Award, 
  Upload, 
  User, 
  FileText, 
  MapPin, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Info, 
  FileCheck,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface OnboardingFormProps {
  onSuccess: () => void;
}

export const OnboardingForm: React.FC<OnboardingFormProps> = ({ onSuccess }) => {
  const { signup, submitVerification, user } = useAuth();

  // Onboarding Step state
  // Step 1: Role Selection
  // Step 2: Core User Account details (Name, Email, Phone)
  // Step 3 (Physio Only): National License & ID Validation
  // Step 4 (Physio Only): Specialization, Bio & Service Area Radius
  const [step, setStep] = useState<number>(1);
  const [role, setRole] = useState<UserRole>('patient');

  // Core inputs
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Physio specific inputs
  const [licenseNumber, setLicenseNumber] = useState<string>('');
  const [aadharNumber, setAadharNumber] = useState<string>('');
  const [specialization, setSpecialization] = useState<string>('Sports Rehab');
  const [experienceYears, setExperienceYears] = useState<number>(5);
  const [bio, setBio] = useState<string>('');
  const [radiusKm, setRadiusKm] = useState<number>(5);
  const [landmark, setLandmark] = useState<string>('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<boolean>(false);

  // Handle local mock file drops
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf" || file.type.startsWith("image/")) {
        setFileName(file.name);
      } else {
        setErrorMsg('Please upload a PDF or image file.');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  // Step Navigations & Local validation
  const nextStep = () => {
    setErrorMsg('');
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!fullName.trim() || !email.trim() || !phone.trim()) {
        setErrorMsg('Please complete all contact details.');
        return;
      }
      if (!email.includes('@')) {
        setErrorMsg('Please enter a valid email address.');
        return;
      }
      if (phone.length < 10) {
        setErrorMsg('Please enter a valid 10-digit phone number.');
        return;
      }

      // If patient, complete onboarding right now
      if (role === 'patient') {
        handleCompletePatient();
      } else {
        setStep(3);
      }
    } else if (step === 3) {
      if (!licenseNumber.trim()) {
        setErrorMsg('State / Central Clinical License Number is required for verification.');
        return;
      }
      if (aadharNumber.replace(/\D/g, '').length !== 12) {
        setErrorMsg('Please enter a valid 12-digit Aadhar Card Number.');
        return;
      }
      if (!fileName) {
        setErrorMsg('Please upload your Degree / License Certificate to proceed.');
        return;
      }
      setStep(4);
    }
  };

  const prevStep = () => {
    setErrorMsg('');
    setStep((s) => Math.max(1, s - 1));
  };

  const handleCompletePatient = async () => {
    try {
      await signup(fullName, email, phone, 'patient');
      onSuccess();
    } catch (err) {
      setErrorMsg('Error creating patient profile.');
    }
  };

  const handleCompletePhysio = async () => {
    setErrorMsg('');
    if (!bio.trim() || bio.length < 20) {
      setErrorMsg('Please write a professional bio of at least 20 characters.');
      return;
    }
    if (!landmark.trim()) {
      setErrorMsg('Please define your home service central landmark.');
      return;
    }

    try {
      // Step 1: Sign up core user
      const createdUser = await signup(fullName, email, phone, 'physio');
      // Step 2: Submit credentials profile
      const updateData: Partial<PhysioProfile> = {
        licenseNumber,
        aadharCardNumber: aadharNumber,
        certificationFileName: fileName,
        specialization,
        experienceYears,
        bio,
        serviceArea: {
          lat: 19.0596, // Mock Coordinate
          lng: 72.8295,
          radiusKm,
          landmark
        },
        status: 'pending' // default quarantine state
      };
      await submitVerification(createdUser.uid, updateData);
      onSuccess();
    } catch (err) {
      setErrorMsg('Verification upload failed.');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white border border-zinc-200/80 rounded-2xl shadow-sm overflow-hidden" id="onboarding-card">
      {/* Top Progress bar */}
      <div className="bg-zinc-50 border-b border-zinc-100 px-6 py-4 flex items-center justify-between" id="progress-header">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-zinc-900" id="onboarding-shield-icon" />
          <span className="font-display font-medium text-sm text-zinc-900 tracking-tight" id="onboarding-title-badge">
            Secure Onboarding Engine
          </span>
        </div>
        <div className="flex items-center gap-1.5" id="step-indicators">
          {[1, 2, 3, 4].map((num) => {
            // If patient, steps 3 & 4 are omitted visually
            if (role === 'patient' && num > 2) return null;
            const isActive = step === num;
            const isCompleted = step > num;
            return (
              <div
                key={num}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'w-6 bg-zinc-900' 
                    : isCompleted 
                    ? 'w-4 bg-zinc-400' 
                    : 'w-1.5 bg-zinc-200'
                }`}
                id={`step-dot-${num}`}
              />
            );
          })}
        </div>
      </div>

      <div className="p-6 md:p-8" id="onboarding-content-container">
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2.5" id="onboarding-error-box">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}

        {/* STEP 1: ROLE SELECTION */}
        {step === 1 && (
          <div className="space-y-6" id="onboarding-step-1">
            <div className="text-center space-y-2">
              <h1 className="font-display text-2xl font-semibold text-zinc-900 tracking-tight">
                Create Your Account
              </h1>
              <p className="text-sm text-zinc-500">
                Are you seeking trusted physical therapy or registering as an approved clinical provider?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8" id="role-grid">
              {/* Option A: Patient */}
              <button
                type="button"
                onClick={() => setRole('patient')}
                className={`relative p-5 text-left rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 ${
                  role === 'patient'
                    ? 'border-zinc-900 bg-zinc-50/50 shadow-xs'
                    : 'border-zinc-200 hover:border-zinc-300 bg-white'
                }`}
                id="role-btn-patient"
              >
                <div className="flex items-start justify-between">
                  <div className={`p-2.5 rounded-lg border ${role === 'patient' ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-zinc-50 text-zinc-600 border-zinc-100'}`}>
                    <User className="w-5 h-5" />
                  </div>
                  {role === 'patient' && (
                    <div className="bg-zinc-900 text-white rounded-full p-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <h3 className="font-display font-medium text-base text-zinc-900">Patient Shell</h3>
                  <p className="text-xs text-zinc-500 mt-1 leading-normal">
                    Search coordinates, view local therapists, and book certified home rehabilitation.
                  </p>
                </div>
              </button>

              {/* Option B: Physiotherapist */}
              <button
                type="button"
                onClick={() => setRole('physio')}
                className={`relative p-5 text-left rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 ${
                  role === 'physio'
                    ? 'border-zinc-900 bg-zinc-50/50 shadow-xs'
                    : 'border-zinc-200 hover:border-zinc-300 bg-white'
                }`}
                id="role-btn-physio"
              >
                <div className="flex items-start justify-between">
                  <div className={`p-2.5 rounded-lg border ${role === 'physio' ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-zinc-50 text-zinc-600 border-zinc-100'}`}>
                    <Award className="w-5 h-5" />
                  </div>
                  {role === 'physio' && (
                    <div className="bg-zinc-900 text-white rounded-full p-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <h3 className="font-display font-medium text-base text-zinc-900">Physiotherapist</h3>
                  <p className="text-xs text-zinc-500 mt-1 leading-normal">
                    List credentials, define service area boundaries, and coordinate medical requests.
                  </p>
                </div>
              </button>
            </div>

            <div className="flex justify-end pt-4" id="step-1-next-btn-container">
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-lg text-sm transition-colors shadow-xs"
                id="btn-next-step"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PROFILE CONTACT INFO */}
        {step === 2 && (
          <div className="space-y-6" id="onboarding-step-2">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">
                Step 02 of {role === 'patient' ? '02' : '04'}
              </span>
              <h2 className="font-display text-2xl font-semibold text-zinc-900 tracking-tight">
                Profile Registration
              </h2>
              <p className="text-sm text-zinc-500">
                Provide your core contact attributes to register your secure identity profile.
              </p>
            </div>

            <div className="space-y-4" id="signup-fields">
              <div>
                <label className="block text-xs font-medium text-zinc-600 uppercase tracking-wider mb-1.5" htmlFor="full-name">
                  Full Name
                </label>
                <input
                  type="text"
                  id="full-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Dr. Rina Shah"
                  className="w-full px-3.5 py-2 border border-zinc-200 rounded-lg text-sm bg-zinc-50/20 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-600 uppercase tracking-wider mb-1.5" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@clinical.com"
                  className="w-full px-3.5 py-2 border border-zinc-200 rounded-lg text-sm bg-zinc-50/20 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-600 uppercase tracking-wider mb-1.5" htmlFor="phone">
                  Contact Phone Number (10 digit)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2 text-zinc-400 text-sm font-mono">+91</span>
                  <input
                    type="tel"
                    id="phone"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    className="w-full pl-12 pr-3.5 py-2 border border-zinc-200 rounded-lg text-sm bg-zinc-50/20 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all font-mono"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4" id="step-2-navs">
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-zinc-200 text-zinc-600 font-medium rounded-lg text-sm hover:bg-zinc-50 transition-colors"
                id="btn-back-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-lg text-sm transition-colors shadow-xs"
                id="btn-submit-step-2"
              >
                {role === 'patient' ? 'Register Account' : 'Next Step'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 (PHYSIO ONLY): LICENSING & SENSITIVE CREDENTIALS */}
        {step === 3 && role === 'physio' && (
          <div className="space-y-6" id="onboarding-step-3">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">
                Step 03 of 04
              </span>
              <h2 className="font-display text-2xl font-semibold text-zinc-900 tracking-tight">
                Clinical Qualifications
              </h2>
              <p className="text-sm text-zinc-500">
                PhysioConnect guarantees client safety. Provide active licensing credentials to register.
              </p>
            </div>

            <div className="space-y-4" id="verification-fields">
              <div>
                <label className="block text-xs font-medium text-zinc-600 uppercase tracking-wider mb-1.5" htmlFor="license-number">
                  Clinical License Registration Number
                </label>
                <input
                  type="text"
                  id="license-number"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="e.g. IAP-61293 or State Reg No"
                  className="w-full px-3.5 py-2 border border-zinc-200 rounded-lg text-sm bg-zinc-50/20 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all font-mono"
                  required
                />
                <p className="text-[11px] text-zinc-400 mt-1">Indian Association of Physiotherapists or State Council Code</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-600 uppercase tracking-wider mb-1.5" htmlFor="aadhar-number">
                  Aadhar Card Number (Sensitive Data)
                </label>
                <input
                  type="text"
                  id="aadhar-number"
                  maxLength={14}
                  value={aadharNumber}
                  onChange={(e) => {
                    // Automatically format: XXXX-XXXX-XXXX
                    const clean = e.target.value.replace(/\D/g, '').slice(0, 12);
                    const segments = clean.match(/.{1,4}/g);
                    setAadharNumber(segments ? segments.join('-') : clean);
                  }}
                  placeholder="XXXX-XXXX-XXXX"
                  className="w-full px-3.5 py-2 border border-zinc-200 rounded-lg text-sm bg-zinc-50/20 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all font-mono"
                  required
                />
                <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-1">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>PII Safe: Isolated in `/physio_credentials` root collection.</span>
                </div>
              </div>

              {/* Certificate File Drag and Drop / Selection target */}
              <div>
                <label className="block text-xs font-medium text-zinc-600 uppercase tracking-wider mb-1.5">
                  Degree / BPT / MPT Certificate Copy (PDF/JPG)
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                    dragOver 
                      ? 'border-zinc-900 bg-zinc-50' 
                      : fileName 
                      ? 'border-emerald-300 bg-emerald-50/10' 
                      : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/10'
                  }`}
                  id="drag-drop-target"
                >
                  <input
                    type="file"
                    id="file-upload"
                    accept=".pdf,image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                    {fileName ? (
                      <>
                        <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-full mb-2">
                          <FileCheck className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-medium text-zinc-900 font-mono truncate max-w-xs">{fileName}</p>
                        <p className="text-xs text-zinc-500 mt-1">Successfully attached. Click to change.</p>
                      </>
                    ) : (
                      <>
                        <div className="p-2.5 bg-zinc-100 text-zinc-500 rounded-full mb-2">
                          <Upload className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-medium text-zinc-800">Drag & Drop or click to browse</p>
                        <p className="text-xs text-zinc-400 mt-1">Upload valid medical accreditation files (Max 5MB)</p>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4" id="step-3-navs">
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-zinc-200 text-zinc-600 font-medium rounded-lg text-sm hover:bg-zinc-50 transition-colors"
                id="btn-back-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium rounded-lg text-sm transition-colors shadow-xs"
                id="btn-submit-step-3"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 (PHYSIO ONLY): GEOGRAPHY & SERVICE DETAILS */}
        {step === 4 && role === 'physio' && (
          <div className="space-y-6" id="onboarding-step-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-mono">
                Step 04 of 04
              </span>
              <h2 className="font-display text-2xl font-semibold text-zinc-900 tracking-tight">
                Profile Specialization
              </h2>
              <p className="text-sm text-zinc-500">
                Specify your medical specialties and geographical reach to start receiving bookings.
              </p>
            </div>

            <div className="space-y-4" id="geography-fields">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-600 uppercase tracking-wider mb-1.5" htmlFor="specialty">
                    Specialization
                  </label>
                  <select
                    id="specialty"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900"
                  >
                    <option value="Sports Rehab">Sports Rehab</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Geriatric Care">Geriatric Care</option>
                    <option value="Neurological Rehab">Neurological Rehab</option>
                    <option value="Pediatric Rehab">Pediatric Rehab</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-600 uppercase tracking-wider mb-1.5" htmlFor="exp">
                    Experience Years
                  </label>
                  <input
                    type="number"
                    id="exp"
                    min={0}
                    max={50}
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm bg-zinc-50/20 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-600 uppercase tracking-wider mb-1.5" htmlFor="landmark">
                  Home Visit Center Landmark / Area
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-zinc-400">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    id="landmark"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Khar West, Mumbai"
                    className="w-full pl-9 pr-3.5 py-2 border border-zinc-200 rounded-lg text-sm bg-zinc-50/20 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-medium text-zinc-600 uppercase tracking-wider">
                    Travel Coverage Radius
                  </label>
                  <span className="text-xs font-semibold text-zinc-950 font-mono bg-zinc-100 px-2 py-0.5 rounded">
                    {radiusKm} KM
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={25}
                  step={1}
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 font-mono mt-1">
                  <span>2 KM</span>
                  <span>12 KM</span>
                  <span>25 KM</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-600 uppercase tracking-wider mb-1.5" htmlFor="bio">
                  Professional Bio
                </label>
                <textarea
                  id="bio"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Describe your therapy approach, key certifications, and clinical methods..."
                  className="w-full px-3.5 py-2 border border-zinc-200 rounded-lg text-sm bg-zinc-50/20 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all resize-none"
                  required
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4" id="step-4-navs">
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-zinc-200 text-zinc-600 font-medium rounded-lg text-sm hover:bg-zinc-50 transition-colors"
                id="btn-back-3"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={handleCompletePhysio}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm transition-colors shadow-xs"
                id="btn-finish"
              >
                Submit Credentials <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
