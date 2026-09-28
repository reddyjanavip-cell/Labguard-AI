import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { AuthUser, UserRole, Patient } from '../types';

export interface AuthContextType {
  currentUser: AuthUser | null;
  effectiveRole: UserRole;
  previewRole: UserRole | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  isPatient: boolean;
  patientRecord: Patient | null;
  profileModalOpen: boolean;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  loginStaff: (emailOrEmployeeId: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginPatient: (uhid: string, phone: string, otp?: string) => Promise<{ success: boolean; error?: string }>;
  sendOTP: (identifier: string, userType: 'staff' | 'patient') => Promise<{ success: boolean; cooldownSeconds?: number; error?: string; message?: string; mode?: string }>;
  verifyOTP: (identifier: string, otp: string, userType: 'staff' | 'patient') => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<AuthUser>) => Promise<{ success: boolean; error?: string }>;
  switchRole: (role: UserRole) => void;
  switchPreviewRole: (role: UserRole | null) => void;
  loginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default seed user (Lab Manager) for initial experience
const DEFAULT_USER: AuthUser = {
  id: 'USR-02',
  name: 'Dr. Aris Thorne, MD',
  email: 'aris.thorne@novacare.org',
  role: 'lab_manager',
  department: 'Administration & Pathology',
  employeeId: 'EMP-1002',
  phone: '+91 98765 01002',
  photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256',
  language: 'en',
  permissions: ['DASHBOARD_FULL', 'PATIENTS_MANAGE', 'ORDERS_APPROVE', 'INVENTORY_WRITE', 'COPILOT_QUERY']
};

const DEFAULT_PATIENT: Patient = {
  patientId: 'PT-1001',
  name: 'Aarav Sharma',
  age: 42,
  gender: 'Male',
  phone: '+91 98765 43210',
  email: 'aarav.sharma@gmail.com',
  registrationDate: '2025-01-10',
  bloodGroup: 'A+',
  referringDoctor: 'Dr. Sunita Rao, MD',
  testsOrderedCount: 4,
  lastVisit: '2025-02-28',
  status: 'Active'
};

const VALID_ROLES: UserRole[] = [
  'administrator',
  'lab_manager',
  'technician',
  'pathologist',
  'finance',
  'pharmacist',
  'patient'
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('labguard_auth_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [previewRole, setPreviewRole] = useState<UserRole | null>(null);
  const [patientRecord, setPatientRecord] = useState<Patient | null>(() => {
    try {
      const saved = localStorage.getItem('labguard_patient_record');
      return saved ? JSON.parse(saved) : DEFAULT_PATIENT;
    } catch {
      return DEFAULT_PATIENT;
    }
  });

  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);

  // Sync state to storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('labguard_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('labguard_auth_user');
    }
  }, [currentUser]);

  useEffect(() => {
    if (patientRecord) {
      localStorage.setItem('labguard_patient_record', JSON.stringify(patientRecord));
    } else {
      localStorage.removeItem('labguard_patient_record');
    }
  }, [patientRecord]);

  // Derive single authoritative role with fallback
  const effectiveRole: UserRole = useMemo(() => {
    const candidate = previewRole || currentUser?.role;
    if (candidate && VALID_ROLES.includes(candidate)) {
      return candidate;
    }
    return 'lab_manager';
  }, [previewRole, currentUser]);

  const isPatient: boolean = effectiveRole === 'patient';
  const isAuthenticated: boolean = currentUser !== null;

  const switchRole = (newRole: UserRole) => {
    const targetRole = VALID_ROLES.includes(newRole) ? newRole : 'lab_manager';
    setPreviewRole(targetRole);

    if (currentUser) {
      setCurrentUser(prev => (prev ? { ...prev, role: targetRole } : null));
    }

    if (targetRole === 'patient' && !patientRecord) {
      setPatientRecord(DEFAULT_PATIENT);
    }
  };

  const switchPreviewRole = (role: UserRole | null) => {
    if (role && !VALID_ROLES.includes(role)) {
      setPreviewRole('lab_manager');
    } else {
      setPreviewRole(role);
      if (role && currentUser) {
        setCurrentUser(prev => (prev ? { ...prev, role } : null));
      }
    }
  };

  const loginStaff = async (emailOrEmployeeId: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsAuthLoading(true);
      const res = await fetch('/api/auth/staff-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrEmployeeId, password })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Authentication failed' };
      }

      setCurrentUser(data.user);
      setPreviewRole(null);
      setLoginModalOpen(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Connection error' };
    } finally {
      setIsAuthLoading(false);
    }
  };

  const loginPatient = async (uhid: string, phone: string, otp?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsAuthLoading(true);
      const res = await fetch('/api/auth/patient-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uhid, phone, otp })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Patient lookup failed' };
      }

      setCurrentUser(data.user);
      setPatientRecord(data.patient || DEFAULT_PATIENT);
      setPreviewRole('patient');
      setLoginModalOpen(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Connection error' };
    } finally {
      setIsAuthLoading(false);
    }
  };

  const sendOTP = async (identifier: string, userType: 'staff' | 'patient'): Promise<{ success: boolean; cooldownSeconds?: number; error?: string; message?: string; mode?: string }> => {
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, userType })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to dispatch OTP', cooldownSeconds: data.cooldownSeconds || 0 };
      }
      return { success: true, cooldownSeconds: data.cooldownSeconds || 30, message: data.message, mode: data.mode };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error while requesting OTP' };
    }
  };

  const verifyOTP = async (identifier: string, otp: string, userType: 'staff' | 'patient'): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsAuthLoading(true);
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp, userType })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Verification failed' };
      }

      setCurrentUser(data.user);
      if (userType === 'patient') {
        setPatientRecord(data.patient || DEFAULT_PATIENT);
        setPreviewRole('patient');
      } else {
        setPreviewRole(null);
      }
      setLoginModalOpen(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Verification connection error' };
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setPatientRecord(null);
    setPreviewRole(null);
    localStorage.removeItem('labguard_auth_user');
    localStorage.removeItem('labguard_patient_record');
    setLoginModalOpen(true);
  };

  const updateProfile = async (updates: Partial<AuthUser>): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) return { success: false, error: 'Not logged in' };

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id,
          'x-user-role': currentUser.role
        },
        body: JSON.stringify({
          userId: currentUser.id,
          ...updates
        })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to update profile' };
      }

      setCurrentUser(data.user);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        effectiveRole,
        previewRole,
        isAuthenticated,
        isAuthLoading,
        isPatient,
        patientRecord,
        profileModalOpen,
        openProfileModal: () => setProfileModalOpen(true),
        closeProfileModal: () => setProfileModalOpen(false),
        loginStaff,
        loginPatient,
        sendOTP,
        verifyOTP,
        logout,
        updateProfile,
        switchRole,
        switchPreviewRole,
        loginModalOpen,
        openLoginModal: () => setLoginModalOpen(true),
        closeLoginModal: () => setLoginModalOpen(false)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
