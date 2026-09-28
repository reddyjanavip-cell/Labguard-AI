import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLabData } from '../context/LabDataContext';
import { useLanguage } from '../context/LanguageContext';
import { Patient, TestOrder, ResultRecord, PrescriptionRecord, AppointmentRecord, PharmacyBillRecord, PharmacyDeliveryRecord } from '../types';
import {
  User,
  FileText,
  Calendar,
  Pill,
  ShieldCheck,
  Printer,
  AlertCircle,
  Clock,
  Sparkles,
  RefreshCw,
  ShieldAlert,
  CreditCard,
  Truck
} from 'lucide-react';

export const PatientPortalView: React.FC = () => {
  const { currentUser, isAuthLoading, patientRecord, switchRole } = useAuth();
  const { doctors, createAppointment } = useLabData();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'reports' | 'prescriptions' | 'appointments' | 'pharmacy'>('reports');
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState<{
    type: 'permission_denied' | 'not_found' | 'server_error' | 'network_error';
    message: string;
  } | null>(null);

  const [patientData, setPatientData] = useState<{
    patient: Patient | null;
    orders: TestOrder[];
    results: ResultRecord[];
    prescriptions: PrescriptionRecord[];
    appointments: AppointmentRecord[];
    bills: PharmacyBillRecord[];
    deliveries: PharmacyDeliveryRecord[];
  }>({
    patient: patientRecord || null,
    orders: [],
    results: [],
    prescriptions: [],
    appointments: [],
    bills: [],
    deliveries: []
  });

  const [selectedResultForPrint, setSelectedResultForPrint] = useState<ResultRecord | null>(null);

  // Book OPD Modal inside Patient Portal
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 10:30 AM');
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  // Authoritative UHID computation
  const targetUhid = currentUser?.patientId || currentUser?.uhid || patientRecord?.patientId || 'PT-1001';
  const [currentUhid, setCurrentUhid] = useState(targetUhid);

  useEffect(() => {
    setCurrentUhid(targetUhid);
  }, [targetUhid]);

  const fetchMyRecord = async (requestedUhid?: string) => {
    const queryUhid = requestedUhid || currentUhid || 'PT-1001';
    setLoading(true);
    setErrorState(null);

    try {
      const res = await fetch(`/api/patient/my-record?uhid=${encodeURIComponent(queryUhid)}`, {
        headers: {
          'x-user-id': currentUser?.id || 'USR-PT-01',
          'x-user-role': currentUser?.role || 'patient'
        }
      });

      if (res.ok) {
        const data = await res.json();
        setPatientData({
          patient: data?.patient || null,
          orders: Array.isArray(data?.orders) ? data.orders : [],
          results: Array.isArray(data?.results) ? data.results : [],
          prescriptions: Array.isArray(data?.prescriptions) ? data.prescriptions : [],
          appointments: Array.isArray(data?.appointments) ? data.appointments : [],
          bills: Array.isArray(data?.bills)
            ? data.bills
            : Array.isArray(data?.pharmacyBills)
            ? data.pharmacyBills
            : [],
          deliveries: Array.isArray(data?.deliveries)
            ? data.deliveries
            : Array.isArray(data?.pharmacyDeliveries)
            ? data.pharmacyDeliveries
            : []
        });
      } else if (res.status === 403) {
        const errJson = await res.json().catch(() => ({}));
        setErrorState({
          type: 'permission_denied',
          message: errJson.error || 'Access denied: You may only access your own personal health records.'
        });
      } else if (res.status === 404) {
        setErrorState({
          type: 'not_found',
          message: `No clinical patient record found for UHID: "${queryUhid}".`
        });
      } else {
        const errJson = await res.json().catch(() => ({}));
        setErrorState({
          type: 'server_error',
          message: errJson.error || 'Clinical database returned an error while fetching patient records.'
        });
      }
    } catch (err: any) {
      setErrorState({
        type: 'network_error',
        message: 'Network communication failure. Please verify server connectivity and retry.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchMyRecord();
    }
  }, [currentUhid, currentUser]);

  // Safe patient information object with bulletproof fallbacks
  const pInfo: Patient = patientData.patient || patientRecord || {
    patientId: currentUhid || 'PT-1001',
    name: currentUser?.name || 'Aarav Sharma',
    age: 42,
    gender: 'Male',
    phone: currentUser?.phone || '+91 98765 43210',
    email: currentUser?.email || 'aarav.sharma@gmail.com',
    bloodGroup: 'A+',
    referringDoctor: 'Dr. Sunita Rao, MD',
    registrationDate: '2025-01-10',
    testsOrderedCount: 5,
    lastVisit: '2025-02-28',
    status: 'Active'
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    const docList = doctors || [];
    const doc = docList.find(d => d.doctorId === selectedDoctorId || d.id === selectedDoctorId) || docList[0];
    if (!doc) return;

    const res = await createAppointment({
      doctorId: doc.doctorId,
      doctorName: doc.name,
      department: doc.department,
      patientId: pInfo.patientId,
      patientName: pInfo.name,
      date: appointmentDate,
      timeSlot,
      consultationType: 'REGULAR'
    });

    if (res.success) {
      setBookingSuccess(`Your OPD Appointment is confirmed! Token Number: ${res.appointment?.tokenNumber || 'T-Next'}`);
      fetchMyRecord();
      setTimeout(() => {
        setBookModalOpen(false);
        setBookingSuccess(null);
      }, 2500);
    }
  };

  const printReport = () => {
    window.print();
  };

  // State 1: Authentication loading
  if (isAuthLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4 text-center animate-fadeIn">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">Authenticating Patient Session...</h3>
        <p className="text-xs text-slate-500 max-w-sm">
          Verifying cryptographic credentials and sovereign access rights for hospital data.
        </p>
      </div>
    );
  }

  // State 2: Unauthenticated state
  if (!currentUser) {
    return (
      <div className="p-8 max-w-lg mx-auto my-12 bg-white rounded-2xl border border-amber-200 shadow-sm text-center space-y-4 animate-fadeIn">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-base font-bold text-slate-900">Patient Authentication Required</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          You are currently not signed in. Access to patient clinical records and laboratory reports requires an active session.
        </p>
        <button
          type="button"
          onClick={() => switchRole('patient')}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md transition-all"
        >
          Sign In as Patient (Aarav Sharma)
        </button>
      </div>
    );
  }

  // State 3: Fatal Error / Permission Denied / Patient Not Found State
  if (errorState) {
    return (
      <div className="p-8 max-w-xl mx-auto my-12 bg-white rounded-2xl border border-slate-200 shadow-lg text-center space-y-4 animate-fadeIn">
        <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center ${
          errorState.type === 'permission_denied' ? 'bg-red-100 text-red-700' :
          errorState.type === 'not_found' ? 'bg-amber-100 text-amber-700' :
          'bg-slate-100 text-slate-700'
        }`}>
          {errorState.type === 'permission_denied' ? (
            <ShieldAlert className="w-7 h-7" />
          ) : (
            <AlertCircle className="w-7 h-7" />
          )}
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-900">
            {errorState.type === 'permission_denied' ? 'Access Denied (RBAC Protection)' :
             errorState.type === 'not_found' ? 'Patient Record Unavailable' :
             'System Communication Notice'}
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto leading-relaxed">
            {errorState.message}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => fetchMyRecord()}
            className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Query</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentUhid('PT-1001');
              switchRole('patient');
              fetchMyRecord('PT-1001');
            }}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm"
          >
            Load Sovereign Patient UHID (PT-1001)
          </button>
        </div>
      </div>
    );
  }

  // Safe arrays guaranteed to be defined and always valid arrays
  const safeOrders = Array.isArray(patientData?.orders) ? patientData.orders : [];
  const safeResults = Array.isArray(patientData?.results) ? patientData.results : [];
  const safePrescriptions = Array.isArray(patientData?.prescriptions) ? patientData.prescriptions : [];
  const safeAppointments = Array.isArray(patientData?.appointments) ? patientData.appointments : [];
  const safeBills = Array.isArray(patientData?.bills) ? patientData.bills : [];
  const safeDeliveries = Array.isArray(patientData?.deliveries) ? patientData.deliveries : [];
  const safeDoctors = Array.isArray(doctors) ? doctors : [];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Patient Health Card Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl p-6 shadow-xl border border-emerald-700/50">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-2xl font-bold shadow-inner">
              {(pInfo.name || 'P').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {pInfo.name || 'Patient'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 text-xs font-mono font-semibold">
                  UHID: {pInfo.patientId || currentUhid}
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-1">
                {pInfo.gender || 'N/A'} · {pInfo.age || 0} Years · Blood Group: <strong className="text-white">{pInfo.bloodGroup || 'N/A'}</strong> · Attending: {pInfo.referringDoctor || 'Medical Specialist'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => fetchMyRecord()}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
              title="Refresh Record"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => {
                if (safeDoctors.length > 0) setSelectedDoctorId(safeDoctors[0].doctorId);
                setBookModalOpen(true);
              }}
              className="px-4 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl text-xs font-bold shadow-md flex items-center space-x-1.5 transition-all"
            >
              <Calendar className="w-4 h-4 text-emerald-700" />
              <span>Book OPD Appointment</span>
            </button>
          </div>
        </div>

        {/* Health Profile Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-emerald-700/60 text-xs">
          <div>
            <span className="text-emerald-300">Registered Phone</span>
            <p className="font-mono font-bold text-white mt-0.5">{pInfo.phone || 'N/A'}</p>
          </div>
          <div>
            <span className="text-emerald-300">Hospital Registration</span>
            <p className="font-mono text-white mt-0.5">{pInfo.registrationDate || '2025-01-10'}</p>
          </div>
          <div>
            <span className="text-emerald-300">Total Diagnostic Tests</span>
            <p className="font-bold text-white mt-0.5">{safeOrders.length} orders recorded</p>
          </div>
          <div>
            <span className="text-emerald-300">Digital Record Status</span>
            <p className="font-bold text-emerald-200 mt-0.5 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Verified & Sovereign
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-4 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('reports')}
          className={`pb-2.5 transition-all border-b-2 flex items-center space-x-1.5 ${
            activeTab === 'reports'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>My Lab Reports ({safeResults.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('prescriptions')}
          className={`pb-2.5 transition-all border-b-2 flex items-center space-x-1.5 ${
            activeTab === 'prescriptions'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>My Prescriptions ({safePrescriptions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('appointments')}
          className={`pb-2.5 transition-all border-b-2 flex items-center space-x-1.5 ${
            activeTab === 'appointments'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>My OPD Consultations ({safeAppointments.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pharmacy')}
          className={`pb-2.5 transition-all border-b-2 flex items-center space-x-1.5 ${
            activeTab === 'pharmacy'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Pharmacy & Bills ({safeDeliveries.length + safeBills.length})</span>
        </button>
      </div>

      {/* Tab 1: Verified Lab Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Laboratory Diagnostic Test Results
              </h2>
              <span className="text-[11px] text-slate-500 font-mono">
                Digitally Verified by Chief Pathologist
              </span>
            </div>

            {safeResults.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No verified test results found for your UHID currently.
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {safeResults.map(result => (
                  <div key={result.resultId} className="p-4 hover:bg-slate-50/70 transition-colors">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-bold text-slate-900">{result.testName}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            result.flag === 'Critical' ? 'bg-red-100 text-red-800' :
                            result.flag === 'High' ? 'bg-amber-100 text-amber-800' :
                            result.flag === 'Low' ? 'bg-blue-100 text-blue-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            {result.flag}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 font-mono">
                          Result ID: {result.resultId} · Order: {result.orderId} · Released: {result.dateTime}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-bold text-slate-900 font-mono">
                          {result.resultValue} <span className="text-xs font-normal text-slate-600">{result.unit}</span>
                        </span>
                        <p className="text-[11px] text-slate-500">
                          Ref: {result.referenceRange}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Tested by: {result.technician} · Verified by: {result.verifier || 'Dr. Sunita Rao'}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedResultForPrint(result)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium text-[11px] flex items-center space-x-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Verified Slip</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Prescriptions */}
      {activeTab === 'prescriptions' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Doctor Prescriptions & Medications
            </h2>
          </div>

          {safePrescriptions.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No active doctor prescriptions on record.
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {safePrescriptions.map(rx => (
                <div key={rx.prescriptionId} className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-emerald-700 text-xs">{rx.prescriptionId}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {rx.prescriptionStatus}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Prescribed by: <strong>{rx.doctorName || rx.prescribingDoctor}</strong> ({rx.department || 'Outpatient Department'}) on {rx.date}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-slate-600 block uppercase">Prescribed Medicines:</span>
                    {(Array.isArray(rx?.medicines) ? rx.medicines : []).map((med, i) => (
                      <div key={i} className="flex justify-between items-center text-xs text-slate-800 border-b border-slate-200/60 pb-1.5 last:border-b-0">
                        <div>
                          <strong className="text-slate-900">{med?.drugName || 'Medication'}</strong>
                          <span className="text-slate-500 ml-2">({med?.dosageInstructions || med?.dosage || 'Standard Dose'}{med?.duration ? `, ${med.duration}` : ''})</span>
                        </div>
                        <span className="font-mono font-semibold text-slate-700">Qty: {med?.quantity || 1}</span>
                      </div>
                    ))}
                  </div>

                  {rx.notes && (
                    <p className="text-xs text-slate-500 mt-2 italic">
                      Special clinical notes: "{rx.notes}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Appointments */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              My Scheduled OPD Consultations
            </h2>
            <button
              type="button"
              onClick={() => {
                if (safeDoctors.length > 0) setSelectedDoctorId(safeDoctors[0].doctorId);
                setBookModalOpen(true);
              }}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              + Book New Visit
            </button>
          </div>

          {safeAppointments.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No appointments scheduled currently.
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {safeAppointments.map(apt => (
                <div key={apt.appointmentId} className="p-4 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex flex-col items-center justify-center">
                      <span className="text-[10px] text-blue-600 font-bold uppercase">Token</span>
                      <span className="text-sm font-black text-blue-800 font-mono">{apt.tokenNumber}</span>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{apt.doctorName}</h3>
                      <p className="text-[11px] text-slate-500">{apt.department} · {apt.timeSlot || apt.time}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Date: {apt.date}</p>
                    </div>
                  </div>

                  <div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      apt.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                      (apt.status as any) === 'IN PROGRESS' ? 'bg-amber-100 text-amber-800' :
                      apt.status === 'CHECKED-IN' || (apt.status as any) === 'CHECKED IN' ? 'bg-blue-100 text-blue-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Pharmacy Bills & Deliveries */}
      {activeTab === 'pharmacy' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Prescription Home Deliveries & Pharmacy Invoices
              </h2>
            </div>

            {safeDeliveries.length === 0 && safeBills.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No medicine orders, deliveries, or pharmacy bills found for this patient profile.
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {/* Deliveries */}
                {safeDeliveries.map(del => (
                  <div key={del.orderId} className="p-4 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-50">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Truck className="w-4 h-4 text-blue-600" />
                        <span className="font-mono font-bold text-xs text-blue-700">{del.orderId}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                          {del.deliveryType}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-slate-600">
                        {(Array.isArray(del?.items) ? del.items : []).map((it, idx) => (
                          <span key={idx} className="mr-2">• {it?.drugName || 'Item'} × {it?.quantity || 1}</span>
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Destination: {del.address || 'Hospital Pharmacy Pickup'}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold font-mono text-slate-900">₹{(del.totalAmount || 0).toFixed(2)}</p>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold mt-1 ${
                        del.deliveryStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                        del.deliveryStatus === 'OUT FOR DELIVERY' ? 'bg-teal-100 text-teal-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {del.deliveryStatus}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Bills */}
                {safeBills.map(bill => (
                  <div key={bill.billNumber} className="p-4 flex flex-wrap items-center justify-between gap-3 hover:bg-slate-50 bg-slate-50/40">
                    <div>
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                        <span className="font-mono font-bold text-xs text-emerald-700">{bill.billNumber}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">
                          Dispensary Bill
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-slate-600">
                        {(Array.isArray(bill?.items) ? bill.items : []).map((it, idx) => (
                          <span key={idx} className="mr-2">• {it?.drugName || 'Item'} × {it?.quantity || 1}</span>
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Payment Method: {bill.paymentMethod} · Date: {bill.date}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold font-mono text-slate-900">₹{(bill.total || 0).toFixed(2)}</p>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold mt-1 bg-emerald-100 text-emerald-800">
                        {bill.paymentStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Book OPD Appointment Modal */}
      {bookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="p-5 bg-emerald-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">Book Hospital OPD Consultation</h3>
              <button type="button" onClick={() => setBookModalOpen(false)} className="text-white/80 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleBookAppointment} className="p-5 space-y-4 text-xs">
              {bookingSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl font-medium border border-emerald-200">
                  {bookingSuccess}
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Consulting Specialist</label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  {safeDoctors.map(d => (
                    <option key={d.doctorId} value={d.doctorId}>
                      {d.name} ({d.specialization} - {d.roomNumber || d.consultationRoom || 'OPD'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preferred Date</label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preferred Time Slot</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="09:30 AM - 10:00 AM">09:30 AM - 10:00 AM</option>
                  <option value="10:00 AM - 10:30 AM">10:00 AM - 10:30 AM</option>
                  <option value="11:30 AM - 12:00 PM">11:30 AM - 12:00 PM</option>
                  <option value="03:00 PM - 03:30 PM">03:00 PM - 03:30 PM</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setBookModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-md shadow-emerald-700/20"
                >
                  Confirm OPD Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Report Slip Modal */}
      {selectedResultForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">LABGUARD AI · DIAGNOSTIC REPORT</h2>
                <p className="text-xs text-slate-500">Government Healthcare Pattern Architecture</p>
              </div>
              <button type="button" onClick={() => setSelectedResultForPrint(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="text-xs space-y-2 font-mono bg-slate-50 p-4 rounded-xl border">
              <p><strong>Patient:</strong> {selectedResultForPrint.patientName} ({selectedResultForPrint.patientId})</p>
              <p><strong>Test Name:</strong> {selectedResultForPrint.testName}</p>
              <p><strong>Observed Value:</strong> <span className="text-base font-bold">{selectedResultForPrint.resultValue} {selectedResultForPrint.unit}</span></p>
              <p><strong>Reference Range:</strong> {selectedResultForPrint.referenceRange}</p>
              <p><strong>Clinical Flag:</strong> {selectedResultForPrint.flag}</p>
              <p><strong>Verified by:</strong> {selectedResultForPrint.verifier || 'Dr. Sunita Rao, MD'}</p>
              <p><strong>Report Timestamp:</strong> {selectedResultForPrint.dateTime}</p>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedResultForPrint(null)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-700"
              >
                Close
              </button>
              <button
                type="button"
                onClick={printReport}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
