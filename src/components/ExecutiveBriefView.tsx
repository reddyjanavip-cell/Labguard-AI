import React from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  TrendingUp, 
  Boxes, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck,
  Clock,
  Layers
} from 'lucide-react';
import { useLabData } from '../context/LabDataContext';

export const ExecutiveBriefView: React.FC = () => {
  const { kpis, risks, setActiveTab } = useLabData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            Strategic Operations Brief
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            AI Executive Brief
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated morning intelligence digest synthesized for NovaCare Laboratory Directors.
          </p>
        </div>

        <div className="text-right text-xs text-slate-500">
          <div>Generated: <span className="font-semibold text-slate-800">Today, 08:00 IST</span></div>
          <div className="text-teal-700 font-medium">Sovereign Decision Layer</div>
        </div>
      </div>

      {/* TOP DIRECTIVE HERO CARD */}
      <div className="rounded-xl border border-teal-200 bg-gradient-to-r from-teal-50 via-white to-cyan-50 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-teal-900 uppercase tracking-wider">
            Morning Strategic Priority Statement
          </span>
          <span className="rounded bg-teal-100 px-2 py-0.5 text-xs font-bold text-teal-800">
            High Confidence Directive
          </span>
        </div>

        <p className="text-base font-semibold text-slate-800 leading-relaxed">
          "NovaCare is operating at 94.2% daily clearance with ₹3,84,600 revenue realized. However, urgent inventory intervention is required on <strong>25-OH Vitamin D Reagent</strong> (4.1 days of stock remaining), and <strong>Biochemistry Analyzer BIO-03</strong> requires workload offloading prior to scheduled maintenance on September 26."
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => setActiveTab('recommendations')}
            className="px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>Execute Morning Action Items</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setActiveTab('what-if')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors"
          >
            Run Volume Surge Simulation
          </button>
        </div>
      </div>

      {/* 2-COLUMN SECTION: TOP 3 RISKS vs. TOP 3 OPPORTUNITIES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top 3 Risks */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span>Top 3 Operational Vulnerabilities</span>
            </h2>
            <span className="text-xs text-red-600 font-bold">Action Required</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-red-50/70 border border-red-200 space-y-1">
              <div className="flex justify-between font-bold text-red-900">
                <span>1. Vitamin D Stock Depletion Risk</span>
                <span className="text-red-700">Depletion in 4.1 days</span>
              </div>
              <p className="text-slate-700 leading-snug">
                18 kits remaining against 31 kits weekly burn rate. Lead time is 4 days. Test cancellations imminent without PO issuance.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 space-y-1">
              <div className="flex justify-between font-bold text-amber-900">
                <span>2. Biochemistry Analyzer Thermal Peak</span>
                <span className="text-amber-800">94% Utilization</span>
              </div>
              <p className="text-slate-700 leading-snug">
                Cobas 6000 has 38 pending tests and scheduled maintenance in 3 days. Rerouting to standby stations required.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex justify-between font-bold text-slate-800">
                <span>3. TaqPath PCR Reagent Expiration</span>
                <span className="text-slate-600">October 15, 2026</span>
              </div>
              <p className="text-slate-700 leading-snug">
                12 kits in stock with 4 kits weekly consumption. 4 kits (₹78,000) at risk of write-off without batch rotation.
              </p>
            </div>
          </div>
        </div>

        {/* Top 3 Opportunities */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-teal-600" />
              <span>Top 3 Strategic Opportunities</span>
            </h2>
            <span className="text-xs text-teal-700 font-bold">Optimization Potential</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-teal-50/60 border border-teal-200 space-y-1">
              <div className="flex justify-between font-bold text-teal-900">
                <span>1. Preventive Wellness Package Growth</span>
                <span className="text-teal-700">+18% Outpatient</span>
              </div>
              <p className="text-slate-700 leading-snug">
                Thyroid and Lipid bundles experienced 18% higher uptake this week, contributing ₹92,000 incremental margin.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex justify-between font-bold text-slate-800">
                <span>2. Automated Specimen Barcoding</span>
                <span className="text-slate-600">99.8% Accuracy</span>
              </div>
              <p className="text-slate-700 leading-snug">
                Phlebotomy barcode integration reduced pre-analytical labeling exceptions from 1.4% to 0.2%.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex justify-between font-bold text-slate-800">
                <span>3. Turnaround Time Consistency</span>
                <span className="text-teal-700">2h 18m Avg</span>
              </div>
              <p className="text-slate-700 leading-snug">
                Average TAT for routine chemistry remains 42 minutes ahead of clinical SLA expectations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DEPARTMENTAL OPERATIONAL BALANCE SHEET */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Operational Health Checklist
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <div className="text-[10px] text-slate-500 uppercase">Workload Clearance</div>
            <div className="text-lg font-bold text-teal-700 mt-1">94.2%</div>
            <span className="text-[10px] text-slate-400">1,176 of 1,248</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <div className="text-[10px] text-slate-500 uppercase">Pending Criticals</div>
            <div className="text-lg font-bold text-red-600 mt-1">1 STAT</div>
            <span className="text-[10px] text-slate-400">Troponin verified</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <div className="text-[10px] text-slate-500 uppercase">Inventory Health</div>
            <div className="text-lg font-bold text-amber-600 mt-1">1 Critical Item</div>
            <span className="text-[10px] text-slate-400">Vitamin D (18 left)</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <div className="text-[10px] text-slate-500 uppercase">Sovereign Compliance</div>
            <div className="text-lg font-bold text-teal-700 mt-1">100% Policy Pass</div>
            <span className="text-[10px] text-slate-400">0 data leaks</span>
          </div>
        </div>
      </div>
    </div>
  );
};
