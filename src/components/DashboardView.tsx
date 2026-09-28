import React from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  ArrowUpRight, 
  Clock, 
  Activity, 
  Boxes, 
  CheckCircle2, 
  DollarSign, 
  Cpu, 
  ArrowRight,
  TrendingUp,
  Layers,
  ShieldCheck,
  Terminal,
  Pill,
  Stethoscope,
  ClipboardList
} from 'lucide-react';
import { useLabData } from '../context/LabDataContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { PatientPortalView } from './PatientPortalView';

export const DashboardView: React.FC = () => {
  const { kpis, setActiveTab, risks, openInspectTrace, pharmacyMedicines, prescriptions, appointments } = useLabData();
  const { currentUser, effectiveRole } = useAuth();
  const { t } = useLanguage();

  if (effectiveRole === 'patient') {
    return <PatientPortalView />;
  }

  // Test volume data (last 14 days representative)
  const volumeData = [1050, 1120, 1090, 1180, 1210, 1140, 1260, 1220, 1190, 1240, 1280, 1210, 1235, 1248];
  const maxVol = Math.max(...volumeData);
  const minVol = 950;

  // Department breakdown
  const departments = [
    { name: 'Biochemistry', count: 480, share: 38.5, color: 'bg-teal-600', textColor: 'text-teal-700' },
    { name: 'Hematology', count: 350, share: 28.0, color: 'bg-cyan-600', textColor: 'text-cyan-700' },
    { name: 'Immunology', count: 210, share: 16.8, color: 'bg-sky-600', textColor: 'text-sky-700' },
    { name: 'Microbiology', count: 98, share: 7.9, color: 'bg-indigo-600', textColor: 'text-indigo-700' },
    { name: 'Pathology', count: 70, share: 5.6, color: 'bg-slate-600', textColor: 'text-slate-700' },
    { name: 'Molecular', count: 40, share: 3.2, color: 'bg-amber-600', textColor: 'text-amber-700' },
  ];

  // Turnaround time distribution
  const tatBuckets = [
    { label: '< 1 hour', count: 320, pct: 25.6 },
    { label: '1 - 2 hours', count: 580, pct: 46.5 },
    { label: '2 - 3 hours', count: 210, pct: 16.8 },
    { label: '3 - 4 hours', count: 85, pct: 6.8 },
    { label: '> 4 hours', count: 53, pct: 4.3 },
  ];

  const getRoleGreeting = () => {
    switch (effectiveRole) {
      case 'administrator':
        return `Chief Administrator Workspace · ${currentUser?.name || 'Dr. Vikram Malhotra'}`;
      case 'pathologist':
        return `Pathology & Clinical Review Console · ${currentUser?.name || 'Dr. Sunita Rao'}`;
      case 'technician':
        return `Laboratory Instrument Benches · ${currentUser?.name || 'Priya Swaminathan'}`;
      case 'finance':
        return `Financial Revenue & Supplier Ledger · ${currentUser?.name || 'Rajesh Kulkarni'}`;
      case 'pharmacist':
        return `Hospital Pharmacy & Formulary Command · ${currentUser?.name || 'Ananya Deshmukh'}`;
      default:
        return `Laboratory Operations Director · ${currentUser?.name || 'Dr. Aris Thorne'}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Greeting & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-600 animate-pulse"></span>
            Operational Intelligence Engine Active · Sovereign Health Storage
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {getRoleGreeting()}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Personalized clinical workflows, pending instrument loads, OPD duty roster, and proactive risk detection.
          </p>
        </div>

        {/* Sovereign Architecture Trace Motif */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openInspectTrace('RSK-01')}
            className="flex items-center gap-1.5 text-[11px] font-mono text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-1.5 rounded-lg transition-all shadow-xs"
            title="Inspect 9-stage sovereign data lineage"
          >
            <Terminal className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-bold text-slate-900">Inspect Trace</span>
            <span className="text-slate-400">·</span>
            <span className="text-[10px] text-teal-700">RSK-01</span>
          </button>
        </div>
      </div>

      {/* AI EXECUTIVE BRIEF CARD */}
      <div className="rounded-xl border border-teal-200 bg-gradient-to-r from-teal-50/90 via-white to-cyan-50/90 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-900 tracking-wider uppercase">
                  🧠 {t('todayLabBrief')}
                </span>
                <span className="rounded bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800">
                  3 {t('priorityFlags')}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-800">
                Supervisor Directive: Review 25-OH Vitamin D reagent inventory first, followed by Biochemistry workload balancing.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1 text-xs">
                <div className="flex items-center gap-2 rounded-lg bg-white/80 border border-red-200/80 p-2 shadow-2xs">
                  <span className="h-2 w-2 rounded-full bg-red-600 shrink-0"></span>
                  <span className="text-slate-700 font-medium truncate">
                    <strong className="text-red-700">CRITICAL:</strong> Vitamin D reagent below reorder threshold (18 units)
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-white/80 border border-amber-200/80 p-2 shadow-2xs">
                  <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0"></span>
                  <span className="text-slate-700 font-medium truncate">
                    <strong className="text-amber-700">OPERATIONAL:</strong> Biochemistry has highest pending queue (38 tests)
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-white/80 border border-slate-200/80 p-2 shadow-2xs">
                  <span className="h-2 w-2 rounded-full bg-sky-500 shrink-0"></span>
                  <span className="text-slate-700 font-medium truncate">
                    <strong className="text-slate-700">MAINTENANCE:</strong> Analyzer BIO-03 scheduled in 3 days
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
            <button
              onClick={() => setActiveTab('risk-center')}
              className="px-3.5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>{t('reviewRisks')}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors"
            >
              {t('viewRecommendations')}
            </button>
          </div>
        </div>
      </div>

      {/* TOP 8 CORE LABORATORY KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500">{t('totalToday')}</div>
          <div className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">
            {kpis.totalTestsToday.toLocaleString()}
          </div>
          <div className="text-[10px] text-teal-600 font-medium mt-1 flex items-center gap-0.5">
            <TrendingUp className="h-3 w-3" />
            +4.2%
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500">{t('completed')}</div>
          <div className="text-xl font-bold text-teal-700 tabular-nums mt-0.5">
            {kpis.completedToday.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">94.2% clearance</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500">{t('pendingTests')}</div>
          <div className="text-xl font-bold text-amber-600 tabular-nums mt-0.5">
            {kpis.pendingToday}
          </div>
          <div className="text-[10px] text-amber-700 font-medium mt-1">38 Biochemistry</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500">{t('averageTat')}</div>
          <div className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">
            {kpis.averageTAT}
          </div>
          <div className="text-[10px] text-teal-600 mt-1">Standard (3h)</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500">{t('todayRevenue')}</div>
          <div className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">
            ₹{(kpis.dailyRevenue / 1000).toFixed(1)}k
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Reconciled</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500">{t('navInventory')}</div>
          <div className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">
            ₹{(kpis.inventoryValue / 1000).toFixed(0)}k
          </div>
          <div className="text-[10px] text-slate-500 mt-1">30 lines</div>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50/40 p-3 shadow-2xs">
          <div className="text-[11px] font-semibold text-red-700">{t('criticalRisks')}</div>
          <div className="text-xl font-bold text-red-600 tabular-nums mt-0.5">
            {risks.length}
          </div>
          <div className="text-[10px] text-red-600 font-medium mt-1">AI flags</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500">{t('navEquipment')}</div>
          <div className="text-xl font-bold text-teal-700 tabular-nums mt-0.5">
            {kpis.equipmentAvailability}%
          </div>
          <div className="text-[10px] text-amber-600 mt-1">Fleet active</div>
        </div>
      </div>

      {/* 6 HIGH-QUALITY PRODUCTION CHARTS (GRID 3x2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Chart 1: Test Volume Trend (Last 14 Days) */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs font-bold text-slate-900">Daily Test Volume Trend</div>
              <div className="text-[11px] text-slate-500">14-day rolling laboratory load</div>
            </div>
            <span className="text-xs font-bold text-teal-700 tabular-nums">1,248 Today</span>
          </div>

          <div className="h-36 w-full flex items-end gap-1.5 pt-4 px-1">
            {volumeData.map((val, i) => {
              const heightPct = Math.round(((val - minVol) / (maxVol - minVol)) * 80) + 15;
              const isToday = i === volumeData.length - 1;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-t-sm transition-all ${
                      isToday ? 'bg-teal-600' : 'bg-slate-200 group-hover:bg-teal-300'
                    }`}
                  />
                  <span className="text-[9px] text-slate-400 font-mono">
                    {i === 0 ? 'D-13' : isToday ? 'Today' : ''}
                  </span>
                  {/* Tooltip */}
                  <div className="absolute -top-7 hidden group-hover:block bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow z-10 whitespace-nowrap tabular-nums">
                    {val} tests
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Daily Revenue vs Target */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs font-bold text-slate-900">Diagnostic Revenue Realization</div>
              <div className="text-[11px] text-slate-500">Today: ₹3,84,600 (Target: ₹3,50,000)</div>
            </div>
            <span className="text-xs font-bold text-teal-700">+9.8%</span>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600">Daily Revenue Target Attainment</span>
                <span className="font-bold text-slate-900 tabular-nums">109.8%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500">Collected Cash & UPI</span>
                <div className="text-xs font-bold text-slate-900 tabular-nums">₹2,85,200 (74%)</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-500">Credit / TPA Insurance</span>
                <div className="text-xs font-bold text-slate-900 tabular-nums">₹99,400 (26%)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 3: Tests by Department */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-xs font-bold text-slate-900">Department Workload Distribution</div>
              <div className="text-[11px] text-slate-500">1,248 tests processed today</div>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            {departments.slice(0, 4).map((d) => (
              <div key={d.name} className="space-y-0.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-medium">{d.name}</span>
                  <span className="text-slate-500 tabular-nums">{d.count} tests ({d.share}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className={`${d.color} h-1.5 rounded-full`} style={{ width: `${d.share * 2}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Turnaround Time Distribution */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs font-bold text-slate-900">Turnaround Time (TAT) Profile</div>
              <div className="text-[11px] text-slate-500">Target standard: 90% completed &lt; 3h</div>
            </div>
            <span className="text-xs font-bold text-teal-700 tabular-nums">88.9% on-time</span>
          </div>

          <div className="space-y-2 pt-1">
            {tatBuckets.map((b) => (
              <div key={b.label} className="flex items-center gap-2 text-xs">
                <span className="w-20 text-[11px] text-slate-600 truncate">{b.label}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${
                      b.label.includes('>') ? 'bg-amber-500' : 'bg-teal-600'
                    }`}
                    style={{ width: `${b.pct * 1.8}%` }}
                  />
                </div>
                <span className="w-12 text-right text-[11px] font-mono text-slate-500 tabular-nums">
                  {b.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 5: Critical Inventory Burnout Projection */}
        <div className="rounded-xl border border-red-200 bg-red-50/20 p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-xs font-bold text-red-900 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-600 animate-ping"></span>
                <span>Inventory Depletion Forecast</span>
              </div>
              <div className="text-[11px] text-slate-600">25-OH Vitamin D Reagent (INV-101)</div>
            </div>
            <span className="text-xs font-bold text-red-700 tabular-nums">4.1 Days Left</span>
          </div>

          <div className="p-3 bg-white rounded-lg border border-red-200/80 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Current Stock</span>
              <span className="font-bold text-red-600 tabular-nums">18 units</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Reorder Level Threshold</span>
              <span className="font-bold text-slate-800 tabular-nums">20 units</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Weekly Consumption</span>
              <span className="font-bold text-slate-800 tabular-nums">31 units (~4.4/day)</span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-100 pt-1.5">
              <span className="text-slate-600">Supplier Lead Time</span>
              <span className="font-bold text-slate-800 tabular-nums">4 days (Abbott)</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('recommendations')}
            className="mt-3 w-full py-1.5 text-xs font-bold text-teal-800 bg-teal-100/80 hover:bg-teal-200/80 rounded-lg transition-colors flex items-center justify-center gap-1"
          >
            <span>Resolve via AI Action Center</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Chart 6: Critical Equipment Utilization */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-xs font-bold text-slate-900">Equipment Capacity Load</div>
              <div className="text-[11px] text-slate-500">Live analyzer thermal/throughput utilization</div>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800">Cobas 6000 (BIO-03)</span>
                <span className="font-bold text-red-600 tabular-nums">94% (Near Peak)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '94%' }} />
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Maintenance scheduled in 3 days</div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800">ARCHITECT i2000SR (IMM-02)</span>
                <span className="font-bold text-amber-600 tabular-nums">88%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '88%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800">Sysmex XN-1000 (HEM-01)</span>
                <span className="font-bold text-teal-700 tabular-nums">82%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-teal-600 h-2 rounded-full" style={{ width: '82%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
