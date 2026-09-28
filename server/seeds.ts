import {
  DoctorRecord,
  AppointmentRecord,
  PharmacyDrugRecord,
  PrescriptionRecord,
  PharmacyDispensingRecord,
  PharmacyBillRecord,
  PharmacyDeliveryRecord,
  PharmacistRecord,
  UserRecord
} from './types';

export function getDefaultDoctors(now: string): DoctorRecord[] {
  return [
    {
      id: 'DOC-01',
      doctorId: 'DOC-101',
      name: 'Dr. V. Ramanathan, MD, FRCP',
      specialization: 'Internal Medicine & Diabetology',
      department: 'General Medicine',
      opdTiming: '09:00 - 13:00 (Mon - Sat)',
      consultationRoom: 'OPD Room 102 (Block A)',
      status: 'ON DUTY',
      availableSlots: ['09:30 AM', '10:00 AM', '11:15 AM', '12:00 PM', '12:30 PM'],
      phone: '+91 98401 55210',
      email: 'v.ramanathan@novacare.org',
      createdAt: now,
      updatedAt: now,
      laboratoryId: 'LAB-NOVACARE'
    },
    {
      id: 'DOC-02',
      doctorId: 'DOC-102',
      name: 'Dr. Shalini Kulkarni, MD',
      specialization: 'Chief Clinical Pathologist & Hematologist',
      department: 'Pathology',
      opdTiming: '10:00 - 16:00 (Mon - Fri)',
      consultationRoom: 'Lab Consultation Bay 04',
      status: 'AVAILABLE',
      availableSlots: ['10:30 AM', '11:30 AM', '02:00 PM', '03:30 PM'],
      phone: '+91 98402 11980',
      email: 'shalini.k@novacare.org',
      createdAt: now,
      updatedAt: now,
      laboratoryId: 'LAB-NOVACARE'
    },
    {
      id: 'DOC-03',
      doctorId: 'DOC-103',
      name: 'Dr. Ananya Sen, MD, DM',
      specialization: 'Endocrinology & Metabolic Disorders',
      department: 'Biochemistry',
      opdTiming: '14:00 - 18:00 (Tue, Thu, Sat)',
      consultationRoom: 'OPD Room 204 (Block B)',
      status: 'IN CONSULTATION',
      availableSlots: ['02:30 PM', '03:15 PM', '04:45 PM'],
      phone: '+91 98403 99451',
      email: 'ananya.sen@novacare.org',
      createdAt: now,
      updatedAt: now,
      laboratoryId: 'LAB-NOVACARE'
    },
    {
      id: 'DOC-04',
      doctorId: 'DOC-104',
      name: 'Dr. K. Raghavan, MS, MCh',
      specialization: 'Cardiology & Preventive Cardiovascular Care',
      department: 'Cardiology',
      opdTiming: '09:00 - 14:00 (Mon, Wed, Fri)',
      consultationRoom: 'Cardiology Clinic 301',
      status: 'IN PROCEDURE',
      availableSlots: ['11:00 AM', '01:30 PM'],
      phone: '+91 98404 33871',
      email: 'k.raghavan@novacare.org',
      createdAt: now,
      updatedAt: now,
      laboratoryId: 'LAB-NOVACARE'
    },
    {
      id: 'DOC-05',
      doctorId: 'DOC-105',
      name: 'Dr. Meera Deshmukh, MD, DCH',
      specialization: 'Pediatrics & Adolescent Care',
      department: 'Pediatrics',
      opdTiming: '10:00 - 15:00 (Mon - Sat)',
      consultationRoom: 'Child Wellness Room 108',
      status: 'ON DUTY',
      availableSlots: ['10:45 AM', '11:45 AM', '01:15 PM', '02:30 PM'],
      phone: '+91 98405 77612',
      email: 'meera.d@novacare.org',
      createdAt: now,
      updatedAt: now,
      laboratoryId: 'LAB-NOVACARE'
    }
  ];
}

export function getDefaultAppointments(now: string): AppointmentRecord[] {
  return [
    {
      id: 'APT-1001',
      appointmentId: 'APT-2026-901',
      patientId: 'PT-1001',
      patientName: 'Aarav Sharma',
      doctorId: 'DOC-101',
      doctorName: 'Dr. V. Ramanathan, MD, FRCP',
      department: 'General Medicine',
      date: '2026-09-24',
      time: '10:00 AM',
      room: 'OPD Room 102',
      status: 'CONFIRMED',
      reason: 'Quarterly Diabetic & HbA1c Review',
      tokenNumber: 'T-014',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'APT-1002',
      appointmentId: 'APT-2026-902',
      patientId: 'PT-1002',
      patientName: 'Priya Patel',
      doctorId: 'DOC-103',
      doctorName: 'Dr. Ananya Sen, MD, DM',
      department: 'Endocrinology',
      date: '2026-09-25',
      time: '02:30 PM',
      room: 'OPD Room 204',
      status: 'CONFIRMED',
      reason: 'Thyroid Function Evaluation (TSH / T4)',
      tokenNumber: 'T-028',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'APT-1003',
      appointmentId: 'APT-2026-903',
      patientId: 'PT-1001',
      patientName: 'Aarav Sharma',
      doctorId: 'DOC-104',
      doctorName: 'Dr. K. Raghavan, MS, MCh',
      department: 'Cardiology',
      date: '2026-09-28',
      time: '11:00 AM',
      room: 'Cardiology Clinic 301',
      status: 'REQUESTED',
      reason: 'Pre-procedure Lipid Profile & ECG Consult',
      tokenNumber: 'T-042',
      createdAt: now,
      updatedAt: now
    }
  ];
}

export function getDefaultPharmacyMedicines(now: string): PharmacyDrugRecord[] {
  return [
    {
      id: 'MED-01',
      drugId: 'DRG-101',
      drugName: 'Paracetamol 650mg Tablets',
      genericName: 'Paracetamol / Acetaminophen IP',
      category: 'Analgesic & Antipyretic',
      manufacturer: 'Cipla Ltd',
      batchNumber: 'CIP-PCM-26A',
      quantity: 420,
      unit: 'Tablets',
      reorderLevel: 200,
      costPrice: 1.2,
      sellingPrice: 2.5,
      expiryDate: '2027-04-30',
      storageCondition: 'Room Temperature (<25°C)',
      prescriptionRequired: false,
      supplier: 'MedPlus Pharma Supply Co',
      status: 'IN STOCK',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'MED-02',
      drugId: 'DRG-102',
      drugName: 'Metformin 500mg SR Tablets',
      genericName: 'Metformin Hydrochloride IP',
      category: 'Antidiabetic',
      manufacturer: 'Sun Pharma',
      batchNumber: 'SUN-MET-908',
      quantity: 380,
      unit: 'Tablets',
      reorderLevel: 150,
      costPrice: 2.8,
      sellingPrice: 5.0,
      expiryDate: '2027-02-28',
      storageCondition: 'Store in dry place below 30°C',
      prescriptionRequired: true,
      supplier: 'MedPlus Pharma Supply Co',
      status: 'IN STOCK',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'MED-03',
      drugId: 'DRG-103',
      drugName: 'Amoxicillin + Potassium Clavulanate 625mg',
      genericName: 'Amoxicillin & Clavulanate Potassium IP',
      category: 'Antibiotic',
      manufacturer: 'GlaxoSmithKline India',
      batchNumber: 'GSK-AMX-541',
      quantity: 85,
      unit: 'Tablets',
      reorderLevel: 120,
      costPrice: 14.5,
      sellingPrice: 24.0,
      expiryDate: '2026-12-31',
      storageCondition: 'Cool dry place below 25°C',
      prescriptionRequired: true,
      supplier: 'Apex Healthcare Distributors',
      status: 'LOW STOCK',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'MED-04',
      drugId: 'DRG-104',
      drugName: 'Atorvastatin 20mg Tablets',
      genericName: 'Atorvastatin Calcium IP',
      category: 'Lipid-Lowering / Statin',
      manufacturer: 'Dr. Reddy Laboratories',
      batchNumber: 'DRL-ATV-332',
      quantity: 260,
      unit: 'Tablets',
      reorderLevel: 100,
      costPrice: 6.5,
      sellingPrice: 12.0,
      expiryDate: '2027-08-31',
      storageCondition: 'Room Temperature (<25°C)',
      prescriptionRequired: true,
      supplier: 'Apex Healthcare Distributors',
      status: 'IN STOCK',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'MED-05',
      drugId: 'DRG-105',
      drugName: 'Pantoprazole 40mg Gastro-Resistant',
      genericName: 'Pantoprazole Sodium IP',
      category: 'Antacid / Proton Pump Inhibitor',
      manufacturer: 'Alkem Laboratories',
      batchNumber: 'ALK-PAN-192',
      quantity: 310,
      unit: 'Tablets',
      reorderLevel: 150,
      costPrice: 4.2,
      sellingPrice: 8.5,
      expiryDate: '2027-01-31',
      storageCondition: 'Store protected from moisture',
      prescriptionRequired: false,
      supplier: 'MedPlus Pharma Supply Co',
      status: 'IN STOCK',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'MED-06',
      drugId: 'DRG-106',
      drugName: 'Insulin Glargine 100 IU/ml (Lantus Pen)',
      genericName: 'Insulin Glargine Recombinant DNA',
      category: 'Long-Acting Insulin',
      manufacturer: 'Sanofi India Ltd',
      batchNumber: 'SAN-INS-802',
      quantity: 14,
      unit: 'Cartridges (3ml)',
      reorderLevel: 25,
      costPrice: 480.0,
      sellingPrice: 650.0,
      expiryDate: '2026-11-30',
      storageCondition: 'Refrigerate (2°C - 8°C). Do not freeze.',
      prescriptionRequired: true,
      supplier: 'Apex Healthcare Distributors',
      status: 'LOW STOCK',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'MED-07',
      drugId: 'DRG-107',
      drugName: 'Azithromycin 500mg Tablets',
      genericName: 'Azithromycin Dihydrate IP',
      category: 'Macrolide Antibiotic',
      manufacturer: 'Cipla Ltd',
      batchNumber: 'CIP-AZI-901',
      quantity: 0,
      unit: 'Tablets',
      reorderLevel: 80,
      costPrice: 18.0,
      sellingPrice: 28.0,
      expiryDate: '2026-10-31',
      storageCondition: 'Room Temperature',
      prescriptionRequired: true,
      supplier: 'MedPlus Pharma Supply Co',
      status: 'OUT OF STOCK',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'MED-08',
      drugId: 'DRG-108',
      drugName: 'Cetirizine 10mg Tablets',
      genericName: 'Cetirizine Hydrochloride IP',
      category: 'Antihistamine / Antiallergic',
      manufacturer: 'Mankind Pharma',
      batchNumber: 'MKD-CET-774',
      quantity: 520,
      unit: 'Tablets',
      reorderLevel: 150,
      costPrice: 0.8,
      sellingPrice: 2.0,
      expiryDate: '2027-06-30',
      storageCondition: 'Dry place below 30°C',
      prescriptionRequired: false,
      supplier: 'MedPlus Pharma Supply Co',
      status: 'IN STOCK',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'MED-09',
      drugId: 'DRG-109',
      drugName: 'Salbutamol 100mcg Inhaler',
      genericName: 'Salbutamol / Albuterol IP',
      category: 'Bronchodilator (Respiratory)',
      manufacturer: 'Cipla Ltd (Asthalin)',
      batchNumber: 'CIP-SAL-411',
      quantity: 32,
      unit: 'Inhalers (200 doses)',
      reorderLevel: 20,
      costPrice: 110.0,
      sellingPrice: 165.0,
      expiryDate: '2027-03-31',
      storageCondition: 'Store below 30°C. Protect from frost.',
      prescriptionRequired: true,
      supplier: 'Apex Healthcare Distributors',
      status: 'IN STOCK',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'MED-10',
      drugId: 'DRG-110',
      drugName: 'Telmisartan 40mg Tablets',
      genericName: 'Telmisartan IP',
      category: 'Antihypertensive / ARB',
      manufacturer: 'Glenmark Pharmaceuticals',
      batchNumber: 'GLN-TEL-219',
      quantity: 240,
      unit: 'Tablets',
      reorderLevel: 100,
      costPrice: 4.8,
      sellingPrice: 9.0,
      expiryDate: '2027-05-31',
      storageCondition: 'Store protected from light & moisture',
      prescriptionRequired: true,
      supplier: 'MedPlus Pharma Supply Co',
      status: 'IN STOCK',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'MED-11',
      drugId: 'DRG-111',
      drugName: 'ORS WHO Formula Electrolyte Sachet 21.8g',
      genericName: 'Oral Rehydration Salts IP (WHO Standard)',
      category: 'Electrolyte & Rehydration',
      manufacturer: 'FDC Ltd',
      batchNumber: 'FDC-ORS-102',
      quantity: 450,
      unit: 'Sachets',
      reorderLevel: 100,
      costPrice: 12.0,
      sellingPrice: 22.0,
      expiryDate: '2027-09-30',
      storageCondition: 'Dry place',
      prescriptionRequired: false,
      supplier: 'MedPlus Pharma Supply Co',
      status: 'IN STOCK',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'MED-12',
      drugId: 'DRG-112',
      drugName: 'Vitamin C 500mg + Zinc Chewable Tablets',
      genericName: 'Ascorbic Acid & Zinc Gluconate',
      category: 'Nutritional Supplement',
      manufacturer: 'Abbott Healthcare',
      batchNumber: 'ABT-VIT-618',
      quantity: 18,
      unit: 'Strips (15 tabs)',
      reorderLevel: 40,
      costPrice: 45.0,
      sellingPrice: 75.0,
      expiryDate: '2026-10-25',
      storageCondition: 'Cool dry place',
      prescriptionRequired: false,
      supplier: 'Apex Healthcare Distributors',
      status: 'EXPIRING SOON',
      createdAt: now,
      updatedAt: now
    }
  ];
}

export function getDefaultPrescriptions(now: string): PrescriptionRecord[] {
  return [
    {
      id: 'RX-1001',
      prescriptionId: 'RX-2026-801',
      patientId: 'PT-1001',
      patientName: 'Aarav Sharma',
      prescribingDoctor: 'Dr. V. Ramanathan, MD, FRCP',
      date: '2026-09-23',
      medicines: [
        {
          drugId: 'DRG-102',
          drugName: 'Metformin 500mg SR Tablets',
          dosageInstructions: '1 tablet twice daily after meals (Morning & Night) for 30 days',
          quantity: 60,
          unit: 'Tablets',
          dispensedQuantity: 60
        },
        {
          drugId: 'DRG-104',
          drugName: 'Atorvastatin 20mg Tablets',
          dosageInstructions: '1 tablet at bedtime for 30 days',
          quantity: 30,
          unit: 'Tablets',
          dispensedQuantity: 30
        }
      ],
      prescriptionStatus: 'DISPENSED',
      prescriptionRequired: true,
      notes: 'Monitor fasting blood sugar weekly. Review in OPD on Sep 24.',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'RX-1002',
      prescriptionId: 'RX-2026-802',
      patientId: 'PT-1002',
      patientName: 'Priya Patel',
      prescribingDoctor: 'Dr. Ananya Sen, MD, DM',
      date: '2026-09-23',
      medicines: [
        {
          drugId: 'DRG-105',
          drugName: 'Pantoprazole 40mg Gastro-Resistant',
          dosageInstructions: '1 tablet once daily before breakfast (empty stomach) for 14 days',
          quantity: 14,
          unit: 'Tablets',
          dispensedQuantity: 0
        },
        {
          drugId: 'DRG-108',
          drugName: 'Cetirizine 10mg Tablets',
          dosageInstructions: '1 tablet at night as needed for allergic rhinitis',
          quantity: 10,
          unit: 'Tablets',
          dispensedQuantity: 0
        }
      ],
      prescriptionStatus: 'ACTIVE',
      prescriptionRequired: true,
      notes: 'Take before meals. Avoid citrus foods immediately after dose.',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'RX-1003',
      prescriptionId: 'RX-2026-803',
      patientId: 'PT-1001',
      patientName: 'Aarav Sharma',
      prescribingDoctor: 'Dr. V. Ramanathan, MD, FRCP',
      date: '2026-09-22',
      medicines: [
        {
          drugId: 'DRG-101',
          drugName: 'Paracetamol 650mg Tablets',
          dosageInstructions: '1 tablet SOS for mild fever/headache',
          quantity: 10,
          unit: 'Tablets',
          dispensedQuantity: 10
        }
      ],
      prescriptionStatus: 'DISPENSED',
      prescriptionRequired: false,
      notes: 'Prescribed during follow up call.',
      createdAt: now,
      updatedAt: now
    }
  ];
}

export function getDefaultDispensing(now: string): PharmacyDispensingRecord[] {
  return [
    {
      id: 'DSP-1001',
      dispenseId: 'DSP-2026-501',
      billNumber: 'PH-BILL-901',
      patientId: 'PT-1001',
      patientName: 'Aarav Sharma',
      prescriptionId: 'RX-2026-801',
      pharmacistId: 'PH-01',
      pharmacistName: 'Pawan Kumar, B.Pharm',
      items: [
        {
          drugId: 'DRG-102',
          drugName: 'Metformin 500mg SR Tablets',
          quantity: 60,
          unitPrice: 5.0,
          totalPrice: 300.0
        },
        {
          drugId: 'DRG-104',
          drugName: 'Atorvastatin 20mg Tablets',
          quantity: 30,
          unitPrice: 12.0,
          totalPrice: 360.0
        }
      ],
      subtotal: 660.0,
      discount: 33.0,
      tax: 31.35,
      totalAmount: 658.35,
      paymentStatus: 'PAID',
      dispenseDate: '2026-09-23 10:45:00',
      createdAt: now,
      updatedAt: now
    }
  ];
}

export function getDefaultPharmacyBills(now: string): PharmacyBillRecord[] {
  return [
    {
      id: 'PB-1001',
      billNumber: 'PH-BILL-901',
      patientId: 'PT-1001',
      patientName: 'Aarav Sharma',
      date: '2026-09-23',
      items: [
        {
          drugId: 'DRG-102',
          drugName: 'Metformin 500mg SR Tablets',
          quantity: 60,
          unitPrice: 5.0,
          total: 300.0
        },
        {
          drugId: 'DRG-104',
          drugName: 'Atorvastatin 20mg Tablets',
          quantity: 30,
          unitPrice: 12.0,
          total: 360.0
        }
      ],
      subtotal: 660.0,
      tax: 31.35,
      discount: 33.0,
      total: 658.35,
      paymentStatus: 'PAID',
      paymentMethod: 'UPI',
      createdAt: now,
      updatedAt: now
    }
  ];
}

export function getDefaultDeliveries(now: string): PharmacyDeliveryRecord[] {
  return [
    {
      id: 'DEL-1001',
      orderId: 'ORD-DEL-401',
      patientId: 'PT-1001',
      patientName: 'Aarav Sharma',
      address: '#42, 3rd Cross, Indiranagar, Bangalore 560038',
      contact: '+91 98765 43210',
      items: [
        { drugName: 'Metformin 500mg SR Tablets', quantity: 60 },
        { drugName: 'Atorvastatin 20mg Tablets', quantity: 30 }
      ],
      deliveryType: 'HOME DELIVERY',
      deliveryStatus: 'DELIVERED',
      assignedDeliveryPerson: 'Suresh Gowda (Internal Hospital Logistics)',
      estimatedDeliveryTime: '2026-09-23 13:00',
      totalAmount: 658.35,
      orderedAt: '2026-09-23 10:45',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'DEL-1002',
      orderId: 'ORD-DEL-402',
      patientId: 'PT-1002',
      patientName: 'Priya Patel',
      address: 'Central Hospital Pharmacy Counter #2',
      contact: '+91 98765 43211',
      items: [
        { drugName: 'Pantoprazole 40mg Gastro-Resistant', quantity: 14 },
        { drugName: 'Cetirizine 10mg Tablets', quantity: 10 }
      ],
      deliveryType: 'COUNTER PICKUP',
      deliveryStatus: 'PACKED',
      estimatedDeliveryTime: '2026-09-23 16:00',
      totalAmount: 139.0,
      orderedAt: '2026-09-23 11:30',
      createdAt: now,
      updatedAt: now
    }
  ];
}

export function getDefaultPharmacists(now: string): PharmacistRecord[] {
  return [
    {
      id: 'PH-01',
      pharmacistId: 'EMP-PH-204',
      name: 'Pawan Kumar, B.Pharm',
      employeeId: 'EMP-PH-204',
      department: 'Central Pharmacy Dispensary',
      licenseNumber: 'KAR-PH-77192',
      shift: 'Morning',
      status: 'ON DUTY',
      phone: '+91 98840 55112',
      email: 'pawan.kumar@novacare.org',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'PH-02',
      pharmacistId: 'EMP-PH-208',
      name: 'Sunita Rao, M.Pharm',
      employeeId: 'EMP-PH-208',
      department: 'Clinical Pharmacology & Inpatient Dispensing',
      licenseNumber: 'KAR-PH-88401',
      shift: 'Evening',
      status: 'AVAILABLE',
      phone: '+91 98840 77334',
      email: 'sunita.rao@novacare.org',
      createdAt: now,
      updatedAt: now
    }
  ];
}

export function getDefaultStaffUsers(now: string): UserRecord[] {
  return [
    {
      id: 'USR-01',
      createdAt: now,
      updatedAt: now,
      name: 'Dr. Aris Thorne, MD',
      email: 'aris.thorne@novacare.org',
      role: 'lab_manager',
      department: 'Administration & Operations',
      lastLogin: now,
      status: 'Active',
      employeeId: 'EMP-MGR-001',
      phone: '+91 98400 11223',
      password: 'manager123',
      language: 'en',
      photoUrl: '/src/assets/images/avatar_lab_director_1790181762231.jpg',
      permissions: ['ALL_LAB_OPERATIONS', 'RISK_MANAGEMENT', 'INVENTORY_REORDER']
    },
    {
      id: 'USR-02',
      createdAt: now,
      updatedAt: now,
      name: 'Chief Admin Sarah Jenkins',
      email: 'sarah.jenkins@novacare.org',
      role: 'administrator',
      department: 'Executive Administration',
      lastLogin: now,
      status: 'Active',
      employeeId: 'EMP-ADM-002',
      phone: '+91 98400 22334',
      password: 'admin123',
      language: 'en',
      permissions: ['SYSTEM_ADMIN', 'SECURITY_AUDIT', 'ROLE_MANAGEMENT', 'INTEGRATIONS']
    },
    {
      id: 'USR-03',
      createdAt: now,
      updatedAt: now,
      name: 'Dr. Shalini Kulkarni, MD',
      email: 'shalini.k@novacare.org',
      role: 'pathologist',
      department: 'Clinical Pathology',
      lastLogin: now,
      status: 'Active',
      employeeId: 'EMP-PAT-003',
      phone: '+91 98400 33445',
      password: 'path123',
      language: 'en',
      permissions: ['VERIFY_RESULTS', 'RELEASE_REPORTS', 'CLINICAL_REVIEW']
    },
    {
      id: 'USR-04',
      createdAt: now,
      updatedAt: now,
      name: 'Senior Tech Rajesh V.',
      email: 'rajesh.v@novacare.org',
      role: 'technician',
      department: 'Biochemistry & Hematology',
      lastLogin: now,
      status: 'Active',
      employeeId: 'EMP-TEC-004',
      phone: '+91 98400 44556',
      password: 'tech123',
      language: 'en',
      permissions: ['SPECIMEN_PROCESSING', 'ENTER_RESULTS', 'EQUIPMENT_CALIBRATION']
    },
    {
      id: 'USR-05',
      createdAt: now,
      updatedAt: now,
      name: 'Finance Controller Anita Roy',
      email: 'anita.roy@novacare.org',
      role: 'finance',
      department: 'Hospital Accounts & Revenue',
      lastLogin: now,
      status: 'Active',
      employeeId: 'EMP-FIN-005',
      phone: '+91 98400 55667',
      password: 'finance123',
      language: 'en',
      permissions: ['INVOICING', 'PAYMENTS', 'REVENUE_AUDIT']
    },
    {
      id: 'USR-06',
      createdAt: now,
      updatedAt: now,
      name: 'Pawan Kumar, B.Pharm',
      email: 'pawan.kumar@novacare.org',
      role: 'pharmacist',
      department: 'Central Pharmacy',
      lastLogin: now,
      status: 'Active',
      employeeId: 'EMP-PH-204',
      phone: '+91 98840 55112',
      password: 'pharma123',
      language: 'en',
      permissions: ['PHARMACY_VIEW', 'PHARMACY_DISPENSE', 'PHARMACY_RESTOCK']
    },
    {
      id: 'USR-PT-1001',
      createdAt: now,
      updatedAt: now,
      name: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      role: 'patient',
      department: 'Outpatient (OPD)',
      lastLogin: now,
      status: 'Active',
      uhid: 'PT-1001',
      patientId: 'PT-1001',
      phone: '9876543210',
      password: 'password123',
      language: 'en',
      permissions: ['PATIENT_SELF_ACCESS']
    },
    {
      id: 'USR-PT-1002',
      createdAt: now,
      updatedAt: now,
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
      role: 'patient',
      department: 'Outpatient (OPD)',
      lastLogin: now,
      status: 'Active',
      uhid: 'PT-1002',
      patientId: 'PT-1002',
      phone: '9876543211',
      password: 'password123',
      language: 'en',
      permissions: ['PATIENT_SELF_ACCESS']
    }
  ];
}
