import React, { useState } from 'react';
import { FileCheck2, Search, Filter, CheckCircle2, AlertTriangle, ShieldCheck, UserCheck } from 'lucide-react';
import { useLabData } from '../context/LabDataContext';

export const ResultsView: React.FC = () => {
  const { results, verifyResult } = useLabData();
  const [searchTerm, setSearchTerm] = useState('');
  const [flagFilter, setFlagFilter] = useState('All');

  const filteredResults = results.filter((r) => {
    const matchesSearch = 
      r.resultId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.testName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFlag = flagFilter === 'All' || r.flag === flagFilter;
    return matchesSearch && matchesFlag;
  });

  const getFlagBadge = (flag: string) => {
    switch (flag) {
      case 'Normal':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">Normal</span>;
      case 'High':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">High ↑</span>;
      case 'Low':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">Low ↓</span>;
      case 'Critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200 animate-pulse">Critical !!</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">{flag}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full mb-1">
            <FileCheck2 className="h-3.5 w-3.5" />
            Clinical Verification Gateway
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Results Management & Sign-Off
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pathologist sign-off queue with automated biological reference range checks and delta verification.
          </p>
        </div>

        {/* Disclaimer Notice */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-teal-600" />
          <span>Clinical diagnoses remain under the legal discretion of the authorized pathologist.</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patient, test, result ID..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <select
            value={flagFilter}
            onChange={(e) => setFlagFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-700 focus:border-teal-500 focus:outline-none"
          >
            <option value="All">All Flags</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
            <option value="Low">Low</option>
            <option value="Critical">Critical Alert</option>
          </select>
        </div>
      </div>

      {/* Results Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-semibold text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-3.5 py-2.5">Result ID</th>
                <th className="px-3.5 py-2.5">Patient</th>
                <th className="px-3.5 py-2.5">Test Parameter</th>
                <th className="px-3.5 py-2.5">Observed Value</th>
                <th className="px-3.5 py-2.5">Reference Range</th>
                <th className="px-3.5 py-2.5">Flag</th>
                <th className="px-3.5 py-2.5">Verified By</th>
                <th className="px-3.5 py-2.5">Status</th>
                <th className="px-3.5 py-2.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResults.map((r) => (
                <tr key={r.resultId} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3.5 py-2 font-mono text-teal-700 font-semibold">{r.resultId}</td>
                  <td className="px-3.5 py-2 font-bold text-slate-900">{r.patientName}</td>
                  <td className="px-3.5 py-2 text-slate-800 font-medium">{r.testName}</td>
                  <td className="px-3.5 py-2 font-mono font-bold text-slate-900 tabular-nums">
                    {r.resultValue} <span className="font-normal text-slate-500 text-[11px]">{r.unit}</span>
                  </td>
                  <td className="px-3.5 py-2 font-mono text-slate-500 tabular-nums">{r.referenceRange}</td>
                  <td className="px-3.5 py-2">{getFlagBadge(r.flag)}</td>
                  <td className="px-3.5 py-2 text-slate-600 font-medium">{r.verifier || 'Pending Sign-Off'}</td>
                  <td className="px-3.5 py-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      r.status === 'Verified' ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-3.5 py-2">
                    {r.status === 'Preliminary' ? (
                      <button
                        onClick={() => verifyResult(r.resultId, 'Dr. Aris Thorne, MD')}
                        className="px-2 py-1 text-[11px] font-bold text-white bg-teal-700 hover:bg-teal-800 rounded transition-colors"
                      >
                        Sign-Off
                      </button>
                    ) : (
                      <span className="text-[11px] text-teal-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Signed
                      </span>
                    )}
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
