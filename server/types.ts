export type StaffRole = 'administrator' | 'lab_manager' | 'technician' | 'pathologist' | 'finance' | 'pharmacist';
export type UserRole = StaffRole | 'patient';

export type Priority = 'Routine' | 'Urgent' | 'STAT';

export type OrderStatus = 'Ordered' | 'Sample Collected' | 'Processing' | 'Completed' | 'Verified' | 'Released';

export type Department = 
  | 'Hematology' 
  | 'Biochemistry' 
  | 'Microbiology' 
  | 'Immunology' 
  | 'Pathology' 
  | 'Molecular Diagnostics';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  laboratoryId?: string;
}

export interface UserRecord extends BaseEntity {
  name: string;
  email: string;
  role: UserRole;
  department: string;
  lastLogin: string;
  status: 'Active' | 'Inactive';
  phone?: string;
  photoUrl?: string;
  employeeId?: string;
  uhid?: string;
  patientId?: string;
  password?: string;
  language?: 'en' | 'hi' | 'kn';
  permissions?: string[];
}

export interface DoctorRecord extends BaseEntity {
  doctorId: string;
  name: string;
  specialization: string;
  department: string;
  opdTiming: string;
  consultationRoom: string;
  status: 'ON DUTY' | 'AVAILABLE' | 'IN CONSULTATION' | 'IN PROCEDURE' | 'ON LEAVE' | 'OFF DUTY';
  availableSlots: string[];
  phone?: string;
  email?: string;
}

export interface AppointmentRecord extends BaseEntity {
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  room: string;
  status: 'REQUESTED' | 'CONFIRMED' | 'CHECKED-IN' | 'COMPLETED' | 'CANCELLED';
  reason?: string;
  tokenNumber: string;
}

export interface PharmacyDrugRecord extends BaseEntity {
  drugId: string;
  drugName: string;
  genericName: string;
  category: string;
  manufacturer: string;
  batchNumber: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  costPrice: number;
  sellingPrice: number;
  expiryDate: string;
  storageCondition: string;
  prescriptionRequired: boolean;
  supplier: string;
  status: 'IN STOCK' | 'LOW STOCK' | 'OUT OF STOCK' | 'EXPIRING SOON' | 'EXPIRED';
}

export interface PrescriptionItem {
  drugId?: string;
  drugName: string;
  dosageInstructions: string;
  quantity: number;
  unit: string;
  dispensedQuantity: number;
}

export interface PrescriptionRecord extends BaseEntity {
  prescriptionId: string;
  patientId: string;
  patientName: string;
  prescribingDoctor: string;
  date: string;
  medicines: PrescriptionItem[];
  prescriptionStatus: 'ACTIVE' | 'PARTIALLY DISPENSED' | 'DISPENSED' | 'CANCELLED';
  notes?: string;
  prescriptionRequired: boolean;
}

export interface PharmacyDispensingRecord extends BaseEntity {
  dispenseId: string;
  billNumber: string;
  patientId: string;
  patientName: string;
  prescriptionId?: string;
  pharmacistId: string;
  pharmacistName: string;
  items: {
    drugId: string;
    drugName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  paymentStatus: 'PAID' | 'PENDING' | 'CANCELLED' | 'REFUNDED';
  dispenseDate: string;
}

export interface PharmacyBillRecord extends BaseEntity {
  billNumber: string;
  patientId: string;
  patientName: string;
  date: string;
  items: {
    drugId: string;
    drugName: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentStatus: 'PAID' | 'PENDING' | 'CANCELLED' | 'REFUNDED';
  paymentMethod: 'Cash' | 'UPI' | 'Card' | 'Corporate' | 'Insurance';
}

export interface PharmacyDeliveryRecord extends BaseEntity {
  orderId: string;
  patientId: string;
  patientName: string;
  address: string;
  contact: string;
  items: { drugName: string; quantity: number }[];
  deliveryType: 'HOME DELIVERY' | 'COUNTER PICKUP';
  deliveryStatus: 'ORDERED' | 'PACKED' | 'DISPATCHED' | 'OUT FOR DELIVERY' | 'DELIVERED' | 'CANCELLED';
  assignedDeliveryPerson?: string;
  estimatedDeliveryTime: string;
  totalAmount: number;
  orderedAt: string;
}

export interface PharmacistRecord extends BaseEntity {
  pharmacistId: string;
  name: string;
  employeeId: string;
  department: string;
  licenseNumber: string;
  shift: 'Morning' | 'Evening' | 'Night';
  status: 'ON DUTY' | 'OFF DUTY' | 'ON LEAVE' | 'AVAILABLE';
  phone: string;
  email: string;
}

export interface TraceStep {
  stage: 'Data Source' | 'Data Retrieved' | 'Validation' | 'Metrics Calculated' | 'Risk Detection' | 'Evidence Selected' | 'AI Processing' | 'Recommendation' | 'Final Output';
  timestamp: string;
  status: 'PASSED' | 'WARNING' | 'FAILED';
  input: string;
  output: string;
  source: string;
  relevantEntity: string;
  processingStage: string;
  details?: Record<string, any>;
}

export interface TraceRecord {
  traceId: string;
  timestamp: string;
  triggerEntityId: string;
  triggerEntityType: 'risk' | 'recommendation' | 'copilot' | 'order' | 'inventory';
  summary: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  failedStage?: string;
  steps: TraceStep[];
}

export interface LaboratoryRecord extends BaseEntity {
  name: string;
  licenseNumber: string;
  accreditation: string[];
  timezone: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
}

export interface PatientRecord extends BaseEntity {
  patientId: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  registrationDate: string;
  bloodGroup: string;
  referringDoctor: string;
  testsOrderedCount: number;
  lastVisit: string;
  status: 'Active' | 'Under Review' | 'Discharged';
}

export interface TestOrderRecord extends BaseEntity {
  orderId: string;
  patientId: string;
  patientName: string;
  testName: string;
  testId?: string;
  sampleType: 'Serum' | 'Whole Blood' | 'Plasma' | 'Urine' | 'Swab' | 'CSF';
  collectionTime: string;
  priority: Priority;
  department: Department;
  status: OrderStatus;
  expectedCompletion: string;
  actualCompletion?: string;
  assignedEquipment?: string;
}

export interface TestResultRecord extends BaseEntity {
  resultId: string;
  orderId: string;
  patientId: string;
  patientName: string;
  testName: string;
  resultValue: string;
  unit: string;
  referenceRange: string;
  flag: 'Normal' | 'High' | 'Low' | 'Critical' | 'Pending Verification';
  technician: string;
  verifier?: string;
  dateTime: string;
  status: 'Preliminary' | 'Verified' | 'Released';
  deltaFlag?: string;
}

export interface LaboratoryTestRecord extends BaseEntity {
  testId: string;
  testName: string;
  department: Department;
  sampleType: string;
  container: string;
  expectedTAT: string;
  price: number;
  cost: number;
  equipmentRequired: string;
  reagentRequirements: string;
  referenceRange: string;
  status: 'Active' | 'Temporarily Restricted' | 'Under Validation';
}

export interface InventoryRecord extends BaseEntity {
  itemId: string;
  itemName: string;
  category: 
    | 'Reagents' 
    | 'Test Kits' 
    | 'Sample Containers' 
    | 'Tubes' 
    | 'Needles' 
    | 'Gloves' 
    | 'Masks' 
    | 'PPE' 
    | 'Cleaning Supplies' 
    | 'Printer Supplies';
  supplier: string;
  batchNumber: string;
  quantity: number;
  unit: string;
  minimumStock: number;
  reorderLevel: number;
  expiryDate: string;
  storageCondition: string;
  unitCost: number;
  totalValue: number;
  status: 'Healthy Stock' | 'Low Stock' | 'Critical' | 'Expiring Soon' | 'Expired';
  weeklyConsumption: number;
  leadTimeDays: number;
}

export interface InventoryTransactionRecord extends BaseEntity {
  itemId: string;
  itemName: string;
  transactionType: 'consumption' | 'restock' | 'adjustment' | 'disposal';
  quantity: number;
  remainingQuantity: number;
  unit: string;
  testOrderId?: string;
  testName?: string;
  reason: string;
  conductedBy: string;
  timestamp: string;
}

export interface EquipmentRecord extends BaseEntity {
  equipmentId: string;
  name: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  location: string;
  department: Department;
  installationDate: string;
  lastMaintenance: string;
  nextMaintenance: string;
  operationalStatus: 'Operational' | 'Maintenance Due' | 'Under Maintenance' | 'Offline';
  utilizationPercent: number;
  temperature?: string;
  testsProcessed: number;
  downtimeHours: number;
}

export interface EquipmentMaintenanceRecord extends BaseEntity {
  equipmentId: string;
  equipmentName: string;
  maintenanceType: 'Preventive' | 'Corrective' | 'Calibration';
  scheduledDate: string;
  completedDate?: string;
  engineerName: string;
  notes: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Deferred';
  cost?: number;
}

export interface StaffRecord extends BaseEntity {
  staffId: string;
  name: string;
  role: 'Laboratory Technician' | 'Pathologist' | 'Microbiologist' | 'Phlebotomist' | 'Administrator' | 'Receptionist';
  department: Department;
  shift: 'Morning' | 'Evening' | 'Night';
  qualification: string;
  assignedEquipment: string;
  testsProcessed: number;
  workloadPercent: number;
  status: 'On Duty' | 'Off Duty' | 'On Leave';
  phone: string;
  email: string;
}

export interface SupplierRecord extends BaseEntity {
  supplierId: string;
  supplierName: string;
  category: string;
  contact: string;
  email: string;
  phone: string;
  products: string[];
  averageDeliveryDays: number;
  orderCount: number;
  pendingOrders: number;
  lastOrder: string;
  reliabilityScore: number;
  contractId: string;
}

export interface BillingRecord extends BaseEntity {
  invoiceId: string;
  patientId: string;
  patientName: string;
  tests: string;
  amount: number;
  discount: number;
  tax: number;
  totalAmount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Partial';
  paymentMethod: 'UPI' | 'Credit Card' | 'Cash' | 'Corporate Account' | 'Insurance';
  date: string;
  insuranceTPA?: string;
}

export interface AlertRecord extends BaseEntity {
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  entityType: 'Inventory' | 'Equipment' | 'TestOrder' | 'Result' | 'Staff' | 'System';
  entityId: string;
  timestamp: string;
  read: boolean;
  resolved: boolean;
}

export interface AIInsightRecord extends BaseEntity {
  title: string;
  summary: string;
  category: 'Inventory' | 'Workload' | 'Equipment' | 'Finance' | 'TAT';
  confidenceScore: number;
  timestamp: string;
  evidence: string[];
}

export interface RecommendationRecord extends BaseEntity {
  recId: string;
  title: string;
  problem: string;
  evidence: string;
  recommendedAction: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  expectedOperationalEffect: string;
  supportingData: Record<string, string | number>;
  actionLabel: string;
  executed: boolean;
  executedAt?: string;
}

export interface NotificationRecord extends BaseEntity {
  title: string;
  message: string;
  type: 'critical' | 'warning' | 'info';
  timestamp: string;
  read: boolean;
  linkTab?: string;
  relatedEntityId?: string;
}

export interface AuditLogRecord extends BaseEntity {
  auditId: string;
  timestamp: string;
  userId: string;
  user: string;
  role: string;
  action: 
    | 'Login' 
    | 'Logout'
    | 'Data Upload' 
    | 'Data Validation' 
    | 'AI Analysis' 
    | 'Recommendation Generated' 
    | 'Recommendation Executed'
    | 'Patient Record Access' 
    | 'CREATE_PATIENT'
    | 'UPDATE_PATIENT'
    | 'DELETE_PATIENT'
    | 'CREATE_TEST_ORDER'
    | 'UPDATE_TEST_ORDER'
    | 'STATUS_CHANGED'
    | 'Result Verification' 
    | 'Inventory Update' 
    | 'UPDATE_INVENTORY'
    | 'RESTOCK_INVENTORY'
    | 'CONSUME_INVENTORY'
    | 'Equipment Update' 
    | 'UPDATE_EQUIPMENT'
    | 'SCHEDULE_MAINTENANCE'
    | 'CREATE_STAFF'
    | 'UPDATE_STAFF'
    | 'CREATE_SUPPLIER'
    | 'UPDATE_SUPPLIER'
    | 'CREATE_INVOICE'
    | 'UPDATE_INVOICE'
    | 'Settings Change'
    | 'Sovereign Policy Check'
    | 'DATA_SYNC_COMPLETED'
    | 'DATA_SYNC_FAILED'
    | 'INTEGRATION_CONNECTED'
    | 'INTEGRATION_DISCONNECTED'
    | 'LOGIN'
    | 'LOGOUT'
    | 'PROFILE_UPDATE'
    | 'ROLE_CHANGE'
    | 'APPOINTMENT_CREATED'
    | 'APPOINTMENT_UPDATED'
    | 'PRESCRIPTION_CREATED'
    | 'PHARMACY_DISPENSED'
    | 'PHARMACY_RESTOCKED'
    | 'PHARMACY_DELIVERY_UPDATED';
  dataset: string;
  recordAffected: string;
  status: 'Authorized' | 'Audited' | 'Restricted' | 'Completed' | 'Failed';
  details: string;
  before?: Record<string, any>;
  after?: Record<string, any>;
  source?: string;
  integrityHash: string;
}

export interface DataSourceRecord extends BaseEntity {
  laboratoryName: string;
  sourceName: string;
  integrationType: 'REST API' | 'JSON Feed' | 'CSV Upload' | 'Webhook' | 'HL7 Feed' | 'FHIR API';
  endpointUrl: string;
  authType: 'Bearer Token' | 'API Key' | 'Basic Auth' | 'Mutual TLS' | 'None';
  frequencyMinutes: number;
  enabledDataTypes: string[];
  status: 'CONNECTED' | 'SYNCING' | 'SYNCED' | 'WARNING' | 'DISCONNECTED' | 'ERROR';
  lastSuccessfulSync?: string;
  nextScheduledSync?: string;
  recordsReceived: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsRejected: number;
  validationErrors: string[];
}

export interface SyncJobRecord extends BaseEntity {
  sourceId: string;
  sourceName: string;
  startTime: string;
  endTime?: string;
  recordsProcessed: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsRejected: number;
  errors: string[];
  status: 'In Progress' | 'Completed' | 'Failed' | 'Paused';
  trigger: 'manual' | 'scheduled' | 'telemetry';
}

export interface SettingsRecord extends BaseEntity {
  laboratoryName: string;
  licenseNumber: string;
  autoReorderEnabled: boolean;
  tatThresholdMinutes: number;
  privateProcessingMode: boolean;
  telemetryMode: 'LIVE' | 'DEMO';
  auditHashChaining: boolean;
  retentionDays: number;
  maxDailyOrdersCapacity: number;
}
