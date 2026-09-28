import React, { useState } from 'react';
import { 
  ScrollText, 
  Search, 
  Download, 
  Filter, 
  CheckCircle2, 
  ShieldCheck, 
  Lock 
} from 'lucide-react';
import { useLabData } from '../context/LabDataContext';

export const AuditLogView: React.FC = () => {
  const { auditLog } = useLabData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('All');

  const filteredLogs = auditLog.filter((log) => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.dataset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.recordAffected.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = selectedAction === 'All' || log.action === selectedAction;
    return matchesSearch && matchesAction;
  });

  const handleExportCSV = () => {
    const headers = ['Audit ID', 'Timestamp', 'User', 'Role', 'Action', 'Dataset', 'Record Affected', 'Status', 'Details'];
    const rows = filteredLogs.map(l => [
      l.auditId,
      l.timestamp,
      `"${l.user}"`,
      `"${l.role}"`,
      `"${l.action}"`,
      `"${l.dataset}"`,
      `"${l.recordAffected}"`,
      l.status,
      `"${l.details.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `novacare_audit_trail_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const actionOptions = [
    'All',
    'Login',
    'Data Upload',
    'Data Validation',
    'AI Analysis',
    'Recommendation Generated',
    'Patient Record Access',
    'Result Verification',
    'Inventory Update',
    'Equipment Update',
    'Sovereign Policy Check'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full mb-1">
            <ScrollText className="h-3.5 w-3.5" />
            Immutable Laboratory Ledger
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Audit Trail & Sovereign Activity Log
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Every user query, CSV ingestion, AI risk detection, and result release is irrevocably logged with timestamps.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search action, user, or record affected..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-500 shrink-0">Filter Action:</span>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-700 focus:border-teal-500 focus:outline-none"
          >
            {actionOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          <span className="text-xs font-semibold text-slate-500 ml-2 whitespace-nowrap">
            Showing {filteredLogs.length} of {auditLog.length} events
          </span>
        </div>
      </div>

      {/* Main Audit Log Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-semibold text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-3.5 py-2.5">Audit ID</th>
                <th className="px-3.5 py-2.5">Timestamp</th>
                <th className="px-3.5 py-2.5">User</th>
                <th className="px-3.5 py-2.5">Role</th>
                <th className="px-3.5 py-2.5">Action</th>
                <th className="px-3.5 py-2.5">Dataset</th>
                <th className="px-3.5 py-2.5">Record / Entity</th>
                <th className="px-3.5 py-2.5">Status</th>
                <th className="px-3.5 py-2.5">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.auditId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-3.5 py-2 font-mono text-[11px] text-slate-500">{log.auditId}</td>
                  <td className="px-3.5 py-2 font-mono text-[11px] text-slate-600 whitespace-nowrap tabular-nums">{log.timestamp}</td>
                  <td className="px-3.5 py-2 font-semibold text-slate-900 whitespace-nowrap">{log.user}</td>
                  <td className="px-3.5 py-2 text-slate-600 whitespace-nowrap">{log.role}</td>
                  <td className="px-3.5 py-2 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded font-semibold text-[10px] bg-slate-100 text-slate-800">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-3.5 py-2 text-slate-600 whitespace-nowrap">{log.dataset}</td>
                  <td className="px-3.5 py-2 font-mono text-[11px] text-teal-700 whitespace-nowrap">{log.recordAffected}</td>
                  <td className="px-3.5 py-2 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700">
                      <CheckCircle2 className="h-3 w-3" />
                      {log.status}
                    </span>
                  </td>
                  <td className="px-3.5 py-2 text-slate-600 max-w-xs truncate" title={log.details}>
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
