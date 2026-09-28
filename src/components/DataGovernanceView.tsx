import React from 'react';
import { FileLock2, ShieldCheck, CheckCircle2, Lock, Users, Database } from 'lucide-react';
import { useLabData } from '../context/LabDataContext';

export const DataGovernanceView: React.FC = () => {
  const { activeRole } = useLabData();

  const permissionsMatrix = [
    { role: 'Administrator', access: 'Full Sovereign Configuration & Role Assignment', read: true, write: true, delete: true, aiAudit: true },
    { role: 'Lab Manager', access: 'Workload Balancing, Inventory Reorder, Simulation', read: true, write: true, delete: false, aiAudit: true },
    { role: 'Senior Technician', access: 'Analyzer Processing, Sample Ingestion & Testing', read: true, write: true, delete: false, aiAudit: false },
    { role: 'Pathologist', access: 'Clinical Validation, Delta Check & Final Sign-Off', read: true, write: true, delete: false, aiAudit: true },
    { role: 'Finance / Cashier', access: 'Billing, Invoicing & Receivables Management', read: true, write: true, delete: false, aiAudit: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full mb-1">
            <FileLock2 className="h-3.5 w-3.5" />
            Sovereign Regulatory Framework
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Data Governance & Access Policies
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Role-Based Access Control (RBAC), data retention schedules, and privacy boundaries.
          </p>
        </div>

        <div className="text-xs text-slate-500">
          Current Context Role: <strong className="text-teal-700 font-bold">{activeRole}</strong>
        </div>
      </div>

      {/* Role-Based Access Control Matrix */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-teal-700" />
            <h2 className="text-sm font-bold text-slate-900">RBAC Permissions Matrix</h2>
          </div>
          <span className="text-xs text-slate-500">Partitioned by Sovereign Boundary</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-semibold text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-3.5 py-2.5">Role</th>
                <th className="px-3.5 py-2.5">Authorized Operational Scope</th>
                <th className="px-3.5 py-2.5 text-center">Read</th>
                <th className="px-3.5 py-2.5 text-center">Write</th>
                <th className="px-3.5 py-2.5 text-center">Delete</th>
                <th className="px-3.5 py-2.5 text-center">AI Audit Logs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionsMatrix.map((m) => (
                <tr key={m.role} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3.5 py-2.5 font-bold text-slate-900">{m.role}</td>
                  <td className="px-3.5 py-2.5 text-slate-600">{m.access}</td>
                  <td className="px-3.5 py-2.5 text-center">{m.read ? '✓' : '—'}</td>
                  <td className="px-3.5 py-2.5 text-center">{m.write ? '✓' : '—'}</td>
                  <td className="px-3.5 py-2.5 text-center">{m.delete ? '✓' : '—'}</td>
                  <td className="px-3.5 py-2.5 text-center">{m.aiAudit ? '✓' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Governance Standards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Database className="h-4 w-4 text-teal-700" />
            <span>Data Retention Policy</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Clinical test records archived for 5 years in local premises storage. Raw telemetry older than 180 days is compressed into audited cold storage.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Lock className="h-4 w-4 text-teal-700" />
            <span>Telemetry Masking</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            All patient names and identifiers are pseudonymized prior to internal heuristic modeling. Reagent lot numbers are internally hashed.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <ShieldCheck className="h-4 w-4 text-teal-700" />
            <span>Audit Continuity</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Every session generates an immutable hash chain. Security exceptions trigger immediate supervisor notifications.
          </p>
        </div>
      </div>
    </div>
  );
};
