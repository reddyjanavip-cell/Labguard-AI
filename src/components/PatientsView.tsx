import React, { useState } from 'react';
import { Users, Search, Filter, Phone, Mail, Calendar, UserCheck, Eye, X, ShieldAlert, Plus, Edit2, Trash2 } from 'lucide-react';
import { useLabData } from '../context/LabDataContext';
import { Patient } from '../types';

export const PatientsView: React.FC = () => {
  const { patients, orders, billing, createPatient, updatePatient, deletePatient, addAuditLog } = useLabData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Add / Edit Modal state
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // In-UI Delete Confirmation Modal State
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    age: 35,
    gender: 'Female' as 'Male' | 'Female' | 'Other',
    phone: '',
    email: '',
    bloodGroup: 'O+',
    referringDoctor: 'Dr. Vikram Sethi',
    status: 'Active' as 'Active' | 'Under Review' | 'Discharged'
  });

  const openCreateModal = () => {
    setEditingPatient(null);
    setFormData({
      name: '',
      age: 35,
      gender: 'Female',
      phone: '+91 98200 ',
      email: '',
      bloodGroup: 'O+',
      referringDoctor: 'Dr. Vikram Sethi (Internal Medicine)',
      status: 'Active'
    });
    setFormError(null);
    setShowFormModal(true);
  };

  const openEditModal = (p: Patient) => {
    setEditingPatient(p);
    setFormData({
      name: p.name,
      age: p.age,
      gender: p.gender,
      phone: p.phone,
      email: p.email || '',
      bloodGroup: p.bloodGroup,
      referringDoctor: p.referringDoctor,
      status: p.status
    });
    setFormError(null);
    setShowFormModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      if (editingPatient) {
        const res = await updatePatient(editingPatient.patientId, formData);
        if (!res.success) {
          setFormError(res.error || 'Failed to update patient');
          setIsSubmitting(false);
          return;
        }
      } else {
        const res = await createPatient(formData);
        if (!res.success) {
          setFormError(res.error || 'Failed to register patient');
          setIsSubmitting(false);
          return;
        }
      }
      setShowFormModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteModal = (p: Patient) => {
    setPatientToDelete(p);
    setDeleteError(null);
    setDeleteModalOpen(true);
  };

  const handleExecuteDelete = async (options?: { force?: boolean; archive?: boolean }) => {
    if (!patientToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);

    const res = await deletePatient(patientToDelete.patientId, options);
    setIsDeleting(false);

    if (res.success) {
      setDeleteModalOpen(false);
      setPatientToDelete(null);
      if (selectedPatient?.patientId === patientToDelete.patientId) {
        setSelectedPatient(null);
      }
    } else {
      setDeleteError(res.error || 'Failed to remove patient record');
    }
  };

  const filteredPatients = patients.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm) ||
      p.referringDoctor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const patientOrders = selectedPatient ? orders.filter(o => o.patientId === selectedPatient.patientId) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full mb-1">
            <Users className="h-3.5 w-3.5" />
            Sovereign Patient Directory
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Patients Master Registry
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified patient demographics, clinical test histories, and physician referrals protected under private access policies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Register Patient
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Total Enrolled:</span>
            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-800 tabular-nums">
              {patients.length} Patients
            </span>
          </div>
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
            placeholder="Search by patient ID, name, or phone..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-500 shrink-0">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-700 focus:border-teal-500 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Under Review">Under Review</option>
            <option value="Discharged">Discharged</option>
          </select>
        </div>
      </div>

      {/* Patient Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-semibold text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-3.5 py-2.5">Patient ID</th>
                <th className="px-3.5 py-2.5">Name</th>
                <th className="px-3.5 py-2.5">Age / Gender</th>
                <th className="px-3.5 py-2.5">Blood Group</th>
                <th className="px-3.5 py-2.5">Contact</th>
                <th className="px-3.5 py-2.5">Referring Physician</th>
                <th className="px-3.5 py-2.5">Tests Count</th>
                <th className="px-3.5 py-2.5">Status</th>
                <th className="px-3.5 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.slice(0, 50).map((p) => (
                <tr key={p.patientId} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3.5 py-2.5 font-mono text-teal-700 font-medium">{p.patientId}</td>
                  <td className="px-3.5 py-2.5 font-bold text-slate-900">{p.name}</td>
                  <td className="px-3.5 py-2.5 text-slate-600">{p.age}y · {p.gender}</td>
                  <td className="px-3.5 py-2.5 font-mono text-slate-700">{p.bloodGroup}</td>
                  <td className="px-3.5 py-2.5 text-slate-600 text-[11px]">{p.phone}</td>
                  <td className="px-3.5 py-2.5 text-slate-600">{p.referringDoctor}</td>
                  <td className="px-3.5 py-2.5 font-bold text-slate-800 tabular-nums">{p.testsOrderedCount}</td>
                  <td className="px-3.5 py-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.status === 'Active' ? 'bg-teal-100 text-teal-800' : p.status === 'Under Review' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-3.5 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedPatient(p)}
                        className="px-2 py-1 text-[11px] font-semibold text-teal-800 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded transition-colors flex items-center gap-1"
                        title="View Full Profile"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Profile</span>
                      </button>
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                        title="Edit Patient"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(p)}
                        className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Profile Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">{selectedPatient.name}</h2>
                  <span className="font-mono text-xs text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {selectedPatient.patientId}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Registered: {selectedPatient.registrationDate} · Blood Group: {selectedPatient.bloodGroup}
                </div>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Age & Gender</span>
                <strong className="text-slate-800">{selectedPatient.age} years · {selectedPatient.gender}</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Phone</span>
                <strong className="text-slate-800">{selectedPatient.phone}</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Referring Doctor</span>
                <strong className="text-slate-800">{selectedPatient.referringDoctor}</strong>
              </div>
            </div>

            {/* Test Orders History */}
            <div>
              <div className="text-xs font-bold text-slate-900 mb-2">Diagnostic Test Orders History</div>
              {patientOrders.length > 0 ? (
                <div className="space-y-1.5 text-xs">
                  {patientOrders.map(o => (
                    <div key={o.orderId} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <div>
                        <span className="font-semibold text-slate-900">{o.testName}</span>
                        <div className="text-[10px] text-slate-500 font-mono">{o.orderId} · {o.department}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                        {o.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-slate-50 text-slate-500 text-xs rounded-lg text-center">
                  No orders recorded for this session.
                </div>
              )}
            </div>

            {/* Sovereign Notice */}
            <div className="p-3 rounded-lg bg-teal-50/60 border border-teal-200 text-xs text-teal-900 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-teal-600 shrink-0" />
              <span>Patient identifiers protected by NovaCare RBAC Sovereign Shield. Audit event logged upon inspection.</span>
            </div>
          </div>
        </div>
      )}

      {/* Register / Edit Patient Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingPatient ? 'Edit Patient Record' : 'Register New Laboratory Patient'}
                </h3>
                <p className="text-xs text-slate-500">Demographic entry with sovereign SHA-256 audit chaining</p>
              </div>
              <button
                onClick={() => setShowFormModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 space-y-3.5 text-xs">
              {formError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700">
                  {formError}
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Patient Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    min="0"
                    max="130"
                    required
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. O+"
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98200 12345"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600 bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Discharged">Discharged</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Referring Physician</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Vikram Sethi (Internal Medicine)"
                  value={formData.referringDoctor}
                  onChange={(e) => setFormData({ ...formData, referringDoctor: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingPatient ? 'Update Patient' : 'Register Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-UI Patient Deletion / Archival Confirmation Modal */}
      {deleteModalOpen && patientToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Remove Patient Record</h3>
                  <p className="text-xs text-slate-500 font-mono">{patientToDelete.patientId}</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {deleteError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Cannot Delete Patient Directly</span>
                </p>
                <p>{deleteError}</p>
              </div>
            )}

            <div className="text-xs text-slate-600 space-y-2">
              <p>
                Are you sure you want to remove the clinical record for <strong>{patientToDelete.name}</strong> ({patientToDelete.age}y, {patientToDelete.gender})?
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Contact:</span>
                  <span className="font-medium text-slate-800">{patientToDelete.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Referring Physician:</span>
                  <span className="font-medium text-slate-800">{patientToDelete.referringDoctor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Orders on Record:</span>
                  <span className="font-bold text-teal-700">{patientToDelete.testsOrderedCount || 0}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                Note: In hospital laboratory systems, patient records linked to active diagnostic worklists require either soft archival or administrative force clearance to maintain chain of custody.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-end">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => handleExecuteDelete({ archive: true })}
                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs disabled:opacity-50"
                title="Mark status as Discharged / Archived without breaking specimen links"
              >
                {isDeleting ? 'Archiving...' : 'Archive Record (Safe)'}
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={() => handleExecuteDelete({ force: true })}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Force Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
