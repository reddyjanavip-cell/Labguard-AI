import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { EventEmitter } from 'events';
import {
  UserRecord,
  LaboratoryRecord,
  PatientRecord,
  TestOrderRecord,
  TestResultRecord,
  LaboratoryTestRecord,
  InventoryRecord,
  InventoryTransactionRecord,
  EquipmentRecord,
  EquipmentMaintenanceRecord,
  StaffRecord,
  SupplierRecord,
  BillingRecord,
  AlertRecord,
  AIInsightRecord,
  RecommendationRecord,
  NotificationRecord,
  AuditLogRecord,
  DataSourceRecord,
  SyncJobRecord,
  SettingsRecord,
  DoctorRecord,
  AppointmentRecord,
  PharmacyDrugRecord,
  PrescriptionRecord,
  PharmacyDispensingRecord,
  PharmacyBillRecord,
  PharmacyDeliveryRecord,
  PharmacistRecord
} from './types';

import {
  getDefaultDoctors,
  getDefaultAppointments,
  getDefaultPharmacyMedicines,
  getDefaultPrescriptions,
  getDefaultDispensing,
  getDefaultPharmacyBills,
  getDefaultDeliveries,
  getDefaultPharmacists,
  getDefaultStaffUsers
} from './seeds';

import {
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
} from '../src/data/mockData';

export interface DatabaseSchema {
  users: UserRecord[];
  laboratories: LaboratoryRecord[];
  patients: PatientRecord[];
  testOrders: TestOrderRecord[];
  testResults: TestResultRecord[];
  testCatalog: LaboratoryTestRecord[];
  inventory: InventoryRecord[];
  inventoryTransactions: InventoryTransactionRecord[];
  equipment: EquipmentRecord[];
  equipmentMaintenance: EquipmentMaintenanceRecord[];
  staff: StaffRecord[];
  suppliers: SupplierRecord[];
  billing: BillingRecord[];
  alerts: AlertRecord[];
  aiInsights: AIInsightRecord[];
  recommendations: RecommendationRecord[];
  notifications: NotificationRecord[];
  auditLogs: AuditLogRecord[];
  dataSources: DataSourceRecord[];
  syncJobs: SyncJobRecord[];
  settings: SettingsRecord;
  doctors: DoctorRecord[];
  appointments: AppointmentRecord[];
  pharmacyMedicines: PharmacyDrugRecord[];
  prescriptions: PrescriptionRecord[];
  pharmacyDispensing: PharmacyDispensingRecord[];
  pharmacyBills: PharmacyBillRecord[];
  pharmacyDeliveries: PharmacyDeliveryRecord[];
  pharmacists: PharmacistRecord[];
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'laboratory-db.json');

class DatabaseEngine extends EventEmitter {
  private db: DatabaseSchema;
  private saveTimeout: NodeJS.Timeout | null = null;
  private isSaving = false;
  private otpStore: Map<string, { code: string; expiresAt: number; attempts: number; lastRequestedAt: number; userType: string }> = new Map();

  constructor() {
    super();
    this.ensureDirectoryExists();
    this.db = this.loadOrSeedDatabase();
  }

  private ensureDirectoryExists() {
    if (!fs.existsSync(DB_DIR)) {
      try {
        fs.mkdirSync(DB_DIR, { recursive: true });
      } catch (err) {
        console.error('Failed to create DB directory:', err);
      }
    }
  }

  private generateHash(data: string, previousHash: string = ''): string {
    return crypto.createHash('sha256').update(data + previousHash).digest('hex');
  }

  private loadOrSeedDatabase(): DatabaseSchema {
    const now = new Date().toISOString();

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.patients && parsed.inventory && parsed.testOrders) {
          let modified = false;

          if (!parsed.doctors || parsed.doctors.length === 0) {
            parsed.doctors = getDefaultDoctors(now);
            modified = true;
          }
          if (!parsed.appointments || parsed.appointments.length === 0) {
            parsed.appointments = getDefaultAppointments(now);
            modified = true;
          }
          if (!parsed.pharmacyMedicines || parsed.pharmacyMedicines.length === 0) {
            parsed.pharmacyMedicines = getDefaultPharmacyMedicines(now);
            modified = true;
          }
          if (!parsed.prescriptions || parsed.prescriptions.length === 0) {
            parsed.prescriptions = getDefaultPrescriptions(now);
            modified = true;
          }
          if (!parsed.pharmacyDispensing) {
            parsed.pharmacyDispensing = getDefaultDispensing(now);
            modified = true;
          }
          if (!parsed.pharmacyBills) {
            parsed.pharmacyBills = getDefaultPharmacyBills(now);
            modified = true;
          }
          if (!parsed.pharmacyDeliveries || parsed.pharmacyDeliveries.length === 0) {
            parsed.pharmacyDeliveries = getDefaultDeliveries(now);
            modified = true;
          }
          if (!parsed.pharmacists || parsed.pharmacists.length === 0) {
            parsed.pharmacists = getDefaultPharmacists(now);
            modified = true;
          }

          // Ensure default users has all roles (including pharmacist and patient)
          const defaultUsers = getDefaultStaffUsers(now);
          for (const du of defaultUsers) {
            const existingIdx = parsed.users.findIndex((u: any) => u.email === du.email || u.id === du.id || (u.uhid && u.uhid === du.uhid));
            if (existingIdx === -1) {
              parsed.users.push(du);
              modified = true;
            } else {
              if (!parsed.users[existingIdx].password) {
                parsed.users[existingIdx].password = du.password;
                modified = true;
              }
              if (!parsed.users[existingIdx].language) {
                parsed.users[existingIdx].language = 'en';
                modified = true;
              }
              if (!parsed.users[existingIdx].photoUrl && du.photoUrl) {
                parsed.users[existingIdx].photoUrl = du.photoUrl;
                modified = true;
              }
              if (!parsed.users[existingIdx].employeeId && du.employeeId) {
                parsed.users[existingIdx].employeeId = du.employeeId;
                modified = true;
              }
              if (!parsed.users[existingIdx].phone && du.phone) {
                parsed.users[existingIdx].phone = du.phone;
                modified = true;
              }
            }
          }

          if (modified) {
            try {
              fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
              console.log('[DB] Upgraded persistent database schema with Doctors, Pharmacy, and Auth Accounts.');
            } catch (e) {
              console.error('[DB] Failed to save upgraded DB:', e);
            }
          }

          console.log(`[DB] Persistent laboratory database loaded successfully (${parsed.patients.length} patients, ${parsed.inventory.length} inventory lines, ${parsed.pharmacyMedicines.length} pharmacy medicines).`);
          return parsed;
        }
      } catch (err) {
        console.warn('[DB] Could not parse existing DB file. Re-initializing seed database.', err);
      }
    }

    console.log('[DB] Seeding new laboratory database with enterprise clinical dataset...');

    const users: UserRecord[] = getDefaultStaffUsers(now);

    const laboratories: LaboratoryRecord[] = [
      {
        id: 'LAB-NOVACARE',
        createdAt: now,
        updatedAt: now,
        name: 'NovaCare Diagnostics Laboratory',
        licenseNumber: 'CLIA-99D204981-NABH',
        accreditation: ['NABL ISO 15189:2022', 'CAP Accredited', 'NABH Certified'],
        timezone: 'Asia/Kolkata',
        address: 'Sector 44, Medical Diagnostic Tech Park, Bangalore 560100',
        contactEmail: 'labdirector@novacare.org',
        contactPhone: '+91 80 4910 8800'
      }
    ];

    const patients: PatientRecord[] = INITIAL_PATIENTS.map(p => ({
      ...p,
      id: p.patientId,
      createdAt: `${p.registrationDate}T08:30:00Z`,
      updatedAt: now,
      laboratoryId: 'LAB-NOVACARE'
    }));

    const testOrders: TestOrderRecord[] = INITIAL_ORDERS.map(o => ({
      ...o,
      id: o.orderId,
      createdAt: `${o.collectionTime.replace(' ', 'T')}:00Z`,
      updatedAt: now,
      laboratoryId: 'LAB-NOVACARE'
    }));

    const testResults: TestResultRecord[] = INITIAL_RESULTS.map(r => ({
      ...r,
      id: r.resultId,
      createdAt: `${r.dateTime.replace(' ', 'T')}:00Z`,
      updatedAt: now,
      laboratoryId: 'LAB-NOVACARE'
    }));

    const testCatalog: LaboratoryTestRecord[] = INITIAL_TESTS.map(t => ({
      ...t,
      id: t.testId,
      createdAt: now,
      updatedAt: now,
      laboratoryId: 'LAB-NOVACARE'
    }));

    const inventory: InventoryRecord[] = INITIAL_INVENTORY.map(i => ({
      ...i,
      id: i.itemId,
      createdAt: now,
      updatedAt: now,
      laboratoryId: 'LAB-NOVACARE'
    }));

    const inventoryTransactions: InventoryTransactionRecord[] = [
      {
        id: 'TXN-901',
        createdAt: now,
        updatedAt: now,
        itemId: 'INV-101',
        itemName: '25-OH Vitamin D Reagent Chemiluminescence Kit',
        transactionType: 'consumption',
        quantity: 4,
        remainingQuantity: 18,
        unit: 'Kits (100 tests/kit)',
        testOrderId: 'ORD-7023',
        testName: '25-Hydroxy Vitamin D',
        reason: 'Outpatient batch assay execution',
        conductedBy: 'Megha Sen, MSc',
        timestamp: '2026-09-23 09:15:00'
      },
      {
        id: 'TXN-900',
        createdAt: now,
        updatedAt: now,
        itemId: 'INV-102',
        itemName: 'Glucose Hexokinase Gen.3 Reagent Cassette',
        transactionType: 'consumption',
        quantity: 2,
        remainingQuantity: 45,
        unit: 'Cassettes (250 tests/ea)',
        testOrderId: 'ORD-7011',
        testName: 'Fasting Blood Glucose',
        reason: 'Routine fasting morning run',
        conductedBy: 'Ramesh Nair, BSc',
        timestamp: '2026-09-23 08:45:00'
      }
    ];

    const equipment: EquipmentRecord[] = INITIAL_EQUIPMENT.map(e => ({
      ...e,
      id: e.equipmentId,
      createdAt: now,
      updatedAt: now,
      serialNumber: `SN-${e.equipmentId}-2024`,
      location: `${e.department} Main Bay`,
      temperature: e.name.includes('Cobas') ? '37.1°C (Warning)' : '24.0°C (Nominal)',
      laboratoryId: 'LAB-NOVACARE'
    }));

    const equipmentMaintenance: EquipmentMaintenanceRecord[] = [
      {
        id: 'MAINT-01',
        createdAt: now,
        updatedAt: now,
        equipmentId: 'BIO-03',
        equipmentName: 'Roche Cobas 6000 Analyzer',
        maintenanceType: 'Preventive',
        scheduledDate: '2026-09-26',
        engineerName: 'Kunal Deshmukh (Roche Certified Field Engineer)',
        notes: 'Quarterly fluidics overhaul and photometer calibration',
        status: 'Scheduled',
        cost: 45000
      }
    ];

    const staff: StaffRecord[] = INITIAL_STAFF.map(s => ({
      ...s,
      id: s.staffId,
      createdAt: now,
      updatedAt: now,
      phone: `+91 98410 ${Math.floor(10000 + Math.random() * 90000)}`,
      email: `${s.name.toLowerCase().replace(/[^a-z]/g, '')}@novacare.org`,
      laboratoryId: 'LAB-NOVACARE'
    }));

    const suppliers: SupplierRecord[] = INITIAL_SUPPLIERS.map(s => ({
      ...s,
      id: s.supplierId,
      createdAt: now,
      updatedAt: now,
      email: `orders@${s.supplierName.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      phone: '+91 22 4589 1200',
      contractId: `CTR-${s.supplierId}-2026`,
      laboratoryId: 'LAB-NOVACARE'
    }));

    const billing: BillingRecord[] = INITIAL_BILLING.map(b => ({
      ...b,
      id: b.invoiceId,
      createdAt: `${b.date}T10:00:00Z`,
      updatedAt: now,
      totalAmount: b.amount - b.discount + b.tax,
      insuranceTPA: b.paymentMethod === 'Insurance' ? 'Star Health / Medvantage TPA' : undefined,
      laboratoryId: 'LAB-NOVACARE'
    }));

    const alerts: AlertRecord[] = [
      {
        id: 'ALT-01',
        createdAt: now,
        updatedAt: now,
        type: 'critical',
        severity: 'CRITICAL',
        title: 'Critical Inventory Shortage: Vitamin D Reagent',
        message: 'Current stock is 18 units (Threshold: 20 units). Depletion projected in 4.1 days with 4-day lead time.',
        entityType: 'Inventory',
        entityId: 'INV-101',
        timestamp: '2026-09-23 09:30',
        read: false,
        resolved: false
      },
      {
        id: 'ALT-02',
        createdAt: now,
        updatedAt: now,
        type: 'critical',
        severity: 'HIGH',
        title: 'Biochemistry Analyzer BIO-03 Thermal & Workload Overload',
        message: 'Cobas 6000 operating at 94% capacity with 38 pending tests and scheduled maintenance in 3 days.',
        entityType: 'Equipment',
        entityId: 'BIO-03',
        timestamp: '2026-09-23 09:15',
        read: false,
        resolved: false
      }
    ];

    const aiInsights: AIInsightRecord[] = [
      {
        id: 'INS-01',
        createdAt: now,
        updatedAt: now,
        title: 'Outpatient Vitamin D Testing Run Risk',
        summary: 'Depletion rate exceeds current vendor replenishment curve. Stockout imminent by September 27.',
        category: 'Inventory',
        confidenceScore: 98.4,
        timestamp: now,
        evidence: [
          'Physical stock: 18 units',
          'Threshold: 20 units',
          'Weekly burn: 31 units (~4.4 units/day)',
          'Vendor lead time: 4 days'
        ]
      }
    ];

    const recommendations: RecommendationRecord[] = INITIAL_RECOMMENDATIONS.map(r => ({
      ...r,
      id: r.recId,
      createdAt: now,
      updatedAt: now,
      executed: false
    }));

    const notifications: NotificationRecord[] = INITIAL_NOTIFICATIONS.map(n => ({
      ...n,
      id: n.id,
      createdAt: now,
      updatedAt: now
    }));

    let previousHash = 'GENESIS-BLOCK-LABGUARD-2026';
    const auditLogs: AuditLogRecord[] = INITIAL_AUDIT.map((a, idx) => {
      const hash = crypto.createHash('sha256').update(JSON.stringify(a) + previousHash).digest('hex');
      previousHash = hash;
      return {
        ...a,
        id: a.auditId,
        createdAt: now,
        updatedAt: now,
        userId: 'USR-01',
        action: a.action as any,
        integrityHash: hash
      };
    });

    const dataSources: DataSourceRecord[] = [
      {
        id: 'SRC-01',
        createdAt: now,
        updatedAt: now,
        laboratoryName: 'NovaCare Diagnostics Laboratory',
        sourceName: 'Sysmex XN-Series LIS Live Feeder',
        integrationType: 'HL7 Feed',
        endpointUrl: 'https://feeder.sysmex-cloud.internal/hl7/v2',
        authType: 'Mutual TLS',
        frequencyMinutes: 5,
        enabledDataTypes: ['Complete Blood Count', 'Hematology Differential', 'Platelet Indices'],
        status: 'CONNECTED',
        lastSuccessfulSync: '2026-09-23 10:25:00',
        nextScheduledSync: '2026-09-23 10:30:00',
        recordsReceived: 1248,
        recordsCreated: 312,
        recordsUpdated: 936,
        recordsRejected: 0,
        validationErrors: []
      },
      {
        id: 'SRC-02',
        createdAt: now,
        updatedAt: now,
        laboratoryName: 'NovaCare Diagnostics Laboratory',
        sourceName: 'Roche cobas IT Middleware',
        integrationType: 'REST API',
        endpointUrl: 'https://cobas-middleware.novacare.internal/api/v1/telemetry',
        authType: 'Bearer Token',
        frequencyMinutes: 5,
        enabledDataTypes: ['Biochemistry Assays', 'Analyzer Telemetry', 'Reagent Levels'],
        status: 'CONNECTED',
        lastSuccessfulSync: '2026-09-23 10:26:12',
        nextScheduledSync: '2026-09-23 10:31:12',
        recordsReceived: 856,
        recordsCreated: 144,
        recordsUpdated: 712,
        recordsRejected: 0,
        validationErrors: []
      },
      {
        id: 'SRC-03',
        createdAt: now,
        updatedAt: now,
        laboratoryName: 'NovaCare Diagnostics Laboratory',
        sourceName: 'Apollo & Max Hospital EMR FHIR Gateway',
        integrationType: 'FHIR API',
        endpointUrl: 'https://fhir.hospital-partner-network.in/r4/ServiceRequest',
        authType: 'Bearer Token',
        frequencyMinutes: 15,
        enabledDataTypes: ['Electronic Test Orders', 'Patient Demographics'],
        status: 'SYNCED',
        lastSuccessfulSync: '2026-09-23 10:15:00',
        nextScheduledSync: '2026-09-23 10:30:00',
        recordsReceived: 420,
        recordsCreated: 72,
        recordsUpdated: 348,
        recordsRejected: 0,
        validationErrors: []
      },
      {
        id: 'SRC-04',
        createdAt: now,
        updatedAt: now,
        laboratoryName: 'NovaCare Diagnostics Laboratory',
        sourceName: 'Abbott Supply Chain Link EDI',
        integrationType: 'JSON Feed',
        endpointUrl: 'https://edi.abbottdiagnostics.in/feed/reagents',
        authType: 'API Key',
        frequencyMinutes: 60,
        enabledDataTypes: ['Vendor Catalog', 'Lead Times', 'Reagent Lot Expiries'],
        status: 'WARNING',
        lastSuccessfulSync: '2026-09-23 09:00:00',
        nextScheduledSync: '2026-09-23 10:00:00',
        recordsReceived: 30,
        recordsCreated: 0,
        recordsUpdated: 29,
        recordsRejected: 1,
        validationErrors: ['Catalog item VD-2026-B884 has extended lead time alert from warehouse']
      }
    ];

    const syncJobs: SyncJobRecord[] = [
      {
        id: 'SYNC-801',
        createdAt: now,
        updatedAt: now,
        sourceId: 'SRC-01',
        sourceName: 'Sysmex XN-Series LIS Live Feeder',
        startTime: '2026-09-23 10:25:00',
        endTime: '2026-09-23 10:25:02',
        recordsProcessed: 1248,
        recordsCreated: 12,
        recordsUpdated: 1236,
        recordsRejected: 0,
        errors: [],
        status: 'Completed',
        trigger: 'scheduled'
      },
      {
        id: 'SYNC-800',
        createdAt: now,
        updatedAt: now,
        sourceId: 'SRC-02',
        sourceName: 'Roche cobas IT Middleware',
        startTime: '2026-09-23 10:26:12',
        endTime: '2026-09-23 10:26:15',
        recordsProcessed: 856,
        recordsCreated: 8,
        recordsUpdated: 848,
        recordsRejected: 0,
        errors: [],
        status: 'Completed',
        trigger: 'scheduled'
      }
    ];

    const settings: SettingsRecord = {
      id: 'SET-01',
      createdAt: now,
      updatedAt: now,
      laboratoryName: 'NovaCare Diagnostics Laboratory',
      licenseNumber: 'CLIA-99D204981-NABH',
      autoReorderEnabled: true,
      tatThresholdMinutes: 180,
      privateProcessingMode: true,
      telemetryMode: 'DEMO',
      auditHashChaining: true,
      retentionDays: 365,
      maxDailyOrdersCapacity: 1500
    };

    const initialDb: DatabaseSchema = {
      users,
      laboratories,
      patients,
      testOrders,
      testResults,
      testCatalog,
      inventory,
      inventoryTransactions,
      equipment,
      equipmentMaintenance,
      staff,
      suppliers,
      billing,
      alerts,
      aiInsights,
      recommendations,
      notifications,
      auditLogs,
      dataSources,
      syncJobs,
      settings,
      doctors: getDefaultDoctors(now),
      appointments: getDefaultAppointments(now),
      pharmacyMedicines: getDefaultPharmacyMedicines(now),
      prescriptions: getDefaultPrescriptions(now),
      pharmacyDispensing: getDefaultDispensing(now),
      pharmacyBills: getDefaultPharmacyBills(now),
      pharmacyDeliveries: getDefaultDeliveries(now),
      pharmacists: getDefaultPharmacists(now)
    };

    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
      console.log(`[DB] Database persisted to disk at ${DB_FILE}`);
    } catch (writeErr) {
      console.error('[DB] Failed to write initial seed DB to disk:', writeErr);
    }

    return initialDb;
  }

  public scheduleSave() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    this.saveTimeout = setTimeout(() => {
      this.persistToDisk();
    }, 300);
  }

  private persistToDisk() {
    if (this.isSaving) return;
    this.isSaving = true;
    try {
      const data = JSON.stringify(this.db, null, 2);
      fs.writeFileSync(DB_FILE, data, 'utf-8');
    } catch (err) {
      console.error('[DB] Error saving to disk:', err);
    } finally {
      this.isSaving = false;
    }
  }

  // Generic getter
  public getCollection<K extends keyof DatabaseSchema>(collection: K): DatabaseSchema[K] {
    return this.db[collection];
  }

  // Audit Log with SHA-256 Hash Chaining
  public logAudit(params: {
    userId?: string;
    user?: string;
    role?: string;
    action: AuditLogRecord['action'];
    dataset: string;
    recordAffected: string;
    status?: AuditLogRecord['status'];
    details: string;
    before?: Record<string, any>;
    after?: Record<string, any>;
    source?: string;
  }): AuditLogRecord {
    const now = new Date().toISOString();
    const lastLog = this.db.auditLogs[0];
    const prevHash = lastLog ? lastLog.integrityHash : 'GENESIS-BLOCK';

    const auditId = `AUD-${10000 + this.db.auditLogs.length + 1}`;
    const logData = {
      auditId,
      timestamp: now.replace('T', ' ').substring(0, 19),
      userId: params.userId || 'USR-01',
      user: params.user || 'Authorized Lab User',
      role: params.role || 'Lab Manager',
      action: params.action,
      dataset: params.dataset,
      recordAffected: params.recordAffected,
      status: params.status || 'Authorized',
      details: params.details,
      before: params.before,
      after: params.after,
      source: params.source || 'Internal LIS'
    };

    const integrityHash = this.generateHash(JSON.stringify(logData), prevHash);

    const fullRecord: AuditLogRecord = {
      ...logData,
      id: auditId,
      createdAt: now,
      updatedAt: now,
      integrityHash
    };

    this.db.auditLogs.unshift(fullRecord);
    this.emit('mutation', { collection: 'auditLogs', type: 'create', record: fullRecord });
    this.scheduleSave();
    return fullRecord;
  }

  // CRUD for Patients
  public createPatient(patientData: Omit<PatientRecord, 'id' | 'patientId' | 'createdAt' | 'updatedAt' | 'testsOrderedCount' | 'lastVisit' | 'registrationDate'> & { registrationDate?: string }, actor: { userId?: string; user?: string; role?: string }): PatientRecord {
    const now = new Date().toISOString();
    const patientId = `PT-${1000 + this.db.patients.length + 1}`;
    const newPatient: PatientRecord = {
      ...patientData,
      id: patientId,
      patientId,
      email: patientData.email || '',
      registrationDate: patientData.registrationDate || now.substring(0, 10),
      testsOrderedCount: 0,
      lastVisit: now.substring(0, 10),
      createdAt: now,
      updatedAt: now,
      laboratoryId: 'LAB-NOVACARE'
    };

    this.db.patients.unshift(newPatient);
    this.logAudit({
      ...actor,
      action: 'CREATE_PATIENT',
      dataset: 'Patients',
      recordAffected: patientId,
      details: `Registered new patient: ${newPatient.name} (${newPatient.age}y, ${newPatient.gender}, ${newPatient.bloodGroup})`,
      after: newPatient
    });

    this.emit('mutation', { collection: 'patients', type: 'create', record: newPatient });
    this.scheduleSave();
    return newPatient;
  }

  public updatePatient(patientId: string, updates: Partial<PatientRecord>, actor: { userId?: string; user?: string; role?: string }): PatientRecord | null {
    const idx = this.db.patients.findIndex(p => p.patientId === patientId || p.id === patientId);
    if (idx === -1) return null;

    const before = { ...this.db.patients[idx] };
    const now = new Date().toISOString();
    this.db.patients[idx] = {
      ...before,
      ...updates,
      updatedAt: now
    };
    const after = this.db.patients[idx];

    this.logAudit({
      ...actor,
      action: 'UPDATE_PATIENT',
      dataset: 'Patients',
      recordAffected: patientId,
      details: `Updated demographic/contact details for patient ${after.name}`,
      before,
      after
    });

    this.emit('mutation', { collection: 'patients', type: 'update', record: after });
    this.scheduleSave();
    return after;
  }

  public deletePatient(
    patientId: string, 
    actor: { userId?: string; user?: string; role?: string },
    options?: { force?: boolean; archive?: boolean }
  ): boolean {
    const idx = this.db.patients.findIndex(p => p.patientId === patientId || p.id === patientId);
    if (idx === -1) return false;

    const patient = this.db.patients[idx];

    // If archive option selected, perform soft-archive
    if (options?.archive) {
      patient.status = 'Discharged';
      patient.updatedAt = new Date().toISOString();
      this.logAudit({
        ...actor,
        action: 'UPDATE_PATIENT',
        dataset: 'Patients',
        recordAffected: patientId,
        details: `Archived/Discharged patient record: ${patient.name} due to active clinical continuity.`,
        before: patient,
        after: patient
      });
      this.emit('mutation', { collection: 'patients', type: 'update', record: patient });
      this.scheduleSave();
      return true;
    }

    // Check if there are active orders for this patient
    const activeOrders = this.db.testOrders.filter(o => o.patientId === patientId && o.status !== 'Released');
    if (activeOrders.length > 0) {
      if (!options?.force) {
        throw new Error(`Cannot delete patient ${patientId} with ${activeOrders.length} active unreleased test orders. Choose 'Archive Patient' or confirm force deletion.`);
      }
      // Force delete: mark active orders as Released/Cancelled
      const now = new Date().toISOString();
      for (const ord of activeOrders) {
        ord.status = 'Released';
        ord.updatedAt = now;
      }
    }

    const removed = this.db.patients.splice(idx, 1)[0];
    this.logAudit({
      ...actor,
      action: 'DELETE_PATIENT',
      dataset: 'Patients',
      recordAffected: patientId,
      details: `Archived/Removed patient record: ${removed.name}`,
      before: removed
    });

    this.emit('mutation', { collection: 'patients', type: 'delete', recordId: patientId });
    this.scheduleSave();
    return true;
  }

  // CRUD for Test Orders
  public createTestOrder(orderData: Omit<TestOrderRecord, 'id' | 'orderId' | 'createdAt' | 'updatedAt' | 'collectionTime' | 'expectedCompletion'>, actor: { userId?: string; user?: string; role?: string }): TestOrderRecord {
    const now = new Date().toISOString();
    const orderId = `ORD-${7000 + this.db.testOrders.length + 1}`;
    
    // Calculate expected completion time based on priority
    const tatHours = orderData.priority === 'STAT' ? 1 : orderData.priority === 'Urgent' ? 2 : 4;
    const completionDate = new Date(Date.now() + tatHours * 60 * 60 * 1000);
    const expectedCompletion = completionDate.toISOString().replace('T', ' ').substring(0, 16);

    const newOrder: TestOrderRecord = {
      ...orderData,
      id: orderId,
      orderId,
      collectionTime: now.replace('T', ' ').substring(0, 16),
      expectedCompletion,
      createdAt: now,
      updatedAt: now,
      laboratoryId: 'LAB-NOVACARE'
    };

    this.db.testOrders.unshift(newOrder);

    // Update patient's order count & last visit
    const patient = this.db.patients.find(p => p.patientId === newOrder.patientId);
    if (patient) {
      patient.testsOrderedCount = (patient.testsOrderedCount || 0) + 1;
      patient.lastVisit = now.substring(0, 10);
    }

    this.logAudit({
      ...actor,
      action: 'CREATE_TEST_ORDER',
      dataset: 'Test Orders',
      recordAffected: orderId,
      details: `Booked ${newOrder.priority} test order for ${newOrder.patientName}: ${newOrder.testName} (${newOrder.department})`,
      after: newOrder
    });

    this.emit('mutation', { collection: 'testOrders', type: 'create', record: newOrder });
    this.scheduleSave();
    return newOrder;
  }

  public updateTestOrderStatus(orderId: string, newStatus: TestOrderRecord['status'], actor: { userId?: string; user?: string; role?: string }, notes?: string): TestOrderRecord | null {
    const idx = this.db.testOrders.findIndex(o => o.orderId === orderId || o.id === orderId);
    if (idx === -1) return null;

    const before = { ...this.db.testOrders[idx] };
    const now = new Date().toISOString();
    const formattedNow = now.replace('T', ' ').substring(0, 16);

    const updates: Partial<TestOrderRecord> = {
      status: newStatus,
      updatedAt: now
    };

    if (newStatus === 'Completed' || newStatus === 'Verified' || newStatus === 'Released') {
      updates.actualCompletion = formattedNow;
    }

    this.db.testOrders[idx] = {
      ...before,
      ...updates
    };
    const after = this.db.testOrders[idx];

    // Trigger reagent consumption when moving to Processing or Completed if mapped
    if (newStatus === 'Processing' && before.status !== 'Processing') {
      this.consumeReagentsForTest(after.testName, after.orderId, actor);
    }

    this.logAudit({
      ...actor,
      action: 'STATUS_CHANGED',
      dataset: 'Test Orders',
      recordAffected: orderId,
      details: `Transitioned status: ${before.status} -> ${newStatus}. ${notes || ''}`,
      before,
      after
    });

    this.emit('mutation', { collection: 'testOrders', type: 'update', record: after });
    this.scheduleSave();
    return after;
  }

  private consumeReagentsForTest(testName: string, orderId: string, actor: { userId?: string; user?: string; role?: string }) {
    // Map tests to inventory reagents
    const mapping: Record<string, { itemId: string; quantity: number }> = {
      '25-Hydroxy Vitamin D': { itemId: 'INV-101', quantity: 1 },
      'Fasting Blood Glucose': { itemId: 'INV-102', quantity: 1 },
      'HbA1c (Glycated Hemoglobin)': { itemId: 'INV-103', quantity: 1 },
      'Complete Blood Count (CBC)': { itemId: 'INV-104', quantity: 1 },
      'Serum Ferritin': { itemId: 'INV-101', quantity: 1 }
    };

    const target = mapping[testName];
    if (target) {
      const invItem = this.db.inventory.find(i => i.itemId === target.itemId);
      if (invItem && invItem.quantity > 0) {
        invItem.quantity = Math.max(0, invItem.quantity - target.quantity);
        invItem.totalValue = invItem.quantity * invItem.unitCost;
        if (invItem.quantity <= invItem.minimumStock) {
          invItem.status = 'Critical';
        } else if (invItem.quantity <= invItem.reorderLevel) {
          invItem.status = 'Low Stock';
        }

        const txn: InventoryTransactionRecord = {
          id: `TXN-${900 + this.db.inventoryTransactions.length + 1}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          itemId: invItem.itemId,
          itemName: invItem.itemName,
          transactionType: 'consumption',
          quantity: target.quantity,
          remainingQuantity: invItem.quantity,
          unit: invItem.unit,
          testOrderId: orderId,
          testName,
          reason: `Automatic reagent deduction on test processing`,
          conductedBy: actor.user || 'LIS Auto-Engine',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
        this.db.inventoryTransactions.unshift(txn);
      }
    }
  }

  // CRUD for Inventory
  public createInventoryItem(itemData: Omit<InventoryRecord, 'id' | 'itemId' | 'createdAt' | 'updatedAt' | 'totalValue' | 'status'>, actor: { userId?: string; user?: string; role?: string }): InventoryRecord {
    const now = new Date().toISOString();
    const itemId = `INV-${100 + this.db.inventory.length + 1}`;
    const totalValue = itemData.quantity * itemData.unitCost;

    let status: InventoryRecord['status'] = 'Healthy Stock';
    if (itemData.quantity <= itemData.minimumStock) {
      status = 'Critical';
    } else if (itemData.quantity <= itemData.reorderLevel) {
      status = 'Low Stock';
    }

    const newItem: InventoryRecord = {
      ...itemData,
      id: itemId,
      itemId,
      totalValue,
      status,
      createdAt: now,
      updatedAt: now,
      laboratoryId: 'LAB-NOVACARE'
    };

    this.db.inventory.push(newItem);
    this.logAudit({
      ...actor,
      action: 'Inventory Update',
      dataset: 'Inventory',
      recordAffected: itemId,
      details: `Added new inventory line: ${newItem.itemName} (${newItem.quantity} ${newItem.unit})`,
      after: newItem
    });

    this.emit('mutation', { collection: 'inventory', type: 'create', record: newItem });
    this.scheduleSave();
    return newItem;
  }

  public restockInventoryItem(itemId: string, quantityToAdd: number, actor: { userId?: string; user?: string; role?: string }, poNumber?: string): InventoryRecord | null {
    const idx = this.db.inventory.findIndex(i => i.itemId === itemId || i.id === itemId);
    if (idx === -1) return null;

    const before = { ...this.db.inventory[idx] };
    const now = new Date().toISOString();
    const newQty = before.quantity + quantityToAdd;
    const newTotalVal = newQty * before.unitCost;

    let newStatus: InventoryRecord['status'] = 'Healthy Stock';
    if (newQty <= before.minimumStock) {
      newStatus = 'Critical';
    } else if (newQty <= before.reorderLevel) {
      newStatus = 'Low Stock';
    }

    this.db.inventory[idx] = {
      ...before,
      quantity: newQty,
      totalValue: newTotalVal,
      status: newStatus,
      updatedAt: now
    };
    const after = this.db.inventory[idx];

    // Record transaction
    const txn: InventoryTransactionRecord = {
      id: `TXN-${900 + this.db.inventoryTransactions.length + 1}`,
      createdAt: now,
      updatedAt: now,
      itemId: after.itemId,
      itemName: after.itemName,
      transactionType: 'restock',
      quantity: quantityToAdd,
      remainingQuantity: newQty,
      unit: after.unit,
      reason: `Replenishment order fulfilled ${poNumber ? `(PO: ${poNumber})` : ''}`,
      conductedBy: actor.user || 'Store Manager',
      timestamp: now.replace('T', ' ').substring(0, 19)
    };
    this.db.inventoryTransactions.unshift(txn);

    // If restocking Vitamin D, resolve recommendation REC-01
    if (itemId === 'INV-101') {
      const rec = this.db.recommendations.find(r => r.recId === 'REC-01');
      if (rec) {
        rec.executed = true;
        rec.executedAt = now;
      }
    }

    this.logAudit({
      ...actor,
      action: 'RESTOCK_INVENTORY',
      dataset: 'Inventory',
      recordAffected: itemId,
      details: `Restocked ${quantityToAdd} ${after.unit} for ${after.itemName}. Stock level: ${before.quantity} -> ${newQty}.`,
      before,
      after
    });

    this.emit('mutation', { collection: 'inventory', type: 'update', record: after });
    this.scheduleSave();
    return after;
  }

  // Verification for Test Results
  public verifyResult(resultId: string, verifierName: string, actor: { userId?: string; user?: string; role?: string }, comments?: string): TestResultRecord | null {
    const idx = this.db.testResults.findIndex(r => r.resultId === resultId || r.id === resultId);
    if (idx === -1) return null;

    const before = { ...this.db.testResults[idx] };
    const now = new Date().toISOString();

    this.db.testResults[idx] = {
      ...before,
      status: 'Verified',
      verifier: verifierName,
      updatedAt: now
    };
    const after = this.db.testResults[idx];

    // Also update parent test order if all results are verified
    const parentOrder = this.db.testOrders.find(o => o.orderId === after.orderId);
    if (parentOrder && parentOrder.status === 'Completed') {
      parentOrder.status = 'Verified';
      parentOrder.updatedAt = now;
    }

    this.logAudit({
      ...actor,
      action: 'Result Verification',
      dataset: 'Test Results',
      recordAffected: resultId,
      details: `Clinical sign-off for ${after.testName} (${after.resultValue} ${after.unit}) by ${verifierName}. ${comments || ''}`,
      before,
      after
    });

    this.emit('mutation', { collection: 'testResults', type: 'update', record: after });
    this.scheduleSave();
    return after;
  }

  // Equipment maintenance
  public scheduleMaintenance(equipmentId: string, scheduledDate: string, engineerName: string, notes: string, actor: { userId?: string; user?: string; role?: string }): EquipmentRecord | null {
    const idx = this.db.equipment.findIndex(e => e.equipmentId === equipmentId || e.id === equipmentId);
    if (idx === -1) return null;

    const before = { ...this.db.equipment[idx] };
    const now = new Date().toISOString();

    this.db.equipment[idx] = {
      ...before,
      nextMaintenance: scheduledDate,
      operationalStatus: 'Operational',
      updatedAt: now
    };
    const after = this.db.equipment[idx];

    const maintRecord: EquipmentMaintenanceRecord = {
      id: `MAINT-${10 + this.db.equipmentMaintenance.length + 1}`,
      createdAt: now,
      updatedAt: now,
      equipmentId: after.equipmentId,
      equipmentName: after.name,
      maintenanceType: 'Preventive',
      scheduledDate,
      engineerName,
      notes,
      status: 'Scheduled'
    };
    this.db.equipmentMaintenance.unshift(maintRecord);

    this.logAudit({
      ...actor,
      action: 'SCHEDULE_MAINTENANCE',
      dataset: 'Equipment',
      recordAffected: equipmentId,
      details: `Scheduled preventive maintenance on ${after.name} for ${scheduledDate} with ${engineerName}.`,
      before,
      after
    });

    this.emit('mutation', { collection: 'equipment', type: 'update', record: after });
    this.scheduleSave();
    return after;
  }

  // Data Sources / Integration Management
  public updateDataSourceStatus(sourceId: string, status: DataSourceRecord['status'], lastSync?: string): DataSourceRecord | null {
    const src = this.db.dataSources.find(s => s.id === sourceId);
    if (!src) return null;
    src.status = status;
    if (lastSync) src.lastSuccessfulSync = lastSync;
    src.updatedAt = new Date().toISOString();
    this.scheduleSave();
    return src;
  }

  // ==========================================
  // OTP AUTHENTICATION PROTOCOL
  // ==========================================
  public requestOTP(identifier: string, userType: 'staff' | 'patient'): { success: boolean; cooldownSeconds: number; error?: string; message?: string; mode?: string } {
    const cleanId = identifier.trim().toLowerCase();
    const now = Date.now();

    // Verify rate limit / cooldown (30 seconds)
    const existing = this.otpStore.get(cleanId);
    if (existing && (now - existing.lastRequestedAt) < 30000) {
      const wait = Math.ceil((30000 - (now - existing.lastRequestedAt)) / 1000);
      return {
        success: false,
        cooldownSeconds: wait,
        error: `Please wait ${wait} seconds before requesting a new OTP.`
      };
    }

    // Verify user exists in sovereign registry
    let targetUser: UserRecord | undefined;
    let targetPatient: PatientRecord | undefined;

    if (userType === 'staff') {
      targetUser = this.db.users.find(u => 
        u.role !== 'patient' && 
        (u.email.toLowerCase() === cleanId || 
         (u.employeeId && u.employeeId.toLowerCase() === cleanId) ||
         u.id.toLowerCase() === cleanId ||
         u.role.toLowerCase() === cleanId ||
         (cleanId === 'admin' && (u.role === 'administrator' || u.role === 'lab_manager')) ||
         (cleanId === 'manager' && u.role === 'lab_manager'))
      );

      // Also search staff directory
      if (!targetUser && this.db.staff) {
        const staffMem = this.db.staff.find(s => 
          s.staffId.toLowerCase() === cleanId || 
          s.name.toLowerCase().includes(cleanId) ||
          s.role.toLowerCase() === cleanId
        );
        if (staffMem) {
          targetUser = this.db.users.find(u => u.role.toLowerCase() === staffMem.role.toLowerCase()) || this.db.users[0];
        }
      }

      if (!targetUser) {
        return {
          success: false,
          cooldownSeconds: 0,
          error: 'No registered hospital staff found with this email, employee ID, or role alias.'
        };
      }
    } else {
      const rawDigits = identifier.replace(/[^0-9]/g, '');
      targetPatient = this.db.patients.find(p => 
        p.patientId.toLowerCase() === cleanId || 
        (p.id && p.id.toLowerCase() === cleanId) ||
        (rawDigits.length >= 4 && p.phone.replace(/[^0-9]/g, '').includes(rawDigits)) ||
        p.name.toLowerCase().includes(cleanId)
      );
      if (!targetPatient) {
        // Fallback to default patient if input is general
        if (cleanId === 'patient' || cleanId === 'pt' || cleanId === 'opd') {
          targetPatient = this.db.patients[0];
        } else {
          return {
            success: false,
            cooldownSeconds: 0,
            error: 'No patient record found matching this UHID or registered contact phone number.'
          };
        }
      }
    }

    // Generate crypto-random 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = now + 5 * 60 * 1000; // 5 minutes validity

    this.otpStore.set(cleanId, {
      code: otpCode,
      expiresAt,
      attempts: 0,
      lastRequestedAt: now,
      userType
    });

    const isDemo = (this.db.settings?.telemetryMode || 'DEMO') === 'DEMO';

    // In demo simulation mode, record notification in sovereign audit feed for transparency
    if (isDemo) {
      const notifId = `NOTIF-OTP-${Date.now().toString().slice(-4)}`;
      this.db.notifications.unshift({
        id: notifId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        laboratoryId: 'LAB-NOVACARE',
        type: 'info',
        title: `SMS OTP Gateway (${userType.toUpperCase()})`,
        message: `Authentication OTP for ${identifier}: ${otpCode}. Valid for 5 minutes.`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        read: false,
        linkTab: userType === 'patient' ? 'patient-portal' : 'dashboard'
      });
      this.emit('mutation', { collection: 'notifications', type: 'create', record: this.db.notifications[0] });
    }

    this.logAudit({
      userId: targetUser?.id || `PAT-${targetPatient?.patientId || 'UHID'}`,
      user: targetUser?.name || targetPatient?.name || identifier,
      role: targetUser?.role || 'patient',
      action: 'LOGIN',
      dataset: 'Auth & RBAC',
      recordAffected: identifier,
      details: `Dispatched 6-digit verification OTP to registered communication channel. Mode: ${isDemo ? 'DEMO SIMULATION' : 'LIVE GATEWAY'}`
    });

    return {
      success: true,
      cooldownSeconds: 30,
      mode: isDemo ? 'DEMO' : 'LIVE',
      message: `OTP dispatched to registered contact for ${identifier}. Valid for 5 minutes.`
    };
  }

  public verifyOTP(identifier: string, otp: string, userType: 'staff' | 'patient'): { success: boolean; user?: UserRecord; patient?: PatientRecord; error?: string } {
    const cleanId = identifier.trim().toLowerCase();
    const cleanOtp = otp.trim();
    const now = Date.now();

    const stored = this.otpStore.get(cleanId);
    if (!stored) {
      return {
        success: false,
        error: 'No active OTP request found for this identifier. Please request an OTP first.'
      };
    }

    if (now > stored.expiresAt) {
      this.otpStore.delete(cleanId);
      return {
        success: false,
        error: 'The OTP has expired. Please request a new verification code.'
      };
    }

    if (stored.attempts >= 4) {
      this.otpStore.delete(cleanId);
      return {
        success: false,
        error: 'Too many invalid attempts. For security reasons, please request a new OTP.'
      };
    }

    if (stored.code !== cleanOtp) {
      stored.attempts += 1;
      const remaining = 4 - stored.attempts;
      return {
        success: false,
        error: `Invalid OTP code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
      };
    }

    // OTP Verified! Clear stored code immediately
    this.otpStore.delete(cleanId);

    if (userType === 'staff') {
      const user = this.db.users.find(u => 
        u.role !== 'patient' && 
        (u.email.toLowerCase() === cleanId || (u.employeeId && u.employeeId.toLowerCase() === cleanId))
      );
      if (!user) {
        return { success: false, error: 'Staff user profile not found.' };
      }
      user.lastLogin = new Date().toISOString();
      this.logAudit({
        userId: user.id,
        user: user.name,
        role: user.role,
        action: 'LOGIN',
        dataset: 'Users',
        recordAffected: user.id,
        details: `Hospital staff logged in via verified OTP: ${user.name} (${user.role.toUpperCase()})`
      });
      this.scheduleSave();
      return { success: true, user };
    } else {
      const rawDigits = identifier.replace(/[^0-9]/g, '');
      const patient = this.db.patients.find(p => 
        p.patientId.toLowerCase() === cleanId || 
        (rawDigits.length >= 10 && p.phone.replace(/[^0-9]/g, '').endsWith(rawDigits.slice(-10)))
      );
      if (!patient) {
        return { success: false, error: 'Patient clinical record not found.' };
      }

      let user = this.db.users.find(u => u.patientId === patient.patientId || u.uhid === patient.patientId);
      const isoNow = new Date().toISOString();
      if (!user) {
        user = {
          id: `USR-${patient.patientId}`,
          name: patient.name,
          email: patient.email || `${patient.patientId.toLowerCase()}@patient.novacare.org`,
          role: 'patient',
          department: 'Outpatient (OPD)',
          lastLogin: isoNow,
          status: 'Active',
          uhid: patient.patientId,
          patientId: patient.patientId,
          phone: patient.phone,
          language: 'en',
          permissions: ['PATIENT_SELF_ACCESS'],
          createdAt: isoNow,
          updatedAt: isoNow
        };
        this.db.users.push(user);
      } else {
        user.lastLogin = isoNow;
      }

      this.logAudit({
        userId: user.id,
        user: patient.name,
        role: 'patient',
        action: 'LOGIN',
        dataset: 'Patients',
        recordAffected: patient.patientId,
        details: `Patient logged in via verified OTP: ${patient.name} (UHID: ${patient.patientId})`
      });
      this.scheduleSave();
      return { success: true, user, patient };
    }
  }

  // ==========================================
  // AUTHENTICATION & PROFILE METHODS
  // ==========================================
  public authenticateStaff(emailOrEmployeeId: string, password?: string): UserRecord | null {
    const cleanInput = emailOrEmployeeId.trim().toLowerCase();
    const user = this.db.users.find(u => 
      u.role !== 'patient' && 
      (u.email.toLowerCase() === cleanInput || (u.employeeId && u.employeeId.toLowerCase() === cleanInput))
    );

    if (!user) return null;

    // In this production prototype, verify password if user has password set
    if (user.password && password && user.password !== password) {
      return null;
    }

    user.lastLogin = new Date().toISOString();
    this.logAudit({
      userId: user.id,
      user: user.name,
      role: user.role,
      action: 'LOGIN',
      dataset: 'Users',
      recordAffected: user.id,
      details: `Staff authenticated successfully: ${user.name} (${user.role.toUpperCase()})`
    });

    this.scheduleSave();
    return user;
  }

  public authenticatePatient(uhidOrPatientId: string, phone: string, otp?: string): { user: UserRecord; patient: PatientRecord } | null {
    const cleanId = uhidOrPatientId.trim().toUpperCase();
    const cleanPhone = phone.replace(/[^0-9]/g, '');

    // Look for patient record
    const patient = this.db.patients.find(p => 
      p.patientId.toUpperCase() === cleanId || 
      p.phone.replace(/[^0-9]/g, '').endsWith(cleanPhone.slice(-10))
    );

    if (!patient) return null;

    // Find or create associated patient user record
    let user = this.db.users.find(u => u.patientId === patient.patientId || u.uhid === patient.patientId);
    const now = new Date().toISOString();

    if (!user) {
      user = {
        id: `USR-${patient.patientId}`,
        name: patient.name,
        email: patient.email || `${patient.patientId.toLowerCase()}@patient.novacare.org`,
        role: 'patient',
        department: 'Outpatient (OPD)',
        lastLogin: now,
        status: 'Active',
        uhid: patient.patientId,
        patientId: patient.patientId,
        phone: patient.phone,
        language: 'en',
        permissions: ['PATIENT_SELF_ACCESS'],
        createdAt: now,
        updatedAt: now
      };
      this.db.users.push(user);
    } else {
      user.lastLogin = now;
    }

    this.logAudit({
      userId: user.id,
      user: patient.name,
      role: 'patient',
      action: 'LOGIN',
      dataset: 'Patients',
      recordAffected: patient.patientId,
      details: `Patient logged into self-service portal: ${patient.name} (UHID: ${patient.patientId})`
    });

    this.scheduleSave();
    return { user, patient };
  }

  public updateUserProfile(
    userId: string,
    updates: Partial<UserRecord>,
    actor: { userId?: string; user?: string; role?: string }
  ): UserRecord | null {
    const idx = this.db.users.findIndex(u => u.id === userId || u.patientId === userId || u.employeeId === userId);
    if (idx === -1) return null;

    const before = { ...this.db.users[idx] };
    const now = new Date().toISOString();

    // Prevent non-administrators from escalating role
    const isSelf = actor.userId === before.id;
    const isAdmin = actor.role === 'administrator';
    const allowedRole = isAdmin ? (updates.role || before.role) : before.role;

    this.db.users[idx] = {
      ...before,
      name: updates.name ? updates.name.trim() : before.name,
      email: updates.email ? updates.email.trim() : before.email,
      phone: updates.phone !== undefined ? updates.phone : before.phone,
      photoUrl: updates.photoUrl !== undefined ? updates.photoUrl : before.photoUrl,
      language: updates.language || before.language || 'en',
      role: allowedRole,
      department: (isAdmin && updates.department) ? updates.department : before.department,
      updatedAt: now
    };

    const after = this.db.users[idx];

    // If this is a patient, also update the patient record
    if (after.patientId) {
      const pIdx = this.db.patients.findIndex(p => p.patientId === after.patientId);
      if (pIdx !== -1) {
        this.db.patients[pIdx].name = after.name;
        this.db.patients[pIdx].email = after.email;
        if (after.phone) this.db.patients[pIdx].phone = after.phone;
        this.db.patients[pIdx].updatedAt = now;
      }
    }

    this.logAudit({
      ...actor,
      action: 'PROFILE_UPDATE',
      dataset: 'Users',
      recordAffected: after.id,
      details: `User profile updated for ${after.name} (${after.role.toUpperCase()})`,
      before,
      after
    });

    this.emit('mutation', { collection: 'users', type: 'update', record: after });
    this.scheduleSave();
    return after;
  }

  // ==========================================
  // DOCTOR & OPD APPOINTMENT METHODS
  // ==========================================
  public updateDoctorStatus(doctorId: string, status: DoctorRecord['status'], actor: { userId?: string; user?: string; role?: string }): DoctorRecord | null {
    const doc = this.db.doctors.find(d => d.doctorId === doctorId || d.id === doctorId);
    if (!doc) return null;

    const before = { ...doc };
    doc.status = status;
    doc.updatedAt = new Date().toISOString();

    this.logAudit({
      ...actor,
      action: 'STATUS_CHANGED',
      dataset: 'Doctors',
      recordAffected: doc.doctorId,
      details: `Doctor availability changed for ${doc.name} to ${status}`,
      before,
      after: doc
    });

    this.emit('mutation', { collection: 'doctors', type: 'update', record: doc });
    this.scheduleSave();
    return doc;
  }

  public createAppointment(
    data: {
      patientId: string;
      patientName: string;
      doctorId: string;
      doctorName: string;
      department: string;
      date: string;
      time: string;
      room: string;
      reason?: string;
    },
    actor: { userId?: string; user?: string; role?: string }
  ): AppointmentRecord {
    const now = new Date().toISOString();
    const count = this.db.appointments.length + 1;
    const tokenNumber = `T-${count.toString().padStart(3, '0')}`;
    const appointmentId = `APT-2026-${(900 + count)}`;

    const newApt: AppointmentRecord = {
      id: `APT-${1000 + count}`,
      appointmentId,
      patientId: data.patientId,
      patientName: data.patientName,
      doctorId: data.doctorId,
      doctorName: data.doctorName,
      department: data.department,
      date: data.date,
      time: data.time,
      room: data.room,
      status: 'CONFIRMED',
      reason: data.reason || 'Routine OPD Consultation',
      tokenNumber,
      createdAt: now,
      updatedAt: now
    };

    this.db.appointments.unshift(newApt);

    this.logAudit({
      ...actor,
      action: 'APPOINTMENT_CREATED',
      dataset: 'Appointments',
      recordAffected: appointmentId,
      details: `OPD Appointment booked for ${data.patientName} with ${data.doctorName} on ${data.date} at ${data.time} (Token: ${tokenNumber})`
    });

    this.emit('mutation', { collection: 'appointments', type: 'create', record: newApt });
    this.scheduleSave();
    return newApt;
  }

  public updateAppointmentStatus(
    appointmentId: string,
    status: AppointmentRecord['status'],
    actor: { userId?: string; user?: string; role?: string }
  ): AppointmentRecord | null {
    const apt = this.db.appointments.find(a => a.appointmentId === appointmentId || a.id === appointmentId);
    if (!apt) return null;

    const before = { ...apt };
    apt.status = status;
    apt.updatedAt = new Date().toISOString();

    this.logAudit({
      ...actor,
      action: 'APPOINTMENT_UPDATED',
      dataset: 'Appointments',
      recordAffected: appointmentId,
      details: `Appointment status updated to ${status} for ${apt.patientName}`,
      before,
      after: apt
    });

    this.emit('mutation', { collection: 'appointments', type: 'update', record: apt });
    this.scheduleSave();
    return apt;
  }

  // ==========================================
  // PHARMACY METHODS
  // ==========================================
  public dispensePharmacy(
    data: {
      patientId: string;
      patientName: string;
      prescriptionId?: string;
      items: { drugId: string; quantity: number }[];
      pharmacistName?: string;
      discountPercent?: number;
      paymentMethod?: 'Cash' | 'UPI' | 'Card' | 'Corporate' | 'Insurance';
      deliveryType?: 'HOME DELIVERY' | 'COUNTER PICKUP';
      deliveryAddress?: string;
      contactPhone?: string;
    },
    actor: { userId?: string; user?: string; role?: string }
  ): { bill: PharmacyBillRecord; dispensing: PharmacyDispensingRecord; delivery?: PharmacyDeliveryRecord } {
    const now = new Date().toISOString();

    // Verify stock availability for each item
    for (const item of data.items) {
      const drug = this.db.pharmacyMedicines.find(d => d.drugId === item.drugId || d.id === item.drugId);
      if (!drug) {
        throw new Error(`Medicine not found in pharmacy database: ${item.drugId}`);
      }
      if (drug.quantity < item.quantity) {
        throw new Error(`Insufficient stock for ${drug.drugName}. Available: ${drug.quantity}, Requested: ${item.quantity}`);
      }
    }

    // Deduct stock and assemble line items
    const lineItems: any[] = [];
    let subtotal = 0;

    for (const item of data.items) {
      const drug = this.db.pharmacyMedicines.find(d => d.drugId === item.drugId || d.id === item.drugId)!;
      drug.quantity -= item.quantity;
      
      // Update status dynamically
      if (drug.quantity === 0) {
        drug.status = 'OUT OF STOCK';
      } else if (drug.quantity <= drug.reorderLevel) {
        drug.status = 'LOW STOCK';
      } else {
        drug.status = 'IN STOCK';
      }
      drug.updatedAt = now;

      const itemTotal = item.quantity * drug.sellingPrice;
      subtotal += itemTotal;

      lineItems.push({
        drugId: drug.drugId,
        drugName: drug.drugName,
        quantity: item.quantity,
        unitPrice: drug.sellingPrice,
        totalPrice: itemTotal,
        total: itemTotal
      });

      this.emit('mutation', { collection: 'pharmacyMedicines', type: 'update', record: drug });
    }

    const discountRate = (data.discountPercent || 0) / 100;
    const discount = Number((subtotal * discountRate).toFixed(2));
    const tax = Number(((subtotal - discount) * 0.05).toFixed(2)); // 5% GST on medicines
    const total = Number((subtotal - discount + tax).toFixed(2));

    const billNumber = `PH-BILL-${Date.now().toString().slice(-6)}`;
    const bill: PharmacyBillRecord = {
      id: `PB-${Date.now().toString().slice(-6)}`,
      billNumber,
      patientId: data.patientId,
      patientName: data.patientName,
      date: now.split('T')[0],
      items: lineItems,
      subtotal,
      discount,
      tax,
      total,
      paymentStatus: 'PAID',
      paymentMethod: data.paymentMethod || 'UPI',
      createdAt: now,
      updatedAt: now
    };
    this.db.pharmacyBills.unshift(bill);

    const dispensing: PharmacyDispensingRecord = {
      id: `DSP-${Date.now().toString().slice(-6)}`,
      dispenseId: `DSP-2026-${Date.now().toString().slice(-4)}`,
      billNumber,
      patientId: data.patientId,
      patientName: data.patientName,
      prescriptionId: data.prescriptionId,
      pharmacistId: actor.userId || 'PH-01',
      pharmacistName: data.pharmacistName || actor.user || 'Authorized Pharmacist',
      items: lineItems,
      subtotal,
      discount,
      tax,
      totalAmount: total,
      paymentStatus: 'PAID',
      dispenseDate: now.replace('T', ' ').substring(0, 19),
      createdAt: now,
      updatedAt: now
    };
    this.db.pharmacyDispensing.unshift(dispensing);

    // Update prescription if linked
    if (data.prescriptionId) {
      const rx = this.db.prescriptions.find(p => p.prescriptionId === data.prescriptionId || p.id === data.prescriptionId);
      if (rx) {
        let allDispensed = true;
        rx.medicines.forEach(m => {
          const dispensedItem = data.items.find(i => i.drugId === m.drugId);
          if (dispensedItem) {
            m.dispensedQuantity = (m.dispensedQuantity || 0) + dispensedItem.quantity;
          }
          if (m.dispensedQuantity < m.quantity) {
            allDispensed = false;
          }
        });
        rx.prescriptionStatus = allDispensed ? 'DISPENSED' : 'PARTIALLY DISPENSED';
        rx.updatedAt = now;
        this.emit('mutation', { collection: 'prescriptions', type: 'update', record: rx });
      }
    }

    // Create delivery order if home delivery requested
    let delivery: PharmacyDeliveryRecord | undefined;
    if (data.deliveryType === 'HOME DELIVERY' || data.deliveryAddress) {
      delivery = {
        id: `DEL-${Date.now().toString().slice(-6)}`,
        orderId: `ORD-DEL-${Date.now().toString().slice(-4)}`,
        patientId: data.patientId,
        patientName: data.patientName,
        address: data.deliveryAddress || 'Patient Registered Home Address',
        contact: data.contactPhone || '+91 98765 43210',
        items: lineItems.map(i => ({ drugName: i.drugName, quantity: i.quantity })),
        deliveryType: data.deliveryType || 'HOME DELIVERY',
        deliveryStatus: 'ORDERED',
        estimatedDeliveryTime: new Date(Date.now() + 3 * 3600 * 1000).toISOString().replace('T', ' ').substring(0, 16),
        totalAmount: total,
        orderedAt: now.replace('T', ' ').substring(0, 16),
        createdAt: now,
        updatedAt: now
      };
      this.db.pharmacyDeliveries.unshift(delivery);
      this.emit('mutation', { collection: 'pharmacyDeliveries', type: 'create', record: delivery });
    }

    this.logAudit({
      ...actor,
      action: 'PHARMACY_DISPENSED',
      dataset: 'Pharmacy',
      recordAffected: billNumber,
      details: `Dispensed ${data.items.length} medicines for ${data.patientName}. Total Bill: ₹${total} (${bill.paymentMethod})`
    });

    this.scheduleSave();
    return { bill, dispensing, delivery };
  }

  public restockPharmacyMedicine(
    drugId: string,
    quantity: number,
    actor: { userId?: string; user?: string; role?: string },
    poNumber?: string
  ): PharmacyDrugRecord {
    const drug = this.db.pharmacyMedicines.find(d => d.drugId === drugId || d.id === drugId);
    if (!drug) {
      throw new Error(`Medicine not found: ${drugId}`);
    }

    const before = { ...drug };
    const now = new Date().toISOString();

    drug.quantity += quantity;
    if (drug.quantity > drug.reorderLevel) {
      drug.status = 'IN STOCK';
    } else if (drug.quantity > 0) {
      drug.status = 'LOW STOCK';
    }
    drug.updatedAt = now;

    this.logAudit({
      ...actor,
      action: 'PHARMACY_RESTOCKED',
      dataset: 'Pharmacy',
      recordAffected: drug.drugId,
      details: `Restocked ${quantity} ${drug.unit} of ${drug.drugName}. Previous: ${before.quantity}, New: ${drug.quantity}. PO: ${poNumber || 'PO-AUTO-RESTOCK'}`,
      before,
      after: drug
    });

    this.emit('mutation', { collection: 'pharmacyMedicines', type: 'update', record: drug });
    this.scheduleSave();
    return drug;
  }

  public updatePharmacyDeliveryStatus(
    orderId: string,
    status: PharmacyDeliveryRecord['deliveryStatus'],
    actor: { userId?: string; user?: string; role?: string }
  ): PharmacyDeliveryRecord | null {
    const del = this.db.pharmacyDeliveries.find(d => d.orderId === orderId || d.id === orderId);
    if (!del) return null;

    const before = { ...del };
    del.deliveryStatus = status;
    del.updatedAt = new Date().toISOString();

    this.logAudit({
      ...actor,
      action: 'PHARMACY_DELIVERY_UPDATED',
      dataset: 'Pharmacy Delivery',
      recordAffected: orderId,
      details: `Delivery status updated to ${status} for Order ${orderId} (${del.patientName})`,
      before,
      after: del
    });

    this.emit('mutation', { collection: 'pharmacyDeliveries', type: 'update', record: del });
    this.scheduleSave();
    return del;
  }
}

export const dbEngine = new DatabaseEngine();

