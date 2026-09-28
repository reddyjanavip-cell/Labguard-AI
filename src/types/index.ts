export type StaffRole = 'administrator' | 'lab_manager' | 'technician' | 'pathologist' | 'finance' | 'pharmacist';
export type UserRole = StaffRole | 'patient';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  phone?: string;
  photoUrl?: string;
  employeeId?: string;
  uhid?: string;
  patientId?: string;
  language: 'en' | 'hi' | 'kn';
  permissions: string[];
}

export type Priority = 'Routine' | 'Urgent' | 'STAT';

export type OrderStatus = 'Ordered' | 'Sample Collected' | 'Processing' | 'Completed' | 'Verified' | 'Released';

export type Department = 
  | 'Hematology' 
  | 'Biochemistry' 
  | 'Microbiology' 
  | 'Immunology' 
  | 'Pathology' 
  | 'Molecular Diagnostics';

export interface Patient {
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

export interface TestOrder {
  orderId: string;
  patientId: string;
  patientName: string;
  testName: string;
  sampleType: 'Serum' | 'Whole Blood' | 'Plasma' | 'Urine' | 'Swab' | 'CSF';
  collectionTime: string;
  priority: Priority;
  department: Department;
  status: OrderStatus;
  expectedCompletion: string;
  actualCompletion?: string;
  assignedEquipment?: string;
}

export interface LaboratoryTest {
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

export interface ResultRecord {
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
}

export interface InventoryItem {
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

export interface EquipmentRecord {
  equipmentId: string;
  name: string;
  manufacturer: string;
  model: string;
  department: Department;
  installationDate: string;
  lastMaintenance: string;
  nextMaintenance: string;
  operationalStatus: 'Operational' | 'Maintenance Due' | 'Under Maintenance' | 'Offline';
  utilizationPercent: number;
  testsProcessed: number;
  downtimeHours: number;
}

export interface StaffRecord {
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
}

export interface SupplierRecord {
  supplierId: string;
  supplierName: string;
  category: string;
  contact: string;
  products: string[];
  averageDeliveryDays: number;
  orderCount: number;
  pendingOrders: number;
  lastOrder: string;
  reliabilityScore: number;
}

export interface BillingRecord {
  invoiceId: string;
  patientId: string;
  patientName: string;
  tests: string;
  amount: number;
  discount: number;
  tax: number;
  paymentStatus: 'Paid' | 'Pending' | 'Partial';
  paymentMethod: 'UPI' | 'Credit Card' | 'Cash' | 'Corporate Account' | 'Insurance';
  date: string;
}

export interface AuditRecord {
  auditId: string;
  timestamp: string;
  user: string;
  role: string;
  action: 
    | 'Login' 
    | 'Data Upload' 
    | 'Data Validation' 
    | 'AI Analysis' 
    | 'Recommendation Generated' 
    | 'Patient Record Access' 
    | 'Result Verification' 
    | 'Inventory Update' 
    | 'Equipment Update' 
    | 'Settings Change'
    | 'Sovereign Policy Check';
  dataset: string;
  recordAffected: string;
  status: 'Authorized' | 'Audited' | 'Restricted' | 'Completed';
  details: string;
}

export interface AIRisk {
  riskId: string;
  title: string;
  level: 'critical' | 'high' | 'medium' | 'low';
  category: 'Inventory' | 'Operational' | 'Maintenance' | 'Quality' | 'Supply Chain';
  description: string;
  evidence: {
    currentStock?: number;
    weeklyUsage?: number;
    reorderThreshold?: number;
    leadTimeDays?: number;
    utilizationPercent?: number;
    pendingWorkload?: number;
    daysRemaining?: number;
    itemOrEntity?: string;
  };
  reason: string;
  recommendation: string;
  actionLabel: string;
  actionType: 'restock' | 'rebalance' | 'schedule_maintenance' | 'verify_samples';
  confidence: number;
  factors: string[];
}

export interface AIRecommendation {
  recId: string;
  title: string;
  problem: string;
  evidence: string;
  recommendedAction: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  expectedOperationalEffect: string;
  supportingData: Record<string, string | number>;
  actionLabel: string;
  executed?: boolean;
}

export interface LabNotification {
  id: string;
  title: string;
  message: string;
  type: 'critical' | 'warning' | 'info';
  timestamp: string;
  read: boolean;
  linkTab?: string;
}

export interface CSVValidationResult {
  fileName: string;
  datasetType: string;
  recordsDetected: number;
  columnsDetected: number;
  missingValues: number;
  duplicateRecords: number;
  invalidEntries: number;
  dataQualityScore: number;
  validRowsCount: number;
  warningRowsCount: number;
  invalidRowsCount: number;
  columns: string[];
  sampleRows: Record<string, any>[];
  validationIssues: {
    row: number;
    column: string;
    issue: string;
    severity: 'error' | 'warning';
    recommendation: string;
  }[];
}

export interface DataSource {
  id: string;
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

export interface SyncJob {
  id: string;
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

export interface SystemHealthState {
  overall: 'HEALTHY' | 'WARNING' | 'ERROR';
  components: {
    database: { status: 'HEALTHY' | 'WARNING' | 'ERROR'; provider: string; path: string };
    authentication: { status: 'HEALTHY' | 'WARNING' | 'ERROR'; provider: string; activeRole: string };
    aiService: { status: 'HEALTHY' | 'WARNING' | 'ERROR'; provider: string; model: string };
    externalIntegrations: { status: 'HEALTHY' | 'WARNING' | 'ERROR'; activeSourcesCount: number; totalSources: number };
    realTimeSync: { status: 'HEALTHY' | 'WARNING' | 'ERROR'; mode: 'LIVE' | 'DEMO'; pushEngine: string };
  };
  timestamp: string;
}

export interface DoctorRecord {
  id: string;
  doctorId: string;
  name: string;
  specialization: string;
  department: string;
  opdTiming: string;
  opdTimings?: string;
  consultationRoom: string;
  roomNumber?: string;
  currentQueueCount?: number;
  status: 'ON DUTY' | 'AVAILABLE' | 'IN CONSULTATION' | 'IN PROCEDURE' | 'ON LEAVE' | 'OFF DUTY';
  availableSlots: string[];
  phone?: string;
  email?: string;
}

export interface AppointmentRecord {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  timeSlot?: string;
  room: string;
  consultationType?: string;
  status: 'REQUESTED' | 'CONFIRMED' | 'CHECKED-IN' | 'CHECKED IN' | 'IN PROGRESS' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  reason?: string;
  tokenNumber: string;
  createdAt: string;
}

export interface PharmacyDrugRecord {
  id: string;
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
  unitPrice?: number;
  dosageForm?: string;
  strength?: string;
  expiryDate: string;
  storageCondition: string;
  prescriptionRequired: boolean;
  supplier: string;
  status: 'IN STOCK' | 'LOW STOCK' | 'OUT OF STOCK' | 'EXPIRING SOON' | 'EXPIRED';
  stockStatus?: 'IN STOCK' | 'LOW STOCK' | 'OUT OF STOCK' | 'EXPIRING SOON' | 'EXPIRED';
}

export interface PrescriptionItem {
  drugId?: string;
  drugName: string;
  dosageInstructions: string;
  dosage?: string;
  duration?: string;
  quantity: number;
  unit: string;
  dispensedQuantity: number;
}

export interface PrescriptionRecord {
  id: string;
  prescriptionId: string;
  patientId: string;
  patientName: string;
  prescribingDoctor: string;
  doctorName?: string;
  department?: string;
  date: string;
  medicines: PrescriptionItem[];
  prescriptionStatus: 'ACTIVE' | 'PARTIALLY DISPENSED' | 'DISPENSED' | 'CANCELLED';
  notes?: string;
  prescriptionRequired: boolean;
}

export interface PharmacyDispensingRecord {
  id: string;
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

export interface PharmacyBillRecord {
  id: string;
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

export interface PharmacyDeliveryRecord {
  id: string;
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

export interface PharmacistRecord {
  id: string;
  pharmacistId: string;
  name: string;
  employeeId: string;
  department: string;
  licenseNumber: string;
  shift: 'Morning' | 'Evening' | 'Night';
  status: 'ON DUTY' | 'OFF DUTY' | 'ON LEAVE';
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
