import React, { createContext, useContext, useState, useEffect } from 'react';
import { BaseUser, PhysioProfile, UserRole } from '../types';

interface AuthContextType {
  user: BaseUser | null;
  physioProfile: PhysioProfile | null;
  loading: boolean;
  allUsers: BaseUser[];
  allPhysios: PhysioProfile[];
  login: (email: string) => Promise<boolean>;
  signup: (fullName: string, email: string, phone: string, role: UserRole) => Promise<BaseUser>;
  submitVerification: (uid: string, data: Partial<PhysioProfile>) => Promise<void>;
  logout: () => void;
  // Simulation Helpers for Automated Verification & Testing
  switchSimulationState: (role: UserRole | 'guest', status?: 'pending' | 'approved' | 'rejected') => void;
  adminSetPhysioStatus: (uid: string, status: 'pending' | 'approved' | 'rejected') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial Mock Patients
const MOCK_PATIENT: BaseUser = {
  uid: 'pat_priya',
  fullName: 'Priya Menon',
  email: 'priya@example.com',
  phone: '9820012345',
  role: 'patient',
  profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
  createdAt: new Date().toISOString(),
  isActive: true,
};

// Initial Mock Physio Profiles corresponding to the layout screenshots
const INITIAL_PHYSIOS: PhysioProfile[] = [
  {
    uid: 'phys_rina',
    specialization: 'Sports Rehab',
    experienceYears: 6,
    bio: 'Dedicated physical therapist specializing in sports injury rehabilitation, dry needling, and posture correction. Helping athletes return to peak performance.',
    licenseNumber: 'IAP-61293',
    aadharCardNumber: '5432-8765-1092',
    certificationFileName: 'rina_degree_bpt.pdf',
    status: 'approved',
    avgRating: 4.8,
    totalReviews: 24,
    serviceArea: {
      lat: 19.0596, // Bandra
      lng: 72.8295,
      radiusKm: 8,
      landmark: 'Bandra, Khar West',
    },
    services: [
      { type: 'home', price: 1200, durationMinutes: 60, enabled: true },
      { type: 'clinic', price: 800, durationMinutes: 45, enabled: true },
    ],
  },
  {
    uid: 'phys_amit',
    specialization: 'Orthopedics',
    experienceYears: 10,
    bio: 'Senior orthopedic physiotherapist with deep expertise in post-surgical knee/hip replacements, chronic joint pain, and osteoarthritis management.',
    licenseNumber: 'IAP-34581',
    aadharCardNumber: '1234-5678-9012',
    certificationFileName: 'amit_ortho_mpt.pdf',
    status: 'approved',
    avgRating: 4.6,
    totalReviews: 42,
    serviceArea: {
      lat: 19.0686, // Khar West
      lng: 72.8358,
      radiusKm: 5,
      landmark: 'Khar West, Santacruz',
    },
    services: [
      { type: 'home', price: 1500, durationMinutes: 60, enabled: true },
      { type: 'clinic', price: 1000, durationMinutes: 45, enabled: true },
    ],
  },
  {
    uid: 'phys_sanjay',
    specialization: 'Geriatric Care',
    experienceYears: 8,
    bio: 'Compassionate therapist focused on enhancing mobility, balance, and independence in senior citizens. Experiency in Parkinson’s and stroke rehab.',
    licenseNumber: 'IAP-90123',
    aadharCardNumber: '9876-5432-1098',
    certificationFileName: 'sanjay_geriatric_cert.pdf',
    status: 'pending',
    avgRating: 0.0,
    totalReviews: 0,
    serviceArea: {
      lat: 19.1025, // Juhu
      lng: 72.8270,
      radiusKm: 6,
      landmark: 'Juhu, Vile Parle',
    },
    services: [
      { type: 'home', price: 1000, durationMinutes: 60, enabled: true },
    ],
  }
];

const INITIAL_USERS: BaseUser[] = [
  MOCK_PATIENT,
  {
    uid: 'phys_rina',
    fullName: 'Dr. Rina Shah',
    email: 'rina@example.com',
    phone: '9819923456',
    role: 'physio',
    profilePhoto: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop',
    createdAt: new Date().toISOString(),
    isActive: true,
  },
  {
    uid: 'phys_amit',
    fullName: 'Dr. Amit Rao',
    email: 'amit@example.com',
    phone: '9819987654',
    role: 'physio',
    profilePhoto: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop',
    createdAt: new Date().toISOString(),
    isActive: true,
  },
  {
    uid: 'phys_sanjay',
    fullName: 'Dr. Sanjay Mehta',
    email: 'sanjay@example.com',
    phone: '9820045678',
    role: 'physio',
    profilePhoto: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&h=150&fit=crop',
    createdAt: new Date().toISOString(),
    isActive: true,
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<BaseUser | null>(null);
  const [physioProfile, setPhysioProfile] = useState<PhysioProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [allUsers, setAllUsers] = useState<BaseUser[]>(INITIAL_USERS);
  const [allPhysios, setAllPhysios] = useState<PhysioProfile[]>(INITIAL_PHYSIOS);

  useEffect(() => {
    // Simulate initial load from localStorage if present
    const cachedUser = localStorage.getItem('pc_current_user');
    if (cachedUser) {
      const parsedUser = JSON.parse(cachedUser) as BaseUser;
      setUser(parsedUser);
      if (parsedUser.role === 'physio') {
        const foundProfile = allPhysios.find((p) => p.uid === parsedUser.uid);
        if (foundProfile) {
          setPhysioProfile(foundProfile);
        }
      }
    } else {
      // Default to guest on first load
      setUser(null);
    }
    setLoading(false);
  }, [allPhysios]);

  const login = async (email: string): Promise<boolean> => {
    setLoading(true);
    const foundUser = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('pc_current_user', JSON.stringify(foundUser));
      if (foundUser.role === 'physio') {
        const profile = allPhysios.find((p) => p.uid === foundUser.uid);
        if (profile) {
          setPhysioProfile(profile);
        } else {
          setPhysioProfile(null);
        }
      } else {
        setPhysioProfile(null);
      }
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  const signup = async (fullName: string, email: string, phone: string, role: UserRole): Promise<BaseUser> => {
    setLoading(true);
    const newUid = `user_${Date.now()}`;
    const newUser: BaseUser = {
      uid: newUid,
      fullName,
      email,
      phone,
      role,
      profilePhoto: null,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    setAllUsers((prev) => [...prev, newUser]);
    setUser(newUser);
    localStorage.setItem('pc_current_user', JSON.stringify(newUser));

    if (role === 'physio') {
      const newProfile: PhysioProfile = {
        uid: newUid,
        specialization: '',
        experienceYears: 0,
        bio: '',
        licenseNumber: '',
        aadharCardNumber: '',
        certificationFileName: null,
        status: 'pending',
        avgRating: 0.0,
        totalReviews: 0,
        serviceArea: {
          lat: 19.0760, // Default Mumbai Central
          lng: 72.8777,
          radiusKm: 5,
          landmark: '',
        },
        services: [
          { type: 'home', price: 1000, durationMinutes: 60, enabled: true },
        ],
      };
      setAllPhysios((prev) => [...prev, newProfile]);
      setPhysioProfile(newProfile);
    } else {
      setPhysioProfile(null);
    }

    setLoading(false);
    return newUser;
  };

  const submitVerification = async (uid: string, data: Partial<PhysioProfile>): Promise<void> => {
    setLoading(true);
    setAllPhysios((prev) =>
      prev.map((p) => (p.uid === uid ? { ...p, ...data, status: 'pending' as const } : p))
    );
    if (physioProfile && physioProfile.uid === uid) {
      setPhysioProfile((prev) => (prev ? { ...prev, ...data, status: 'pending' as const } : null));
    }
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    setPhysioProfile(null);
    localStorage.removeItem('pc_current_user');
  };

  // Switch simulation parameters instantly to allow fast inspection of role dashboards
  const switchSimulationState = (role: UserRole | 'guest', status: 'pending' | 'approved' | 'rejected' = 'approved') => {
    setLoading(true);
    if (role === 'guest') {
      setUser(null);
      setPhysioProfile(null);
      localStorage.removeItem('pc_current_user');
    } else if (role === 'patient') {
      setUser(MOCK_PATIENT);
      setPhysioProfile(null);
      localStorage.setItem('pc_current_user', JSON.stringify(MOCK_PATIENT));
    } else if (role === 'physio') {
      // Find a matching physio by status
      const matchedPhysio = allPhysios.find((p) => p.status === status);
      if (matchedPhysio) {
        const correspondingUser = allUsers.find((u) => u.uid === matchedPhysio.uid);
        if (correspondingUser) {
          setUser(correspondingUser);
          setPhysioProfile(matchedPhysio);
          localStorage.setItem('pc_current_user', JSON.stringify(correspondingUser));
        }
      } else {
        // Fallback fallback
        const backupProfile = allPhysios[0];
        backupProfile.status = status;
        const backupUser = allUsers.find((u) => u.uid === backupProfile.uid)!;
        setUser(backupUser);
        setPhysioProfile(backupProfile);
        localStorage.setItem('pc_current_user', JSON.stringify(backupUser));
      }
    }
    setLoading(false);
  };

  const adminSetPhysioStatus = (uid: string, status: 'pending' | 'approved' | 'rejected') => {
    setAllPhysios((prev) =>
      prev.map((p) => (p.uid === uid ? { ...p, status } : p))
    );
    if (physioProfile && physioProfile.uid === uid) {
      setPhysioProfile((prev) => (prev ? { ...prev, status } : null));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        physioProfile,
        loading,
        allUsers,
        allPhysios,
        login,
        signup,
        submitVerification,
        logout,
        switchSimulationState,
        adminSetPhysioStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
