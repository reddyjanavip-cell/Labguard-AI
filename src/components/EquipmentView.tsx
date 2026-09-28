import React, { useState } from 'react';
import { Cpu, Search, AlertTriangle, CheckCircle2, Wrench, Clock, Activity, ArrowRight, Plus, Calendar, Thermometer } from 'lucide-react';
import { useLabData } from '../context/LabDataContext';
import { EquipmentRecord } from '../types';

export const EquipmentView: React.FC = () => {
  const { equipment, scheduleEquipmentMaintenance, createEquipment, whatIf, setWhatIf, setActiveTab } = useLabData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEquipForPM, setSelectedEquipForPM] = useState<EquipmentRecord | null>(null);
  const [pmDate, setPmDate] = useState('2026-04-10');
  const [pmEngineer, setPmEngineer] = useState('Kunal Deshmukh (Roche Certified Lead)');

  // New Equipment Form
  const [newEquip, setNewEquip] = useState({
    name: '',
    department: 'Biochemistry' as const,
    manufacturer: 'Roche Diagnostics',
    serialNumber: `SN-${Math.floor(100000 + Math.random() * 900000)}`,
    installationDate: '2025-01-15'
  });

  const handleMaintenanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEquipForPM) return;
    await scheduleEquipmentMaintenance(selectedEquipForPM.equipmentId, pmDate, pmEngineer, 'Rescheduled to prevent peak shift collision');
    setSelectedEquipForPM(null);
  };

  const handleAddEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    await createEquipment(newEquip);
    setShowAddModal(false);
  };

  const filteredEquipment = equipment.filter((e) => {
    return (
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.equipmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const operationalCount = equipment.filter(e => e.operationalStatus === 'Operational').length;
  const availabilityRate = equipment.length > 0 ? Math.round((operationalCount / equipment.length) * 100) : 94;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full mb-1">
            <Cpu className="h-3.5 w-3.5" />
            Instrument Telemetry & Lifecycle
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Laboratory Equipment Fleet
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time throughput capacity, calibration intervals, thermal loads, and preventive maintenance tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-500 block">Fleet Operational Availability</span>
            <span className="text-sm font-bold text-teal-700 tabular-nums">{availabilityRate}% Active</span>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg shadow-2xs transition-colors flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            Register Instrument
          </button>
          <button
            onClick={() => setActiveTab('what-if')}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors"
          >
            Simulate BIO-03 Downtime
          </button>
        </div>
      </div>

      {/* Equipment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEquipment.map((eq) => {
          const isBio03 = eq.equipmentId === 'BIO-03';
          const isHighUtilization = eq.utilizationPercent >= 85;
          const isMaintenanceDue = eq.operationalStatus === 'Maintenance Due';

          return (
            <div
              key={eq.equipmentId}
              className={`rounded-xl border p-4 shadow-2xs flex flex-col justify-between transition-all bg-white ${
                isBio03 && isMaintenanceDue
                  ? 'border-amber-300 ring-1 ring-amber-200'
                  : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-mono text-teal-700 font-bold bg-teal-50 px-1.5 py-0.5 rounded">
                      {eq.equipmentId}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{eq.name}</h3>
                    <div className="text-xs text-slate-500">{eq.department} · {eq.manufacturer}</div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    eq.operationalStatus === 'Operational'
                      ? 'bg-teal-100 text-teal-800'
                      : eq.operationalStatus === 'Maintenance Due'
                      ? 'bg-amber-100 text-amber-800 animate-pulse'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {eq.operationalStatus}
                  </span>
                </div>

                {/* Utilization Progress Bar */}
                <div className="my-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Capacity Load</span>
                    <span className={`font-bold tabular-nums ${isHighUtilization ? 'text-red-600' : 'text-slate-900'}`}>
                      {eq.utilizationPercent}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        eq.utilizationPercent > 90 ? 'bg-red-500' : eq.utilizationPercent > 80 ? 'bg-amber-500' : 'bg-teal-600'
                      }`}
                      style={{ width: `${eq.utilizationPercent}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2 rounded bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Tests Processed</span>
                    <strong className="text-slate-800 tabular-nums">{eq.testsProcessed} tests</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Next Scheduled PM</span>
                    <strong className={`tabular-nums ${isMaintenanceDue ? 'text-amber-700' : 'text-slate-800'}`}>
                      {eq.nextMaintenance}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono text-[11px]">Last PM: {eq.lastMaintenance}</span>
                <button
                  onClick={() => setSelectedEquipForPM(eq)}
                  className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors flex items-center gap-1 text-[11px]"
                >
                  <Wrench className="w-3 h-3 text-slate-500" />
                  <span>Schedule PM</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Maintenance Modal */}
      {selectedEquipForPM && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Schedule Preventive Maintenance</h3>
                <p className="text-xs text-slate-500">{selectedEquipForPM.name} ({selectedEquipForPM.equipmentId})</p>
              </div>
              <button onClick={() => setSelectedEquipForPM(null)} className="text-slate-400 hover:text-slate-600 text-lg leading-none">
                &times;
              </button>
            </div>

            <form onSubmit={handleMaintenanceSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Maintenance Date</label>
                <input
                  type="date"
                  required
                  value={pmDate}
                  onChange={(e) => setPmDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Certified Field Service Engineer</label>
                <input
                  type="text"
                  required
                  value={pmEngineer}
                  onChange={(e) => setPmEngineer(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600"
                />
              </div>

              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px]">
                Scheduling preventive maintenance updates the laboratory calibration calendar and dispatches an audit trail log for CAP/NABL compliance.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedEquipForPM(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold transition-colors"
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Equipment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Register Laboratory Analyzer</h3>
                <p className="text-xs text-slate-500">Add an analytical instrument or bench analyzer</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-lg leading-none">
                &times;
              </button>
            </div>

            <form onSubmit={handleAddEquipment} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Analyzer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sysmex CS-2500 Hemostasis System"
                  value={newEquip.name}
                  onChange={(e) => setNewEquip({ ...newEquip, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={newEquip.department}
                    onChange={(e) => setNewEquip({ ...newEquip, department: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600 bg-white"
                  >
                    <option value="Biochemistry">Biochemistry</option>
                    <option value="Hematology">Hematology</option>
                    <option value="Immunology">Immunology</option>
                    <option value="Microbiology">Microbiology</option>
                    <option value="Pathology">Pathology</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Manufacturer</label>
                  <input
                    type="text"
                    required
                    value={newEquip.manufacturer}
                    onChange={(e) => setNewEquip({ ...newEquip, manufacturer: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Serial Number</label>
                <input
                  type="text"
                  required
                  value={newEquip.serialNumber}
                  onChange={(e) => setNewEquip({ ...newEquip, serialNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold transition-colors"
                >
                  Register Fleet Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
