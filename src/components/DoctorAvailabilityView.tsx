import React, { useState } from 'react';
import { useLabData } from '../context/LabDataContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { DoctorRecord, AppointmentRecord } from '../types';
import { UserCheck, Clock, Calendar, CheckCircle, AlertCircle, Plus, Search, Filter, ShieldCheck, MapPin, Stethoscope, RefreshCw } from 'lucide-react';

export const DoctorAvailabilityView: React.FC = () => {
  const { doctors, appointments, updateDoctorStatus, createAppointment, updateAppointmentStatus, patients, refreshAllData } = useLabData();
  const { currentUser, effectiveRole } = useAuth();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Book OPD Appointment Modal
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 10:30 AM');
  const [consultationType, setConsultationType] = useState<'REGULAR' | 'FOLLOW UP' | 'SPECIALIST' | 'EMERGENCY'>('REGULAR');
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Status updating state
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const canManageDoctors = effectiveRole === 'administrator' || effectiveRole === 'lab_manager' || effectiveRole === 'pathologist';

  const handleStatusChange = async (doctorId: string, newStatus: DoctorRecord['status']) => {
    setActionError(null);
    setUpdatingId(doctorId);
    const res = await updateDoctorStatus(doctorId, newStatus);
    setUpdatingId(null);
    if (!res.success) {
      setActionError(`Could not update doctor status: ${res.error}`);
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);
    setBookingSuccess(null);

    const doc = doctors.find(d => d.doctorId === selectedDoctorId || d.id === selectedDoctorId);
    if (!doc) {
      setBookingError('Please select a valid doctor');
      return;
    }

    const res = await createAppointment({
      doctorId: doc.doctorId,
      doctorName: doc.name,
      department: doc.department,
      patientId: patientId || (currentUser?.role === 'patient' && currentUser.patientId ? currentUser.patientId : 'PT-1001'),
      patientName: patientName || (currentUser?.name || 'Aarav Sharma'),
      date: appointmentDate,
      timeSlot,
      consultationType
    });

    if (res.success) {
      setBookingSuccess(`OPD Appointment booked! Token Number: ${res.appointment?.tokenNumber || 'T-Next'}`);
      setTimeout(() => {
        setBookModalOpen(false);
        setBookingSuccess(null);
        refreshAllData();
      }, 2000);
    } else {
      setBookingError(res.error || 'Failed to schedule appointment');
    }
  };

  const getStatusBadge = (status: DoctorRecord['status']) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'ON DUTY':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'IN CONSULTATION':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'ON LEAVE':
        return 'bg-slate-200 text-slate-700 border-slate-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredDoctors = doctors.filter(doc => {
    const roomStr = doc.roomNumber || doc.consultationRoom || '';
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          roomStr.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDepartment === 'All' || doc.department === selectedDepartment;
    const matchesStatus = statusFilter === 'All' || doc.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const departments = Array.from(new Set(doctors.map(d => d.department)));

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner with Railway HMIS reference */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Stethoscope className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {t('navDoctors')}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Centralized OPD Roster · Real-Time Room Allocation & Consultation Queues
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => refreshAllData()}
            className="p-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
            title="Refresh Roster"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (doctors.length > 0) setSelectedDoctorId(doctors[0].doctorId);
              if (patients.length > 0) {
                setPatientId(patients[0].patientId);
                setPatientName(patients[0].name);
              }
              setBookModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-blue-500/20 flex items-center space-x-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t('bookAppointment')}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Doctors On Duty</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {doctors.filter(d => d.status === 'ON DUTY' || d.status === 'AVAILABLE' || d.status === 'IN CONSULTATION').length}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">Active in OPD Chambers</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Available For Consult</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {doctors.filter(d => d.status === 'AVAILABLE').length}
          </p>
          <span className="text-[11px] text-slate-500">Immediate queue acceptance</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Total OPD Tokens Booked</span>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {appointments.length}
          </p>
          <span className="text-[11px] text-slate-500">Today's scheduled visits</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500">In Active Consultation</span>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {doctors.filter(d => d.status === 'IN CONSULTATION').length}
          </p>
          <span className="text-[11px] text-slate-500">Patients inside chambers</span>
        </div>
      </div>

      {/* Search & Filter Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[240px] relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search doctor by name, specialization, or room..."
            className="w-full px-3 py-2 pl-9 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-700 font-medium"
          >
            <option value="All">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-700 font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="ON DUTY">On Duty</option>
            <option value="IN CONSULTATION">In Consultation</option>
            <option value="ON LEAVE">On Leave</option>
          </select>
        </div>
      </div>

      {/* Doctor Cards / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Clinical Duty Roster ({filteredDoctors.length} Registered Medical Officers)
          </h2>
          <span className="text-[11px] text-slate-500 font-mono">
            OPD Hours: 08:00 - 20:00 IST
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 font-semibold">
                <th className="py-3 px-4">Doctor Information</th>
                <th className="py-3 px-4">Department & Speciality</th>
                <th className="py-3 px-4">Room / Chamber</th>
                <th className="py-3 px-4">OPD Hours</th>
                <th className="py-3 px-4">Queue Load</th>
                <th className="py-3 px-4">Current Status</th>
                {canManageDoctors && <th className="py-3 px-4 text-right">Roster Control</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredDoctors.map(doctor => (
                <tr key={doctor.doctorId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                        {doctor.name.replace('Dr. ', '').charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{doctor.name}</p>
                        <p className="text-[11px] text-slate-500">{doctor.doctorId} · {doctor.phone}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-medium text-slate-800">{doctor.department}</p>
                    <p className="text-[11px] text-slate-500">{doctor.specialization}</p>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                    <span className="inline-flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{doctor.roomNumber || doctor.consultationRoom}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 font-mono">
                    {doctor.opdTimings || doctor.opdTiming}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-mono font-semibold">
                      {doctor.currentQueueCount ?? 0} waiting
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(doctor.status)}`}>
                      {doctor.status}
                    </span>
                  </td>

                  {canManageDoctors && (
                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={doctor.status}
                        disabled={updatingId === doctor.doctorId}
                        onChange={(e) => handleStatusChange(doctor.doctorId, e.target.value as any)}
                        className="px-2 py-1 rounded-lg border border-slate-300 text-[11px] font-medium bg-white focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="AVAILABLE">Set AVAILABLE</option>
                        <option value="ON DUTY">Set ON DUTY</option>
                        <option value="IN CONSULTATION">Set IN CONSULT</option>
                        <option value="ON LEAVE">Set ON LEAVE</option>
                      </select>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* OPD Appointments Worklist */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Today's OPD Queue & Scheduled Tokens ({appointments.length} Consultations)
          </h2>
          <span className="text-[11px] text-slate-500 font-mono">Live Sync</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 font-semibold">
                <th className="py-3 px-4">Token #</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Consulting Doctor</th>
                <th className="py-3 px-4">Time Slot</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status</th>
                {canManageDoctors && <th className="py-3 px-4 text-right">Queue Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {appointments.slice(0, 10).map(apt => (
                <tr key={apt.appointmentId} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">
                    {apt.tokenNumber}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-900">{apt.patientName}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{apt.patientId}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-slate-800">{apt.doctorName}</p>
                    <p className="text-[11px] text-slate-500">{apt.department}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-mono">
                    {apt.timeSlot || apt.time}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                      {apt.consultationType || 'REGULAR'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      apt.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                      (apt.status as any) === 'IN PROGRESS' ? 'bg-amber-100 text-amber-800' :
                      apt.status === 'CHECKED-IN' || (apt.status as any) === 'CHECKED IN' ? 'bg-blue-100 text-blue-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {apt.status}
                    </span>
                  </td>
                  {canManageDoctors && (
                    <td className="py-3 px-4 text-right space-x-1">
                      {(apt.status === 'REQUESTED' || (apt.status as any) === 'SCHEDULED' || apt.status === 'CONFIRMED') && (
                        <button
                          type="button"
                          onClick={() => updateAppointmentStatus(apt.appointmentId, 'CHECKED-IN')}
                          className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-[10px] font-semibold"
                        >
                          Check In
                        </button>
                      )}
                      {(apt.status === 'CHECKED-IN' || (apt.status as any) === 'CHECKED IN') && (
                        <button
                          type="button"
                          onClick={() => updateAppointmentStatus(apt.appointmentId, 'IN PROGRESS')}
                          className="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded text-[10px] font-semibold"
                        >
                          Start Consult
                        </button>
                      )}
                      {(apt.status as any) === 'IN PROGRESS' && (
                        <button
                          type="button"
                          onClick={() => updateAppointmentStatus(apt.appointmentId, 'COMPLETED')}
                          className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[10px] font-semibold"
                        >
                          Mark Done
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Appointment Modal */}
      {bookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold">Schedule OPD Appointment</h3>
              </div>
              <button
                type="button"
                onClick={() => setBookModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookAppointment} className="p-6 space-y-4 text-xs">
              {bookingSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-medium">
                  {bookingSuccess}
                </div>
              )}
              {bookingError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl font-medium">
                  {bookingError}
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Doctor</label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  {doctors.map(d => (
                    <option key={d.doctorId} value={d.doctorId}>
                      {d.name} ({d.department} - {d.roomNumber || d.consultationRoom})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Patient UHID</label>
                  <input
                    type="text"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    required
                    placeholder="PT-1001"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Patient Name</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                    placeholder="Patient Full Name"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time Slot</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="09:30 AM - 10:00 AM">09:30 AM - 10:00 AM</option>
                    <option value="10:00 AM - 10:30 AM">10:00 AM - 10:30 AM</option>
                    <option value="11:00 AM - 11:30 AM">11:00 AM - 11:30 AM</option>
                    <option value="02:00 PM - 02:30 PM">02:00 PM - 02:30 PM</option>
                    <option value="03:30 PM - 04:00 PM">03:30 PM - 04:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Consultation Type</label>
                <select
                  value={consultationType}
                  onChange={(e) => setConsultationType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="REGULAR">REGULAR OPD</option>
                  <option value="FOLLOW UP">FOLLOW UP</option>
                  <option value="SPECIALIST">SPECIALIST REVIEW</option>
                  <option value="EMERGENCY">URGENT CONSULT</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setBookModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md shadow-blue-500/20"
                >
                  Confirm & Issue Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
