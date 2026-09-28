import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert,
  Bell, 
  Search, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  X,
  ChevronDown,
  Activity,
  HeartPulse,
  Radio,
  Clock,
  Sparkles,
  Server,
  Key,
  Cpu,
  Network,
  LogOut,
  User as UserIcon,
  Globe,
  Users,
  FlaskConical,
  Boxes,
  Stethoscope,
  Pill,
  Receipt,
  Loader2,
  ArrowRight,
  Calendar,
  FileText,
  UserCheck
} from 'lucide-react';
import { useLabData } from '../context/LabDataContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserRole } from '../types';

interface SearchResultItem {
  category: 'Patients' | 'Test Orders' | 'Inventory' | 'Equipment' | 'Doctors' | 'Pharmacy Drugs' | 'Invoices' | 'Appointments' | 'Prescriptions' | 'Staff';
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  tab: string;
}

interface NavbarProps {
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const { 
    activeRole, 
    setActiveRole, 
    unreadAlertsCount, 
    notifications, 
    markNotificationRead,
    markAllNotificationsRead,
    setActiveTab,
    startDemoMode,
    demoModeActive,
    systemHealth,
    environmentStatus,
    lastSyncTimestamp,
    telemetryMode,
    setTelemetryMode,
    patients,
    orders,
    inventory,
    equipment,
    doctors,
    pharmacyMedicines,
    billing,
    appointments,
    prescriptions,
    staff
  } = useLabData();

  const { currentUser, effectiveRole, openProfileModal, logout, previewRole, switchRole, switchPreviewRole } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showHealthDropdown, setShowHealthDropdown] = useState(false);
  const [showEnvDropdown, setShowEnvDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Global Data-Driven Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcut '/' or 'Ctrl+K' to focus search, and 'Escape' to blur
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key === 'k')) && document.activeElement !== searchInputRef.current) {
        // Only if not currently typing in another input/textarea
        const tag = (document.activeElement?.tagName || '').toLowerCase();
        if (tag !== 'input' && tag !== 'textarea') {
          e.preventDefault();
          searchInputRef.current?.focus();
          setIsSearchFocused(true);
        }
      } else if (e.key === 'Escape' && isSearchFocused) {
        setIsSearchFocused(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchFocused]);

  // Debounce search state for active typing indicator
  useEffect(() => {
    if (searchQuery.trim().length >= 1) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 120);
      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
    }
  }, [searchQuery]);

  // Dismiss search overlay on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const roles: { id: UserRole; label: string; desc: string }[] = [
    { id: 'lab_manager', label: t('roleLabManager'), desc: 'Operations, inventory & risk intelligence' },
    { id: 'administrator', label: t('roleAdmin'), desc: 'Full sovereign governance & system access' },
    { id: 'technician', label: t('roleTechnician'), desc: 'Laboratory benches & test execution' },
    { id: 'pathologist', label: t('rolePathologist'), desc: 'Diagnostic verification & clinical review' },
    { id: 'finance', label: t('roleFinance'), desc: 'Billing, revenue & supplier ledger' },
    { id: 'pharmacist', label: t('rolePharmacist'), desc: 'Drug dispensing & formulary control' },
    { id: 'patient', label: t('rolePatient'), desc: 'Personal health record & OPD self-service' }
  ];

  const currentRoleObj = roles.find(r => r.id === effectiveRole) || roles[0];

  // Data-Driven Search Across Real Collections with RBAC filtering
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 2) return [];

    const list: SearchResultItem[] = [];
    const isPatientRole = effectiveRole === 'patient';
    const boundPatientId = (currentUser?.patientId || currentUser?.uhid || 'PT-1001').toLowerCase();

    // 1. Patients
    patients.forEach(p => {
      if (isPatientRole && p.patientId.toLowerCase() !== boundPatientId) return;
      if (
        p.name.toLowerCase().includes(q) ||
        p.patientId.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.bloodGroup.toLowerCase().includes(q) ||
        p.referringDoctor.toLowerCase().includes(q)
      ) {
        list.push({
          category: 'Patients',
          id: p.patientId,
          title: p.name,
          subtitle: `UHID: ${p.patientId} · Blood: ${p.bloodGroup} · Doctor: ${p.referringDoctor}`,
          badge: p.status,
          tab: isPatientRole ? 'patient-portal' : 'patients'
        });
      }
    });

    // 2. Test Orders
    orders.forEach(o => {
      if (isPatientRole && o.patientId.toLowerCase() !== boundPatientId) return;
      if (
        o.orderId.toLowerCase().includes(q) ||
        o.patientName.toLowerCase().includes(q) ||
        o.testName.toLowerCase().includes(q) ||
        o.department.toLowerCase().includes(q) ||
        o.sampleType.toLowerCase().includes(q) ||
        o.priority.toLowerCase().includes(q)
      ) {
        list.push({
          category: 'Test Orders',
          id: o.orderId,
          title: `${o.orderId}: ${o.testName}`,
          subtitle: `Patient: ${o.patientName} (${o.patientId}) · ${o.department}`,
          badge: o.status,
          tab: isPatientRole ? 'patient-portal' : 'orders'
        });
      }
    });

    // 3. Inventory (Restricted for patient)
    if (!isPatientRole) {
      inventory.forEach(i => {
        if (
          i.itemName.toLowerCase().includes(q) ||
          i.itemId.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          i.batchNumber.toLowerCase().includes(q) ||
          i.supplier.toLowerCase().includes(q)
        ) {
          list.push({
            category: 'Inventory',
            id: i.itemId,
            title: i.itemName,
            subtitle: `ID: ${i.itemId} · Batch: ${i.batchNumber} · Stock: ${i.quantity} ${i.unit}`,
            badge: i.status,
            tab: 'inventory'
          });
        }
      });
    }

    // 4. Equipment (Restricted for patient)
    if (!isPatientRole) {
      equipment.forEach(e => {
        if (
          e.name.toLowerCase().includes(q) ||
          e.equipmentId.toLowerCase().includes(q) ||
          e.manufacturer.toLowerCase().includes(q) ||
          e.model.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q)
        ) {
          list.push({
            category: 'Equipment',
            id: e.equipmentId,
            title: `${e.name} (${e.model})`,
            subtitle: `ID: ${e.equipmentId} · Dept: ${e.department} · Maker: ${e.manufacturer}`,
            badge: e.operationalStatus,
            tab: 'equipment'
          });
        }
      });
    }

    // 5. Doctors
    doctors.forEach(d => {
      const room = d.roomNumber || d.consultationRoom || '';
      if (
        d.name.toLowerCase().includes(q) ||
        d.doctorId.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q) ||
        d.department.toLowerCase().includes(q) ||
        room.toLowerCase().includes(q)
      ) {
        list.push({
          category: 'Doctors',
          id: d.doctorId,
          title: d.name,
          subtitle: `${d.specialization} · Dept: ${d.department} · Room: ${room || 'OPD'}`,
          badge: d.status,
          tab: 'doctors'
        });
      }
    });

    // 6. Pharmacy Drugs
    pharmacyMedicines.forEach(m => {
      const statusLabel = m.stockStatus || m.status;
      if (
        m.drugName.toLowerCase().includes(q) ||
        m.drugId.toLowerCase().includes(q) ||
        m.genericName.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.manufacturer.toLowerCase().includes(q)
      ) {
        list.push({
          category: 'Pharmacy Drugs',
          id: m.drugId,
          title: m.drugName,
          subtitle: `Generic: ${m.genericName} · Category: ${m.category} · Stock: ${m.quantity}`,
          badge: statusLabel,
          tab: 'pharmacy'
        });
      }
    });

    // 7. Invoices / Billing
    billing.forEach(b => {
      if (isPatientRole && b.patientId.toLowerCase() !== boundPatientId) return;
      if (
        b.invoiceId.toLowerCase().includes(q) ||
        b.patientName.toLowerCase().includes(q) ||
        b.patientId.toLowerCase().includes(q) ||
        b.paymentStatus.toLowerCase().includes(q) ||
        b.tests.toLowerCase().includes(q)
      ) {
        list.push({
          category: 'Invoices',
          id: b.invoiceId,
          title: `${b.invoiceId} - ₹${b.amount}`,
          subtitle: `Patient: ${b.patientName} (${b.patientId}) · ${b.tests}`,
          badge: b.paymentStatus,
          tab: isPatientRole ? 'patient-portal' : 'billing'
        });
      }
    });

    // 8. Appointments
    appointments.forEach(a => {
      if (isPatientRole && a.patientId.toLowerCase() !== boundPatientId) return;
      if (
        a.appointmentId.toLowerCase().includes(q) ||
        a.patientName.toLowerCase().includes(q) ||
        a.patientId.toLowerCase().includes(q) ||
        a.doctorName.toLowerCase().includes(q) ||
        a.department.toLowerCase().includes(q) ||
        (a.tokenNumber && a.tokenNumber.toLowerCase().includes(q)) ||
        (a.reason && a.reason.toLowerCase().includes(q))
      ) {
        list.push({
          category: 'Appointments',
          id: a.appointmentId,
          title: `Appointment ${a.tokenNumber || a.appointmentId}: ${a.patientName}`,
          subtitle: `With: ${a.doctorName} · Date: ${a.date} ${a.time} (${a.department})`,
          badge: a.status,
          tab: isPatientRole ? 'patient-portal' : 'doctors'
        });
      }
    });

    // 9. Prescriptions
    prescriptions.forEach(p => {
      if (isPatientRole && p.patientId.toLowerCase() !== boundPatientId) return;
      const medsStr = (p.medicines || []).map(m => m.drugName).join(' ').toLowerCase();
      const docName = p.doctorName || p.prescribingDoctor || '';
      if (
        p.prescriptionId.toLowerCase().includes(q) ||
        p.patientName.toLowerCase().includes(q) ||
        p.patientId.toLowerCase().includes(q) ||
        docName.toLowerCase().includes(q) ||
        (p.notes && p.notes.toLowerCase().includes(q)) ||
        medsStr.includes(q)
      ) {
        list.push({
          category: 'Prescriptions',
          id: p.prescriptionId,
          title: `Prescription ${p.prescriptionId} - ${p.patientName}`,
          subtitle: `Doctor: ${docName} · ${p.medicines?.length || 0} items (${p.prescriptionStatus})`,
          badge: p.prescriptionStatus,
          tab: isPatientRole ? 'patient-portal' : 'pharmacy'
        });
      }
    });

    // 10. Staff Directory (Authorized for Admin & Lab Manager only)
    if (!isPatientRole && (effectiveRole === 'administrator' || effectiveRole === 'lab_manager')) {
      staff.forEach(s => {
        if (
          s.name.toLowerCase().includes(q) ||
          s.staffId.toLowerCase().includes(q) ||
          s.role.toLowerCase().includes(q) ||
          s.department.toLowerCase().includes(q)
        ) {
          list.push({
            category: 'Staff',
            id: s.staffId,
            title: `${s.name} (${s.staffId})`,
            subtitle: `Role: ${s.role} · Department: ${s.department}`,
            badge: s.status,
            tab: 'staff'
          });
        }
      });
    }

    return list.slice(0, 16);
  }, [searchQuery, effectiveRole, currentUser, patients, orders, inventory, equipment, doctors, pharmacyMedicines, billing, appointments, prescriptions, staff]);

  const handleSelectResult = (item: SearchResultItem) => {
    setActiveTab(item.tab);
    setIsSearchFocused(false);
    setSearchQuery('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      handleSelectResult(searchResults[0]);
    }
  };

  const getEnvBadgeStyles = () => {
    switch (environmentStatus) {
      case 'LIVE DATA':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-emerald-400';
      case 'DEMO SIMULATION':
        return 'bg-amber-50 text-amber-800 border-amber-300 ring-amber-400';
      case 'OFFLINE':
        return 'bg-rose-50 text-rose-800 border-rose-300 ring-rose-400';
      default:
        return 'bg-teal-50 text-teal-800 border-teal-300 ring-teal-400';
    }
  };

  const getCategoryIcon = (category: SearchResultItem['category']) => {
    switch (category) {
      case 'Patients':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'Test Orders':
        return <FlaskConical className="w-4 h-4 text-purple-600" />;
      case 'Inventory':
        return <Boxes className="w-4 h-4 text-amber-600" />;
      case 'Equipment':
        return <Cpu className="w-4 h-4 text-slate-600" />;
      case 'Doctors':
        return <Stethoscope className="w-4 h-4 text-emerald-600" />;
      case 'Pharmacy Drugs':
        return <Pill className="w-4 h-4 text-teal-600" />;
      case 'Invoices':
        return <Receipt className="w-4 h-4 text-emerald-700" />;
      case 'Appointments':
        return <Calendar className="w-4 h-4 text-indigo-600" />;
      case 'Prescriptions':
        return <FileText className="w-4 h-4 text-violet-600" />;
      case 'Staff':
        return <UserCheck className="w-4 h-4 text-cyan-600" />;
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6">
      {/* Zone 1: Brand & Sovereign Identity */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-700 to-slate-900 text-white shadow-xs">
            <ShieldCheck className="h-5 w-5 text-teal-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-slate-900">
                LABGUARD <span className="text-teal-700 font-black">AI</span>
              </span>
              
              {/* Environment Indicator Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowEnvDropdown(!showEnvDropdown)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wider transition-all uppercase cursor-pointer hover:shadow-xs ${getEnvBadgeStyles()}`}
                  title="Click to toggle between Demo Simulation and Live Laboratory Telemetry"
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    environmentStatus === 'LIVE DATA' ? 'bg-emerald-600 animate-ping' :
                    environmentStatus === 'DEMO SIMULATION' ? 'bg-amber-600 animate-pulse' :
                    'bg-rose-600'
                  }`}></span>
                  <span>{environmentStatus}</span>
                  <ChevronDown className="h-2.5 w-2.5 opacity-60" />
                </button>

                {showEnvDropdown && (
                  <div className="absolute left-0 mt-1.5 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg z-50 text-xs">
                    <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                      Telemetry Stream
                    </div>
                    <button
                      onClick={() => {
                        setTelemetryMode('DEMO');
                        setShowEnvDropdown(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg transition-colors flex items-center justify-between ${
                        telemetryMode === 'DEMO' ? 'bg-amber-50 text-amber-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <div>Demo Simulation</div>
                        <div className="text-[10px] text-slate-500 font-normal">Controlled hospital scenario benchmarks</div>
                      </div>
                      {telemetryMode === 'DEMO' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
                    </button>
                    <button
                      onClick={() => {
                        setTelemetryMode('LIVE');
                        setShowEnvDropdown(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg transition-colors flex items-center justify-between mt-1 ${
                        telemetryMode === 'LIVE' ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <div>Live Data</div>
                        <div className="text-[10px] text-slate-500 font-normal">Genuine incoming instrument streams</div>
                      </div>
                      {telemetryMode === 'LIVE' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                    <div className="mt-2 pt-2 border-t border-slate-100 px-2 text-[10px] text-slate-400 flex items-center justify-between">
                      <span>Last sync:</span>
                      <span className="font-mono">{lastSyncTimestamp}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="hidden lg:flex text-[11px] text-slate-500 items-center gap-1.5">
              <span>NovaCare Diagnostics</span>
              <span className="text-slate-300">·</span>
              <span className="text-teal-700 font-medium">Private Processing Mode</span>
            </div>
          </div>
        </div>
      </div>

      {/* Zone 2: Global Data-Driven Search Overlay (Full-width, zero-clipping, responsive) */}
      <div ref={searchContainerRef} className="flex flex-1 max-w-xl mx-2 sm:mx-4 relative min-w-[180px] sm:min-w-[260px] z-40">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchFocused(true);
            }}
            placeholder={t('searchPlaceholder') || "Search patients, orders, inventory, equipment, pharmacy, doctors..."}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/90 py-1.5 pl-9 pr-14 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 shadow-xs transition-all"
          />

          <div className="absolute right-2 top-2 flex items-center gap-1.5">
            {isSearching ? (
              <div className="w-3.5 h-3.5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
            ) : searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  searchInputRef.current?.focus();
                }}
                className="text-slate-400 hover:text-slate-600 p-0.5"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 rounded border border-slate-200 shadow-2xs">
                /
              </kbd>
            )}
          </div>
        </form>

        {/* Dynamic Search Results Dropdown Overlay */}
        {isSearchFocused && (
          <div className="absolute left-0 w-[92vw] sm:w-[500px] md:w-[580px] max-w-[95vw] top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 max-h-[75vh] overflow-y-auto divide-y divide-slate-100 animate-fadeIn text-xs">
            {/* Search State 1: Idle (Query is short) */}
            {searchQuery.trim().length < 2 && (
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold uppercase tracking-wider">Universal Clinical Search</span>
                  <span>Press <kbd className="px-1 py-0.5 bg-slate-100 rounded text-slate-600 border">Esc</kbd> to close</span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Type at least 2 characters to search across <strong>Patients</strong>, <strong>Test Orders</strong>, <strong>Analyzers</strong>, <strong>Reagents</strong>, <strong>Pharmacy Drugs</strong>, <strong>Doctors</strong>, <strong>Invoices</strong>, and <strong>Appointments</strong>.
                </p>
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Quick Suggestions
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Vitamin D', 'CBC', 'Sysmex', 'Paracetamol', 'PT-1001', 'Biochemistry'].map(chip => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => {
                          setSearchQuery(chip);
                          setIsSearchFocused(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 text-[11px] font-medium transition-colors border border-slate-200"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Search State 2 & 3: Results or No Results (Query >= 2 chars) */}
            {searchQuery.trim().length >= 2 && (
              <>
                <div className="p-2.5 bg-slate-50/90 flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-100">
                  <span className="font-semibold uppercase tracking-wider text-slate-700">
                    Matches ({searchResults.length}) for "{searchQuery}"
                  </span>
                  <span className="text-[10px] text-slate-400">Click or press Enter to navigate</span>
                </div>

                {/* Unauthorized Warning for Patient Role */}
                {effectiveRole === 'patient' && ['inventory', 'reagent', 'analyzer', 'equipment', 'staff', 'salary'].some(term => searchQuery.toLowerCase().includes(term)) && (
                  <div className="p-3 bg-amber-50 border-b border-amber-200 text-amber-800 text-[11px] flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Laboratory backend inventory and staff directories are restricted under patient RBAC credentials.</span>
                  </div>
                )}

                {searchResults.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 space-y-2">
                    <Search className="w-7 h-7 mx-auto text-slate-300" />
                    <p className="font-semibold text-slate-700 text-xs">No records found matching "{searchQuery}"</p>
                    <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed">
                      No matching records across patients, orders, reagents, analyzers, pharmacy items, or consultations. Check the spelling or try searching by ID.
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                      >
                        Clear Search
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-1.5 space-y-1">
                    {searchResults.map((item) => (
                      <div
                        key={`${item.category}-${item.id}`}
                        onClick={() => handleSelectResult(item)}
                        className="p-2.5 rounded-xl hover:bg-teal-50/90 cursor-pointer transition-all flex items-center justify-between group border border-transparent hover:border-teal-200"
                      >
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-teal-100 text-slate-600 group-hover:text-teal-800 transition-colors shrink-0">
                            {getCategoryIcon(item.category)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-slate-900 group-hover:text-teal-950 truncate text-xs">
                                {item.title}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 font-mono font-semibold shrink-0">
                                {item.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-3 shrink-0">
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">
                            {item.badge}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Zone 3: Actions, Health, RBAC & Profile */}
      <div className="flex items-center gap-3">
        {/* System Health Indicator & Popover */}
        <div className="relative">
          <button
            onClick={() => setShowHealthDropdown(!showHealthDropdown)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              systemHealth.overall === 'HEALTHY'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
            title="System Health & Infrastructure Monitor"
          >
            <HeartPulse className={`h-3.5 w-3.5 ${systemHealth.overall === 'HEALTHY' ? 'text-emerald-600' : 'text-amber-600'}`} />
            <span className="hidden sm:inline">{t('healthStatus')}:</span>
            <span>{systemHealth.overall}</span>
          </button>

          {showHealthDropdown && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-xl z-50 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-teal-600" />
                  <span className="font-bold text-slate-900">Laboratory System Health</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {systemHealth.overall}
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Server className="w-3.5 h-3.5 text-slate-500" />
                    <div>
                      <div className="font-semibold text-slate-800">Persistent Database</div>
                      <div className="text-[10px] text-slate-500">{systemHealth.components.database.provider}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {systemHealth.components.database.status}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Key className="w-3.5 h-3.5 text-slate-500" />
                    <div>
                      <div className="font-semibold text-slate-800">Authentication & RBAC</div>
                      <div className="text-[10px] text-slate-500">{systemHealth.components.authentication.provider}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {systemHealth.components.authentication.status}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-slate-500" />
                    <div>
                      <div className="font-semibold text-slate-800">AI Service (Gemini API)</div>
                      <div className="text-[10px] text-slate-500">{systemHealth.components.aiService.provider}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {systemHealth.components.aiService.status}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Network className="w-3.5 h-3.5 text-slate-500" />
                    <div>
                      <div className="font-semibold text-slate-800">External Integrations</div>
                      <div className="text-[10px] text-slate-500">{systemHealth.components.externalIntegrations.activeSourcesCount} active feeds</div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    systemHealth.components.externalIntegrations.status === 'HEALTHY'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {systemHealth.components.externalIntegrations.status}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-slate-500" />
                    <div>
                      <div className="font-semibold text-slate-800">Real-Time Sync Stream</div>
                      <div className="text-[10px] text-slate-500">SSE Connection Active</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {systemHealth.components.realTimeSync.status}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Audited: Hash Chain Verified</span>
                <button
                  onClick={() => {
                    setActiveTab('integrations');
                    setShowHealthDropdown(false);
                  }}
                  className="text-teal-700 font-semibold hover:underline"
                >
                  Manage Feeds →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Hackathon Demo Mode Launcher Button */}
        <button
          onClick={startDemoMode}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all shadow-xs ${
            demoModeActive
              ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 animate-pulse'
              : 'bg-gradient-to-r from-teal-700 to-cyan-700 text-white hover:from-teal-800 hover:to-cyan-800'
          }`}
          title="Launch 3-minute guided hackathon demo scenario"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          <span>🎯 {t('demoMode')}</span>
        </button>

        {/* Real-time Language Selector Dropdown (No refresh required) */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-2 py-0.5 rounded font-semibold transition-all text-[11px] cursor-pointer ${
              language === 'en' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage('hi')}
            className={`px-2 py-0.5 rounded font-semibold transition-all text-[11px] cursor-pointer ${
              language === 'hi' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            हिन्दी
          </button>
          <button
            type="button"
            onClick={() => setLanguage('kn')}
            className={`px-2 py-0.5 rounded font-semibold transition-all text-[11px] cursor-pointer ${
              language === 'kn' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            ಕನ್ನಡ
          </button>
        </div>

        {/* Role-Based Access Control Selector / Instant Single Source of Truth */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
              previewRole
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="text-slate-500">{t('roleLabel')}:</span>
            <span className="font-semibold text-slate-900">{currentRoleObj.label}</span>
            {previewRole && (
              <span className="text-[9px] bg-amber-200 text-amber-900 px-1 py-0.2 rounded font-mono">
                PREVIEW
              </span>
            )}
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-1.5 w-64 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg z-50">
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex justify-between items-center">
                <span>Active Role Preview</span>
                {previewRole && (
                  <button
                    onClick={() => {
                      switchPreviewRole(null);
                      setShowRoleDropdown(false);
                    }}
                    className="text-[10px] text-red-600 font-bold hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>
              {roles.map(r => (
                <button
                  key={r.id}
                  onClick={() => {
                    switchRole(r.id);
                    setActiveRole(r.id);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex flex-col ${
                    effectiveRole === r.id ? 'bg-teal-50 text-teal-900' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="font-medium">{r.label}</span>
                  <span className="text-[11px] text-slate-500">{r.desc}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Center */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white tabular-nums animate-pulse">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-xl z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900">{t('alerts')}</span>
                  <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-semibold text-slate-600">
                    {notifications.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => markAllNotificationsRead()}
                    className="text-[11px] font-semibold text-teal-700 hover:underline"
                  >
                    Mark all read
                  </button>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationRead(n.id);
                      if (n.linkTab) setActiveTab(n.linkTab);
                      setShowNotifications(false);
                    }}
                    className={`p-2 rounded-lg cursor-pointer transition-colors border text-left ${
                      n.read ? 'bg-slate-50/60 border-slate-100 text-slate-600' : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={`font-semibold ${
                        n.type === 'critical' ? 'text-red-600' : n.type === 'warning' ? 'text-amber-600' : 'text-blue-600'
                      }`}>
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-400">{n.timestamp.substring(11, 16)}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Trigger & Menu */}
        <div className="relative pl-2 border-l border-slate-200">
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors text-left"
          >
            {currentUser?.photoUrl ? (
              <img
                src={currentUser.photoUrl}
                alt={currentUser?.name || 'User'}
                className="h-8 w-8 rounded-full object-cover border border-slate-300"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-slate-900">
                {currentUser?.name || 'Authorized User'}
              </div>
              <div className="text-[10px] text-slate-500">
                {currentUser?.department || 'NovaCare Diagnostics'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="font-bold text-slate-900">{currentUser?.name}</p>
                <p className="text-[10px] text-slate-500">{currentUser?.email || currentUser?.phone}</p>
                <span className="mt-1 inline-block px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-mono">
                  {currentUser?.role?.toUpperCase()}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  openProfileModal();
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 font-medium flex items-center space-x-2 transition-colors"
              >
                <UserIcon className="w-4 h-4 text-blue-600" />
                <span>{t('profileBtn')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 font-medium flex items-center space-x-2 transition-colors mt-1"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>{t('logoutBtn')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
