import React from 'react';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  FlaskConical,
  FileCheck2,
  Boxes,
  Cpu,
  UserCheck,
  Building2,
  Receipt,
  Sparkles,
  AlertOctagon,
  Lightbulb,
  SlidersHorizontal,
  Bot,
  ShieldAlert,
  Binary,
  ScrollText,
  UploadCloud,
  FileLock2,
  Activity,
  ChevronRight,
  Network,
  Stethoscope,
  Pill,
  User
} from 'lucide-react';
import { useLabData } from '../context/LabDataContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: 'red' | 'amber' | 'teal' | 'slate' | 'emerald';
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, risks, inventory, equipment, prescriptions, appointments } = useLabData();
  const { effectiveRole } = useAuth();
  const { t } = useLanguage();

  // Computed badges
  const criticalRisksCount = risks.filter(r => r.level === 'critical').length;
  const lowInventoryCount = inventory.filter(i => i.status === 'Low Stock' || i.status === 'Critical').length;
  const maintenanceDueCount = equipment.filter(e => e.operationalStatus === 'Maintenance Due').length;
  const pendingRxCount = prescriptions.filter(p => p.prescriptionStatus === 'ACTIVE').length;
  const todayAptsCount = appointments.filter(a => a.status === 'CONFIRMED' || a.status === 'CHECKED-IN' || (a.status as any) === 'SCHEDULED' || (a.status as any) === 'CHECKED IN').length;

  // Role-filtered navigations
  const isPatient = effectiveRole === 'patient';
  const isPharmacist = effectiveRole === 'pharmacist';
  const isTech = effectiveRole === 'technician';
  const isPathologist = effectiveRole === 'pathologist';
  const isFinance = effectiveRole === 'finance';

  const coreNav: NavItem[] = isPatient ? [
    { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { id: 'patient-portal', label: t('patientPortal'), icon: User },
    { id: 'doctors', label: t('navDoctors'), icon: Stethoscope, badge: todayAptsCount, badgeColor: 'teal' },
    { id: 'pharmacy', label: t('navPharmacy'), icon: Pill },
  ] : [
    { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    ...(!isFinance && !isPharmacist ? [{ id: 'patients', label: t('navPatients'), icon: Users }] : []),
    ...(!isFinance && !isPharmacist ? [{ id: 'orders', label: t('navOrders'), icon: ClipboardList, badge: 72, badgeColor: 'amber' as const }] : []),
    ...(!isFinance && !isPharmacist ? [{ id: 'tests', label: t('navTests'), icon: FlaskConical }] : []),
    ...(!isFinance && !isPharmacist ? [{ id: 'results', label: t('navResults'), icon: FileCheck2 }] : []),
    ...(!isFinance ? [{ id: 'inventory', label: t('navInventory'), icon: Boxes, badge: lowInventoryCount, badgeColor: 'red' as const }] : []),
    ...(!isFinance && !isPharmacist ? [{ id: 'equipment', label: t('navEquipment'), icon: Cpu, badge: maintenanceDueCount, badgeColor: 'amber' as const }] : []),
    { id: 'doctors', label: t('navDoctors'), icon: Stethoscope, badge: todayAptsCount, badgeColor: 'teal' as const },
    { id: 'pharmacy', label: t('navPharmacy'), icon: Pill, badge: pendingRxCount, badgeColor: 'emerald' as const },
    ...(!isTech && !isPharmacist ? [{ id: 'staff', label: t('navStaff'), icon: UserCheck }] : []),
    ...(!isTech ? [{ id: 'suppliers', label: t('navSuppliers'), icon: Building2 }] : []),
    ...(!isTech && !isPathologist ? [{ id: 'billing', label: t('navBilling'), icon: Receipt }] : []),
  ];

  const aiNav: NavItem[] = isPatient ? [
    { id: 'copilot', label: t('navCopilot'), icon: Bot }
  ] : [
    ...(!isTech ? [{ id: 'executive-brief', label: t('navExecutiveBrief'), icon: Sparkles }] : []),
    { id: 'risk-center', label: t('navRiskCenter'), icon: AlertOctagon, badge: criticalRisksCount, badgeColor: 'red' as const },
    ...(!isTech ? [{ id: 'recommendations', label: t('navRecommendations'), icon: Lightbulb }] : []),
    ...(!isTech && !isPharmacist ? [{ id: 'what-if', label: t('navSimulator'), icon: SlidersHorizontal }] : []),
    { id: 'copilot', label: t('navCopilot'), icon: Bot },
  ];

  const sovereignNav: NavItem[] = isPatient ? [] : [
    ...(!isTech && !isPharmacist && !isFinance ? [{ id: 'integrations', label: t('navIntegrations'), icon: Network }] : []),
    ...(!isTech && !isPharmacist && !isFinance ? [{ id: 'control-center', label: t('navControlCenter'), icon: ShieldAlert }] : []),
    ...(!isTech && !isPharmacist && !isFinance ? [{ id: 'private-processing', label: t('navPrivateProcessing'), icon: Binary }] : []),
    { id: 'audit', label: t('navAudit'), icon: ScrollText },
  ];

  const governanceNav: NavItem[] = (isPatient || isTech || isPharmacist || isFinance) ? [] : [
    { id: 'upload', label: t('navUpload'), icon: UploadCloud },
    { id: 'governance', label: t('navGovernance'), icon: FileLock2 },
    { id: 'impact', label: t('navImpact'), icon: Activity },
  ];

  const renderNavGroup = (title: string, items: NavItem[]) => (
    <div className="mb-4">
      <div className="px-3 mb-1.5 text-[11px] font-bold tracking-wider text-slate-500 uppercase leading-snug">
        {title}
      </div>
      <div className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                isActive
                  ? 'bg-teal-700 text-white font-semibold shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-1">
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                <span className="truncate leading-normal">{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge !== 0 && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md tabular-nums shrink-0 ml-1.5 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : item.badgeColor === 'red'
                      ? 'bg-red-100 text-red-700'
                      : item.badgeColor === 'amber'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className="w-64 sm:w-68 lg:w-72 border-r border-slate-200 bg-white flex flex-col shrink-0 min-h-screen transition-all">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-200 flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-base shadow-xs shrink-0">
          LG
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-extrabold tracking-tight text-slate-900 truncate">
            LABGUARD AI
          </div>
          <div className="text-[10px] font-semibold text-teal-800 uppercase tracking-wider truncate">
            Sovereign Lab Intelligence
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 text-xs">
        {coreNav.length > 0 && renderNavGroup(isPatient ? t('groupHealthRecords') : t('groupLabOps'), coreNav)}
        {aiNav.length > 0 && renderNavGroup(t('groupAiIntel'), aiNav)}
        {sovereignNav.length > 0 && renderNavGroup(t('groupSovereignGov'), sovereignNav)}
        {governanceNav.length > 0 && renderNavGroup(t('groupDataImpact'), governanceNav)}
      </div>

      {/* Bottom Sovereign AI Status Box */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/80">
        <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-700">Governance Mode</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-700">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500"></span>
              Sovereign Layer
            </span>
          </div>
          <p className="mt-1 text-[10px] text-slate-600 leading-tight">
            Data access strictly restricted to NovaCare private premises.
          </p>
          <button
            onClick={() => setActiveTab('control-center')}
            className="mt-2 w-full flex items-center justify-center gap-1 py-1 text-[11px] font-semibold text-teal-800 hover:text-teal-900 bg-teal-50/80 hover:bg-teal-100/80 rounded transition-colors"
          >
            <span>Review Policy Audit</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </aside>
  );
};
