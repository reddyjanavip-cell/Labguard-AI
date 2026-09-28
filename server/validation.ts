import { z } from 'zod';

export const patientSchema = z.object({
  name: z.string().min(2, 'Patient name must be at least 2 characters'),
  age: z.number().int().min(0).max(130, 'Age must be between 0 and 130'),
  gender: z.enum(['Male', 'Female', 'Other']),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  email: z.string().default(''),
  bloodGroup: z.string().min(1, 'Blood group is required'),
  referringDoctor: z.string().min(2, 'Referring doctor is required'),
  status: z.enum(['Active', 'Under Review', 'Discharged']).default('Active')
});

export const testOrderSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  patientName: z.string().min(1, 'Patient name is required'),
  testName: z.string().min(1, 'Test name is required'),
  testId: z.string().optional(),
  sampleType: z.enum(['Serum', 'Whole Blood', 'Plasma', 'Urine', 'Swab', 'CSF']),
  priority: z.enum(['Routine', 'Urgent', 'STAT']),
  department: z.enum(['Hematology', 'Biochemistry', 'Microbiology', 'Immunology', 'Pathology', 'Molecular Diagnostics']),
  status: z.enum(['Ordered', 'Sample Collected', 'Processing', 'Completed', 'Verified', 'Released']).default('Ordered'),
  assignedEquipment: z.string().optional()
});

export const orderStatusTransitionSchema = z.object({
  status: z.enum(['Ordered', 'Sample Collected', 'Processing', 'Completed', 'Verified', 'Released']),
  notes: z.string().optional()
});

export const testResultVerificationSchema = z.object({
  verifier: z.string().min(2, 'Verifier name is required'),
  comments: z.string().optional()
});

export const testResultCreateSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  patientId: z.string().min(1, 'Patient ID is required'),
  patientName: z.string().min(1, 'Patient name is required'),
  testName: z.string().min(1, 'Test name is required'),
  resultValue: z.string().min(1, 'Result value is required'),
  unit: z.string().default(''),
  referenceRange: z.string().default(''),
  flag: z.enum(['Normal', 'High', 'Low', 'Critical', 'Pending Verification']).default('Normal'),
  technician: z.string().min(1, 'Technician name is required')
});

export const inventoryItemSchema = z.object({
  itemName: z.string().min(2, 'Item name is required'),
  category: z.enum([
    'Reagents',
    'Test Kits',
    'Sample Containers',
    'Tubes',
    'Needles',
    'Gloves',
    'Masks',
    'PPE',
    'Cleaning Supplies',
    'Printer Supplies'
  ]),
  supplier: z.string().min(2, 'Supplier name is required'),
  batchNumber: z.string().min(1, 'Batch number is required'),
  quantity: z.number().min(0, 'Quantity cannot be negative'),
  unit: z.string().min(1, 'Unit is required'),
  minimumStock: z.number().min(0),
  reorderLevel: z.number().min(0),
  expiryDate: z.string().min(4, 'Expiry date is required'),
  storageCondition: z.string().default('Controlled Ambient'),
  unitCost: z.number().min(0),
  weeklyConsumption: z.number().min(0).default(5),
  leadTimeDays: z.number().int().min(1).default(3)
});

export const restockSchema = z.object({
  quantity: z.number().int().positive('Quantity must be greater than 0'),
  batchNumber: z.string().optional(),
  supplier: z.string().optional(),
  unitCost: z.number().positive().optional(),
  purchaseOrderNumber: z.string().optional()
});

export const equipmentSchema = z.object({
  name: z.string().min(2, 'Equipment name is required'),
  manufacturer: z.string().min(1, 'Manufacturer is required'),
  model: z.string().min(1, 'Model is required'),
  serialNumber: z.string().optional().default('SN-PENDING'),
  location: z.string().default('Main Laboratory'),
  department: z.enum(['Hematology', 'Biochemistry', 'Microbiology', 'Immunology', 'Pathology', 'Molecular Diagnostics']),
  installationDate: z.string().default(() => new Date().toISOString().substring(0, 10)),
  lastMaintenance: z.string().default(() => new Date().toISOString().substring(0, 10)),
  nextMaintenance: z.string().min(4, 'Next maintenance date is required'),
  operationalStatus: z.enum(['Operational', 'Maintenance Due', 'Under Maintenance', 'Offline']).default('Operational'),
  utilizationPercent: z.number().min(0).max(100).default(50),
  temperature: z.string().optional()
});

export const maintenanceScheduleSchema = z.object({
  scheduledDate: z.string().min(4, 'Scheduled date is required'),
  engineerName: z.string().min(2, 'Engineer or Service Provider is required'),
  notes: z.string().optional().default('Regular preventive maintenance')
});

export const staffSchema = z.object({
  name: z.string().min(2, 'Staff name is required'),
  role: z.enum(['Laboratory Technician', 'Pathologist', 'Microbiologist', 'Phlebotomist', 'Administrator', 'Receptionist']),
  department: z.enum(['Hematology', 'Biochemistry', 'Microbiology', 'Immunology', 'Pathology', 'Molecular Diagnostics']),
  shift: z.enum(['Morning', 'Evening', 'Night']),
  qualification: z.string().min(2, 'Qualification is required'),
  assignedEquipment: z.string().default('General Stations'),
  phone: z.string().min(8, 'Phone number is required'),
  email: z.string().email('Invalid email address')
});

export const supplierSchema = z.object({
  supplierName: z.string().min(2, 'Supplier name is required'),
  category: z.string().min(2, 'Category is required'),
  contact: z.string().min(2, 'Contact person is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(8, 'Phone number is required'),
  products: z.array(z.string()).default([]),
  averageDeliveryDays: z.number().int().min(1).default(3)
});

export const billingSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  patientName: z.string().min(1, 'Patient name is required'),
  tests: z.string().min(1, 'Test description is required'),
  amount: z.number().min(0),
  discount: z.number().min(0).default(0),
  tax: z.number().min(0).default(0),
  paymentStatus: z.enum(['Paid', 'Pending', 'Partial']),
  paymentMethod: z.enum(['UPI', 'Credit Card', 'Cash', 'Corporate Account', 'Insurance']),
  insuranceTPA: z.string().optional()
});

export const dataSourceSchema = z.object({
  laboratoryName: z.string().min(2, 'Laboratory name is required'),
  sourceName: z.string().min(2, 'Data source name is required'),
  integrationType: z.enum(['REST API', 'JSON Feed', 'CSV Upload', 'Webhook', 'HL7 Feed', 'FHIR API']),
  endpointUrl: z.string().url('Must be a valid URL endpoint'),
  authType: z.enum(['Bearer Token', 'API Key', 'Basic Auth', 'Mutual TLS', 'None']),
  frequencyMinutes: z.number().int().min(1).max(1440).default(15),
  enabledDataTypes: z.array(z.string()).min(1, 'At least one data type must be enabled')
});
