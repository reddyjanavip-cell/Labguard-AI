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
  LabNotification
} from '../types';

export const INITIAL_KPIS = {
  totalTestsToday: 1248,
  completedToday: 1176,
  pendingToday: 72,
  averageTAT: '2h 18m',
  dailyRevenue: 384600,
  inventoryValue: 842000,
  criticalAlerts: 4,
  equipmentAvailability: 94,
};

// 100 Realistic Fictional Patients
export const INITIAL_PATIENTS: Patient[] = [
  { patientId: 'PT-1001', name: 'Rajesh Sharma', age: 48, gender: 'Male', phone: '+91 98201 44521', email: 'rajesh.sharma@example.com', registrationDate: '2026-08-14', bloodGroup: 'B+', referringDoctor: 'Dr. V. Raman (Apollo)', testsOrderedCount: 5, lastVisit: '2026-09-23', status: 'Active' },
  { patientId: 'PT-1002', name: 'Priya Iyer', age: 34, gender: 'Female', phone: '+91 98450 11982', email: 'priya.iyer@example.com', registrationDate: '2026-08-18', bloodGroup: 'O+', referringDoctor: 'Dr. S. Nair (Max Health)', testsOrderedCount: 3, lastVisit: '2026-09-23', status: 'Active' },
  { patientId: 'PT-1003', name: 'Amitabh Verma', age: 62, gender: 'Male', phone: '+91 99100 87342', email: 'amitabh.verma@example.com', registrationDate: '2026-07-29', bloodGroup: 'A+', referringDoctor: 'Dr. K. Saxena (Fortis)', testsOrderedCount: 8, lastVisit: '2026-09-22', status: 'Under Review' },
  { patientId: 'PT-1004', name: 'Sunita Deshmukh', age: 51, gender: 'Female', phone: '+91 97654 32109', email: 'sunita.d@example.com', registrationDate: '2026-08-01', bloodGroup: 'AB+', referringDoctor: 'Dr. A. Kulkarni', testsOrderedCount: 4, lastVisit: '2026-09-23', status: 'Active' },
  { patientId: 'PT-1005', name: 'Vikramjit Singh', age: 39, gender: 'Male', phone: '+91 98112 90812', email: 'vikram.singh@example.com', registrationDate: '2026-09-02', bloodGroup: 'O-', referringDoctor: 'Dr. G. Brar (Care Clinic)', testsOrderedCount: 2, lastVisit: '2026-09-23', status: 'Active' },
  { patientId: 'PT-1006', name: 'Ananya Roy', age: 29, gender: 'Female', phone: '+91 98301 77654', email: 'ananya.roy@example.com', registrationDate: '2026-09-10', bloodGroup: 'A-', referringDoctor: 'Dr. M. Banerjee', testsOrderedCount: 3, lastVisit: '2026-09-21', status: 'Active' },
  { patientId: 'PT-1007', name: 'Farooq Abdullah Khan', age: 57, gender: 'Male', phone: '+91 98900 12345', email: 'farooq.khan@example.com', registrationDate: '2026-06-15', bloodGroup: 'B-', referringDoctor: 'Dr. H. Qureshi', testsOrderedCount: 11, lastVisit: '2026-09-23', status: 'Active' },
  { patientId: 'PT-1008', name: 'Meenakshi Sundaram', age: 44, gender: 'Female', phone: '+91 94440 88219', email: 'meenakshi.s@example.com', registrationDate: '2026-08-22', bloodGroup: 'O+', referringDoctor: 'Dr. R. Venkat', testsOrderedCount: 6, lastVisit: '2026-09-22', status: 'Active' },
  { patientId: 'PT-1009', name: 'Kavita Nair', age: 31, gender: 'Female', phone: '+91 98470 65432', email: 'kavita.nair@example.com', registrationDate: '2026-09-05', bloodGroup: 'AB-', referringDoctor: 'Dr. P. Menon', testsOrderedCount: 2, lastVisit: '2026-09-23', status: 'Active' },
  { patientId: 'PT-1010', name: 'Deepak Joshi', age: 66, gender: 'Male', phone: '+91 98220 99881', email: 'deepak.joshi@example.com', registrationDate: '2026-05-19', bloodGroup: 'B+', referringDoctor: 'Dr. D. Joshi', testsOrderedCount: 14, lastVisit: '2026-09-23', status: 'Under Review' },
  { patientId: 'PT-1011', name: 'Sneha Patel', age: 26, gender: 'Female', phone: '+91 98795 33412', email: 'sneha.patel@example.com', registrationDate: '2026-09-12', bloodGroup: 'A+', referringDoctor: 'Dr. B. Shah', testsOrderedCount: 2, lastVisit: '2026-09-23', status: 'Active' },
  { patientId: 'PT-1012', name: 'Arjun Reddy', age: 38, gender: 'Male', phone: '+91 99887 76655', email: 'arjun.reddy@example.com', registrationDate: '2026-08-30', bloodGroup: 'O+', referringDoctor: 'Dr. C. Rao', testsOrderedCount: 4, lastVisit: '2026-09-23', status: 'Active' },
  { patientId: 'PT-1013', name: 'Divya Nambiar', age: 41, gender: 'Female', phone: '+91 94471 22901', email: 'divya.n@example.com', registrationDate: '2026-07-11', bloodGroup: 'B+', referringDoctor: 'Dr. S. Nair', testsOrderedCount: 7, lastVisit: '2026-09-22', status: 'Active' },
  { patientId: 'PT-1014', name: 'Harpreet Singh', age: 53, gender: 'Male', phone: '+91 98140 55667', email: 'harpreet.s@example.com', registrationDate: '2026-08-04', bloodGroup: 'A+', referringDoctor: 'Dr. T. Kohli', testsOrderedCount: 5, lastVisit: '2026-09-23', status: 'Active' },
  { patientId: 'PT-1015', name: 'Zoya Fatima', age: 24, gender: 'Female', phone: '+91 98205 66789', email: 'zoya.f@example.com', registrationDate: '2026-09-15', bloodGroup: 'O-', referringDoctor: 'Dr. A. Siddiqui', testsOrderedCount: 1, lastVisit: '2026-09-23', status: 'Active' },
  { patientId: 'PT-1016', name: 'Manoj Tiwari', age: 49, gender: 'Male', phone: '+91 94150 88990', email: 'manoj.tiwari@example.com', registrationDate: '2026-06-20', bloodGroup: 'AB+', referringDoctor: 'Dr. N. Pandey', testsOrderedCount: 9, lastVisit: '2026-09-20', status: 'Discharged' },
  { patientId: 'PT-1017', name: 'Ritu Agarwal', age: 36, gender: 'Female', phone: '+91 98101 22334', email: 'ritu.agarwal@example.com', registrationDate: '2026-08-25', bloodGroup: 'B+', referringDoctor: 'Dr. M. Mittal', testsOrderedCount: 3, lastVisit: '2026-09-23', status: 'Active' },
  { patientId: 'PT-1018', name: 'Siddharth Sen', age: 45, gender: 'Male', phone: '+91 98310 99001', email: 'siddharth.sen@example.com', registrationDate: '2026-09-01', bloodGroup: 'A+', referringDoctor: 'Dr. B. Das', testsOrderedCount: 4, lastVisit: '2026-09-23', status: 'Active' },
  { patientId: 'PT-1019', name: 'Lakshmi Narayanan', age: 70, gender: 'Female', phone: '+91 94441 55667', email: 'lakshmi.n@example.com', registrationDate: '2026-04-18', bloodGroup: 'O+', referringDoctor: 'Dr. R. Venkat', testsOrderedCount: 16, lastVisit: '2026-09-23', status: 'Under Review' },
  { patientId: 'PT-1020', name: 'Gautam Gambhir', age: 33, gender: 'Male', phone: '+91 98118 77665', email: 'gautam.g@example.com', registrationDate: '2026-09-18', bloodGroup: 'B-', referringDoctor: 'Dr. V. Raman', testsOrderedCount: 2, lastVisit: '2026-09-23', status: 'Active' },
];

// Dynamically generate up to 100 consistent fictional patients for full depth
for (let i = 21; i <= 100; i++) {
  const pId = `PT-${1000 + i}`;
  const firstNames = ['Ramesh', 'Sanjay', 'Alok', 'Mohan', 'Bhavna', 'Neha', 'Pooja', 'Tanvi', 'Kishore', 'Rohit', 'Suraj', 'Shalini', 'Nandini', 'Rahul', 'Vikas'];
  const lastNames = ['Gupta', 'Mehta', 'Verma', 'Kumar', 'Kapoor', 'Bhatia', 'Jain', 'Rao', 'Reddy', 'Chauhan', 'Nath', 'Goswami', 'Pillai', 'Menon'];
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const fn = firstNames[i % firstNames.length];
  const ln = lastNames[i % lastNames.length];
  INITIAL_PATIENTS.push({
    patientId: pId,
    name: `${fn} ${ln}`,
    age: 22 + ((i * 7) % 55),
    gender: i % 2 === 0 ? 'Male' : 'Female',
    phone: `+91 98${(100 + i * 13) % 900} ${(20000 + i * 37) % 90000}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@example.com`,
    registrationDate: `2026-0${1 + (i % 8)}-${10 + (i % 18)}`,
    bloodGroup: bloodGroups[i % bloodGroups.length],
    referringDoctor: `Dr. ${(i % 5 === 0 ? 'V. Raman' : i % 3 === 0 ? 'K. Saxena' : 'S. Nair')}`,
    testsOrderedCount: 1 + (i % 7),
    lastVisit: i % 4 === 0 ? '2026-09-23' : '2026-09-22',
    status: i % 9 === 0 ? 'Under Review' : 'Active'
  });
}

// 50 Laboratory Test Catalog
export const INITIAL_TESTS: LaboratoryTest[] = [
  { testId: 'LAB-101', testName: 'Complete Blood Count (CBC)', department: 'Hematology', sampleType: 'Whole Blood (EDTA)', container: 'Lavender Top Tube', expectedTAT: '1h 30m', price: 450, cost: 85, equipmentRequired: 'Sysmex XN-1000', reagentRequirements: 'CBC CellPack & Stromatolyser', referenceRange: 'Hb 13-17 g/dL, WBC 4-11 x10^3/uL', status: 'Active' },
  { testId: 'LAB-102', testName: 'Hemoglobin (Hb)', department: 'Hematology', sampleType: 'Whole Blood (EDTA)', container: 'Lavender Top Tube', expectedTAT: '45m', price: 180, cost: 35, equipmentRequired: 'Sysmex XN-1000', reagentRequirements: 'Sulfolyser Reagent', referenceRange: '13.0 - 17.5 g/dL (M), 12.0 - 15.5 g/dL (F)', status: 'Active' },
  { testId: 'LAB-103', testName: 'Erythrocyte Sedimentation Rate (ESR)', department: 'Hematology', sampleType: 'Whole Blood (Citrate)', container: 'Black Top Tube', expectedTAT: '1h 00m', price: 200, cost: 40, equipmentRequired: 'Sedimat ESR Reader', reagentRequirements: 'Sodium Citrate 3.8%', referenceRange: '0 - 15 mm/hr (M), 0 - 20 mm/hr (F)', status: 'Active' },
  { testId: 'LAB-104', testName: 'Fasting Blood Glucose (FBS)', department: 'Biochemistry', sampleType: 'Fluoride Plasma', container: 'Grey Top Tube', expectedTAT: '1h 15m', price: 150, cost: 28, equipmentRequired: 'Cobas 6000 (BIO-03)', reagentRequirements: 'Glucose HK Gen.3 Reagent', referenceRange: '70 - 99 mg/dL', status: 'Active' },
  { testId: 'LAB-105', testName: 'HbA1c (Glycated Hemoglobin)', department: 'Biochemistry', sampleType: 'Whole Blood (EDTA)', container: 'Lavender Top Tube', expectedTAT: '2h 00m', price: 750, cost: 160, equipmentRequired: 'Cobas 6000 (BIO-03)', reagentRequirements: 'HbA1c Gen.3 Immunoassay Kit', referenceRange: '< 5.7% Normal, 5.7-6.4% Pre-diabetic', status: 'Active' },
  { testId: 'LAB-106', testName: 'Lipid Profile Comprehensive', department: 'Biochemistry', sampleType: 'Serum', container: 'Red/Gold SST Tube', expectedTAT: '2h 30m', price: 850, cost: 190, equipmentRequired: 'Cobas 6000 (BIO-03)', reagentRequirements: 'Cholesterol, Triglycerides, HDL, LDL Casettes', referenceRange: 'Total Chol < 200 mg/dL, Trig < 150 mg/dL', status: 'Active' },
  { testId: 'LAB-107', testName: 'Liver Function Test (LFT)', department: 'Biochemistry', sampleType: 'Serum', container: 'Red/Gold SST Tube', expectedTAT: '2h 15m', price: 900, cost: 210, equipmentRequired: 'Cobas 6000 (BIO-03)', reagentRequirements: 'Bilirubin, SGOT, SGPT, ALP, Total Protein Reagents', referenceRange: 'SGOT 15-40 U/L, SGPT 10-49 U/L', status: 'Active' },
  { testId: 'LAB-108', testName: 'Kidney Function Test (KFT / RFT)', department: 'Biochemistry', sampleType: 'Serum', container: 'Red/Gold SST Tube', expectedTAT: '2h 00m', price: 850, cost: 180, equipmentRequired: 'Cobas 6000 (BIO-03)', reagentRequirements: 'Urea, Creatinine, Electrolytes Cartridge', referenceRange: 'Serum Creatinine 0.7 - 1.3 mg/dL', status: 'Active' },
  { testId: 'LAB-109', testName: '25-Hydroxy Vitamin D', department: 'Immunology', sampleType: 'Serum', container: 'Gold SST Gel Separator', expectedTAT: '3h 30m', price: 1650, cost: 420, equipmentRequired: 'Abbott Architect i2000SR', reagentRequirements: 'Architect 25-OH Vitamin D Reagent Kit (CRITICAL STOCK)', referenceRange: '30 - 100 ng/mL Sufficient, < 20 Deficient', status: 'Active' },
  { testId: 'LAB-110', testName: 'Vitamin B12 Cyanocobalamin', department: 'Immunology', sampleType: 'Serum', container: 'Gold SST Gel Separator', expectedTAT: '3h 00m', price: 1200, cost: 310, equipmentRequired: 'Abbott Architect i2000SR', reagentRequirements: 'B12 Chemiluminescent Microparticle Assay', referenceRange: '211 - 911 pg/mL', status: 'Active' },
  { testId: 'LAB-111', testName: 'Thyroid Stimulating Hormone (TSH Ultra)', department: 'Immunology', sampleType: 'Serum', container: 'Red/Gold SST Tube', expectedTAT: '2h 15m', price: 400, cost: 95, equipmentRequired: 'Abbott Architect i2000SR', reagentRequirements: 'TSH Ultrasensitive Reagent Pack', referenceRange: '0.45 - 4.50 uIU/mL', status: 'Active' },
  { testId: 'LAB-112', testName: 'Total Thyroid Profile (T3, T4, TSH)', department: 'Immunology', sampleType: 'Serum', container: 'Red/Gold SST Tube', expectedTAT: '3h 00m', price: 950, cost: 240, equipmentRequired: 'Abbott Architect i2000SR', reagentRequirements: 'Architect Total T3, Free T4, TSH Kits', referenceRange: 'FT4 0.8-1.8 ng/dL, TSH 0.45-4.5 uIU/mL', status: 'Active' },
  { testId: 'LAB-113', testName: 'C-Reactive Protein (CRP Quantitative)', department: 'Immunology', sampleType: 'Serum', container: 'Red Top Tube', expectedTAT: '1h 30m', price: 550, cost: 110, equipmentRequired: 'Cobas 6000 (BIO-03)', reagentRequirements: 'CRP Latex Enhanced Immunoturbidimetric', referenceRange: '< 5.0 mg/L', status: 'Active' },
  { testId: 'LAB-114', testName: 'High Sensitivity Troponin I', department: 'Biochemistry', sampleType: 'Plasma/Serum', container: 'Green Heparin / SST', expectedTAT: '45m (STAT)', price: 1800, cost: 520, equipmentRequired: 'Cobas 6000 (BIO-03)', reagentRequirements: 'hs-cTnI Immunoassay Kit', referenceRange: '< 14 ng/L', status: 'Active' },
  { testId: 'LAB-115', testName: 'Urine Routine & Microscopic Examination', department: 'Pathology', sampleType: 'Urine', container: 'Sterile Urine Container', expectedTAT: '1h 00m', price: 250, cost: 45, equipmentRequired: 'Olympus BX53 & Iris Urine Analyzer', reagentRequirements: 'Multistix 10SG Reagent Strips', referenceRange: 'Color Pale Yellow, Clear, Pus cells 0-5 /hpf', status: 'Active' },
  { testId: 'LAB-116', testName: 'Urine Aerobic Culture & Sensitivity', department: 'Microbiology', sampleType: 'Midstream Urine', container: 'Sterile Universal Container', expectedTAT: '48h 00m', price: 950, cost: 220, equipmentRequired: 'Bact/Alert & VITEK 2 Compact', reagentRequirements: 'CLED Agar, Blood Agar, AST Cards', referenceRange: 'No growth after 48 hrs incubation', status: 'Active' },
  { testId: 'LAB-117', testName: 'Blood Culture (Automated)', department: 'Microbiology', sampleType: 'Whole Blood', container: 'Aerobic & Anaerobic Culture Bottles', expectedTAT: '72h 00m', price: 1850, cost: 480, equipmentRequired: 'BacT/ALERT 3D Microbial System', reagentRequirements: 'BacT/Alert FA Plus / FN Plus Bottles', referenceRange: 'Sterile at 5 days', status: 'Active' },
  { testId: 'LAB-118', testName: 'Serum Ferritin', department: 'Immunology', sampleType: 'Serum', container: 'Red/Gold SST Tube', expectedTAT: '2h 30m', price: 800, cost: 175, equipmentRequired: 'Abbott Architect i2000SR', reagentRequirements: 'Ferritin CMIA Reagent Pack', referenceRange: '30 - 400 ng/mL (M), 15 - 150 ng/mL (F)', status: 'Active' },
  { testId: 'LAB-119', testName: 'Dengue NS1 Antigen & IgM/IgG', department: 'Microbiology', sampleType: 'Serum', container: 'Red Top Tube', expectedTAT: '1h 15m', price: 1200, cost: 290, equipmentRequired: 'Immunoassay Reader', reagentRequirements: 'Dengue Duo Rapid & ELISA Microplate', referenceRange: 'Negative for NS1 Ag & IgM Ab', status: 'Active' },
  { testId: 'LAB-120', testName: 'RT-PCR Multiplex Viral Panel', department: 'Molecular Diagnostics', sampleType: 'Nasopharyngeal Swab (VTM)', container: 'Viral Transport Medium', expectedTAT: '4h 00m', price: 2400, cost: 680, equipmentRequired: 'Bio-Rad CFX96 Real-Time PCR', reagentRequirements: 'TaqPath Multiplex Real-time PCR MasterMix', referenceRange: 'Target Not Detected', status: 'Active' },
];

// Populate 30 additional tests to make exactly 50
const moreTestNames = [
  'Prothrombin Time & INR', 'Activated PTT (APTT)', 'Serum Electrolytes (Na, K, Cl)', 'Serum Uric Acid',
  'Serum Calcium & Phosphorus', 'Serum Albumin / Globulin', 'Serum Amylase & Lipase', 'Serum Iron & TIBC',
  'Glycosylated Albumin', 'D-Dimer Quantitative', 'Beta-hCG Total Quantitative', 'Prostate Specific Antigen (Total PSA)',
  'Free PSA', 'Anti-Nuclear Antibody (ANA IFA)', 'Rheumatoid Factor Quantitative', 'Anti-CCP Antibodies',
  'HBsAg (Hepatitis B Surface Antigen)', 'Anti-HCV Total', 'HIV 1 & 2 4th Gen Ag/Ab', 'VDRL / RPR Syphilis Test',
  'Widal Slide Agglutination', 'Stool Routine & Occult Blood', 'Pap Smear Liquid Cytology', 'Sputum for AFB Stain',
  'HLA B27 by Real-Time PCR', 'Hepatitis B Viral Load (HBV DNA)', 'Hepatitis C Viral Load (HCV RNA)',
  'Microalbuminuria (Spot Urine)', 'Total IgE Antibody', 'Interleukin-6 (IL-6)'
];

moreTestNames.forEach((name, idx) => {
  const tId = `LAB-${121 + idx}`;
  const depts: LaboratoryTest['department'][] = ['Hematology', 'Biochemistry', 'Immunology', 'Microbiology', 'Pathology', 'Molecular Diagnostics'];
  INITIAL_TESTS.push({
    testId: tId,
    testName: name,
    department: depts[idx % depts.length],
    sampleType: 'Serum / Blood',
    container: 'Standard Specimen Container',
    expectedTAT: `${1 + (idx % 4)}h 30m`,
    price: 350 + (idx * 65),
    cost: 80 + (idx * 18),
    equipmentRequired: idx % 3 === 0 ? 'Cobas 6000 (BIO-03)' : idx % 2 === 0 ? 'Abbott Architect i2000SR' : 'Sysmex XN-1000',
    reagentRequirements: `${name} Standard Reagent Pack`,
    referenceRange: 'Clinical Diagnostic Standard Range',
    status: 'Active'
  });
});

// 30 Inventory Items
export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    itemId: 'INV-101',
    itemName: '25-OH Vitamin D Chemiluminescent Reagent Kit',
    category: 'Reagents',
    supplier: 'Abbott Diagnostics India',
    batchNumber: 'VD-2026-B884',
    quantity: 18, // Prompt requirement: 18 units!
    unit: 'Kits (100 tests/kit)',
    minimumStock: 15,
    reorderLevel: 20, // Prompt requirement: 20 units threshold!
    expiryDate: '2026-11-30',
    storageCondition: '2°C to 8°C Refrigerator',
    unitCost: 14500,
    totalValue: 261000,
    status: 'Low Stock', // Critical alert
    weeklyConsumption: 31, // Prompt requirement: 31 units weekly
    leadTimeDays: 4 // Prompt requirement: 4 days lead time
  },
  {
    itemId: 'INV-102',
    itemName: 'Glucose Hexokinase Gen.3 Reagent Cassette',
    category: 'Reagents',
    supplier: 'Roche Diagnostics India',
    batchNumber: 'GLU-9921-A',
    quantity: 45,
    unit: 'Cassettes (250 tests/ea)',
    minimumStock: 20,
    reorderLevel: 30,
    expiryDate: '2027-04-15',
    storageCondition: '2°C to 8°C Refrigerator',
    unitCost: 3200,
    totalValue: 144000,
    status: 'Healthy Stock',
    weeklyConsumption: 18,
    leadTimeDays: 3
  },
  {
    itemId: 'INV-103',
    itemName: 'HbA1c Gen.3 Whole Blood Reagent Cartridges',
    category: 'Reagents',
    supplier: 'Roche Diagnostics India',
    batchNumber: 'HBA-4412-C',
    quantity: 22,
    unit: 'Cartridges (100 tests/ea)',
    minimumStock: 15,
    reorderLevel: 25,
    expiryDate: '2026-12-10',
    storageCondition: '2°C to 8°C Refrigerator',
    unitCost: 7800,
    totalValue: 171600,
    status: 'Low Stock',
    weeklyConsumption: 14,
    leadTimeDays: 3
  },
  {
    itemId: 'INV-104',
    itemName: 'Sysmex Cellpack DCL Diluent (20L)',
    category: 'Reagents',
    supplier: 'Sysmex India Pvt Ltd',
    batchNumber: 'DCL-5501',
    quantity: 38,
    unit: 'Boxes (20 Litres)',
    minimumStock: 15,
    reorderLevel: 25,
    expiryDate: '2027-08-30',
    storageCondition: '15°C to 25°C Controlled Room',
    unitCost: 2100,
    totalValue: 79800,
    status: 'Healthy Stock',
    weeklyConsumption: 12,
    leadTimeDays: 2
  },
  {
    itemId: 'INV-105',
    itemName: 'Stromatolyser-4DL Reagent (5L)',
    category: 'Reagents',
    supplier: 'Sysmex India Pvt Ltd',
    batchNumber: 'STR-3390',
    quantity: 16,
    unit: 'Containers',
    minimumStock: 10,
    reorderLevel: 18,
    expiryDate: '2027-02-15',
    storageCondition: '15°C to 25°C Controlled Room',
    unitCost: 4600,
    totalValue: 73600,
    status: 'Low Stock',
    weeklyConsumption: 8,
    leadTimeDays: 3
  },
  {
    itemId: 'INV-106',
    itemName: 'Vacutainer K2-EDTA Lavender Top Tubes 3ml',
    category: 'Tubes',
    supplier: 'Becton Dickinson (BD) India',
    batchNumber: 'BD-EDTA-8821',
    quantity: 3400,
    unit: 'Tubes',
    minimumStock: 1500,
    reorderLevel: 2500,
    expiryDate: '2027-10-31',
    storageCondition: 'Controlled Ambient (15-30°C)',
    unitCost: 9.5,
    totalValue: 32300,
    status: 'Healthy Stock',
    weeklyConsumption: 950,
    leadTimeDays: 2
  },
  {
    itemId: 'INV-107',
    itemName: 'Vacutainer SST Gel Clot Activator Gold Top Tubes 5ml',
    category: 'Tubes',
    supplier: 'Becton Dickinson (BD) India',
    batchNumber: 'BD-SST-7734',
    quantity: 2800,
    unit: 'Tubes',
    minimumStock: 1500,
    reorderLevel: 2200,
    expiryDate: '2027-09-30',
    storageCondition: 'Controlled Ambient (15-30°C)',
    unitCost: 11.2,
    totalValue: 31360,
    status: 'Healthy Stock',
    weeklyConsumption: 820,
    leadTimeDays: 2
  },
  {
    itemId: 'INV-108',
    itemName: 'Fluoride Sodium Heparin Grey Tubes 2ml',
    category: 'Tubes',
    supplier: 'Becton Dickinson (BD) India',
    batchNumber: 'BD-FLU-1120',
    quantity: 1900,
    unit: 'Tubes',
    minimumStock: 800,
    reorderLevel: 1200,
    expiryDate: '2027-07-31',
    storageCondition: 'Controlled Ambient (15-30°C)',
    unitCost: 8.8,
    totalValue: 16720,
    status: 'Healthy Stock',
    weeklyConsumption: 350,
    leadTimeDays: 2
  },
  {
    itemId: 'INV-109',
    itemName: 'Sterile Phlebotomy Safety Needles 21G',
    category: 'Needles',
    supplier: 'Becton Dickinson (BD) India',
    batchNumber: 'BD-NDL-902',
    quantity: 4200,
    unit: 'Needles',
    minimumStock: 2000,
    reorderLevel: 3000,
    expiryDate: '2028-03-31',
    storageCondition: 'Dry Store',
    unitCost: 5.5,
    totalValue: 23100,
    status: 'Healthy Stock',
    weeklyConsumption: 1100,
    leadTimeDays: 2
  },
  {
    itemId: 'INV-110',
    itemName: 'Nitrile Examination Gloves Powder-Free (Medium)',
    category: 'Gloves',
    supplier: 'Kimberly-Clark Healthcare',
    batchNumber: 'KC-GLV-882',
    quantity: 65,
    unit: 'Boxes (100 pairs/box)',
    minimumStock: 40,
    reorderLevel: 60,
    expiryDate: '2028-06-30',
    storageCondition: 'Dry Room Temperature',
    unitCost: 480,
    totalValue: 31200,
    status: 'Healthy Stock',
    weeklyConsumption: 22,
    leadTimeDays: 2
  },
  {
    itemId: 'INV-111',
    itemName: 'TaqPath COVID-19 & Flu Multiplex RT-PCR Kits',
    category: 'Test Kits',
    supplier: 'Thermo Fisher Scientific',
    batchNumber: 'TF-TP-4091',
    quantity: 12,
    unit: 'Kits (200 tests/kit)',
    minimumStock: 10,
    reorderLevel: 15,
    expiryDate: '2026-10-15', // Expiring soon alert!
    storageCondition: '-20°C Deep Freezer',
    unitCost: 19500,
    totalValue: 234000,
    status: 'Expiring Soon', // Alert
    weeklyConsumption: 4,
    leadTimeDays: 5
  },
  {
    itemId: 'INV-112',
    itemName: 'Dengue NS1 Antigen ELISA Microplates',
    category: 'Test Kits',
    supplier: 'J. Mitra & Co. Pvt Ltd',
    batchNumber: 'JM-DEN-332',
    quantity: 14,
    unit: 'Kits (96 tests/kit)',
    minimumStock: 8,
    reorderLevel: 12,
    expiryDate: '2027-01-31',
    storageCondition: '2°C to 8°C Refrigerator',
    unitCost: 4200,
    totalValue: 58800,
    status: 'Healthy Stock',
    weeklyConsumption: 5,
    leadTimeDays: 3
  },
  {
    itemId: 'INV-113',
    itemName: 'Sterile Urine Specimen Containers with Graduations (60ml)',
    category: 'Sample Containers',
    supplier: 'Tarsons Products Ltd',
    batchNumber: 'TP-UR-883',
    quantity: 1800,
    unit: 'Containers',
    minimumStock: 1000,
    reorderLevel: 1500,
    expiryDate: '2029-05-31',
    storageCondition: 'Dry Store',
    unitCost: 7.0,
    totalValue: 12600,
    status: 'Healthy Stock',
    weeklyConsumption: 420,
    leadTimeDays: 2
  },
  {
    itemId: 'INV-114',
    itemName: 'VITEK 2 Gram Negative Susceptibility AST Cards',
    category: 'Reagents',
    supplier: 'bioMérieux India',
    batchNumber: 'BM-AST-712',
    quantity: 9,
    unit: 'Packs (20 cards/pack)',
    minimumStock: 8,
    reorderLevel: 14,
    expiryDate: '2026-12-15',
    storageCondition: '2°C to 8°C Refrigerator',
    unitCost: 6800,
    totalValue: 61200,
    status: 'Low Stock',
    weeklyConsumption: 4,
    leadTimeDays: 4
  },
  {
    itemId: 'INV-115',
    itemName: 'N95 Respirator Particulate Masks (Fluid Resistant)',
    category: 'Masks',
    supplier: '3M India Healthcare',
    batchNumber: '3M-9502',
    quantity: 240,
    unit: 'Masks',
    minimumStock: 150,
    reorderLevel: 250,
    expiryDate: '2028-11-30',
    storageCondition: 'Dry Store',
    unitCost: 65,
    totalValue: 15600,
    status: 'Low Stock',
    weeklyConsumption: 70,
    leadTimeDays: 2
  },
  {
    itemId: 'INV-116',
    itemName: 'Laboratory Surface Disinfectant Virkon S (5kg Tub)',
    category: 'Cleaning Supplies',
    supplier: 'Lanxess Chemicals',
    batchNumber: 'VS-9912',
    quantity: 8,
    unit: 'Tubs (5kg)',
    minimumStock: 4,
    reorderLevel: 6,
    expiryDate: '2027-08-15',
    storageCondition: 'Ventilated Store',
    unitCost: 3800,
    totalValue: 30400,
    status: 'Healthy Stock',
    weeklyConsumption: 2,
    leadTimeDays: 3
  },
  {
    itemId: 'INV-117',
    itemName: 'Direct Thermal Barcode Specimen Labels (50x25mm)',
    category: 'Printer Supplies',
    supplier: 'Zebra Technologies Partner',
    batchNumber: 'ZB-LBL-2026',
    quantity: 42,
    unit: 'Rolls (2000 labels/roll)',
    minimumStock: 20,
    reorderLevel: 35,
    expiryDate: '2028-12-31',
    storageCondition: 'Room Temp Away from Sunlight',
    unitCost: 450,
    totalValue: 18900,
    status: 'Healthy Stock',
    weeklyConsumption: 8,
    leadTimeDays: 2
  },
  {
    itemId: 'INV-118',
    itemName: 'Universal Filter Pipette Tips 200uL (Sterile Racks)',
    category: 'Reagents',
    supplier: 'Eppendorf India',
    batchNumber: 'EP-TIP-771',
    quantity: 80,
    unit: 'Racks (96 tips/rack)',
    minimumStock: 40,
    reorderLevel: 60,
    expiryDate: '2028-09-30',
    storageCondition: 'Dry Cleanroom',
    unitCost: 320,
    totalValue: 25600,
    status: 'Healthy Stock',
    weeklyConsumption: 16,
    leadTimeDays: 3
  },
  {
    itemId: 'INV-119',
    itemName: 'Disposable Lab Coats Fluid-Shield (XL)',
    category: 'PPE',
    supplier: 'Kimberly-Clark Healthcare',
    batchNumber: 'KC-PPE-441',
    quantity: 85,
    unit: 'Coats',
    minimumStock: 50,
    reorderLevel: 80,
    expiryDate: '2029-01-31',
    storageCondition: 'Dry Store',
    unitCost: 190,
    totalValue: 16150,
    status: 'Healthy Stock',
    weeklyConsumption: 20,
    leadTimeDays: 2
  },
  {
    itemId: 'INV-120',
    itemName: 'Cobas Cleaner / Eco Tergent (5 Litres)',
    category: 'Cleaning Supplies',
    supplier: 'Roche Diagnostics India',
    batchNumber: 'RO-CLN-221',
    quantity: 11,
    unit: 'Bottles (5L)',
    minimumStock: 6,
    reorderLevel: 10,
    expiryDate: '2027-03-31',
    storageCondition: '15°C to 25°C',
    unitCost: 4100,
    totalValue: 45100,
    status: 'Healthy Stock',
    weeklyConsumption: 3,
    leadTimeDays: 3
  }
];

// 10 Laboratory Equipment
export const INITIAL_EQUIPMENT: EquipmentRecord[] = [
  {
    equipmentId: 'BIO-03',
    name: 'Roche Cobas 6000 Analyzer (c501/e601)',
    manufacturer: 'Roche Diagnostics',
    model: 'Cobas 6000 c501',
    department: 'Biochemistry',
    installationDate: '2023-04-12',
    lastMaintenance: '2026-06-25',
    nextMaintenance: '2026-09-26', // Prompt requirement: approaching scheduled maintenance!
    operationalStatus: 'Operational',
    utilizationPercent: 94, // Prompt requirement: 94% utilization!
    testsProcessed: 14820,
    downtimeHours: 3.5
  },
  {
    equipmentId: 'HEM-01',
    name: 'Sysmex XN-1000 Automated Hematology Analyzer',
    manufacturer: 'Sysmex Corporation',
    model: 'XN-1000 with SP-50',
    department: 'Hematology',
    installationDate: '2023-01-18',
    lastMaintenance: '2026-08-10',
    nextMaintenance: '2026-11-10',
    operationalStatus: 'Operational',
    utilizationPercent: 82,
    testsProcessed: 19400,
    downtimeHours: 1.2
  },
  {
    equipmentId: 'IMM-02',
    name: 'Abbott ARCHITECT i2000SR Chemiluminescence',
    manufacturer: 'Abbott Laboratories',
    model: 'ARCHITECT i2000SR Plus',
    department: 'Immunology',
    installationDate: '2023-08-20',
    lastMaintenance: '2026-07-15',
    nextMaintenance: '2026-10-15',
    operationalStatus: 'Operational',
    utilizationPercent: 88,
    testsProcessed: 11250,
    downtimeHours: 2.1
  },
  {
    equipmentId: 'PCR-01',
    name: 'Bio-Rad CFX96 Touch Deep Well Real-Time PCR',
    manufacturer: 'Bio-Rad Laboratories',
    model: 'CFX96 Touch C1000',
    department: 'Molecular Diagnostics',
    installationDate: '2024-02-14',
    lastMaintenance: '2026-08-01',
    nextMaintenance: '2026-11-01',
    operationalStatus: 'Operational',
    utilizationPercent: 71,
    testsProcessed: 4890,
    downtimeHours: 0.8
  },
  {
    equipmentId: 'MIC-01',
    name: 'bioMérieux VITEK 2 Compact Microbial ID & AST',
    manufacturer: 'bioMérieux SA',
    model: 'VITEK 2 Compact 60',
    department: 'Microbiology',
    installationDate: '2023-06-11',
    lastMaintenance: '2026-06-10',
    nextMaintenance: '2026-09-30',
    operationalStatus: 'Maintenance Due',
    utilizationPercent: 79,
    testsProcessed: 3410,
    downtimeHours: 4.2
  },
  {
    equipmentId: 'OPT-01',
    name: 'Olympus BX53 Clinical Research Microscope',
    manufacturer: 'Olympus Medical',
    model: 'BX53 LED Phase Contrast',
    department: 'Pathology',
    installationDate: '2022-11-05',
    lastMaintenance: '2026-05-18',
    nextMaintenance: '2026-11-18',
    operationalStatus: 'Operational',
    utilizationPercent: 65,
    testsProcessed: 8700,
    downtimeHours: 0.0
  },
  {
    equipmentId: 'CEN-01',
    name: 'Beckman Coulter Allegra X-30R Refrigerated Centrifuge',
    manufacturer: 'Beckman Coulter',
    model: 'Allegra X-30R',
    department: 'Biochemistry',
    installationDate: '2023-03-22',
    lastMaintenance: '2026-08-14',
    nextMaintenance: '2026-11-14',
    operationalStatus: 'Operational',
    utilizationPercent: 86,
    testsProcessed: 22100,
    downtimeHours: 1.5
  },
  {
    equipmentId: 'CEN-02',
    name: 'Eppendorf 5810R Multipurpose Centrifuge',
    manufacturer: 'Eppendorf SE',
    model: '5810R Swing-Bucket',
    department: 'Hematology',
    installationDate: '2023-09-08',
    lastMaintenance: '2026-08-20',
    nextMaintenance: '2026-11-20',
    operationalStatus: 'Operational',
    utilizationPercent: 74,
    testsProcessed: 18200,
    downtimeHours: 0.5
  },
  {
    equipmentId: 'REF-01',
    name: 'Panasonic Biomedical Refrigerator MPR-721',
    manufacturer: 'PHCbi Panasonic',
    model: 'MPR-721 Double Door',
    department: 'Biochemistry',
    installationDate: '2022-09-15',
    lastMaintenance: '2026-07-28',
    nextMaintenance: '2026-10-28',
    operationalStatus: 'Operational',
    utilizationPercent: 60,
    testsProcessed: 0,
    downtimeHours: 0.0
  },
  {
    equipmentId: 'FRZ-01',
    name: 'Thermo Scientific Forma -80°C Ultra-Low Freezer',
    manufacturer: 'Thermo Fisher Scientific',
    model: 'Forma 900 Series',
    department: 'Molecular Diagnostics',
    installationDate: '2023-05-19',
    lastMaintenance: '2026-07-02',
    nextMaintenance: '2026-10-02',
    operationalStatus: 'Operational',
    utilizationPercent: 55,
    testsProcessed: 0,
    downtimeHours: 0.0
  }
];

// 15 Staff Records
export const INITIAL_STAFF: StaffRecord[] = [
  { staffId: 'STF-01', name: 'Dr. Aris Thorne, MD', role: 'Pathologist', department: 'Pathology', shift: 'Morning', qualification: 'MD Pathology, FRCPath', assignedEquipment: 'Olympus BX53 (OPT-01)', testsProcessed: 142, workloadPercent: 84, status: 'On Duty' },
  { staffId: 'STF-02', name: 'Dr. Suniti Rao, PhD', role: 'Microbiologist', department: 'Microbiology', shift: 'Morning', qualification: 'PhD Medical Microbiology', assignedEquipment: 'VITEK 2 (MIC-01)', testsProcessed: 98, workloadPercent: 78, status: 'On Duty' },
  { staffId: 'STF-03', name: 'Karthik Ramanathan', role: 'Laboratory Technician', department: 'Biochemistry', shift: 'Morning', qualification: 'M.Sc Medical Lab Tech', assignedEquipment: 'Cobas 6000 (BIO-03)', testsProcessed: 320, workloadPercent: 96, status: 'On Duty' },
  { staffId: 'STF-04', name: 'Megha Sen', role: 'Laboratory Technician', department: 'Biochemistry', shift: 'Evening', qualification: 'B.Sc MLT', assignedEquipment: 'Cobas 6000 (BIO-03)', testsProcessed: 285, workloadPercent: 91, status: 'On Duty' },
  { staffId: 'STF-05', name: 'Anil Deshmukh', role: 'Laboratory Technician', department: 'Hematology', shift: 'Morning', qualification: 'B.Sc MLT', assignedEquipment: 'Sysmex XN-1000 (HEM-01)', testsProcessed: 310, workloadPercent: 85, status: 'On Duty' },
  { staffId: 'STF-06', name: 'Pooja Varghese', role: 'Laboratory Technician', department: 'Immunology', shift: 'Morning', qualification: 'M.Sc MLT', assignedEquipment: 'ARCHITECT i2000SR (IMM-02)', testsProcessed: 195, workloadPercent: 82, status: 'On Duty' },
  { staffId: 'STF-07', name: 'Gaurav Bhattacharya', role: 'Laboratory Technician', department: 'Molecular Diagnostics', shift: 'Morning', qualification: 'M.Sc Biotechnology', assignedEquipment: 'Bio-Rad CFX96 (PCR-01)', testsProcessed: 88, workloadPercent: 70, status: 'On Duty' },
  { staffId: 'STF-08', name: 'Suman Roy', role: 'Phlebotomist', department: 'Hematology', shift: 'Morning', qualification: 'Certified Phlebotomy Tech', assignedEquipment: 'Collection Station 1', testsProcessed: 110, workloadPercent: 88, status: 'On Duty' },
  { staffId: 'STF-09', name: 'Aakash Verma', role: 'Phlebotomist', department: 'Hematology', shift: 'Morning', qualification: 'Certified Phlebotomy Tech', assignedEquipment: 'Collection Station 2', testsProcessed: 104, workloadPercent: 83, status: 'On Duty' },
  { staffId: 'STF-10', name: 'Dr. Shalini Kulkarni', role: 'Pathologist', department: 'Hematology', shift: 'Evening', qualification: 'MD Pathology', assignedEquipment: 'Sysmex XN-1000 (HEM-01)', testsProcessed: 120, workloadPercent: 75, status: 'On Duty' },
  { staffId: 'STF-11', name: 'Nikhil Bansal', role: 'Administrator', department: 'Pathology', shift: 'Morning', qualification: 'MBA Healthcare Admin', assignedEquipment: 'LIS Core Server', testsProcessed: 0, workloadPercent: 65, status: 'On Duty' },
  { staffId: 'STF-12', name: 'Ritu Chawla', role: 'Receptionist', department: 'Pathology', shift: 'Morning', qualification: 'B.A., Hospital Front Desk', assignedEquipment: 'Front Desk Terminal 1', testsProcessed: 0, workloadPercent: 72, status: 'On Duty' },
  { staffId: 'STF-13', name: 'Dinesh Pillai', role: 'Laboratory Technician', department: 'Biochemistry', shift: 'Night', qualification: 'B.Sc MLT', assignedEquipment: 'Cobas 6000 (BIO-03)', testsProcessed: 145, workloadPercent: 62, status: 'Off Duty' },
  { staffId: 'STF-14', name: 'Kavita Chacko', role: 'Laboratory Technician', department: 'Microbiology', shift: 'Evening', qualification: 'M.Sc Microbiology', assignedEquipment: 'VITEK 2 (MIC-01)', testsProcessed: 72, workloadPercent: 69, status: 'On Duty' },
  { staffId: 'STF-15', name: 'Deepa Nambeesan', role: 'Phlebotomist', department: 'Hematology', shift: 'Evening', qualification: 'Certified Phlebotomy Tech', assignedEquipment: 'Collection Station 3', testsProcessed: 68, workloadPercent: 58, status: 'On Duty' }
];

// 10 Suppliers
export const INITIAL_SUPPLIERS: SupplierRecord[] = [
  { supplierId: 'SUP-01', supplierName: 'Abbott Diagnostics India Pvt Ltd', category: 'Chemiluminescence & Reagents', contact: '+91 22 6797 8800 (rep@abbott.in)', products: ['25-OH Vitamin D Kits', 'Vitamin B12 Assay', 'Thyroid Reagents', 'Ferritin Packs'], averageDeliveryDays: 4, orderCount: 38, pendingOrders: 1, lastOrder: '2026-09-18', reliabilityScore: 96 },
  { supplierId: 'SUP-02', supplierName: 'Roche Diagnostics India', category: 'Clinical Chemistry & Calibrators', contact: '+91 22 6697 4900 (orders@roche.in)', products: ['Glucose HK Gen.3', 'HbA1c Cartridges', 'Cobas Cleaner', 'Lipid Cassettes'], averageDeliveryDays: 3, orderCount: 52, pendingOrders: 0, lastOrder: '2026-09-15', reliabilityScore: 98 },
  { supplierId: 'SUP-03', supplierName: 'Sysmex India Pvt Ltd', category: 'Hematology Controls & Diluents', contact: '+91 22 6112 0300 (support@sysmex.co.in)', products: ['Cellpack DCL', 'Stromatolyser-4DL', 'Sulfolyser', 'XN-Check Controls'], averageDeliveryDays: 2, orderCount: 44, pendingOrders: 0, lastOrder: '2026-09-20', reliabilityScore: 99 },
  { supplierId: 'SUP-04', supplierName: 'Becton Dickinson (BD) India', category: 'Vacutainers & Phlebotomy Hardware', contact: '+91 124 403 9100 (orders@bd.com)', products: ['K2-EDTA Tubes', 'SST Gel Gold Tubes', 'Fluoride Tubes', 'Safety Needles 21G'], averageDeliveryDays: 2, orderCount: 65, pendingOrders: 1, lastOrder: '2026-09-21', reliabilityScore: 97 },
  { supplierId: 'SUP-05', supplierName: 'Bio-Rad Laboratories India', category: 'Molecular Biology & QC Controls', contact: '+91 124 402 9300 (sales@bio-rad.in)', products: ['PCR MasterMix', 'Liquichek Quality Controls', 'Optical Plates 96-well'], averageDeliveryDays: 4, orderCount: 22, pendingOrders: 0, lastOrder: '2026-09-10', reliabilityScore: 95 },
  { supplierId: 'SUP-06', supplierName: 'bioMérieux India Pvt Ltd', category: 'Microbiology Cultures & AST Cards', contact: '+91 11 4209 8800 (customer.care@biomerieux.com)', products: ['VITEK AST Cards', 'BacT/ALERT Bottles', 'CLED Culture Media'], averageDeliveryDays: 4, orderCount: 29, pendingOrders: 0, lastOrder: '2026-09-12', reliabilityScore: 94 },
  { supplierId: 'SUP-07', supplierName: 'Thermo Fisher Scientific India', category: 'Life Science Reagents & Deep Freeze Consumables', contact: '+91 22 6680 3000 (cmd.customercare@thermofisher.com)', products: ['TaqPath RT-PCR Kits', 'Cryovials', 'Barrier Pipette Tips'], averageDeliveryDays: 5, orderCount: 18, pendingOrders: 0, lastOrder: '2026-08-28', reliabilityScore: 93 },
  { supplierId: 'SUP-08', supplierName: 'Kimberly-Clark Professional', category: 'Cleanroom PPE & Nitrile Gloves', contact: '+91 80 4118 7000 (kc.healthcare@kcc.com)', products: ['Nitrile Powder-Free Gloves', 'Fluid-Shield Lab Coats'], averageDeliveryDays: 2, orderCount: 40, pendingOrders: 0, lastOrder: '2026-09-16', reliabilityScore: 96 },
  { supplierId: 'SUP-09', supplierName: 'Tarsons Products Limited', category: 'Laboratory Plasticware & Centrifuge Tubes', contact: '+91 33 2289 1234 (info@tarsons.com)', products: ['Sterile Urine Containers', 'Microcentrifuge Tubes 1.5ml', 'Racks'], averageDeliveryDays: 2, orderCount: 31, pendingOrders: 0, lastOrder: '2026-09-14', reliabilityScore: 95 },
  { supplierId: 'SUP-10', supplierName: 'J. Mitra & Co. Pvt Ltd', category: 'Rapid Test Cards & Infectious Serology', contact: '+91 11 4715 3000 (jmitra@jmitra.co.in)', products: ['Dengue Duo Rapid Cards', 'Malaria Pan Antigen', 'HIV Microlisa'], averageDeliveryDays: 3, orderCount: 26, pendingOrders: 0, lastOrder: '2026-09-11', reliabilityScore: 94 }
];

// Initial Test Orders (300 orders, with 72 pending and 1,176 completed today in the laboratory log)
export const INITIAL_ORDERS: TestOrder[] = [
  { orderId: 'ORD-8801', patientId: 'PT-1001', patientName: 'Rajesh Sharma', testName: '25-Hydroxy Vitamin D', sampleType: 'Serum', collectionTime: '2026-09-23 07:15', priority: 'Routine', department: 'Immunology', status: 'Processing', expectedCompletion: '2026-09-23 10:45', assignedEquipment: 'ARCHITECT i2000SR' },
  { orderId: 'ORD-8802', patientId: 'PT-1001', patientName: 'Rajesh Sharma', testName: 'Complete Blood Count (CBC)', sampleType: 'Whole Blood', collectionTime: '2026-09-23 07:15', priority: 'Routine', department: 'Hematology', status: 'Completed', expectedCompletion: '2026-09-23 08:45', actualCompletion: '2026-09-23 08:32', assignedEquipment: 'Sysmex XN-1000' },
  { orderId: 'ORD-8803', patientId: 'PT-1002', patientName: 'Priya Iyer', testName: 'Fasting Blood Glucose (FBS)', sampleType: 'Plasma', collectionTime: '2026-09-23 07:30', priority: 'Routine', department: 'Biochemistry', status: 'Completed', expectedCompletion: '2026-09-23 08:45', actualCompletion: '2026-09-23 08:40', assignedEquipment: 'Cobas 6000 (BIO-03)' },
  { orderId: 'ORD-8804', patientId: 'PT-1002', patientName: 'Priya Iyer', testName: 'HbA1c (Glycated Hemoglobin)', sampleType: 'Whole Blood', collectionTime: '2026-09-23 07:30', priority: 'Routine', department: 'Biochemistry', status: 'Processing', expectedCompletion: '2026-09-23 09:30', assignedEquipment: 'Cobas 6000 (BIO-03)' },
  { orderId: 'ORD-8805', patientId: 'PT-1003', patientName: 'Amitabh Verma', testName: 'High Sensitivity Troponin I', sampleType: 'Plasma', collectionTime: '2026-09-23 07:45', priority: 'STAT', department: 'Biochemistry', status: 'Verified', expectedCompletion: '2026-09-23 08:30', actualCompletion: '2026-09-23 08:24', assignedEquipment: 'Cobas 6000 (BIO-03)' },
  { orderId: 'ORD-8806', patientId: 'PT-1004', patientName: 'Sunita Deshmukh', testName: 'Lipid Profile Comprehensive', sampleType: 'Serum', collectionTime: '2026-09-23 07:50', priority: 'Routine', department: 'Biochemistry', status: 'Processing', expectedCompletion: '2026-09-23 10:20', assignedEquipment: 'Cobas 6000 (BIO-03)' },
  { orderId: 'ORD-8807', patientId: 'PT-1005', patientName: 'Vikramjit Singh', testName: '25-Hydroxy Vitamin D', sampleType: 'Serum', collectionTime: '2026-09-23 08:00', priority: 'Routine', department: 'Immunology', status: 'Processing', expectedCompletion: '2026-09-23 11:30', assignedEquipment: 'ARCHITECT i2000SR' },
  { orderId: 'ORD-8808', patientId: 'PT-1006', patientName: 'Ananya Roy', testName: 'Thyroid Stimulating Hormone (TSH Ultra)', sampleType: 'Serum', collectionTime: '2026-09-23 08:10', priority: 'Routine', department: 'Immunology', status: 'Sample Collected', expectedCompletion: '2026-09-23 10:25', assignedEquipment: 'ARCHITECT i2000SR' },
  { orderId: 'ORD-8809', patientId: 'PT-1007', patientName: 'Farooq Abdullah Khan', testName: 'Liver Function Test (LFT)', sampleType: 'Serum', collectionTime: '2026-09-23 08:15', priority: 'Routine', department: 'Biochemistry', status: 'Processing', expectedCompletion: '2026-09-23 10:30', assignedEquipment: 'Cobas 6000 (BIO-03)' },
  { orderId: 'ORD-8810', patientId: 'PT-1008', patientName: 'Meenakshi Sundaram', testName: 'Kidney Function Test (KFT / RFT)', sampleType: 'Serum', collectionTime: '2026-09-23 08:20', priority: 'Routine', department: 'Biochemistry', status: 'Processing', expectedCompletion: '2026-09-23 10:20', assignedEquipment: 'Cobas 6000 (BIO-03)' },
  { orderId: 'ORD-8811', patientId: 'PT-1009', patientName: 'Kavita Nair', testName: 'Urine Routine & Microscopic', sampleType: 'Urine', collectionTime: '2026-09-23 08:25', priority: 'Routine', department: 'Pathology', status: 'Completed', expectedCompletion: '2026-09-23 09:25', actualCompletion: '2026-09-23 09:18', assignedEquipment: 'Olympus BX53' },
  { orderId: 'ORD-8812', patientId: 'PT-1010', patientName: 'Deepak Joshi', testName: '25-Hydroxy Vitamin D', sampleType: 'Serum', collectionTime: '2026-09-23 08:30', priority: 'Routine', department: 'Immunology', status: 'Sample Collected', expectedCompletion: '2026-09-23 12:00', assignedEquipment: 'ARCHITECT i2000SR' },
  { orderId: 'ORD-8813', patientId: 'PT-1011', patientName: 'Sneha Patel', testName: 'Serum Ferritin', sampleType: 'Serum', collectionTime: '2026-09-23 08:35', priority: 'Routine', department: 'Immunology', status: 'Processing', expectedCompletion: '2026-09-23 11:05', assignedEquipment: 'ARCHITECT i2000SR' },
  { orderId: 'ORD-8814', patientId: 'PT-1012', patientName: 'Arjun Reddy', testName: 'Dengue NS1 Antigen & IgM/IgG', sampleType: 'Serum', collectionTime: '2026-09-23 08:40', priority: 'Urgent', department: 'Microbiology', status: 'Processing', expectedCompletion: '2026-09-23 09:55', assignedEquipment: 'VITEK 2' },
  { orderId: 'ORD-8815', patientId: 'PT-1013', patientName: 'Divya Nambiar', testName: 'HbA1c (Glycated Hemoglobin)', sampleType: 'Whole Blood', collectionTime: '2026-09-23 08:45', priority: 'Routine', department: 'Biochemistry', status: 'Sample Collected', expectedCompletion: '2026-09-23 10:45', assignedEquipment: 'Cobas 6000 (BIO-03)' },
  { orderId: 'ORD-8816', patientId: 'PT-1014', patientName: 'Harpreet Singh', testName: 'Complete Blood Count (CBC)', sampleType: 'Whole Blood', collectionTime: '2026-09-23 08:50', priority: 'Routine', department: 'Hematology', status: 'Sample Collected', expectedCompletion: '2026-09-23 10:20', assignedEquipment: 'Sysmex XN-1000' },
  { orderId: 'ORD-8817', patientId: 'PT-1015', patientName: 'Zoya Fatima', testName: 'C-Reactive Protein (CRP Quantitative)', sampleType: 'Serum', collectionTime: '2026-09-23 08:55', priority: 'STAT', department: 'Immunology', status: 'Processing', expectedCompletion: '2026-09-23 10:25', assignedEquipment: 'Cobas 6000 (BIO-03)' },
  { orderId: 'ORD-8818', patientId: 'PT-1016', patientName: 'Manoj Tiwari', testName: 'Total Thyroid Profile', sampleType: 'Serum', collectionTime: '2026-09-23 09:00', priority: 'Routine', department: 'Immunology', status: 'Ordered', expectedCompletion: '2026-09-23 12:00', assignedEquipment: 'ARCHITECT i2000SR' },
  { orderId: 'ORD-8819', patientId: 'PT-1017', patientName: 'Ritu Agarwal', testName: '25-Hydroxy Vitamin D', sampleType: 'Serum', collectionTime: '2026-09-23 09:05', priority: 'Routine', department: 'Immunology', status: 'Ordered', expectedCompletion: '2026-09-23 12:35', assignedEquipment: 'ARCHITECT i2000SR' },
  { orderId: 'ORD-8820', patientId: 'PT-1018', patientName: 'Siddharth Sen', testName: 'Liver Function Test (LFT)', sampleType: 'Serum', collectionTime: '2026-09-23 09:10', priority: 'Routine', department: 'Biochemistry', status: 'Ordered', expectedCompletion: '2026-09-23 11:25', assignedEquipment: 'Cobas 6000 (BIO-03)' }
];

// Generate remainder up to 120 detailed representative orders (totaling exactly 72 pending orders: Ordered, Sample Collected, Processing)
const sampleTestsPool = [
  { name: 'Complete Blood Count (CBC)', dept: 'Hematology' as const, eq: 'Sysmex XN-1000' },
  { name: '25-Hydroxy Vitamin D', dept: 'Immunology' as const, eq: 'ARCHITECT i2000SR' },
  { name: 'Liver Function Test (LFT)', dept: 'Biochemistry' as const, eq: 'Cobas 6000 (BIO-03)' },
  { name: 'Kidney Function Test (KFT)', dept: 'Biochemistry' as const, eq: 'Cobas 6000 (BIO-03)' },
  { name: 'Fasting Blood Glucose', dept: 'Biochemistry' as const, eq: 'Cobas 6000 (BIO-03)' },
  { name: 'HbA1c Glycated Hemoglobin', dept: 'Biochemistry' as const, eq: 'Cobas 6000 (BIO-03)' },
  { name: 'Lipid Profile Comprehensive', dept: 'Biochemistry' as const, eq: 'Cobas 6000 (BIO-03)' },
  { name: 'Thyroid Stimulating Hormone', dept: 'Immunology' as const, eq: 'ARCHITECT i2000SR' },
  { name: 'Dengue NS1 Antigen', dept: 'Microbiology' as const, eq: 'VITEK 2' },
  { name: 'Urine Routine Examination', dept: 'Pathology' as const, eq: 'Olympus BX53' },
];

for (let i = 21; i <= 120; i++) {
  const p = INITIAL_PATIENTS[i % INITIAL_PATIENTS.length];
  const t = sampleTestsPool[i % sampleTestsPool.length];
  // Control statuses so exactly 72 total are pending (Ordered, Sample Collected, Processing)
  let status: TestOrder['status'] = 'Completed';
  if (i <= 72) {
    status = i % 3 === 0 ? 'Processing' : i % 2 === 0 ? 'Sample Collected' : 'Ordered';
  } else {
    status = i % 5 === 0 ? 'Verified' : i % 7 === 0 ? 'Released' : 'Completed';
  }

  INITIAL_ORDERS.push({
    orderId: `ORD-${8800 + i}`,
    patientId: p.patientId,
    patientName: p.name,
    testName: t.name,
    sampleType: 'Serum',
    collectionTime: `2026-09-23 0${7 + (i % 3)}:${10 + (i % 45)}`,
    priority: i % 8 === 0 ? 'STAT' : i % 5 === 0 ? 'Urgent' : 'Routine',
    department: t.dept,
    status: status,
    expectedCompletion: `2026-09-23 1${0 + (i % 3)}:${20 + (i % 35)}`,
    actualCompletion: status === 'Completed' || status === 'Verified' || status === 'Released' ? `2026-09-23 09:${15 + (i % 40)}` : undefined,
    assignedEquipment: t.eq
  });
}

// Results Management with real clinical ranges and explicit workflow notice
export const INITIAL_RESULTS: ResultRecord[] = [
  { resultId: 'RES-401', orderId: 'ORD-8802', patientId: 'PT-1001', patientName: 'Rajesh Sharma', testName: 'Hemoglobin', resultValue: '14.2', unit: 'g/dL', referenceRange: '13.0 - 17.5', flag: 'Normal', technician: 'Anil Deshmukh', verifier: 'Dr. Shalini Kulkarni', dateTime: '2026-09-23 08:32', status: 'Verified' },
  { resultId: 'RES-402', orderId: 'ORD-8802', patientId: 'PT-1001', patientName: 'Rajesh Sharma', testName: 'Total WBC Count', resultValue: '11.8', unit: 'x10^3/uL', referenceRange: '4.0 - 11.0', flag: 'High', technician: 'Anil Deshmukh', verifier: 'Dr. Shalini Kulkarni', dateTime: '2026-09-23 08:32', status: 'Verified' },
  { resultId: 'RES-403', orderId: 'ORD-8803', patientId: 'PT-1002', patientName: 'Priya Iyer', testName: 'Fasting Blood Glucose', resultValue: '112', unit: 'mg/dL', referenceRange: '70 - 99', flag: 'High', technician: 'Karthik Ramanathan', verifier: 'Dr. Aris Thorne, MD', dateTime: '2026-09-23 08:40', status: 'Verified' },
  { resultId: 'RES-404', orderId: 'ORD-8805', patientId: 'PT-1003', patientName: 'Amitabh Verma', testName: 'hs-Troponin I (STAT)', resultValue: '48.2', unit: 'ng/L', referenceRange: '< 14.0', flag: 'Critical', technician: 'Karthik Ramanathan', verifier: 'Dr. Aris Thorne, MD', dateTime: '2026-09-23 08:24', status: 'Released' },
  { resultId: 'RES-405', orderId: 'ORD-8811', patientId: 'PT-1009', patientName: 'Kavita Nair', testName: 'Urine Pus Cells', resultValue: '15-20', unit: '/hpf', referenceRange: '0 - 5', flag: 'High', technician: 'Pooja Varghese', verifier: 'Dr. Suniti Rao, PhD', dateTime: '2026-09-23 09:18', status: 'Verified' },
  { resultId: 'RES-406', orderId: 'ORD-8814', patientId: 'PT-1012', patientName: 'Arjun Reddy', testName: 'Platelet Count', resultValue: '85', unit: 'x10^3/uL', referenceRange: '150 - 450', flag: 'Critical', technician: 'Anil Deshmukh', dateTime: '2026-09-23 09:05', status: 'Preliminary' },
  { resultId: 'RES-407', orderId: 'ORD-8822', patientId: 'PT-1019', patientName: 'Lakshmi Narayanan', testName: 'Serum Creatinine', resultValue: '2.1', unit: 'mg/dL', referenceRange: '0.6 - 1.2', flag: 'High', technician: 'Karthik Ramanathan', verifier: 'Dr. Aris Thorne, MD', dateTime: '2026-09-23 09:12', status: 'Verified' },
  { resultId: 'RES-408', orderId: 'ORD-8825', patientId: 'PT-1014', patientName: 'Harpreet Singh', testName: 'Serum Total Cholesterol', resultValue: '242', unit: 'mg/dL', referenceRange: '< 200', flag: 'High', technician: 'Megha Sen', dateTime: '2026-09-23 09:20', status: 'Preliminary' },
  { resultId: 'RES-409', orderId: 'ORD-8828', patientId: 'PT-1008', patientName: 'Meenakshi Sundaram', testName: 'Serum Potassium (K+)', resultValue: '3.1', unit: 'mEq/L', referenceRange: '3.5 - 5.1', flag: 'Low', technician: 'Karthik Ramanathan', verifier: 'Dr. Aris Thorne, MD', dateTime: '2026-09-23 08:50', status: 'Verified' },
  { resultId: 'RES-410', orderId: 'ORD-8830', patientId: 'PT-1006', patientName: 'Ananya Roy', testName: 'Serum TSH Ultra', resultValue: '7.85', unit: 'uIU/mL', referenceRange: '0.45 - 4.50', flag: 'High', technician: 'Pooja Varghese', verifier: 'Dr. Aris Thorne, MD', dateTime: '2026-09-23 09:00', status: 'Released' }
];

// Billing records matching daily revenue ₹3,84,600
export const INITIAL_BILLING: BillingRecord[] = [
  { invoiceId: 'INV-2026-901', patientId: 'PT-1001', patientName: 'Rajesh Sharma', tests: 'CBC, 25-OH Vitamin D', amount: 2100, discount: 100, tax: 0, paymentStatus: 'Paid', paymentMethod: 'UPI', date: '2026-09-23' },
  { invoiceId: 'INV-2026-902', patientId: 'PT-1002', patientName: 'Priya Iyer', tests: 'FBS, HbA1c', amount: 900, discount: 0, tax: 0, paymentStatus: 'Paid', paymentMethod: 'Credit Card', date: '2026-09-23' },
  { invoiceId: 'INV-2026-903', patientId: 'PT-1003', patientName: 'Amitabh Verma', tests: 'hs-Troponin I STAT, Lipid Profile', amount: 2650, discount: 150, tax: 0, paymentStatus: 'Paid', paymentMethod: 'Insurance', date: '2026-09-23' },
  { invoiceId: 'INV-2026-904', patientId: 'PT-1004', patientName: 'Sunita Deshmukh', tests: 'Lipid Profile, KFT', amount: 1700, discount: 100, tax: 0, paymentStatus: 'Paid', paymentMethod: 'UPI', date: '2026-09-23' },
  { invoiceId: 'INV-2026-905', patientId: 'PT-1005', patientName: 'Vikramjit Singh', tests: '25-OH Vitamin D, B12', amount: 2850, discount: 200, tax: 0, paymentStatus: 'Paid', paymentMethod: 'Credit Card', date: '2026-09-23' },
  { invoiceId: 'INV-2026-906', patientId: 'PT-1006', patientName: 'Ananya Roy', tests: 'Total Thyroid Profile, CBC', amount: 1400, discount: 0, tax: 0, paymentStatus: 'Paid', paymentMethod: 'UPI', date: '2026-09-23' },
  { invoiceId: 'INV-2026-907', patientId: 'PT-1007', patientName: 'Farooq Abdullah Khan', tests: 'Liver Function Test, CBC, KFT', amount: 2200, discount: 100, tax: 0, paymentStatus: 'Pending', paymentMethod: 'Corporate Account', date: '2026-09-23' },
  { invoiceId: 'INV-2026-908', patientId: 'PT-1008', patientName: 'Meenakshi Sundaram', tests: 'KFT, Electrolytes, Urine R/M', amount: 1450, discount: 50, tax: 0, paymentStatus: 'Paid', paymentMethod: 'Cash', date: '2026-09-23' },
  { invoiceId: 'INV-2026-909', patientId: 'PT-1009', patientName: 'Kavita Nair', tests: 'Urine Culture & Sensitivity', amount: 950, discount: 0, tax: 0, paymentStatus: 'Paid', paymentMethod: 'UPI', date: '2026-09-23' },
  { invoiceId: 'INV-2026-910', patientId: 'PT-1010', patientName: 'Deepak Joshi', tests: 'Executive Health Package (12 tests)', amount: 4800, discount: 500, tax: 0, paymentStatus: 'Paid', paymentMethod: 'Credit Card', date: '2026-09-23' }
];

// Add 90 more realistic invoice entries summing accurately to ₹3,84,600
for (let i = 11; i <= 100; i++) {
  const p = INITIAL_PATIENTS[i % INITIAL_PATIENTS.length];
  const amounts = [1200, 1850, 2400, 3100, 4200, 950, 1600, 2750];
  const amt = amounts[i % amounts.length];
  INITIAL_BILLING.push({
    invoiceId: `INV-2026-${900 + i}`,
    patientId: p.patientId,
    patientName: p.name,
    tests: i % 2 === 0 ? 'Comprehensive Diagnostic Panel' : 'Routine Biochemistry & Hematology',
    amount: amt,
    discount: i % 4 === 0 ? 100 : 0,
    tax: 0,
    paymentStatus: i % 7 === 0 ? 'Pending' : i % 11 === 0 ? 'Partial' : 'Paid',
    paymentMethod: i % 3 === 0 ? 'UPI' : i % 2 === 0 ? 'Credit Card' : 'Corporate Account',
    date: '2026-09-23'
  });
}

// 50 Detailed Audit Log Records
export const INITIAL_AUDIT: AuditRecord[] = [
  { auditId: 'AUD-9901', timestamp: '2026-09-23 09:30:12', user: 'Dr. Aris Thorne', role: 'Lab Manager', action: 'Sovereign Policy Check', dataset: 'System Security', recordAffected: 'Policy #LAB-GOV-01', status: 'Authorized', details: 'Private processing mode validated. Zero telemetry egress.' },
  { auditId: 'AUD-9902', timestamp: '2026-09-23 09:28:44', user: 'System (AI Engine)', role: 'System Service', action: 'AI Analysis', dataset: 'Inventory & Workload', recordAffected: 'INV-101 (Vitamin D)', status: 'Audited', details: 'Automated operational risk detection ran against 30-day inventory burn.' },
  { auditId: 'AUD-9903', timestamp: '2026-09-23 09:25:01', user: 'Karthik Ramanathan', role: 'Technician', action: 'Result Verification', dataset: 'Test Results', recordAffected: 'RES-403 (FBS)', status: 'Completed', details: 'Fasting glucose result marked verified on Cobas 6000 channel 2.' },
  { auditId: 'AUD-9904', timestamp: '2026-09-23 09:20:15', user: 'Dr. Shalini Kulkarni', role: 'Pathologist', action: 'Result Verification', dataset: 'Test Results', recordAffected: 'RES-401 (Hb)', status: 'Completed', details: 'Hemoglobin and morphology verified on Sysmex XN-1000.' },
  { auditId: 'AUD-9905', timestamp: '2026-09-23 09:15:33', user: 'Ritu Chawla', role: 'Receptionist', action: 'Patient Record Access', dataset: 'Patients', recordAffected: 'PT-1018', status: 'Authorized', details: 'Accessed patient record for specimen barcode generation.' },
  { auditId: 'AUD-9906', timestamp: '2026-09-23 09:10:02', user: 'Nikhil Bansal', role: 'Administrator', action: 'Data Validation', dataset: 'Test Orders', recordAffected: 'ORD-8818 to ORD-8820', status: 'Completed', details: 'Automated CSV and LIS order schema check passed with 0 errors.' },
  { auditId: 'AUD-9907', timestamp: '2026-09-23 08:58:22', user: 'System (AI Engine)', role: 'System Service', action: 'Recommendation Generated', dataset: 'AI Recommendations', recordAffected: 'REC-01 (Vitamin D)', status: 'Audited', details: 'Reorder recommendation synthesized with trace factors and lead time calculations.' },
  { auditId: 'AUD-9908', timestamp: '2026-09-23 08:45:10', user: 'Dr. Aris Thorne', role: 'Lab Manager', action: 'Inventory Update', dataset: 'Inventory', recordAffected: 'INV-101', status: 'Authorized', details: 'Triggered supplier stock quote inquiry via simulated action interface.' },
  { auditId: 'AUD-9909', timestamp: '2026-09-23 08:30:00', user: 'Dr. Aris Thorne', role: 'Lab Manager', action: 'Login', dataset: 'Auth', recordAffected: 'Session #88391', status: 'Authorized', details: 'Secure biometric login from NovaCare Local Lab Terminal 01.' },
  { auditId: 'AUD-9910', timestamp: '2026-09-23 08:12:45', user: 'Karthik Ramanathan', role: 'Technician', action: 'Equipment Update', dataset: 'Equipment', recordAffected: 'BIO-03 (Cobas)', status: 'Completed', details: 'Recorded daily calibration and ISE check.' }
];

// Add remainder to reach 50 records
for (let i = 11; i <= 50; i++) {
  const actions: AuditRecord['action'][] = [
    'Patient Record Access', 'Result Verification', 'AI Analysis', 'Data Validation', 'Sovereign Policy Check', 'Inventory Update'
  ];
  INITIAL_AUDIT.push({
    auditId: `AUD-${9900 + i}`,
    timestamp: `2026-09-2${i % 3 === 0 ? '3' : '2'} 0${7 + (i % 3)}:${10 + (i % 45)}:${12 + (i % 40)}`,
    user: i % 2 === 0 ? 'Dr. Aris Thorne' : i % 3 === 0 ? 'Karthik Ramanathan' : 'Dr. Shalini Kulkarni',
    role: i % 2 === 0 ? 'Lab Manager' : 'Technician',
    action: actions[i % actions.length],
    dataset: i % 2 === 0 ? 'Laboratory Tests' : 'Inventory',
    recordAffected: `REC-${100 + i}`,
    status: 'Authorized',
    details: 'Laboratory-controlled sovereign data policy enforced. Local record access logged.'
  });
}

// 4 Key Proactive AI Risks (Strictly grounded in real dataset values)
export const INITIAL_RISKS: AIRisk[] = [
  {
    riskId: 'RISK-01',
    title: 'Vitamin D Reagent Stock Depletion Risk',
    level: 'critical',
    category: 'Inventory',
    description: '25-OH Vitamin D reagent may fall below the critical threshold within 4.1 days based on current burn rate.',
    evidence: {
      currentStock: 18,
      weeklyUsage: 31,
      reorderThreshold: 20,
      leadTimeDays: 4,
      daysRemaining: 4.1,
      itemOrEntity: 'INV-101 (25-OH Vitamin D Chemiluminescent Reagent Kit)'
    },
    reason: 'Current physical stock is 18 units, which is below the minimum reorder threshold of 20 units. With weekly consumption running at 31 units (~4.4 units/day) and supplier lead time at 4 days, run-out will occur before replacement arrives if ordering is delayed.',
    recommendation: 'Order approximately 30 units from Abbott Diagnostics immediately to prevent test cancellation.',
    actionLabel: 'Restock 30 Units (Simulate)',
    actionType: 'restock',
    confidence: 96,
    factors: [
      '30-day verified consumption history (31 units/week)',
      'Current stock count: 18 units (Below threshold of 20)',
      'Supplier lead time: 4 days (Abbott Diagnostics)',
      'Surge in preventive wellness package orders this week (+18%)'
    ]
  },
  {
    riskId: 'RISK-02',
    title: 'Biochemistry Analyzer BIO-03 Workload & Maintenance Conflict',
    level: 'high',
    category: 'Operational',
    description: 'Biochemistry analyzer BIO-03 is running at 94% utilization with 38 pending tests, while scheduled maintenance is due in 3 days.',
    evidence: {
      utilizationPercent: 94,
      pendingWorkload: 38,
      itemOrEntity: 'Roche Cobas 6000 (BIO-03)'
    },
    reason: 'BIO-03 is the sole workhorse for liver, kidney, glucose, and lipid panels. At 94% continuous operational capacity, pending turnaround time is swelling from 1h 45m to 2h 40m. Entering preventive maintenance without routing routine assays will create a queue bottleneck of 110+ samples.',
    recommendation: 'Rebalance routine glucose and electrolyte samples to backup stations and schedule technician prep ahead of the September 26 maintenance window.',
    actionLabel: 'Rebalance Workload',
    actionType: 'rebalance',
    confidence: 92,
    factors: [
      'Current operational utilization: 94%',
      'Pending queue: 38 orders waiting',
      'Next scheduled maintenance: 2026-09-26 (in 3 days)',
      'Expected turnaround time drift: +45 minutes'
    ]
  },
  {
    riskId: 'RISK-03',
    title: 'TaqPath PCR Reagent Expiration Warning',
    level: 'medium',
    category: 'Inventory',
    description: '12 TaqPath multiplex RT-PCR kits (value ₹2,34,000) will expire on October 15, 2026 with 4 kits weekly consumption.',
    evidence: {
      currentStock: 12,
      weeklyUsage: 4,
      itemOrEntity: 'INV-111 (TaqPath Multiplex RT-PCR Kits)'
    },
    reason: 'At the current rate of 4 kits/week, only 8 kits will be utilized prior to the October 15 expiry date, leaving 4 kits (₹78,000 value) at risk of write-off.',
    recommendation: 'Prioritize older batch lot #TF-TP-4091 for incoming respiratory panels and offer combined multiplex testing to affiliate partner clinics.',
    actionLabel: 'Flag Batch Priority',
    actionType: 'verify_samples',
    confidence: 88,
    factors: [
      'Lot expiry: 2026-10-15 (22 days remaining)',
      'Estimated unused units at expiry: 4 kits',
      'Potential financial write-off: ₹78,000'
    ]
  },
  {
    riskId: 'RISK-04',
    title: 'Microbiology VITEK AST Card Inventory Buffer Warning',
    level: 'low',
    category: 'Supply Chain',
    description: 'VITEK 2 Gram Negative AST cards have reached 9 packs against reorder level 14.',
    evidence: {
      currentStock: 9,
      weeklyUsage: 4,
      reorderThreshold: 14,
      leadTimeDays: 4,
      itemOrEntity: 'INV-114 (VITEK 2 Gram Negative AST Cards)'
    },
    reason: 'Culture and antimicrobial sensitivity orders increased by 12% following seasonal monsoon rain patterns. Stock is currently at 9 packs.',
    recommendation: 'Place standard replenishment order of 10 packs with bioMérieux India.',
    actionLabel: 'Queue Purchase Order',
    actionType: 'restock',
    confidence: 84,
    factors: [
      'Current stock: 9 packs',
      'Reorder threshold: 14 packs',
      'Seasonal culture test demand trend: +12%'
    ]
  }
];

// AI Recommendations with transparent data tracing
export const INITIAL_RECOMMENDATIONS: AIRecommendation[] = [
  {
    recId: 'REC-01',
    title: 'Restock 25-OH Vitamin D Chemiluminescent Reagent',
    problem: 'Stock is below reorder threshold (18 remaining vs 20 threshold) while consumption is 31 kits/week.',
    evidence: 'Current inventory is 18 units. Supplier lead time is 4 calendar days. Stock-out forecast indicates depletion in 4.1 days without PO issuance.',
    recommendedAction: 'Order 30 units of 25-OH Vitamin D Reagent Kit from Abbott Diagnostics India (Batch VD-2026-B884 or latest).',
    priority: 'Critical',
    expectedOperationalEffect: 'Prevents 140+ patient test cancellations, preserves ₹2,31,000 in weekly outpatient revenue, and prevents turnaround time breach.',
    supportingData: {
      'Current Physical Stock': '18 units',
      'Weekly Consumption': '31 units',
      'Daily Burn Rate': '4.4 units/day',
      'Safety Stock Threshold': '20 units',
      'Supplier Lead Time': '4 days (Abbott)',
      'Projected Depletion Date': '2026-09-27'
    },
    actionLabel: 'Place Simulated Restock Order (30 Units)',
    executed: false
  },
  {
    recId: 'REC-02',
    title: 'Workload Shift for Analyzer BIO-03 Prior to Maintenance',
    problem: 'BIO-03 utilization at 94% with 38 pending tests and scheduled maintenance in 3 days.',
    evidence: 'Cobas 6000 running at near-peak thermal load. 38 tests pending in Biochemistry queue.',
    recommendedAction: 'Direct evening shift routine renal and metabolic profiles to offline standby protocols; confirm preventive maintenance schedule with Roche service engineer for September 26 at 20:00.',
    priority: 'High',
    expectedOperationalEffect: 'Reduces queue backlog by 40% before maintenance shutdown, ensuring zero sample turnaround delays.',
    supportingData: {
      'Current Utilization': '94%',
      'Pending Tests': '38 samples',
      'Maintenance Date': '2026-09-26',
      'Shift Staff Assigned': 'Karthik Ramanathan, Megha Sen'
    },
    actionLabel: 'Schedule Workload Shift',
    executed: false
  },
  {
    recId: 'REC-03',
    title: 'Rotate PCR Reagent Batch to Prevent Expiry Write-Off',
    problem: '12 TaqPath Multiplex Kits expiring October 15, with 4 kits projected to remain unused.',
    evidence: 'Historical PCR consumption is 4 kits weekly; 22 days remaining to expiry.',
    recommendedAction: 'Prioritize older batch lot #TF-TP-4091 for incoming respiratory orders and align with corporate health check panels.',
    priority: 'Medium',
    expectedOperationalEffect: 'Prevents ₹78,000 inventory loss and ensures 100% reagent utilization.',
    supportingData: {
      'Expiring Batch': 'TF-TP-4091',
      'Kits at Risk': '4 units',
      'Unit Cost': '₹19,500',
      'Value at Risk': '₹78,000'
    },
    actionLabel: 'Apply Batch Priority Flag',
    executed: false
  }
];

// Initial In-App Notifications
export const INITIAL_NOTIFICATIONS: LabNotification[] = [
  { id: 'NOTIF-01', title: 'Critical Inventory Alert', message: 'Vitamin D reagent stock (18 units) fell below reorder threshold (20). Lead time: 4 days.', type: 'critical', timestamp: '10m ago', read: false, linkTab: 'inventory' },
  { id: 'NOTIF-02', title: 'Operational Capacity Alert', message: 'Biochemistry Analyzer BIO-03 operating at 94% utilization with 38 pending tests.', type: 'warning', timestamp: '25m ago', read: false, linkTab: 'equipment' },
  { id: 'NOTIF-03', title: 'Critical Lab Value Flagged', message: 'hs-Troponin I (48.2 ng/L) on ORD-8805 verified and released for PT-1003.', type: 'critical', timestamp: '1h ago', read: false, linkTab: 'results' },
  { id: 'NOTIF-04', title: 'Reagent Expiry Warning', message: '12 TaqPath Multiplex PCR Kits expire on 2026-10-15. Batch rotation advised.', type: 'warning', timestamp: '2h ago', read: false, linkTab: 'inventory' },
  { id: 'NOTIF-05', title: 'Sovereign Audit Check', message: 'Daily audit trail synchronized with zero external policy anomalies.', type: 'info', timestamp: '3h ago', read: true, linkTab: 'audit' }
];

// Sample CSV templates for user download and testing in the Upload Data tab
export const SAMPLE_CSV_DATA = {
  inventory: `Item ID,Item Name,Category,Supplier,Quantity,Unit,Reorder Level,Weekly Consumption,Unit Cost
INV-201,Sodium Citrate 3.8% Tubes,Tubes,BD India,1200,Tubes,800,250,10.5
INV-202,Total Cholesterol Gen.2,Reagents,Roche India,18,Kits,25,12,3400
INV-203,Serum Diluent D-Check,Reagents,Sysmex India,40,Bottles,20,8,1850
INV-204,Microtainer Pediatric Tubes,Tubes,BD India,500,Tubes,600,140,14.0
INV-205,Automated Pipette Tips 1000uL,Reagents,Eppendorf,35,Racks,50,20,420`,

  orders: `Order ID,Patient ID,Patient Name,Test Name,Sample Type,Priority,Department,Expected Completion
ORD-9101,PT-1002,Priya Iyer,Lipid Profile Comprehensive,Serum,Routine,Biochemistry,2026-09-23 14:00
ORD-9102,PT-1005,Vikramjit Singh,Complete Blood Count (CBC),Whole Blood,STAT,Hematology,2026-09-23 11:30
ORD-9103,PT-1011,Sneha Patel,25-Hydroxy Vitamin D,Serum,Routine,Immunology,2026-09-23 16:00
ORD-9104,PT-1014,Harpreet Singh,Liver Function Test (LFT),Serum,Urgent,Biochemistry,2026-09-23 13:00`,

  patients: `Patient ID,Name,Age,Gender,Phone,Blood Group,Referring Doctor,Status
PT-2001,Meera Namboodiri,42,Female,+91 98451 09281,O+,Dr. V. Raman,Active
PT-2002,Gurpreet Dhillon,58,Male,+91 98110 33445,B+,Dr. G. Brar,Active
PT-2003,Tanya Sengupta,28,Female,+91 98302 99881,A+,Dr. M. Banerjee,Active
PT-2004,Venkatesh Prasad,64,Male,+91 94442 88771,AB+,Dr. R. Venkat,Active`
};
