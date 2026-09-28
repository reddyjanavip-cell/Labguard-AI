import React, { useState, useEffect } from 'react';
import { 
  Binary, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Cpu, 
  Database,
  ScrollText,
  Activity
} from 'lucide-react';
import { useLabData } from '../context/LabDataContext';

export const PrivateProcessingView: React.FC = () => {
  const { setActiveTab } = useLabData();
  const [pipelineProgress, setPipelineProgress] = useState(100);

  const steps = [
    { title: 'Data Isolation & Ingestion', desc: 'Secure memory allocation inside NovaCare private runtime', status: 'Completed', icon: Database },
    { title: 'Sovereign Policy Enforcement', desc: 'External telemetry and unauthorized endpoints blocked', status: 'Completed', icon: Lock },
    { title: 'Schema & Range Validation', desc: 'All biological flags and ID consistency validated', status: 'Completed', icon: CheckCircle2 },
    { title: 'Operational Risk Synthesis', desc: 'Reagent burn rates and equipment loads calculated', status: 'Completed', icon: Cpu },
    { title: 'Explainability & Factor Tracing', desc: 'Reasoning links established to physical inventory counts', status: 'Completed', icon: Sparkles },
    { title: 'Audit Trail Persistence', desc: 'Session hash recorded into immutable laboratory audit log', status: 'Completed', icon: ScrollText },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full mb-1">
            <Binary className="h-3.5 w-3.5" />
            Sovereign Execution Engine
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Private Data Processing Pipeline
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent inspection of how data flows through NovaCare's sovereign laboratory boundary.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800">
            <span className="h-2 w-2 rounded-full bg-teal-600 animate-pulse"></span>
            Private Mode Active · Zero Data Egress
          </span>
        </div>
      </div>

      {/* Main Execution Pipeline Visualizer */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="text-sm font-bold text-slate-900">Pipeline Execution Status: Fully Verified</div>
            <div className="text-xs text-slate-500">All 6 sovereign governance gates passed with 0 security exceptions.</div>
          </div>
          <span className="text-xs font-bold text-teal-700 font-mono">Status: 100% COMPLETE</span>
        </div>

        {/* Steps List with Icons */}
        <div className="space-y-3">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-8 w-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shrink-0 shadow-2xs">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span>Gate 0{idx + 1}: {st.title}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-teal-100 text-teal-800">
                        VERIFIED
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{st.desc}</div>
                  </div>
                </div>

                <CheckCircle2 className="h-5 w-5 text-teal-600 shrink-0" />
              </div>
            );
          })}
        </div>

        {/* Pipeline Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Data Ownership</span>
            <div className="text-sm font-bold text-slate-900">NovaCare Diagnostics</div>
            <p className="text-[11px] text-slate-600">The laboratory holds full legal and operational control over datasets.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">External Sharing</span>
            <div className="text-sm font-bold text-teal-700">Restricted by Default</div>
            <p className="text-[11px] text-slate-600">Strict firewall rules prevent clinical telemetry transmission.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Audit Logging</span>
            <div className="text-sm font-bold text-slate-900">Immutable & Continuous</div>
            <p className="text-[11px] text-slate-600">Every validation and query is appended to local audit memory.</p>
          </div>
        </div>

        {/* Bottom CTA to review insights */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Pipeline outputs are available in the AI Risk Center and Decision Center.
          </div>
          <button
            onClick={() => setActiveTab('risk-center')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors"
          >
            <span>Proceed to AI Risk Center</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
