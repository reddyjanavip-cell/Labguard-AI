import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  Patient,
  TestOrder,
  LaboratoryTest,
  ResultRecord,
  InventoryItem,
  EquipmentRecord,
  StaffRecord,
  SupplierRecord,
  BillingRecord,
  AuditRecord,
  AIRisk,
  AIRecommendation,
  UserRole,
  LabNotification,
  CSVValidationResult,
  DataSource,
  SyncJob,
  SystemHealthState,
  DoctorRecord,
  AppointmentRecord,
  PharmacyDrugRecord,
  PrescriptionRecord,
  PharmacyDispensingRecord,
  PharmacyBillRecord,
  PharmacyDeliveryRecord,
  PharmacistRecord,
  TraceRecord
} from '../types';
import {
  INITIAL_KPIS,
  INITIAL_PATIENTS,
  INITIAL_TESTS,
  INITIAL_INVENTORY,
  INITIAL_EQUIPMENT,
  INITIAL_STAFF,
  INITIAL_SUPPLIERS,
  INITIAL_ORDERS,
  INITIAL_RESULTS,
  INITIAL_BILLING,
  INITIAL_AUDIT,
  INITIAL_RISKS,
  INITIAL_RECOMMENDATIONS,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';

export interface WhatIfScenarioState {
  volumeMultiplier: number;
  staffAvailabilityMultiplier: number;
  analyzerOffline: boolean;
  inventoryLevel: 'current' | 'reduced' | 'increased';
}

interface LabDataContextType {
  // Current user & role
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Datasets
  patients: Patient[];
  orders: TestOrder[];
  tests: LaboratoryTest[];
  results: ResultRecord[];
  inventory: InventoryItem[];
  equipment: EquipmentRecord[];
  staff: StaffRecord[];
  suppliers: SupplierRecord[];
  billing: BillingRecord[];
  auditLog: AuditRecord[];
  risks: AIRisk[];
  recommendations: AIRecommendation[];
  notifications: LabNotification[];
  dataSources: DataSource[];
  syncJobs: SyncJob[];
  doctors: DoctorRecord[];
  appointments: AppointmentRecord[];
  pharmacyMedicines: PharmacyDrugRecord[];
  prescriptions: PrescriptionRecord[];
  pharmacyBills: PharmacyBillRecord[];
  pharmacyDeliveries: PharmacyDeliveryRecord[];
  pharmacists: PharmacistRecord[];

  // Inspect Trace Modal State
  inspectTraceEntityId: string | null;
  inspectTraceModalOpen: boolean;
  openInspectTrace: (entityId: string) => void;
  closeInspectTrace: () => void;

  // Doctor Availability Modal State
  doctorAvailabilityModalOpen: boolean;
  openDoctorAvailabilityModal: () => void;
  closeDoctorAvailabilityModal: () => void;

  // Dynamic Metrics & System Status
  kpis: typeof INITIAL_KPIS;
  unreadAlertsCount: number;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  systemHealth: SystemHealthState;
  environmentStatus: 'LIVE DATA' | 'DEMO SIMULATION' | 'LAST SYNCHRONIZED DATA' | 'OFFLINE';
  lastSyncTimestamp: string;
  telemetryMode: 'LIVE' | 'DEMO';
  setTelemetryMode: (mode: 'LIVE' | 'DEMO') => Promise<void>;
  refreshAllData: () => Promise<void>;

  // Real CRUD Actions
  createPatient: (patientData: { name: string; age: number; gender: 'Male' | 'Female' | 'Other'; phone: string; email?: string; bloodGroup: string; referringDoctor: string; status?: 'Active' | 'Under Review' | 'Discharged' }) => Promise<{ success: boolean; error?: string }>;
  updatePatient: (id: string, updates: Partial<Patient>) => Promise<{ success: boolean; error?: string }>;
  deletePatient: (id: string, options?: { force?: boolean; archive?: boolean }) => Promise<{ success: boolean; error?: string }>;
  createTestOrder: (orderData: { patientId: string; patientName: string; testName: string; sampleType: 'Serum' | 'Whole Blood' | 'Plasma' | 'Urine' | 'Swab' | 'CSF'; priority: 'Routine' | 'Urgent' | 'STAT'; department: any }) => Promise<{ success: boolean; error?: string }>;
  updateOrderStatus: (orderId: string, status: TestOrder['status'], notes?: string) => Promise<{ success: boolean; error?: string }>;
  createTestResult: (resultData: { orderId: string; patientId: string; patientName: string; testName: string; resultValue: string; unit: string; referenceRange: string; flag: ResultRecord['flag']; technician: string }) => Promise<{ success: boolean; error?: string }>;
  verifyResult: (resultId: string, verifierName: string, comments?: string) => Promise<{ success: boolean; error?: string }>;
  createInventoryItem: (itemData: any) => Promise<{ success: boolean; error?: string }>;
  restockInventoryItem: (itemId: string, quantityToAdd: number, poNumber?: string) => Promise<{ success: boolean; error?: string }>;
  simulatedRestockItem: (itemId: string, quantityToAdd: number) => void;
  createEquipment: (equipData: any) => Promise<{ success: boolean; error?: string }>;
  scheduleEquipmentMaintenance: (equipmentId: string, scheduledDate: string, engineerName?: string, notes?: string) => Promise<{ success: boolean; error?: string }>;
  createStaff: (staffData: any) => Promise<{ success: boolean; error?: string }>;
  createSupplier: (supplierData: any) => Promise<{ success: boolean; error?: string }>;
  createInvoice: (invoiceData: any) => Promise<{ success: boolean; error?: string }>;
  executeRecommendation: (recId: string) => Promise<{ success: boolean; error?: string }>;
  resolveRisk: (riskId: string) => void;
  addAuditLog: (action: AuditRecord['action'], dataset: string, recordAffected: string, details: string) => void;

  // Doctors & OPD Methods
  updateDoctorStatus: (doctorId: string, status: DoctorRecord['status']) => Promise<{ success: boolean; error?: string }>;
  createAppointment: (data: any) => Promise<{ success: boolean; appointment?: AppointmentRecord; error?: string }>;
  updateAppointmentStatus: (appointmentId: string, status: AppointmentRecord['status']) => Promise<{ success: boolean; error?: string }>;

  // Pharmacy Methods
  dispensePharmacy: (data: any) => Promise<{ success: boolean; data?: any; error?: string }>;
  restockPharmacyMedicine: (drugId: string, quantity: number, poNumber?: string) => Promise<{ success: boolean; error?: string }>;
  updatePharmacyDeliveryStatus: (orderId: string, status: PharmacyDeliveryRecord['deliveryStatus']) => Promise<{ success: boolean; error?: string }>;
  createPrescription: (data: any) => Promise<{ success: boolean; error?: string }>;

  // External Data Sync & Integration Center
  syncIntegrationSource: (sourceId: string) => Promise<{ success: boolean; message: string }>;
  testIntegrationConnection: (endpointUrl: string, authType: string) => Promise<{ reachable: boolean; latencyMs: number; protocol: string; message: string }>;
  toggleIntegrationStatus: (sourceId: string) => Promise<{ success: boolean }>;

  // CSV Processing
  uploadedValidationResult: CSVValidationResult | null;
  processCSVUpload: (csvContent: string, fileName: string, datasetType: string) => CSVValidationResult;
  commitUploadedData: () => void;
  resetUpload: () => void;

  // What-If Simulation
  whatIf: WhatIfScenarioState;
  setWhatIf: React.Dispatch<React.SetStateAction<WhatIfScenarioState>>;
  calculatedSimulation: {
    simulatedTestVolume: number;
    projectedPendingTests: number;
    projectedAvgTAT: string;
    biochemistryLoadPercent: number;
    inventoryBurnoutDays: number;
    overtimeHoursRequired: number;
    bottleneckFlag: string;
  };

  // Demo Mode
  demoModeActive: boolean;
  demoStep: number;
  startDemoMode: () => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  exitDemoMode: () => void;
  demoProgressPhase: 'DATA' | 'INSIGHT' | 'RISK' | 'EVIDENCE' | 'ACTION';
}

const LabDataContext = createContext<LabDataContextType | undefined>(undefined);

export const LabDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { effectiveRole, switchRole } = useAuth();
  const activeRole = effectiveRole;
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Datasets state
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [orders, setOrders] = useState<TestOrder[]>(INITIAL_ORDERS);
  const [tests] = useState<LaboratoryTest[]>(INITIAL_TESTS);
  const [results, setResults] = useState<ResultRecord[]>(INITIAL_RESULTS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [equipment, setEquipment] = useState<EquipmentRecord[]>(INITIAL_EQUIPMENT);
  const [staff, setStaff] = useState<StaffRecord[]>(INITIAL_STAFF);
  const [suppliers, setSuppliers] = useState<SupplierRecord[]>(INITIAL_SUPPLIERS);
  const [billing, setBilling] = useState<BillingRecord[]>(INITIAL_BILLING);
  const [auditLog, setAuditLog] = useState<AuditRecord[]>(INITIAL_AUDIT);
  const [risks, setRisks] = useState<AIRisk[]>(INITIAL_RISKS);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(INITIAL_RECOMMENDATIONS);
  const [notifications, setNotifications] = useState<LabNotification[]>(INITIAL_NOTIFICATIONS);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [syncJobs, setSyncJobs] = useState<SyncJob[]>([]);
  const [doctors, setDoctors] = useState<DoctorRecord[]>([]);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [pharmacyMedicines, setPharmacyMedicines] = useState<PharmacyDrugRecord[]>([]);
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>([]);
  const [pharmacyBills, setPharmacyBills] = useState<PharmacyBillRecord[]>([]);
  const [pharmacyDeliveries, setPharmacyDeliveries] = useState<PharmacyDeliveryRecord[]>([]);
  const [pharmacists, setPharmacists] = useState<PharmacistRecord[]>([]);

  // Inspect Trace Modal State
  const [inspectTraceEntityId, setInspectTraceEntityId] = useState<string | null>(null);
  const [inspectTraceModalOpen, setInspectTraceModalOpen] = useState<boolean>(false);

  const openInspectTrace = (entityId: string) => {
    setInspectTraceEntityId(entityId);
    setInspectTraceModalOpen(true);
  };

  const closeInspectTrace = () => {
    setInspectTraceModalOpen(false);
  };

  // Doctor Availability Modal State
  const [doctorAvailabilityModalOpen, setDoctorAvailabilityModalOpen] = useState<boolean>(false);
  const openDoctorAvailabilityModal = () => setDoctorAvailabilityModalOpen(true);
  const closeDoctorAvailabilityModal = () => setDoctorAvailabilityModalOpen(false);

  // Telemetry & Environment
  const [telemetryMode, setTelemetryModeState] = useState<'LIVE' | 'DEMO'>('DEMO');
  const [environmentStatus, setEnvironmentStatus] = useState<'LIVE DATA' | 'DEMO SIMULATION' | 'LAST SYNCHRONIZED DATA' | 'OFFLINE'>('DEMO SIMULATION');
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState<string>(new Date().toISOString().substring(11, 19));

  // System Health
  const [systemHealth, setSystemHealth] = useState<SystemHealthState>({
    overall: 'HEALTHY',
    components: {
      database: { status: 'HEALTHY', provider: 'Persistent Laboratory Engine', path: 'data/laboratory-db.json' },
      authentication: { status: 'HEALTHY', provider: 'Sovereign Role-Based RBAC', activeRole: 'Lab Manager' },
      aiService: { status: 'HEALTHY', provider: 'Gemini 3.8 Flash (Server-Side Proxy)', model: 'gemini-3.8-flash' },
      externalIntegrations: { status: 'HEALTHY', activeSourcesCount: 3, totalSources: 4 },
      realTimeSync: { status: 'HEALTHY', mode: 'DEMO', pushEngine: 'SSE' }
    },
    timestamp: new Date().toISOString()
  });

  const [uploadedValidationResult, setUploadedValidationResult] = useState<CSVValidationResult | null>(null);

  // What-If Scenario State
  const [whatIf, setWhatIf] = useState<WhatIfScenarioState>({
    volumeMultiplier: 1.0,
    staffAvailabilityMultiplier: 1.0,
    analyzerOffline: false,
    inventoryLevel: 'current'
  });

  // Demo Mode Walkthrough State
  const [demoModeActive, setDemoModeActive] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(1);

  // Common request headers with actor role
  const getAuthHeaders = useCallback(() => {
    let userId = activeRole === 'lab_manager' ? 'USR-02' : activeRole === 'administrator' ? 'USR-01' : 'USR-03';
    try {
      const saved = localStorage.getItem('labguard_auth_user');
      if (saved) {
        const u = JSON.parse(saved);
        if (u.id) userId = u.id;
      }
    } catch {}

    return {
      'Content-Type': 'application/json',
      'x-user-role': activeRole,
      'x-user-id': userId
    };
  }, [activeRole]);

  // Refresh all state from REST API
  const refreshAllData = useCallback(async () => {
    try {
      const headers = getAuthHeaders();
      const [
        dashRes,
        patientsRes,
        ordersRes,
        resultsRes,
        invRes,
        equipRes,
        staffRes,
        suppRes,
        billRes,
        auditRes,
        notifRes,
        sourcesRes,
        jobsRes,
        healthRes,
        modeRes,
        docsRes,
        aptsRes,
        medsRes,
        rxRes,
        pbRes,
        delRes,
        pharmRes
      ] = await Promise.allSettled([
        fetch('/api/dashboard', { headers }),
        fetch('/api/patients', { headers }),
        fetch('/api/test-orders', { headers }),
        fetch('/api/test-results', { headers }),
        fetch('/api/inventory', { headers }),
        fetch('/api/equipment', { headers }),
        fetch('/api/staff', { headers }),
        fetch('/api/suppliers', { headers }),
        fetch('/api/billing', { headers }),
        fetch('/api/audit', { headers }),
        fetch('/api/notifications', { headers }),
        fetch('/api/integrations', { headers }),
        fetch('/api/sync', { headers }),
        fetch('/api/health', { headers }),
        fetch('/api/telemetry/mode', { headers }),
        fetch('/api/doctors', { headers }),
        fetch('/api/appointments', { headers }),
        fetch('/api/pharmacy/medicines', { headers }),
        fetch('/api/pharmacy/prescriptions', { headers }),
        fetch('/api/pharmacy/bills', { headers }),
        fetch('/api/pharmacy/deliveries', { headers }),
        fetch('/api/pharmacy/pharmacists', { headers })
      ]);

      if (dashRes.status === 'fulfilled' && dashRes.value.ok) {
        const dashData = await dashRes.value.json();
        if (dashData.risks) setRisks(dashData.risks);
        if (dashData.recommendations) setRecommendations(dashData.recommendations);
      }

      if (patientsRes.status === 'fulfilled' && patientsRes.value.ok) {
        const pData = await patientsRes.value.json();
        setPatients(pData);
      }

      if (ordersRes.status === 'fulfilled' && ordersRes.value.ok) {
        const oData = await ordersRes.value.json();
        setOrders(oData);
      }

      if (resultsRes.status === 'fulfilled' && resultsRes.value.ok) {
        const rData = await resultsRes.value.json();
        setResults(rData);
      }

      if (invRes.status === 'fulfilled' && invRes.value.ok) {
        const iData = await invRes.value.json();
        setInventory(iData);
      }

      if (equipRes.status === 'fulfilled' && equipRes.value.ok) {
        const eData = await equipRes.value.json();
        setEquipment(eData);
      }

      if (staffRes.status === 'fulfilled' && staffRes.value.ok) {
        const sData = await staffRes.value.json();
        setStaff(sData);
      }

      if (suppRes.status === 'fulfilled' && suppRes.value.ok) {
        const supData = await suppRes.value.json();
        setSuppliers(supData);
      }

      if (billRes.status === 'fulfilled' && billRes.value.ok) {
        const bData = await billRes.value.json();
        setBilling(bData);
      }

      if (auditRes.status === 'fulfilled' && auditRes.value.ok) {
        const aData = await auditRes.value.json();
        setAuditLog(aData);
      }

      if (notifRes.status === 'fulfilled' && notifRes.value.ok) {
        const nData = await notifRes.value.json();
        setNotifications(nData);
      }

      if (sourcesRes.status === 'fulfilled' && sourcesRes.value.ok) {
        const sData = await sourcesRes.value.json();
        setDataSources(sData);
      }

      if (jobsRes.status === 'fulfilled' && jobsRes.value.ok) {
        const jData = await jobsRes.value.json();
        setSyncJobs(jData);
      }

      if (healthRes.status === 'fulfilled' && healthRes.value.ok) {
        const hData = await healthRes.value.json();
        setSystemHealth(hData);
      }

      if (modeRes.status === 'fulfilled' && modeRes.value.ok) {
        const mData = await modeRes.value.json();
        setTelemetryModeState(mData.mode);
        setEnvironmentStatus(mData.mode === 'LIVE' ? 'LIVE DATA' : 'DEMO SIMULATION');
      }

      if (docsRes.status === 'fulfilled' && docsRes.value.ok) {
        const docData = await docsRes.value.json();
        setDoctors(docData);
      }

      if (aptsRes.status === 'fulfilled' && aptsRes.value.ok) {
        const aptData = await aptsRes.value.json();
        setAppointments(aptData);
      }

      if (medsRes.status === 'fulfilled' && medsRes.value.ok) {
        const medData = await medsRes.value.json();
        setPharmacyMedicines(medData);
      }

      if (rxRes.status === 'fulfilled' && rxRes.value.ok) {
        const rxData = await rxRes.value.json();
        setPrescriptions(rxData);
      }

      if (pbRes.status === 'fulfilled' && pbRes.value.ok) {
        const pbData = await pbRes.value.json();
        setPharmacyBills(pbData);
      }

      if (delRes.status === 'fulfilled' && delRes.value.ok) {
        const delData = await delRes.value.json();
        setPharmacyDeliveries(delData);
      }

      if (pharmRes.status === 'fulfilled' && pharmRes.value.ok) {
        const pharmData = await pharmRes.value.json();
        setPharmacists(pharmData);
      }

      setLastSyncTimestamp(new Date().toISOString().substring(11, 19));
    } catch (err) {
      console.warn('[LabData] API sync fallback to local store:', err);
      setEnvironmentStatus('OFFLINE');
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Connect to Real-time SSE Telemetry Stream
  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;

    const connectSSE = () => {
      try {
        eventSource = new EventSource('/api/telemetry/stream');

        eventSource.onopen = () => {
          if (environmentStatus === 'OFFLINE') {
            setEnvironmentStatus(telemetryMode === 'LIVE' ? 'LIVE DATA' : 'DEMO SIMULATION');
          }
        };

        eventSource.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data);
            setLastSyncTimestamp(new Date().toISOString().substring(11, 19));

            if (data.type === 'MUTATION') {
              if (data.collection === 'patients') {
                if (data.type === 'create') setPatients(prev => [data.record, ...prev]);
                if (data.type === 'update') setPatients(prev => prev.map(p => p.patientId === data.record.patientId ? data.record : p));
                if (data.type === 'delete') setPatients(prev => prev.filter(p => p.patientId !== data.recordId));
              } else if (data.collection === 'testOrders') {
                if (data.type === 'create') setOrders(prev => [data.record, ...prev]);
                if (data.type === 'update') setOrders(prev => prev.map(o => o.orderId === data.record.orderId ? data.record : o));
              } else if (data.collection === 'testResults') {
                if (data.type === 'create') setResults(prev => [data.record, ...prev]);
                if (data.type === 'update') setResults(prev => prev.map(r => r.resultId === data.record.resultId ? data.record : r));
              } else if (data.collection === 'inventory') {
                if (data.type === 'create') setInventory(prev => [...prev, data.record]);
                if (data.type === 'update') setInventory(prev => prev.map(i => i.itemId === data.record.itemId ? data.record : i));
              } else if (data.collection === 'equipment') {
                if (data.type === 'update') setEquipment(prev => prev.map(eq => eq.equipmentId === data.record.equipmentId ? data.record : eq));
              } else if (data.collection === 'auditLogs') {
                setAuditLog(prev => [data.record, ...prev]);
              }
            } else if (data.type === 'TELEMETRY_TICK') {
              if (data.type === 'ORDER_COMPLETED' || data.type === 'ORDER_PROCESSING') {
                // Refresh orders & inventory
                fetch('/api/test-orders').then(r => r.json()).then(setOrders).catch(() => {});
                fetch('/api/inventory').then(r => r.json()).then(setInventory).catch(() => {});
              } else if (data.type === 'EQUIPMENT_TELEMETRY') {
                setEquipment(prev => prev.map(eq => eq.equipmentId === data.equipmentId ? {
                  ...eq,
                  utilizationPercent: data.utilization,
                  temperature: data.temperature
                } : eq));
              }
            }
          } catch {
            // Ignore parse errors on keep-alives
          }
        };

        eventSource.onerror = () => {
          if (eventSource) eventSource.close();
          reconnectTimeout = setTimeout(connectSSE, 5000);
        };
      } catch (err) {
        console.warn('[SSE] Connection error:', err);
      }
    };

    connectSSE();

    return () => {
      if (eventSource) eventSource.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, [telemetryMode, environmentStatus]);

  // Mode switcher
  const setTelemetryMode = async (mode: 'LIVE' | 'DEMO') => {
    try {
      const res = await fetch('/api/telemetry/mode', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ mode })
      });
      if (res.ok) {
        setTelemetryModeState(mode);
        setEnvironmentStatus(mode === 'LIVE' ? 'LIVE DATA' : 'DEMO SIMULATION');
      }
    } catch {
      setTelemetryModeState(mode);
      setEnvironmentStatus(mode === 'LIVE' ? 'LIVE DATA' : 'DEMO SIMULATION');
    }
  };

  // Add audit log helper
  const addAuditLog = (
    action: AuditRecord['action'],
    dataset: string,
    recordAffected: string,
    details: string
  ) => {
    const roleLabels: Record<UserRole, string> = {
      administrator: 'Administrator',
      lab_manager: 'Lab Manager',
      technician: 'Technician',
      pathologist: 'Pathologist',
      finance: 'Finance Officer',
      pharmacist: 'Pharmacist',
      patient: 'Patient'
    };

    const newRecord: AuditRecord = {
      auditId: `AUD-${9900 + auditLog.length + 1}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: activeRole === 'lab_manager' ? 'Dr. Aris Thorne' : activeRole === 'pathologist' ? 'Dr. Shalini Kulkarni' : 'Authorized Lab User',
      role: roleLabels[activeRole],
      action,
      dataset,
      recordAffected,
      status: 'Authorized',
      details
    };

    setAuditLog(prev => [newRecord, ...prev]);
  };

  const setActiveRole = (role: UserRole) => {
    switchRole(role);
    addAuditLog('Login', 'Auth & RBAC', `Role switched to ${role.toUpperCase()}`, `Session authorization level changed to ${role}`);
  };

  // Notifications
  const markNotificationRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: getAuthHeaders()
      });
    } catch {
      // Local state already updated
    }
  };

  const markAllNotificationsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        headers: getAuthHeaders()
      });
    } catch {
      // Local state already updated
    }
  };

  const unreadAlertsCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // CRUD: Patients
  const createPatient = async (patientData: {
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    phone: string;
    email?: string;
    bloodGroup: string;
    referringDoctor: string;
    status?: 'Active' | 'Under Review' | 'Discharged';
  }) => {
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(patientData)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to create patient' };
      }
      setPatients(prev => [data, ...prev]);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updatePatient = async (id: string, updates: Partial<Patient>) => {
    try {
      const res = await fetch(`/api/patients/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to update patient' };
      }
      setPatients(prev => prev.map(p => p.patientId === id ? data : p));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const deletePatient = async (id: string, options?: { force?: boolean; archive?: boolean }) => {
    try {
      const q = options?.force ? '?force=true' : options?.archive ? '?archive=true' : '';
      const res = await fetch(`/api/patients/${id}${q}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to delete patient' };
      }
      if (options?.archive) {
        setPatients(prev => prev.map(p => p.patientId === id ? { ...p, status: 'Discharged' } : p));
      } else {
        setPatients(prev => prev.filter(p => p.patientId !== id));
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // CRUD: Test Orders & Workflow
  const createTestOrder = async (orderData: {
    patientId: string;
    patientName: string;
    testName: string;
    sampleType: 'Serum' | 'Whole Blood' | 'Plasma' | 'Urine' | 'Swab' | 'CSF';
    priority: 'Routine' | 'Urgent' | 'STAT';
    department: any;
  }) => {
    try {
      const res = await fetch('/api/test-orders', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(orderData)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to create test order' };
      }
      setOrders(prev => [data, ...prev]);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateOrderStatus = async (orderId: string, status: TestOrder['status'], notes?: string) => {
    try {
      const res = await fetch(`/api/test-orders/${orderId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, notes })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to update order status' };
      }
      setOrders(prev => prev.map(o => o.orderId === orderId ? data : o));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // CRUD: Results & Verification
  const createTestResult = async (resultData: {
    orderId: string;
    patientId: string;
    patientName: string;
    testName: string;
    resultValue: string;
    unit: string;
    referenceRange: string;
    flag: ResultRecord['flag'];
    technician: string;
  }) => {
    try {
      const res = await fetch('/api/test-results', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(resultData)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to record test result' };
      }
      setResults(prev => [data, ...prev]);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const verifyResult = async (resultId: string, verifierName: string, comments?: string) => {
    try {
      const res = await fetch(`/api/test-results/${resultId}/verify`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ verifier: verifierName, comments })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to verify result' };
      }
      setResults(prev => prev.map(r => r.resultId === resultId ? data : r));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // CRUD: Inventory & Reagents
  const createInventoryItem = async (itemData: any) => {
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(itemData)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to create inventory item' };
      }
      setInventory(prev => [...prev, data]);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const restockInventoryItem = async (itemId: string, quantityToAdd: number, poNumber?: string) => {
    try {
      const res = await fetch(`/api/inventory/${itemId}/restock`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ quantity: quantityToAdd, purchaseOrderNumber: poNumber })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to restock item' };
      }
      setInventory(prev => prev.map(i => i.itemId === itemId ? data : i));

      // Update recommendations & risks
      setRecommendations(prev => prev.map(rec => {
        if (rec.recId === 'REC-01' && itemId === 'INV-101') {
          return { ...rec, executed: true, actionLabel: 'Replenishment Order Queued ✓' };
        }
        return rec;
      }));

      setRisks(prev => prev.map(r => {
        if (r.evidence.itemOrEntity?.includes(itemId)) {
          return {
            ...r,
            level: 'low',
            title: `${r.title} [Replenished]`,
            description: `Stock replenished by ${quantityToAdd} units. Safe stock level achieved.`
          };
        }
        return r;
      }));

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // CRUD: Equipment & Maintenance
  const createEquipment = async (equipData: any) => {
    try {
      const res = await fetch('/api/equipment', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(equipData)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to register equipment' };
      }
      setEquipment(prev => [...prev, data]);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const scheduleEquipmentMaintenance = async (equipmentId: string, scheduledDate: string, engineerName: string = 'Kunal Deshmukh (Roche Certified)', notes: string = 'Scheduled preventive maintenance') => {
    try {
      const res = await fetch(`/api/equipment/${equipmentId}/maintenance`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ scheduledDate, engineerName, notes })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to schedule maintenance' };
      }
      setEquipment(prev => prev.map(e => e.equipmentId === equipmentId ? data : e));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // CRUD: Staff
  const createStaff = async (staffData: any) => {
    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(staffData)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to add staff member' };
      }
      setStaff(prev => [...prev, data]);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // CRUD: Suppliers
  const createSupplier = async (supplierData: any) => {
    try {
      const res = await fetch('/api/suppliers', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(supplierData)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to add supplier' };
      }
      setSuppliers(prev => [...prev, data]);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // CRUD: Billing
  const createInvoice = async (invoiceData: any) => {
    try {
      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(invoiceData)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to create invoice' };
      }
      setBilling(prev => [data, ...prev]);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // AI Recommendations
  const executeRecommendation = async (recId: string) => {
    try {
      const res = await fetch(`/api/recommendations/${recId}/execute`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to execute recommendation' };
      }
      setRecommendations(prev => prev.map(r => r.recId === recId ? { ...r, executed: true, actionLabel: 'Executed ✓' } : r));
      if (recId === 'REC-01') {
        refreshAllData();
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const resolveRisk = (riskId: string) => {
    setRisks(prev => prev.filter(r => r.riskId !== riskId));
    addAuditLog('AI Analysis', 'AI Risk Center', riskId, 'Operational risk marked as mitigated by laboratory supervisor.');
  };

  // Doctors & OPD Methods
  const updateDoctorStatus = async (doctorId: string, status: DoctorRecord['status']) => {
    try {
      const res = await fetch(`/api/doctors/${doctorId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || 'Failed to update status' };
      setDoctors(prev => prev.map(d => (d.doctorId === doctorId || d.id === doctorId) ? data.doctor : d));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const createAppointment = async (aptData: any) => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(aptData)
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || 'Failed to book appointment' };
      setAppointments(prev => [data, ...prev]);
      return { success: true, appointment: data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: AppointmentRecord['status']) => {
    try {
      const res = await fetch(`/api/appointments/${appointmentId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || 'Failed to update appointment' };
      setAppointments(prev => prev.map(a => (a.appointmentId === appointmentId || a.id === appointmentId) ? data.appointment : a));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Pharmacy Methods
  const dispensePharmacy = async (dispenseData: any) => {
    try {
      const res = await fetch('/api/pharmacy/dispense', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(dispenseData)
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || 'Dispensing failed' };
      if (data.bill) setPharmacyBills(prev => [data.bill, ...prev]);
      if (data.delivery) setPharmacyDeliveries(prev => [data.delivery, ...prev]);
      refreshAllData();
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const restockPharmacyMedicine = async (drugId: string, quantity: number, poNumber?: string) => {
    try {
      const res = await fetch(`/api/pharmacy/medicines/${drugId}/restock`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ quantity, poNumber })
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || 'Restock failed' };
      setPharmacyMedicines(prev => prev.map(m => (m.drugId === drugId || m.id === drugId) ? data.medicine : m));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updatePharmacyDeliveryStatus = async (orderId: string, status: PharmacyDeliveryRecord['deliveryStatus']) => {
    try {
      const res = await fetch(`/api/pharmacy/deliveries/${orderId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || 'Failed to update delivery' };
      setPharmacyDeliveries(prev => prev.map(d => (d.orderId === orderId || d.id === orderId) ? data.delivery : d));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const createPrescription = async (rxData: any) => {
    try {
      const res = await fetch('/api/pharmacy/prescriptions', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(rxData)
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || 'Failed to create prescription' };
      setPrescriptions(prev => [data, ...prev]);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Integration Center Actions
  const syncIntegrationSource = async (sourceId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`/api/integrations/${sourceId}/sync-now`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || 'Sync failed' };
      }
      // Refresh integration lists
      fetch('/api/integrations').then(r => r.json()).then(setDataSources).catch(() => {});
      fetch('/api/sync').then(r => r.json()).then(setSyncJobs).catch(() => {});
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, message: err.message || 'Network error during sync' };
    }
  };

  const testIntegrationConnection = async (endpointUrl: string, authType: string) => {
    try {
      const res = await fetch('/api/integrations/test-connection', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ endpointUrl, authType })
      });
      return await res.json();
    } catch (err: any) {
      return { reachable: false, latencyMs: 0, protocol: 'ERR', message: err.message };
    }
  };

  const toggleIntegrationStatus = async (sourceId: string) => {
    try {
      const res = await fetch(`/api/integrations/${sourceId}/toggle-status`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (res.ok && data.source) {
        setDataSources(prev => prev.map(s => s.id === sourceId ? data.source : s));
        return { success: true };
      }
      return { success: false };
    } catch {
      return { success: false };
    }
  };

  // Dynamic KPI calculations derived from current state
  const kpis = useMemo(() => {
    const totalTestsToday = 1248 + (orders.length - 72);
    const pendingToday = orders.filter(o => o.status === 'Ordered' || o.status === 'Sample Collected' || o.status === 'Processing').length;
    const completedToday = totalTestsToday - pendingToday;

    const baseMinutes = 138;
    const extraLoad = Math.max(0, pendingToday - 70) * 1.5;
    const avgMinutes = Math.round(baseMinutes + extraLoad);
    const hours = Math.floor(avgMinutes / 60);
    const mins = avgMinutes % 60;
    const averageTAT = `${hours}h ${mins.toString().padStart(2, '0')}m`;

    const dailyRevenue = billing.reduce((sum, b) => sum + (b.amount - (b.discount || 0) + (b.tax || 0)), 0);
    const inventoryValue = inventory.reduce((sum, i) => sum + (i.quantity * i.unitCost), 0);
    const operationalEquip = equipment.filter(e => e.operationalStatus === 'Operational').length;
    const equipmentAvailability = equipment.length > 0 ? Math.round((operationalEquip / equipment.length) * 100) : 94;

    return {
      totalTestsToday,
      completedToday,
      pendingToday,
      averageTAT,
      dailyRevenue,
      inventoryValue,
      criticalAlerts: risks.filter(r => r.level === 'critical').length,
      equipmentAvailability
    };
  }, [orders, billing, inventory, equipment, risks]);

  // CSV Upload & Parsing
  const processCSVUpload = (csvContent: string, fileName: string, datasetType: string): CSVValidationResult => {
    const lines = csvContent.trim().split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) {
      return {
        fileName,
        datasetType,
        recordsDetected: 0,
        columnsDetected: 0,
        missingValues: 0,
        duplicateRecords: 0,
        invalidEntries: 0,
        dataQualityScore: 0,
        validRowsCount: 0,
        warningRowsCount: 0,
        invalidRowsCount: 0,
        columns: [],
        sampleRows: [],
        validationIssues: [{ row: 0, column: 'File', issue: 'Uploaded file is empty', severity: 'error', recommendation: 'Provide a valid CSV file with headers and data.' }]
      };
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
    const rows = lines.slice(1);
    let missingValuesCount = 0;
    let duplicateCount = 0;
    let invalidCount = 0;
    const seenIds = new Set<string>();
    const issues: CSVValidationResult['validationIssues'] = [];
    const sampleParsedRows: Record<string, any>[] = [];

    rows.forEach((line, rowIndex) => {
      const values = line.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
      const rowObj: Record<string, any> = {};
      let rowHasError = false;

      headers.forEach((h, colIndex) => {
        const val = values[colIndex] ?? '';
        rowObj[h] = val;

        if (val === '' || val === 'null' || val === 'undefined') {
          missingValuesCount++;
          if (colIndex === 0) {
            rowHasError = true;
            issues.push({
              row: rowIndex + 2,
              column: h,
              issue: 'Missing mandatory identifier',
              severity: 'error',
              recommendation: 'Ensure each record has a primary key ID.'
            });
          }
        }
      });

      const primaryId = values[0];
      if (primaryId) {
        if (seenIds.has(primaryId)) {
          duplicateCount++;
          issues.push({
            row: rowIndex + 2,
            column: headers[0],
            issue: `Duplicate ID detected: ${primaryId}`,
            severity: 'warning',
            recommendation: 'Records will be merged or deduplicated during normalization.'
          });
        } else {
          seenIds.add(primaryId);
        }
      }

      if (rowHasError) invalidCount++;
      if (rowIndex < 10) sampleParsedRows.push(rowObj);
    });

    const validRowsCount = rows.length - invalidCount;
    const dataQualityScore = Math.max(0, Math.round(100 - (missingValuesCount * 2 + invalidCount * 10 + duplicateCount * 3) / (rows.length || 1)));

    const result: CSVValidationResult = {
      fileName,
      datasetType,
      recordsDetected: rows.length,
      columnsDetected: headers.length,
      missingValues: missingValuesCount,
      duplicateRecords: duplicateCount,
      invalidEntries: invalidCount,
      dataQualityScore: Math.min(100, Math.max(10, dataQualityScore)),
      validRowsCount,
      warningRowsCount: duplicateCount,
      invalidRowsCount: invalidCount,
      columns: headers,
      sampleRows: sampleParsedRows,
      validationIssues: issues
    };

    setUploadedValidationResult(result);
    addAuditLog(
      'Data Upload',
      datasetType,
      fileName,
      `CSV file processed (${rows.length} records, ${headers.length} columns). Quality score: ${result.dataQualityScore}%.`
    );

    return result;
  };

  const commitUploadedData = () => {
    if (!uploadedValidationResult) return;
    addAuditLog(
      'Data Validation',
      uploadedValidationResult.datasetType,
      uploadedValidationResult.fileName,
      `Private processing pipeline ingested ${uploadedValidationResult.validRowsCount} normalized records into laboratory sovereign memory.`
    );
  };

  const resetUpload = () => {
    setUploadedValidationResult(null);
  };

  // What-If Dynamic Calculation
  const calculatedSimulation = useMemo(() => {
    const baseVolume = 1248;
    const simVolume = Math.round(baseVolume * whatIf.volumeMultiplier);

    const extraWorkloadFactor = (whatIf.volumeMultiplier - 1.0) * 120;
    const staffReliefFactor = (1.0 - whatIf.staffAvailabilityMultiplier) * 80;
    const analyzerDownPenalty = whatIf.analyzerOffline ? 95 : 0;
    const projPending = Math.round(72 + extraWorkloadFactor + staffReliefFactor + analyzerDownPenalty);

    const baseMinutes = 138;
    const simMinutes = Math.round(baseMinutes * (whatIf.volumeMultiplier * 0.7 + (1 / whatIf.staffAvailabilityMultiplier) * 0.3) + (whatIf.analyzerOffline ? 65 : 0));
    const hours = Math.floor(simMinutes / 60);
    const mins = simMinutes % 60;
    const projectedAvgTAT = `${hours}h ${mins < 10 ? '0' : ''}${mins}m`;

    let bioLoad = Math.round(94 * whatIf.volumeMultiplier * (whatIf.analyzerOffline ? 1.45 : 1.0));
    bioLoad = Math.min(100, bioLoad);

    let burnoutDays = 4.1;
    if (whatIf.volumeMultiplier > 1.0) {
      burnoutDays = +(4.1 / whatIf.volumeMultiplier).toFixed(1);
    }
    if (whatIf.inventoryLevel === 'reduced') burnoutDays = +(burnoutDays * 0.6).toFixed(1);
    if (whatIf.inventoryLevel === 'increased') burnoutDays = +(burnoutDays * 1.8).toFixed(1);

    const overtimeHours = Math.max(0, Math.round(((simVolume - 1248) / 45) + (whatIf.staffAvailabilityMultiplier < 1 ? 16 : 0)));

    let bottleneck = 'Nominal Queue Flow';
    if (whatIf.analyzerOffline && whatIf.volumeMultiplier >= 1.25) {
      bottleneck = 'CRITICAL: Severe Biochemistry analyzer bottleneck & STAT queue failure';
    } else if (whatIf.analyzerOffline) {
      bottleneck = 'HIGH RISK: Secondary stations overloaded; routine TAT prolonged';
    } else if (whatIf.volumeMultiplier >= 1.25) {
      bottleneck = 'WARNING: Reagent stock depletion accelerated; overtime mandatory';
    }

    return {
      simulatedTestVolume: simVolume,
      projectedPendingTests: projPending,
      projectedAvgTAT,
      biochemistryLoadPercent: bioLoad,
      inventoryBurnoutDays: burnoutDays,
      overtimeHoursRequired: overtimeHours,
      bottleneckFlag: bottleneck
    };
  }, [whatIf]);

  // Demo Walkthrough
  const startDemoMode = () => {
    setDemoModeActive(true);
    setDemoStep(1);
    setActiveTab('dashboard');
  };

  const nextDemoStep = () => {
    if (demoStep >= 7) {
      setDemoModeActive(false);
      return;
    }
    const next = demoStep + 1;
    setDemoStep(next);

    if (next === 1) setActiveTab('dashboard');
    else if (next === 2) setActiveTab('risk-center');
    else if (next === 3) setActiveTab('recommendations');
    else if (next === 4) setActiveTab('recommendations');
    else if (next === 5) setActiveTab('what-if');
    else if (next === 6) setActiveTab('copilot');
    else if (next === 7) setActiveTab('control-center');
  };

  const prevDemoStep = () => {
    if (demoStep <= 1) return;
    const prev = demoStep - 1;
    setDemoStep(prev);
    if (prev === 1) setActiveTab('dashboard');
    else if (prev === 2) setActiveTab('risk-center');
    else if (prev === 3) setActiveTab('recommendations');
    else if (prev === 4) setActiveTab('recommendations');
    else if (prev === 5) setActiveTab('what-if');
    else if (prev === 6) setActiveTab('copilot');
    else if (prev === 7) setActiveTab('control-center');
  };

  const exitDemoMode = () => {
    setDemoModeActive(false);
  };

  const demoProgressPhase = useMemo((): 'DATA' | 'INSIGHT' | 'RISK' | 'EVIDENCE' | 'ACTION' => {
    if (demoStep === 1) return 'DATA';
    if (demoStep === 2) return 'RISK';
    if (demoStep === 3) return 'EVIDENCE';
    if (demoStep === 4) return 'ACTION';
    if (demoStep === 5) return 'INSIGHT';
    if (demoStep === 6) return 'EVIDENCE';
    return 'ACTION';
  }, [demoStep]);

  return (
    <LabDataContext.Provider
      value={{
        activeRole,
        setActiveRole,
        activeTab,
        setActiveTab,
        patients,
        orders,
        tests,
        results,
        inventory,
        equipment,
        staff,
        suppliers,
        billing,
        auditLog,
        risks,
        recommendations,
        notifications,
        dataSources,
        syncJobs,
        doctors,
        appointments,
        pharmacyMedicines,
        prescriptions,
        pharmacyBills,
        pharmacyDeliveries,
        pharmacists,
        inspectTraceEntityId,
        inspectTraceModalOpen,
        openInspectTrace,
        closeInspectTrace,
        doctorAvailabilityModalOpen,
        openDoctorAvailabilityModal,
        closeDoctorAvailabilityModal,
        kpis,
        unreadAlertsCount,
        markNotificationRead,
        markAllNotificationsRead,
        systemHealth,
        environmentStatus,
        lastSyncTimestamp,
        telemetryMode,
        setTelemetryMode,
        refreshAllData,
        createPatient,
        updatePatient,
        deletePatient,
        createTestOrder,
        updateOrderStatus,
        createTestResult,
        verifyResult,
        createInventoryItem,
        restockInventoryItem,
        simulatedRestockItem: (itemId: string, quantityToAdd: number) => {
          restockInventoryItem(itemId, quantityToAdd);
        },
        createEquipment,
        scheduleEquipmentMaintenance,
        createStaff,
        createSupplier,
        createInvoice,
        executeRecommendation,
        resolveRisk,
        addAuditLog,
        updateDoctorStatus,
        createAppointment,
        updateAppointmentStatus,
        dispensePharmacy,
        restockPharmacyMedicine,
        updatePharmacyDeliveryStatus,
        createPrescription,
        syncIntegrationSource,
        testIntegrationConnection,
        toggleIntegrationStatus,
        uploadedValidationResult,
        processCSVUpload,
        commitUploadedData,
        resetUpload,
        whatIf,
        setWhatIf,
        calculatedSimulation,
        demoModeActive,
        demoStep,
        startDemoMode,
        nextDemoStep,
        prevDemoStep,
        exitDemoMode,
        demoProgressPhase
      }}
    >
      {children}
    </LabDataContext.Provider>
  );
};

export const useLabData = () => {
  const context = useContext(LabDataContext);
  if (!context) {
    throw new Error('useLabData must be used within a LabDataProvider');
  }
  return context;
};
