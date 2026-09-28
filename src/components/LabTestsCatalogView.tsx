import React, { useState } from 'react';
import { FlaskConical, Search, Filter, Clock, Tag, ShieldCheck } from 'lucide-react';
import { useLabData } from '../context/LabDataContext';

export const LabTestsCatalogView: React.FC = () => {
  const { tests } = useLabData();
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  const filteredTests = tests.filter((t) => {
    const matchesSearch = 
      t.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.testId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.reagentRequirements.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.equipmentRequired.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = deptFilter === 'All' || t.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full mb-1">
            <FlaskConical className="h-3.5 w-3.5" />
            Standard Test Master Menu
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Laboratory Diagnostic Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            50 standardized clinical assays, reference intervals, instrument mapping, and reagent dependencies.
          </p>
        </div>

        <div className="text-xs text-slate-500">
          Total Validated Assays: <strong className="text-slate-900 font-bold tabular-nums">50 Tests</strong>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search test name, reagent, analyzer..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-700 focus:border-teal-500 focus:outline-none"
          >
            <option value="All">All Departments</option>
            <option value="Biochemistry">Biochemistry</option>
            <option value="Hematology">Hematology</option>
            <option value="Immunology">Immunology</option>
            <option value="Microbiology">Microbiology</option>
            <option value="Pathology">Pathology</option>
            <option value="Molecular Diagnostics">Molecular Diagnostics</option>
          </select>
        </div>
      </div>

      {/* Tests Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-semibold text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-3.5 py-2.5">Test Code</th>
                <th className="px-3.5 py-2.5">Test Name</th>
                <th className="px-3.5 py-2.5">Department</th>
                <th className="px-3.5 py-2.5">Specimen / Tube</th>
                <th className="px-3.5 py-2.5">Target TAT</th>
                <th className="px-3.5 py-2.5">Retail Price</th>
                <th className="px-3.5 py-2.5">Consumable Cost</th>
                <th className="px-3.5 py-2.5">Primary Instrument</th>
                <th className="px-3.5 py-2.5">Reagent Pack</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTests.map((t) => (
                <tr key={t.testId} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3.5 py-2 font-mono text-teal-700 font-semibold">{t.testId}</td>
                  <td className="px-3.5 py-2 font-bold text-slate-900">{t.testName}</td>
                  <td className="px-3.5 py-2 text-slate-600">{t.department}</td>
                  <td className="px-3.5 py-2 text-slate-500 text-[11px]">{t.container}</td>
                  <td className="px-3.5 py-2 font-mono text-slate-600 tabular-nums">{t.expectedTAT}</td>
                  <td className="px-3.5 py-2 font-bold text-slate-900 tabular-nums">₹{t.price}</td>
                  <td className="px-3.5 py-2 text-slate-500 tabular-nums">₹{t.cost}</td>
                  <td className="px-3.5 py-2 text-slate-700 font-medium">{t.equipmentRequired}</td>
                  <td className="px-3.5 py-2 text-slate-500 text-[11px] max-w-xs truncate" title={t.reagentRequirements}>
                    {t.reagentRequirements}
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
