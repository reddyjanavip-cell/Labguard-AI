import React, { useState } from 'react';
import { ClipboardList, Search, Filter, Clock, CheckCircle2, AlertTriangle, ArrowRight, Plus, ChevronDown, Check } from 'lucide-react';
import { useLabData } from '../context/LabDataContext';
import { Department, Priority, OrderStatus, TestOrder } from '../types';

export const TestOrdersView: React.FC = () => {
  const { orders, patients, createTestOrder, updateOrderStatus } = useLabData();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeMenuOrderId, setActiveMenuOrderId] = useState<string | null>(null);

  // New order form
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.patientId || '');
  const [testName, setTestName] = useState('Complete Blood Count (CBC)');
  const [sampleType, setSampleType] = useState<'Serum' | 'Whole Blood' | 'Plasma' | 'Urine' | 'Swab' | 'CSF'>('Whole Blood');
  const [priority, setPriority] = useState<Priority>('Routine');
  const [department, setDepartment] = useState<Department>('Hematology');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    const pat = patients.find(p => p.patientId === selectedPatientId);
    const pName = pat ? pat.name : 'Unknown Patient';

    try {
      const res = await createTestOrder({
        patientId: selectedPatientId,
        patientName: pName,
        testName,
        sampleType,
        priority,
        department
      });

      if (!res.success) {
        setFormError(res.error || 'Failed to place test order');
        setIsSubmitting(false);
        return;
      }
      setShowCreateModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (orderId: string, nextStatus: OrderStatus) => {
    setActiveMenuOrderId(null);
    await updateOrderStatus(orderId, nextStatus);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = 
      o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.testName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = departmentFilter === 'All' || o.department === departmentFilter;
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const getPriorityBadge = (p: Priority) => {
    switch (p) {
      case 'STAT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200 animate-pulse">STAT</span>;
      case 'Urgent':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Urgent</span>;
      case 'Routine':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">Routine</span>;
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Processing':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Processing</span>;
      case 'Sample Collected':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-sky-100 text-sky-800">Sample Collected</span>;
      case 'Ordered':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">Ordered</span>;
      case 'Completed':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-teal-100 text-teal-800">Completed</span>;
      case 'Verified':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Verified</span>;
      case 'Released':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">Released</span>;
    }
  };

  const availableStatuses: OrderStatus[] = [
    'Ordered',
    'Sample Collected',
    'Processing',
    'Completed',
    'Verified',
    'Released'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full mb-1">
            <ClipboardList className="h-3.5 w-3.5" />
            LIS Test Order Tracking
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Laboratory Test Orders
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active diagnostic queues, sample statuses, assigned analyzers, and expected turnaround deadlines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Place Test Order
          </button>
          <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 font-bold">
            Pending Queue: {orders.filter(o => o.status !== 'Completed' && o.status !== 'Verified' && o.status !== 'Released').length} orders
          </div>
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
            placeholder="Search order ID, patient, or test..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-700 focus:border-teal-500 focus:outline-none"
          >
            <option value="All">All Departments</option>
            <option value="Biochemistry">Biochemistry</option>
            <option value="Hematology">Hematology</option>
            <option value="Immunology">Immunology</option>
            <option value="Microbiology">Microbiology</option>
            <option value="Pathology">Pathology</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-700 focus:border-teal-500 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Ordered">Ordered</option>
            <option value="Sample Collected">Sample Collected</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
            <option value="Verified">Verified</option>
            <option value="Released">Released</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-semibold text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-3.5 py-2.5">Order ID</th>
                <th className="px-3.5 py-2.5">Patient</th>
                <th className="px-3.5 py-2.5">Test Ordered</th>
                <th className="px-3.5 py-2.5">Department</th>
                <th className="px-3.5 py-2.5">Sample Type</th>
                <th className="px-3.5 py-2.5">Priority</th>
                <th className="px-3.5 py-2.5">Workflow Status</th>
                <th className="px-3.5 py-2.5">Assigned Station</th>
                <th className="px-3.5 py-2.5 text-right">Update Workflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.slice(0, 50).map((o) => (
                <tr key={o.orderId} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3.5 py-2 font-mono text-teal-700 font-semibold">{o.orderId}</td>
                  <td className="px-3.5 py-2 font-bold text-slate-900">{o.patientName}</td>
                  <td className="px-3.5 py-2 text-slate-800 font-medium">{o.testName}</td>
                  <td className="px-3.5 py-2 text-slate-600">{o.department}</td>
                  <td className="px-3.5 py-2 text-slate-500">{o.sampleType}</td>
                  <td className="px-3.5 py-2">{getPriorityBadge(o.priority)}</td>
                  <td className="px-3.5 py-2">{getStatusBadge(o.status)}</td>
                  <td className="px-3.5 py-2 text-slate-600 font-mono text-[11px]">{o.assignedEquipment || 'Bench 1'}</td>
                  <td className="px-3.5 py-2 text-right relative">
                    <button
                      onClick={() => setActiveMenuOrderId(activeMenuOrderId === o.orderId ? null : o.orderId)}
                      className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-100 text-[11px] font-semibold text-slate-700 inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Advance</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>

                    {activeMenuOrderId === o.orderId && (
                      <div className="absolute right-3.5 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-1 text-left">
                        <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Set Order Status
                        </div>
                        {availableStatuses.map((st) => (
                          <button
                            key={st}
                            onClick={() => handleStatusChange(o.orderId, st)}
                            className={`w-full px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                              o.status === st ? 'bg-teal-50 text-teal-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <span>{st}</span>
                            {o.status === st && <Check className="w-3.5 h-3.5 text-teal-700" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Place Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Place Laboratory Test Order</h3>
                <p className="text-xs text-slate-500">Assign sample tube, test panel, and analyzer bench</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="p-5 space-y-3.5 text-xs">
              {formError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700">
                  {formError}
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Patient</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600 bg-white"
                >
                  {patients.map(p => (
                    <option key={p.patientId} value={p.patientId}>
                      {p.name} ({p.patientId}) - {p.gender}, {p.age}y
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Test Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Complete Blood Count (CBC), Vitamin D 25-OH"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as any)}
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
                  <label className="block font-semibold text-slate-700 mb-1">Sample Type</label>
                  <select
                    value={sampleType}
                    onChange={(e) => setSampleType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600 bg-white"
                  >
                    <option value="Whole Blood">Whole Blood (EDTA)</option>
                    <option value="Serum">Serum (SST)</option>
                    <option value="Plasma">Plasma (Citrate)</option>
                    <option value="Urine">Urine</option>
                    <option value="Swab">Swab</option>
                    <option value="CSF">CSF</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                <div className="flex gap-2">
                  {(['Routine', 'Urgent', 'STAT'] as Priority[]).map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                        priority === p
                          ? p === 'STAT' ? 'bg-red-600 text-white border-red-600' : p === 'Urgent' ? 'bg-amber-600 text-white border-amber-600' : 'bg-teal-700 text-white border-teal-700'
                          : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Placing Order...' : 'Confirm Test Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
