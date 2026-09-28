import React, { useState } from 'react';
import { UserCheck, Search, Filter, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';
import { useLabData } from '../context/LabDataContext';

export const StaffView: React.FC = () => {
  const { staff } = useLabData();
  const [searchTerm, setSearchTerm] = useState('');
  const [shiftFilter, setShiftFilter] = useState('All');

  const filteredStaff = staff.filter((s) => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesShift = shiftFilter === 'All' || s.shift === shiftFilter;
    return matchesSearch && matchesShift;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full mb-1">
            <UserCheck className="h-3.5 w-3.5" />
            Duty Roster & Workload
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Laboratory Personnel & Staff Roster
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pathologists, biochemists, senior technicians, and phlebotomists actively on duty across shifts.
          </p>
        </div>

        <div className="text-xs text-slate-500">
          Active On-Bench Personnel: <strong className="text-slate-900 font-bold tabular-nums">{staff.length} Members</strong>
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
            placeholder="Search staff name, role, department..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <select
            value={shiftFilter}
            onChange={(e) => setShiftFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-700 focus:border-teal-500 focus:outline-none"
          >
            <option value="All">All Shifts</option>
            <option value="Morning">Morning Shift (07:00 - 15:30)</option>
            <option value="Evening">Evening Shift (15:00 - 23:00)</option>
            <option value="Night">Night Shift (22:30 - 07:30)</option>
            <option value="General">General Administrative</option>
          </select>
        </div>
      </div>

      {/* Staff Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-semibold text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-3.5 py-2.5">Staff ID</th>
                <th className="px-3.5 py-2.5">Name</th>
                <th className="px-3.5 py-2.5">Designation</th>
                <th className="px-3.5 py-2.5">Department</th>
                <th className="px-3.5 py-2.5">Assigned Shift</th>
                <th className="px-3.5 py-2.5">Active Workload</th>
                <th className="px-3.5 py-2.5">Qualifications</th>
                <th className="px-3.5 py-2.5">Assigned Station</th>
                <th className="px-3.5 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.map((s) => (
                <tr key={s.staffId} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3.5 py-2 font-mono text-teal-700 font-semibold">{s.staffId}</td>
                  <td className="px-3.5 py-2 font-bold text-slate-900">{s.name}</td>
                  <td className="px-3.5 py-2 text-slate-700">{s.role}</td>
                  <td className="px-3.5 py-2 text-slate-600">{s.department}</td>
                  <td className="px-3.5 py-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {s.shift}
                    </span>
                  </td>
                  <td className="px-3.5 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${s.workloadPercent > 85 ? 'bg-red-500' : 'bg-teal-600'}`}
                          style={{ width: `${s.workloadPercent}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px] text-slate-600 tabular-nums">{s.workloadPercent}%</span>
                    </div>
                  </td>
                  <td className="px-3.5 py-2 text-slate-500 text-[11px] max-w-xs truncate" title={s.qualification}>
                    {s.qualification}
                  </td>
                  <td className="px-3.5 py-2 text-slate-600 text-[11px] font-medium">{s.assignedEquipment}</td>
                  <td className="px-3.5 py-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      s.status === 'On Duty' ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {s.status}
                    </span>
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
