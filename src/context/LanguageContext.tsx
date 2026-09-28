import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

export type LanguageCode = 'en' | 'hi' | 'kn';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
    kn: string;
  };
}

export const translations: Translations = {
  // Brand & General
  appName: {
    en: 'LABGUARD AI',
    hi: 'लैबगार्ड एआई',
    kn: 'ಲ್ಯಾಬ್‌ಗಾರ್ಡ್ ಎಐ'
  },
  tagline: {
    en: 'Private Laboratory & Pharmacy Intelligence Platform',
    hi: 'निजी प्रयोगशाला और फार्मेसी इंटेलिजेंस प्लेटफॉर्म',
    kn: 'ಖಾಸಗಿ ಪ್ರಯೋಗಾಲಯ ಮತ್ತು ಔಷಧಾಲಯ ಬುದ್ಧಿಮತ್ತೆ ವೇದಿಕೆ'
  },
  railwayHmisNotice: {
    en: 'Railway-HMIS Architecture Pattern · Secure Multi-Role Clinical Workflow',
    hi: 'रेलवे-एचएमआईएस आर्किटेक्चर पैटर्न · सुरक्षित बहु-भूमिका नैदानिक वर्कफ़्लो',
    kn: 'ರೈಲ್ವೆ-ಎಚ್‌ಎಂಐಎಸ್ ವಾಸ್ತುಶಿಲ್ಪ ಶೈಲಿ · ಸುರಕ್ಷಿತ ಬಹು-ಪಾತ್ರ ಕ್ಲಿನಿಕಲ್ ಕೆಲಸದ ಹರಿವು'
  },
  
  // Navigation Tabs
  navDashboard: {
    en: 'Dashboard',
    hi: 'डैशबोर्ड',
    kn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್'
  },
  navPatients: {
    en: 'Patients (OPD/IPD)',
    hi: 'मरीज़ (ओपीडी/आईपीडी)',
    kn: 'ರೋಗಿಗಳು (ಒಪಿಡಿ/ಐಪಿಡಿ)'
  },
  navTestOrders: {
    en: 'Test Orders',
    hi: 'परीक्षण आदेश',
    kn: 'ಪರೀಕ್ಷಾ ಆದೇಶಗಳು'
  },
  navResults: {
    en: 'Results & Verification',
    hi: 'परिणाम और सत्यापन',
    kn: 'ಫಲಿತಾಂಶಗಳು ಮತ್ತು ಪರಿಶೀಲನೆ'
  },
  navCatalog: {
    en: 'Test Catalog',
    hi: 'परीक्षण सूची',
    kn: 'ಪರೀಕ್ಷಾ ಪಟ್ಟಿ'
  },
  navInventory: {
    en: 'Reagents & Inventory',
    hi: 'अभिकर्मक और इन्वेंटरी',
    kn: 'ರೀಜೆಂಟ್‌ಗಳು ಮತ್ತು ದಾಸ್ತಾನು'
  },
  navPharmacy: {
    en: 'Hospital Pharmacy',
    hi: 'अस्पताल फार्मेसी',
    kn: 'ಆಸ್ಪತ್ರೆ ಔಷಧಾಲಯ'
  },
  navDoctors: {
    en: 'Doctors & OPD Roster',
    hi: 'डॉक्टर और ओपीडी रोस्टर',
    kn: 'ವೈದ್ಯರು ಮತ್ತು ಒಪಿಡಿ ವೇಳಾಪಟ್ಟಿ'
  },
  navPatientPortal: {
    en: 'Patient Health Portal',
    hi: 'रोगी स्वास्थ्य पोर्टल',
    kn: 'ರೋಗಿ ಆರೋಗ್ಯ ಪೋರ್ಟಲ್'
  },
  navEquipment: {
    en: 'Analyzers & Equipment',
    hi: 'विश्लेषक और उपकरण',
    kn: 'ವಿಶ್ಲೇಷಕಗಳು ಮತ್ತು ಉಪಕರಣಗಳು'
  },
  navStaff: {
    en: 'Staff Directory',
    hi: 'कर्मचारी निर्देशिका',
    kn: 'ಸಿಬ್ಬಂದಿ ವಿವರ'
  },
  navSuppliers: {
    en: 'Suppliers & Vendors',
    hi: 'आपूर्तिकर्ता और विक्रेता',
    kn: 'ಸರಬರಾಜುದಾರರು ಮತ್ತು ಮಾರಾಟಗಾರರು'
  },
  navBilling: {
    en: 'Billing & Invoices',
    hi: 'बिलिंग और चालान',
    kn: 'ಬಿಲ್ಲಿಂಗ್ ಮತ್ತು ಇನ್ವಾಯ್ಸ್‌ಗಳು'
  },
  navRiskCenter: {
    en: 'AI Risk Registry',
    hi: 'एआई जोखिम रजिस्ट्री',
    kn: 'ಎಐ ಅಪಾಯ ನೋಂದಣಿ'
  },
  navRecommendations: {
    en: 'Action Center',
    hi: 'कार्रवाई केंद्र',
    kn: 'ಕ್ರಿಯಾ ಕೇಂದ್ರ'
  },
  navSimulator: {
    en: 'What-If Simulator',
    hi: 'व्हाट-इफ सिम्युलेटर',
    kn: 'ಪೂರ್ವಭಾವಿ ಸಿಮ್ಯುಲೇಟರ್'
  },
  navAudit: {
    en: 'Audit Trail',
    hi: 'ऑडिट ट्रेल',
    kn: 'ಲೆಕ್ಕಪರಿಶೋಧನಾ ದಾಖಲೆ'
  },
  navIntegrations: {
    en: 'Integrations & EDI',
    hi: 'एकीकरण और ईडीआई',
    kn: 'ಸಂಯೋಜನೆಗಳು ಮತ್ತು ಇಡಿಐ'
  },
  navCopilot: {
    en: 'Smart Lab Copilot',
    hi: 'स्मार्ट लैब कोपायलट',
    kn: 'ಸ್ಮಾರ್ಟ್ ಲ್ಯಾಬ್ ಕೋಪೈಲಟ್'
  },
  navExecutiveBrief: {
    en: 'AI Executive Brief',
    hi: 'एआई कार्यकारी सारांश',
    kn: 'ಎಐ ಕಾರ್ಯನಿರ್ವಾಹಕ ಸಾರಾಂಶ'
  },
  navControlCenter: {
    en: 'Sovereign Control Center',
    hi: 'संप्रभु नियंत्रण केंद्र',
    kn: 'ಸಾರ್ವಭೌಮ ನಿಯಂತ್ರಣ ಕೇಂದ್ರ'
  },
  navPrivateProcessing: {
    en: 'Private Data Pipeline',
    hi: 'निजी डेटा पाइपलाइन',
    kn: 'ಖಾಸಗಿ ಡೇಟಾ ಪೈಪ್‌ಲೈನ್'
  },
  navUpload: {
    en: 'Upload Laboratory CSV',
    hi: 'प्रयोगशाला सीएसवी अपलोड करें',
    kn: 'ಪ್ರಯೋಗಾಲಯ ಸಿಎಸ್‌ವಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ'
  },
  navGovernance: {
    en: 'Data Governance Policies',
    hi: 'डेटा शासन नीतियां',
    kn: 'ಡೇಟಾ ಆಡಳಿತ ನೀತಿಗಳು'
  },
  navImpact: {
    en: 'Laboratory Impact',
    hi: 'प्रयोगशाला प्रभाव',
    kn: 'ಪ್ರಯೋಗಾಲಯ ಪ್ರಭಾವ'
  },
  groupLabOps: {
    en: 'Laboratory Operations',
    hi: 'प्रयोगशाला संचालन',
    kn: 'ಪ್ರಯೋಗಾಲಯ ಕಾರ್ಯಾಚರಣೆಗಳು'
  },
  groupHealthRecords: {
    en: 'Personal Health Records',
    hi: 'व्यक्तिगत स्वास्थ्य रिकॉर्ड',
    kn: 'ವೈಯಕ್ತಿಕ ಆರೋಗ್ಯ ದಾಖಲೆಗಳು'
  },
  groupAiIntel: {
    en: 'AI Intelligence & Risk',
    hi: 'एआई इंटेलिजेंस और जोखिम',
    kn: 'ಎಐ ಇಂಟೆಲಿಜೆನ್ಸ್ ಮತ್ತು ಅಪಾಯ'
  },
  groupSovereignGov: {
    en: 'Sovereign AI Governance',
    hi: 'संप्रभु एआई शासन',
    kn: 'ಸಾರ್ವಭೌಮ ಎಐ ಆಡಳಿತ'
  },
  groupDataImpact: {
    en: 'Data & Impact',
    hi: 'डेटा और प्रभाव',
    kn: 'ಡೇಟಾ ಮತ್ತು ಪ್ರಭಾವ'
  },

  // Auth & Roles
  roleAdmin: {
    en: 'Chief Administrator',
    hi: 'मुख्य प्रशासक',
    kn: 'ಮುಖ್ಯ ಆಡಳಿತಾಧಿಕಾರಿ'
  },
  roleLabManager: {
    en: 'Laboratory Director',
    hi: 'प्रयोगशाला निदेशक',
    kn: 'ಪ್ರಯೋಗಾಲಯ ನಿರ್ದೇಶಕ'
  },
  rolePathologist: {
    en: 'Clinical Pathologist',
    hi: 'क्लिनिकल पैथोलॉजिस्ट',
    kn: 'ಕ್ಲಿನಿಕಲ್ ರೋಗಶಾಸ್ತ್ರಜ್ಞ'
  },
  roleTechnician: {
    en: 'Senior Lab Technician',
    hi: 'वरिष्ठ लैब तकनीशियन',
    kn: 'ಹಿರಿಯ ಲ್ಯಾಬ್ ತಂತ್ರಜ್ಞ'
  },
  roleFinance: {
    en: 'Finance Controller',
    hi: 'वित्त नियंत्रक',
    kn: 'ಹಣಕಾಸು ನಿಯಂತ್ರಕ'
  },
  rolePharmacist: {
    en: 'Registered Pharmacist',
    hi: 'पंजीकृत फार्मासिस्ट',
    kn: 'ನೋಂದಾಯಿತ ಔಷಧಶಾಸ್ತ್ರಜ್ಞ'
  },
  rolePatient: {
    en: 'Verified Patient (OPD)',
    hi: 'सत्यापित मरीज़ (ओपीडी)',
    kn: 'ದೃಢೀಕೃತ ರೋಗಿ (ಒಪಿಡಿ)'
  },
  staffPortal: {
    en: 'Hospital Staff Portal',
    hi: 'अस्पताल कर्मचारी पोर्टल',
    kn: 'ಆಸ್ಪತ್ರೆ ಸಿಬ್ಬಂದಿ ಪೋರ್ಟಲ್'
  },
  patientPortal: {
    en: 'Patient Self-Service Portal',
    hi: 'रोगी स्व-सेवा पोर्टल',
    kn: 'ರೋಗಿ ಸ್ವ-ಸೇವಾ ಪೋರ್ಟಲ್'
  },
  loginBtn: {
    en: 'Sign In',
    hi: 'साइन इन करें',
    kn: 'ಸೈನ್ ಇನ್ ಮಾಡಿ'
  },
  logoutBtn: {
    en: 'Logout',
    hi: 'लॉग आउट',
    kn: 'ಲಾಗ್ ಔಟ್'
  },
  profileBtn: {
    en: 'My Profile',
    hi: 'मेरी प्रोफाइल',
    kn: 'ನನ್ನ ಪ್ರೊಫೈಲ್'
  },
  inspectTrace: {
    en: 'Inspect Trace',
    hi: 'ट्रेस निरीक्षण करें',
    kn: 'ಟ್ರೆಸ್ ಪರಿಶೀಲಿಸಿ'
  },
  doctorAvailability: {
    en: 'Doctor Availability',
    hi: 'डॉक्टर उपलब्धता',
    kn: 'ವೈದ್ಯರ ಲಭ್ಯತೆ'
  },

  // Actions & Search
  alerts: {
    en: 'System Alerts & Notifications',
    hi: 'सिस्टम अलर्ट और सूचनाएं',
    kn: 'ವ್ಯವಸ್ಥೆ ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ಅಧಿಸೂಚನೆಗಳು'
  },
  searchPlaceholder: {
    en: 'Search patients, orders, reagents, doctors, drugs, equipment...',
    hi: 'मरीज़, परीक्षण, अभिकर्मक, डॉक्टर, दवाएं खोजें...',
    kn: 'ರೋಗಿಗಳು, ಆದೇಶಗಳು, ಔಷಧಿಗಳು, ವೈದ್ಯರನ್ನು ಹುಡುಕಿ...'
  },
  applyFilter: {
    en: 'Filter',
    hi: 'फ़िल्टर करें',
    kn: 'ಫಿಲ್ಟರ್ ಮಾಡಿ'
  },
  refresh: {
    en: 'Refresh Data',
    hi: 'डेटा ताज़ा करें',
    kn: 'ಡೇಟಾ ಮರುಹೊಂದಿಸಿ'
  },
  saveChanges: {
    en: 'Save Changes',
    hi: 'बदलाव सहेजें',
    kn: 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ'
  },
  cancel: {
    en: 'Cancel',
    hi: 'रद्द करें',
    kn: 'ರದ್ದುಮಾಡಿ'
  },
  downloadReport: {
    en: 'Download Verified Report',
    hi: 'सत्यापित रिपोर्ट डाउनलोड करें',
    kn: 'ದೃಢೀಕೃತ ವರದಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ'
  },
  bookAppointment: {
    en: 'Book OPD Appointment',
    hi: 'ओपीडी अपॉइंटमेंट बुक करें',
    kn: 'ಒಪಿಡಿ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ'
  },
  dispenseMed: {
    en: 'Dispense Medicines',
    hi: 'दवाएं वितरित करें',
    kn: 'ಔಷಧಿಗಳನ್ನು ವಿತರಿಸಿ'
  },
  restock: {
    en: 'Restock Batch',
    hi: 'बैच पुनः स्टॉक करें',
    kn: 'ದಾಸ್ತಾನು ಮರುಪೂರಣ'
  },
  statusOnDuty: {
    en: 'ON DUTY',
    hi: 'ड्यूटी पर',
    kn: 'ಕರ್ತವ್ಯದಲ್ಲಿದ್ದಾರೆ'
  },
  statusAvailable: {
    en: 'AVAILABLE',
    hi: 'उपलब्ध',
    kn: 'ಲಭ್ಯವಿದೆ'
  },
  statusInConsult: {
    en: 'IN CONSULTATION',
    hi: 'परामर्श में',
    kn: 'ಸಮಾಲೋಚನೆಯಲ್ಲಿ'
  },
  statusOnLeave: {
    en: 'ON LEAVE',
    hi: 'छुट्टी पर',
    kn: 'ರಜೆಯಲ್ಲಿದ್ದಾರೆ'
  },
  statusActive: {
    en: 'Active',
    hi: 'सक्रिय',
    kn: 'ಸಕ್ರಿಯ'
  },
  statusCompleted: {
    en: 'Completed',
    hi: 'पूर्ण',
    kn: 'ಪೂರ್ಣಗೊಂಡಿದೆ'
  },
  statusPending: {
    en: 'Pending',
    hi: 'लंबित',
    kn: 'ಬಾಕಿ ಇದೆ'
  },
  statusVerified: {
    en: 'Verified',
    hi: 'सत्यापित',
    kn: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ'
  },
  tokenNumber: {
    en: 'Token Number',
    hi: 'टोकन संख्या',
    kn: 'ಟೋಕನ್ ಸಂಖ್ಯೆ'
  },
  noResultsFound: {
    en: 'No matching records found',
    hi: 'कोई मेल खाने वाला रिकॉर्ड नहीं मिला',
    kn: 'ಯಾವುದೇ ಹೊಂದಾಣಿಕೆಯ ದಾಖಲೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ'
  },
  searchingRecords: {
    en: 'Searching across laboratory databases...',
    hi: 'प्रयोगशाला डेटाबेस में खोज की जा रही है...',
    kn: 'ಪ್ರಯೋಗಾಲಯದ ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ಹುಡುಕಲಾಗುತ್ತಿದೆ...'
  },
  totalToday: {
    en: 'Total Today',
    hi: 'आज का कुल',
    kn: 'ಇಂದಿನ ಒಟ್ಟು'
  },
  completed: {
    en: 'Completed',
    hi: 'पूर्ण',
    kn: 'ಪೂರ್ಣಗೊಂಡಿದೆ'
  },
  pendingTests: {
    en: 'Pending Tests',
    hi: 'लंबित परीक्षण',
    kn: 'ಬಾಕಿ ಇರುವ ಪರೀಕ್ಷೆಗಳು'
  },
  averageTat: {
    en: 'Average TAT',
    hi: 'औसत टर्नअराउंड समय',
    kn: 'ಸರಾಸರಿ ಟರ್ನ್‌ಅರೌಂಡ್ ಸಮಯ'
  },
  todayRevenue: {
    en: 'Today Revenue',
    hi: 'आज का राजस्व',
    kn: 'ಇಂದಿನ ಆದಾಯ'
  },
  criticalRisks: {
    en: 'Critical Risks',
    hi: 'गंभीर जोखिम',
    kn: 'ಗಂಭೀರ ಅಪಾಯಗಳು'
  },
  activeDoctors: {
    en: 'Active Doctors',
    hi: 'सक्रिय डॉक्टर',
    kn: 'ಸಕ್ರಿಯ ವೈದ್ಯರು'
  },
  lowStockReagents: {
    en: 'Low Stock Reagents',
    hi: 'कम स्टॉक अभिकर्मक',
    kn: 'ಕಡಿಮೆ ದಾಸ್ತಾನು ರೀಜೆಂಟ್‌ಗಳು'
  },
  todayLabBrief: {
    en: "Today's Laboratory Brief",
    hi: 'आज का प्रयोगशाला सारांश',
    kn: 'ಇಂದಿನ ಪ್ರಯೋಗಾಲಯ ಸಾರಾಂಶ'
  },
  priorityFlags: {
    en: 'Priority Flags',
    hi: 'प्राथमिकता झंडे',
    kn: 'ಆದ್ಯತೆಯ ಧ್ವಜಗಳು'
  },
  reviewRisks: {
    en: 'Review Risks',
    hi: 'जोखिमों की समीक्षा करें',
    kn: 'ಅಪಾಯಗಳನ್ನು ಪರಿಶೀಲಿಸಿ'
  },
  viewRecommendations: {
    en: 'View Recommendations',
    hi: 'सिफारिशें देखें',
    kn: 'ಶಿಫಾರಸುಗಳನ್ನು ವೀಕ್ಷಿಸಿ'
  },
  testVolumeTrends: {
    en: '14-Day Test Volume & Trajectory',
    hi: '14-दिवसीय परीक्षण मात्रा और रुझान',
    kn: '14-ದಿನಗಳ ಪರೀಕ್ಷಾ ಪ್ರಮಾಣ ಮತ್ತು ಪ್ರವೃತ್ತಿ'
  },
  departmentDistribution: {
    en: 'Departmental Specimen Distribution',
    hi: 'विभागीय नमूना वितरण',
    kn: 'ವಿಭಾಗೀಯ ಮಾದರಿ ವಿತರಣೆ'
  },
  tatComplianceDistribution: {
    en: 'Turnaround Time Compliance Distribution',
    hi: 'टर्नअराउंड समय अनुपालन वितरण',
    kn: 'ಟರ್ನ್‌ಅರೌಂಡ್ ಸಮಯ ಅನುಸರಣೆ ವಿತರಣೆ'
  },
  activeRisksHeading: {
    en: 'Active Operational Risks Detected by AI',
    hi: 'एआई द्वारा पहचाने गए सक्रिय परिचालन जोखिम',
    kn: 'ಎಐ ಮೂಲಕ ಪತ್ತೆಯಾದ ಸಕ್ರಿಯ ಕಾರ್ಯಾಚರಣೆಯ ಅಪಾಯಗಳು'
  },
  viewAllRisks: {
    en: 'View All in Risk Center',
    hi: 'जोखिम केंद्र में सभी देखें',
    kn: 'ಅಪಾಯ ಕೇಂದ್ರದಲ್ಲಿ ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ'
  },
  healthStatus: {
    en: 'Health',
    hi: 'स्वास्थ्य',
    kn: 'ಆರೋಗ್ಯ'
  },
  demoMode: {
    en: 'DEMO MODE',
    hi: 'डेमो मोड',
    kn: 'ಡೆಮೊ ಮೋಡ್'
  },
  roleLabel: {
    en: 'Role',
    hi: 'भूमिका',
    kn: 'ಪಾತ್ರ'
  },
  backToWorkspace: {
    en: 'Return to Workspace',
    hi: 'कार्यक्षेत्र पर लौटें',
    kn: 'ಕಾರ್ಯಕ್ಷೇತ್ರಕ್ಕೆ ಹಿಂತಿರುಗಿ'
  },
  otpVerification: {
    en: 'OTP Verification',
    hi: 'ओटीपी सत्यापन',
    kn: 'ಒಟಿಪಿ ಪರಿಶೀಲನೆ'
  },
  requestOtp: {
    en: 'Request OTP',
    hi: 'ओटीपी का अनुरोध करें',
    kn: 'ಒಟಿಪಿಗೆ ವಿನಂತಿಸಿ'
  },
  resendOtp: {
    en: 'Resend OTP',
    hi: 'ओटीपी पुनः भेजें',
    kn: 'ಒಟಿಪಿಯನ್ನು ಮರುಕಳುಹಿಸಿ'
  },
  enterOtp: {
    en: 'Enter 6-Digit Verification Code',
    hi: '6 अंकों का सत्यापन कोड दर्ज करें',
    kn: '6-ಅಂಕಿಯ ಪರಿಶೀಲನಾ ಕೋಡ್ ನಮೂದಿಸಿ'
  },
  archiveSafe: {
    en: 'Archive Record (Safe)',
    hi: 'रिकॉर्ड संग्रहीत करें (सुरक्षित)',
    kn: 'ದಾಖಲೆಯನ್ನು ಆರ್ಕೈವ್ ಮಾಡಿ (ಸುರಕ್ಷಿತ)'
  },
  forceDelete: {
    en: 'Force Delete',
    hi: 'जबरन हटाएं',
    kn: 'ಬಲವಂತವಾಗಿ ಅಳಿಸಿ'
  },
  turnaroundTime: {
    en: 'Turnaround Time',
    hi: 'टर्नअराउंड समय',
    kn: 'ಟರ್ನ್‌ಅರೌಂಡ್ ಸಮಯ'
  },
  permissionRestricted: {
    en: 'Access restricted for current role',
    hi: 'वर्तमान भूमिका के लिए पहुंच प्रतिबंधित है',
    kn: 'ಪ್ರಸ್ತುತ ಪಾತ್ರಕ್ಕೆ ಪ್ರವೇಶ ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ'
  }
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('labguard_lang');
      return (saved === 'hi' || saved === 'kn') ? saved : 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('labguard_lang', lang);
    } catch {
      // safe fallback
    }
  };

  const t = useMemo(() => {
    return (key: string): string => {
      if (!key) return '';
      const item = translations[key];
      if (item && item[language]) return item[language];
      if (item && item.en) return item.en;

      // Handle dot notation e.g. "nav.dashboard" -> "Dashboard"
      const leaf = key.includes('.') ? key.split('.').pop() || key : key;
      const formatted = leaf
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
      return formatted || key;
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
