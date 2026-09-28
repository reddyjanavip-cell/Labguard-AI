import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useLabData } from '../context/LabDataContext';
import { X, User, Mail, Phone, Globe, Shield, CheckCircle2, AlertCircle, Sparkles, Building2 } from 'lucide-react';

export const UserProfileModal: React.FC = () => {
  const { currentUser, profileModalOpen, closeProfileModal, updateProfile, previewRole, switchPreviewRole } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { refreshAllData } = useLabData();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [userLang, setUserLang] = useState<'en' | 'hi' | 'kn'>('en');

  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setPhotoUrl(currentUser.photoUrl || '');
      setUserLang(currentUser.language || 'en');
    }
  }, [currentUser]);

  if (!profileModalOpen || !currentUser) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    const res = await updateProfile({
      name,
      email,
      phone,
      photoUrl,
      language: userLang
    });

    setSaving(false);
    if (res.success) {
      setStatusMessage({ type: 'success', text: 'Profile updated successfully and logged in sovereign audit records.' });
      setLanguage(userLang);
      refreshAllData();
      setTimeout(() => {
        setStatusMessage(null);
      }, 3500);
    } else {
      setStatusMessage({ type: 'error', text: res.error || 'Failed to save profile changes.' });
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'administrator': return t('roleAdmin');
      case 'lab_manager': return t('roleLabManager');
      case 'pathologist': return t('rolePathologist');
      case 'technician': return t('roleTechnician');
      case 'finance': return t('roleFinance');
      case 'pharmacist': return t('rolePharmacist');
      case 'patient': return t('rolePatient');
      default: return role;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-lg text-white shadow-md">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                {currentUser.name}
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {currentUser.role.toUpperCase()}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {currentUser.department} · {currentUser.employeeId || currentUser.uhid || 'Verified User'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeProfileModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {statusMessage && (
            <div className={`mb-5 p-4 rounded-xl text-xs font-medium flex items-center space-x-3 ${
              statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm pl-9"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm pl-9"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
                <div className="relative">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm pl-9"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Interface Language</label>
                <div className="relative">
                  <select
                    value={userLang}
                    onChange={(e) => setUserLang(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm pl-9 bg-white"
                  >
                    <option value="en">English (Clinical UK/US Standard)</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="kn">ಕನ್ನಡ (Kannada)</option>
                  </select>
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Profile Avatar URL</label>
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 text-xs font-mono"
              />
            </div>

            {/* Readonly Roles & Permissions */}
            <div className="mt-6 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-blue-600" />
                  Assigned Security Role & Department
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  {currentUser.department}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-md font-bold text-xs">
                  {getRoleDisplayName(currentUser.role)}
                </span>
                {currentUser.permissions?.map((perm) => (
                  <span key={perm} className="px-2 py-0.5 bg-slate-200/80 text-slate-700 rounded text-[10px] font-mono">
                    {perm}
                  </span>
                ))}
              </div>
            </div>

            {/* Admin Role Preview Tool */}
            {currentUser.role === 'administrator' && (
              <div className="mt-4 p-3 bg-indigo-50/70 rounded-xl border border-indigo-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Administrator View Preview (Utility)
                  </span>
                  {previewRole && (
                    <button
                      type="button"
                      onClick={() => switchPreviewRole(null)}
                      className="text-[10px] text-red-600 font-semibold hover:underline"
                    >
                      Reset to Chief Administrator
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-indigo-800 mb-2">
                  Simulate other hospital staff perspectives without altering your persistent session:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(['lab_manager', 'pathologist', 'technician', 'finance', 'pharmacist', 'patient'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => switchPreviewRole(r)}
                      className={`px-2 py-1 text-[11px] rounded-lg font-medium border transition-all ${
                        previewRole === r
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white text-indigo-900 border-indigo-200 hover:bg-indigo-100/60'
                      }`}
                    >
                      {r.replace('_', ' ').toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={closeProfileModal}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 disabled:opacity-50"
              >
                {saving ? 'Saving...' : t('saveChanges')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
