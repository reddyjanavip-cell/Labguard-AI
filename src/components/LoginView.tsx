import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  AlertCircle, 
  Building2, 
  User, 
  KeyRound, 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft,
  RefreshCw,
  Clock,
  Radio,
  Send
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess?: () => void;
  onBack?: () => void;
  isModal?: boolean;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onBack, isModal = false }) => {
  const { loginStaff, loginPatient, sendOTP, verifyOTP, currentUser, closeLoginModal } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [activePortal, setActivePortal] = useState<'staff' | 'patient'>('staff');
  const [authMode, setAuthMode] = useState<'password' | 'otp'>('password');

  // Staff Form
  const [staffIdentifier, setStaffIdentifier] = useState('aris.thorne@novacare.org');
  const [staffPassword, setStaffPassword] = useState('Hospital#2025');

  // Patient Form
  const [uhid, setUhid] = useState('PT-1001');
  const [phone, setPhone] = useState('+91 98765 43210');

  // OTP State (Staff & Patient)
  const [otpCode, setOtpCode] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [otpGatewayMode, setOtpGatewayMode] = useState<'DEMO' | 'LIVE'>('DEMO');

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // 30s Cooldown Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (isModal) {
      closeLoginModal();
    } else if (currentUser) {
      closeLoginModal();
    } else {
      // Default: login as demo manager to allow return to main dashboard
      loginStaff('aris.thorne@novacare.org', 'Hospital#2025');
    }
  };

  // 1. Password login for Staff
  const handleStaffPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    const res = await loginStaff(staffIdentifier, staffPassword);
    setLoading(false);

    if (res.success) {
      setSuccessMessage('Staff authenticated successfully. Initializing workspace...');
      if (onLoginSuccess) onLoginSuccess();
    } else {
      setErrorMessage(res.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  // 2. Request OTP (Staff or Patient)
  const handleRequestOtp = async (userType: 'staff' | 'patient') => {
    const identifier = userType === 'staff' ? staffIdentifier : (uhid || phone);
    if (!identifier.trim()) {
      setErrorMessage(userType === 'staff' ? 'Please enter your Employee ID or Work Email.' : 'Please enter your UHID or registered phone.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    const res = await sendOTP(identifier, userType);
    setLoading(false);

    if (res.success) {
      setOtpRequested(true);
      setCooldown(res.cooldownSeconds || 30);
      setOtpGatewayMode((res.mode as any) || 'DEMO');
      setSuccessMessage(res.message || `OTP dispatched to registered contact for ${identifier}.`);
    } else {
      setErrorMessage(res.error || 'Failed to dispatch OTP.');
      if (res.cooldownSeconds && res.cooldownSeconds > 0) {
        setCooldown(res.cooldownSeconds);
      }
    }
  };

  // 3. Verify OTP Submit (Staff or Patient)
  const handleVerifyOtpSubmit = async (e: React.FormEvent, userType: 'staff' | 'patient') => {
    e.preventDefault();
    const identifier = userType === 'staff' ? staffIdentifier : (uhid || phone);

    if (!otpCode || otpCode.trim().length !== 6) {
      setErrorMessage('Please enter the complete 6-digit OTP code.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    const res = await verifyOTP(identifier, otpCode.trim(), userType);
    setLoading(false);

    if (res.success) {
      setSuccessMessage('OTP verified! Access granted to sovereign workspace...');
      if (onLoginSuccess) onLoginSuccess();
    } else {
      setErrorMessage(res.error || 'OTP verification failed. Please try again.');
    }
  };

  const quickStaffSelect = (email: string) => {
    setStaffIdentifier(email);
    setStaffPassword('Hospital#2025');
    setOtpRequested(false);
    setOtpCode('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const quickPatientSelect = (pid: string, ph: string) => {
    setUhid(pid);
    setPhone(ph);
    setOtpRequested(false);
    setOtpCode('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div className={`w-full ${isModal ? 'p-2' : 'min-h-[85vh] flex items-center justify-center p-4'}`}>
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header with Back Navigation & Railway HMIS reference styling */}
        <div className="bg-slate-900 text-white p-6 border-b border-slate-800">
          {/* Top Bar: Back Button, Brand, Language */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleBack}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer border border-slate-700"
                title="Back to Workspace / Previous Session"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Back to Workspace / Previous Session</span>
                <span className="sm:hidden">Back</span>
              </button>

              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-lg text-white shadow-md shadow-blue-500/30">
                LG
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                  {t('appName')}
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono font-medium border border-blue-400/30">
                    Sovereign Core
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t('railwayHmisNotice')}
                </p>
              </div>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center space-x-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-all ${
                  language === 'en' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-all ${
                  language === 'hi' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setLanguage('kn')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-all ${
                  language === 'kn' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                ಕನ್ನಡ
              </button>
            </div>
          </div>

          {/* Portal Switcher Tabs */}
          <div className="flex space-x-2 mt-6 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={() => { 
                setActivePortal('staff'); 
                setErrorMessage(''); 
                setSuccessMessage(''); 
                setOtpRequested(false);
                setOtpCode('');
              }}
              className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl font-medium text-sm transition-all ${
                activePortal === 'staff'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>{t('staffPortal')}</span>
            </button>
            <button
              type="button"
              onClick={() => { 
                setActivePortal('patient'); 
                setErrorMessage(''); 
                setSuccessMessage(''); 
                setOtpRequested(false);
                setOtpCode('');
              }}
              className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl font-medium text-sm transition-all ${
                activePortal === 'patient'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <User className="w-4 h-4" />
              <span>{t('patientPortal')}</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {/* Status feedback banners */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
              <div>
                <p className="font-semibold">Authentication Notice</p>
                <p className="text-xs mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
              <div>
                <p className="font-semibold">Verification Update</p>
                <p className="text-xs mt-0.5">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Gateway Status Badge */}
          <div className="mb-5 flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <Radio className={`w-3.5 h-3.5 ${otpGatewayMode === 'DEMO' ? 'text-amber-600' : 'text-emerald-600'} animate-pulse`} />
              <span className="font-semibold text-slate-700">
                {otpGatewayMode === 'DEMO' ? 'DEMO SIMULATION GATEWAY' : 'REAL HOSPITAL SMS/EMAIL GATEWAY'}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              {otpGatewayMode === 'DEMO' ? 'Simulated SMS Engine Active' : 'Live Telecom SMPP Bind'}
            </span>
          </div>

          {activePortal === 'staff' ? (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Hospital Staff Authorization</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Multi-role access for Admin, Lab Director, Pathologist, Technician, Finance, and Pharmacist.
                  </p>
                </div>

                {/* Staff Auth Mode Selector: Password vs OTP */}
                <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200 self-start sm:self-auto text-xs">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('password'); setErrorMessage(''); }}
                    className={`px-3 py-1 font-semibold rounded-md transition-all ${
                      authMode === 'password' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Password
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('otp'); setErrorMessage(''); }}
                    className={`px-3 py-1 font-semibold rounded-md transition-all ${
                      authMode === 'otp' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    OTP Verification
                  </button>
                </div>
              </div>

              {authMode === 'password' ? (
                <form onSubmit={handleStaffPasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Work Email / Employee ID
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={staffIdentifier}
                        onChange={(e) => setStaffIdentifier(e.target.value)}
                        required
                        placeholder="e.g. aris.thorne@novacare.org or EMP-1002"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pl-10"
                      />
                      <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Hospital Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={staffPassword}
                        onChange={(e) => setStaffPassword(e.target.value)}
                        required
                        placeholder="••••••••••••"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pl-10 font-mono"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <span>Verifying Credentials...</span>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Sign In to Clinical Workspace</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Registered Work Email / Employee ID
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={staffIdentifier}
                          onChange={(e) => setStaffIdentifier(e.target.value)}
                          required
                          placeholder="e.g. aris.thorne@novacare.org or EMP-1002"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pl-10"
                        />
                        <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      </div>
                      <button
                        type="button"
                        disabled={loading || cooldown > 0}
                        onClick={() => handleRequestOtp('staff')}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {cooldown > 0 ? (
                          <>
                            <Clock className="w-3.5 h-3.5 animate-spin" />
                            <span>Resend in {cooldown}s</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>{otpRequested ? 'Resend OTP' : 'Request OTP'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {otpRequested && (
                    <form onSubmit={(e) => handleVerifyOtpSubmit(e, 'staff')} className="space-y-4 pt-2">
                      <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-xs font-semibold text-blue-900">
                            Enter 6-Digit OTP Verification Code
                          </label>
                          <span className="text-[10px] text-blue-700 font-mono">
                            Expires in 5 minutes
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            maxLength={6}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                            required
                            placeholder="• • • • • •"
                            className="w-full px-4 py-3 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg tracking-widest font-mono text-center font-bold bg-white text-slate-900"
                          />
                          <KeyRound className="w-5 h-5 text-blue-600 absolute left-4 top-3.5" />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading || otpCode.length !== 6}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                      >
                        {loading ? (
                          <span>Verifying OTP...</span>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span>Verify & Sign In</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Quick Staff Demo Accounts (All 6 Supported Roles) */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Quick Role Selector (Demonstration)
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                    6 Staff Roles Supported
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => quickStaffSelect('aris.thorne@novacare.org')}
                    className="p-2.5 text-left rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer"
                  >
                    <p className="text-xs font-bold text-slate-800">Dr. Aris Thorne</p>
                    <p className="text-[11px] text-blue-600 font-medium">Lab Director</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => quickStaffSelect('vikram.admin@novacare.org')}
                    className="p-2.5 text-left rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer"
                  >
                    <p className="text-xs font-bold text-slate-800">Dr. V. Malhotra</p>
                    <p className="text-[11px] text-indigo-600 font-medium">Chief Administrator</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => quickStaffSelect('sunita.path@novacare.org')}
                    className="p-2.5 text-left rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer"
                  >
                    <p className="text-xs font-bold text-slate-800">Dr. Sunita Rao</p>
                    <p className="text-[11px] text-emerald-600 font-medium">Pathologist</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => quickStaffSelect('priya.tech@novacare.org')}
                    className="p-2.5 text-left rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer"
                  >
                    <p className="text-xs font-bold text-slate-800">Priya S.</p>
                    <p className="text-[11px] text-amber-600 font-medium">Senior Technician</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => quickStaffSelect('rajesh.finance@novacare.org')}
                    className="p-2.5 text-left rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer"
                  >
                    <p className="text-xs font-bold text-slate-800">Rajesh K.</p>
                    <p className="text-[11px] text-purple-600 font-medium">Finance Controller</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => quickStaffSelect('ananya.pharma@novacare.org')}
                    className="p-2.5 text-left rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer"
                  >
                    <p className="text-xs font-bold text-slate-800">Ananya D.</p>
                    <p className="text-[11px] text-teal-600 font-medium">Pharmacist</p>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900">Patient Self-Service Health Portal</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Access verified test reports, active prescriptions, booked OPD tokens, and pharmacy medicine deliveries.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Unique Health Identification (UHID) / Patient ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={uhid}
                      onChange={(e) => setUhid(e.target.value.toUpperCase())}
                      required
                      placeholder="e.g. PT-1001"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm pl-10 font-mono uppercase"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Registered Mobile Number
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="+91 98765 43210"
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                    <button
                      type="button"
                      disabled={loading || cooldown > 0}
                      onClick={() => handleRequestOtp('patient')}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {cooldown > 0 ? (
                        <>
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          <span>Resend in {cooldown}s</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>{otpRequested ? 'Resend OTP' : 'Send OTP'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {otpRequested && (
                  <form onSubmit={(e) => handleVerifyOtpSubmit(e, 'patient')} className="space-y-4 pt-2">
                    <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-semibold text-emerald-900">
                          Enter 6-Digit Verification Code
                        </label>
                        <span className="text-[10px] text-emerald-700 font-mono">
                          Expires in 5 minutes
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          maxLength={6}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                          required
                          placeholder="• • • • • •"
                          className="w-full px-4 py-3 rounded-xl border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-lg tracking-widest font-mono text-center font-bold bg-white text-slate-900"
                        />
                        <KeyRound className="w-5 h-5 text-emerald-600 absolute left-4 top-3.5" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || otpCode.length !== 6}
                      className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <span>Verifying Patient Record...</span>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Access My Health Portal</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Quick Patient Selectors */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Quick Patient Accounts (Registered in Hospital Database)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => quickPatientSelect('PT-1001', '+91 98765 43210')}
                    className="p-3 text-left rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-bold text-slate-900">Aarav Sharma (42, M)</p>
                      <span className="text-[10px] bg-slate-100 font-mono px-1.5 py-0.5 rounded">PT-1001</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Blood Group: A+ · Active Lipid & HbA1c orders
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => quickPatientSelect('PT-1002', '+91 98765 43211')}
                    className="p-3 text-left rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-bold text-slate-900">Priya Patel (29, F)</p>
                      <span className="text-[10px] bg-slate-100 font-mono px-1.5 py-0.5 rounded">PT-1002</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Blood Group: B+ · Thyroid & CBC verified
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Security Disclaimers */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2">
          <span>Sovereign Hospital Data Storage · Real-Time Audit Logged</span>
          <span className="font-mono">ABDM / Railway-HMIS Pattern Reference</span>
        </div>
      </div>
    </div>
  );
};
