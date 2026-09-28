import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Lock, 
  Key, 
  FileText, 
  ScrollText, 
  Eye, 
  CheckCircle2, 
  AlertCircle,
  Database,
  Layers,
  ArrowRight,
  Server
} from 'lucide-react';
import { useLabData } from '../context/LabDataContext';

export const ControlCenterView: React.FC = () => {
  const { auditLog, activeRole, setActiveTab } = useLabData();

  const policies = [
    { id: 'POL-01', title: 'Laboratory Data Ownership Policy', status: 'Enforced', desc: 'All diagnostic datasets, test orders, and calibrations remain the exclusive property of NovaCare Diagnostics.' },
    { id: 'POL-02', title: 'Restricted Data Sharing by Default', status: 'Enforced', desc: 'No patient identifiers or reagent volume telemetry can be queried or transmitted outside local premises.' },
    { id: 'POL-03', title: 'Role-Based Access Control (RBAC)', status: 'Active', desc: 'Permissions partitioned across Administrator, Lab Manager, Technician, Pathologist, and Finance.' },
    { id: 'POL-04', title: 'Explainable AI Decision Traceability', status: 'Active', desc: 'Every AI risk detection requires verifiable empirical evidence and historical burn rate factors.' },
    { id: 'POL-05', title: 'Immutable Local Audit Trail', status: 'Active', desc: 'Continuous append-only logging of user logins, CSV uploads, verifications, and recommendation actions.' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full mb-1">
            <ShieldAlert className="h-3.5 w-3.5" />
            Hackathon Sovereign Domain Differentiator
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Sovereign AI Control Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Governance dashboard enforcing laboratory data sovereignty, access policies, and explainability audit logs.
          </p>
        </div>

        {/* Prototype Sovereign Architecture Tag */}
        <div className="rounded-lg border border-teal-200 bg-teal-50/80 px-3 py-1.5 text-xs text-teal-900 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-teal-700" />
          <span>
            <strong>Prototype Sovereign AI Governance Layer</strong>
          </span>
        </div>
      </div>

      {/* SOVEREIGN ARCHITECTURE FLOW DIAGRAM */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Sovereign AI End-to-End Operating Topology
          </div>
          <span className="text-[11px] font-mono text-teal-700 font-semibold">
            Laboratory Premises Boundary
          </span>
        </div>

        {/* Visual Boxed Diagram */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-[760px] text-xs font-medium">
            <div className="p-3 rounded-lg bg-white border border-slate-300 text-center flex-1 shadow-2xs">
              <Database className="h-4 w-4 text-teal-700 mx-auto mb-1" />
              <div className="font-bold text-slate-900">Lab Data</div>
              <div className="text-[10px] text-slate-500">Orders & Inventory</div>
            </div>

            <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />

            <div className="p-3 rounded-lg bg-teal-50 border border-teal-300 text-center flex-1 shadow-2xs">
              <Lock className="h-4 w-4 text-teal-700 mx-auto mb-1" />
              <div className="font-bold text-teal-900">Private Layer</div>
              <div className="text-[10px] text-teal-700">Zero Egress</div>
            </div>

            <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />

            <div className="p-3 rounded-lg bg-white border border-slate-300 text-center flex-1 shadow-2xs">
              <Layers className="h-4 w-4 text-cyan-700 mx-auto mb-1" />
              <div className="font-bold text-slate-900">AI Analysis</div>
              <div className="text-[10px] text-slate-500">Burn Rate & Queues</div>
            </div>

            <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />

            <div className="p-3 rounded-lg bg-amber-50 border border-amber-300 text-center flex-1 shadow-2xs">
              <ShieldAlert className="h-4 w-4 text-amber-700 mx-auto mb-1" />
              <div className="font-bold text-amber-900">Risk Engine</div>
              <div className="text-[10px] text-amber-700">Lead Time Checks</div>
            </div>

            <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />

            <div className="p-3 rounded-lg bg-white border border-slate-300 text-center flex-1 shadow-2xs">
              <Eye className="h-4 w-4 text-indigo-700 mx-auto mb-1" />
              <div className="font-bold text-slate-900">Explainable AI</div>
              <div className="text-[10px] text-slate-500">Traceable Factors</div>
            </div>

            <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />

            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-center flex-1 shadow-2xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-700 mx-auto mb-1" />
              <div className="font-bold text-emerald-900">Decision</div>
              <div className="text-[10px] text-emerald-700">Manager Commits</div>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 italic">
          *Note: This architecture demonstrates a sovereign AI governance model ensuring laboratory data sovereignty while providing explainable decision support.
        </p>
      </div>

      {/* Policies Checklist & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Active Policies */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">Laboratory Sovereign Policies</h2>
            <span className="text-xs text-teal-700 font-semibold">5 / 5 Policies Enforced</span>
          </div>

          <div className="space-y-3">
            {policies.map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-lg border border-slate-200/90 bg-slate-50/60 text-left space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{p.title}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                    {p.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
                <div className="text-[10px] font-mono text-slate-400 pt-1">Rule ID: {p.id}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Audit Trail Snapshot */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ScrollText className="h-4 w-4 text-teal-600" />
              <h2 className="text-sm font-bold text-slate-900">Audit Trail Activity</h2>
            </div>
            <button
              onClick={() => setActiveTab('audit')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-0.5"
            >
              <span>View Full Log ({auditLog.length})</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {auditLog.slice(0, 6).map((log) => (
              <div
                key={log.auditId}
                className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 text-left text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{log.action}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{log.timestamp.substring(11)}</span>
                </div>
                <div className="text-slate-600 text-[11px] leading-snug">{log.details}</div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                  <span>User: {log.user} ({log.role})</span>
                  <span className="text-teal-700 font-semibold">{log.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
