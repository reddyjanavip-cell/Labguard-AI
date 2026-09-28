/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LabDataProvider, useLabData } from './context/LabDataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DemoWalkthroughBar } from './components/DemoWalkthroughBar';
import { LandingScreen } from './components/LandingScreen';
import { LoginView } from './components/LoginView';
import { UserProfileModal } from './components/UserProfileModal';
import { InspectTraceModal } from './components/InspectTraceModal';

// Operational Views
import { DashboardView } from './components/DashboardView';
import { PatientsView } from './components/PatientsView';
import { TestOrdersView } from './components/TestOrdersView';
import { LabTestsCatalogView } from './components/LabTestsCatalogView';
import { ResultsView } from './components/ResultsView';
import { InventoryView } from './components/InventoryView';
import { EquipmentView } from './components/EquipmentView';
import { StaffView } from './components/StaffView';
import { SuppliersView } from './components/SuppliersView';
import { BillingView } from './components/BillingView';

// Railway-HMIS Clinical Modules
import { DoctorAvailabilityView } from './components/DoctorAvailabilityView';
import { PharmacyView } from './components/PharmacyView';
import { PatientPortalView } from './components/PatientPortalView';

// AI Intelligence & Sovereign Views
import { ExecutiveBriefView } from './components/ExecutiveBriefView';
import { RiskCenterView } from './components/RiskCenterView';
import { RecommendationsView } from './components/RecommendationsView';
import { WhatIfSimulatorView } from './components/WhatIfSimulatorView';
import { CopilotView } from './components/CopilotView';

import { ControlCenterView } from './components/ControlCenterView';
import { PrivateProcessingView } from './components/PrivateProcessingView';
import { AuditLogView } from './components/AuditLogView';
import { UploadDataView } from './components/UploadDataView';
import { DataGovernanceView } from './components/DataGovernanceView';
import { ImpactDashboardView } from './components/ImpactDashboardView';
import { IntegrationCenterView } from './components/IntegrationCenterView';
import { useLanguage } from './context/LanguageContext';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab } = useLabData();
  const { currentUser, effectiveRole } = useAuth();
  const { language } = useLanguage();

  const renderActiveView = () => {
    // If authenticated as patient, default to patient-centric views
    if (effectiveRole === 'patient') {
      switch (activeTab) {
        case 'patient-portal':
          return (
            <ErrorBoundary sectionName="Patient Health Portal" onResetToSafeView={() => setActiveTab('patient-portal')}>
              <PatientPortalView />
            </ErrorBoundary>
          );
        case 'doctors':
          return (
            <ErrorBoundary sectionName="Doctors & OPD Roster" onResetToSafeView={() => setActiveTab('patient-portal')}>
              <DoctorAvailabilityView />
            </ErrorBoundary>
          );
        case 'pharmacy':
          return (
            <ErrorBoundary sectionName="Hospital Pharmacy" onResetToSafeView={() => setActiveTab('patient-portal')}>
              <PharmacyView />
            </ErrorBoundary>
          );
        case 'copilot':
          return (
            <ErrorBoundary sectionName="Smart Lab Copilot" onResetToSafeView={() => setActiveTab('patient-portal')}>
              <CopilotView />
            </ErrorBoundary>
          );
        default:
          return (
            <ErrorBoundary sectionName="Patient Health Portal" onResetToSafeView={() => setActiveTab('patient-portal')}>
              <PatientPortalView />
            </ErrorBoundary>
          );
      }
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <ErrorBoundary sectionName="Dashboard & Operational Overview" onResetToSafeView={() => setActiveTab('dashboard')}>
            <DashboardView />
          </ErrorBoundary>
        );
      case 'doctors':
        return (
          <ErrorBoundary sectionName="Doctor Availability & OPD Roster" onResetToSafeView={() => setActiveTab('dashboard')}>
            <DoctorAvailabilityView />
          </ErrorBoundary>
        );
      case 'pharmacy':
        return (
          <ErrorBoundary sectionName="Hospital Pharmacy & Formulary" onResetToSafeView={() => setActiveTab('dashboard')}>
            <PharmacyView />
          </ErrorBoundary>
        );
      case 'patient-portal':
        return (
          <ErrorBoundary sectionName="Patient Health Portal" onResetToSafeView={() => setActiveTab('dashboard')}>
            <PatientPortalView />
          </ErrorBoundary>
        );
      case 'integrations':
        return (
          <ErrorBoundary sectionName="Integrations & EDI Feeds" onResetToSafeView={() => setActiveTab('dashboard')}>
            <IntegrationCenterView />
          </ErrorBoundary>
        );
      case 'patients':
        return (
          <ErrorBoundary sectionName="Patients Management" onResetToSafeView={() => setActiveTab('dashboard')}>
            <PatientsView />
          </ErrorBoundary>
        );
      case 'orders':
        return (
          <ErrorBoundary sectionName="Test Orders Worklist" onResetToSafeView={() => setActiveTab('dashboard')}>
            <TestOrdersView />
          </ErrorBoundary>
        );
      case 'tests':
        return (
          <ErrorBoundary sectionName="Laboratory Test Catalog" onResetToSafeView={() => setActiveTab('dashboard')}>
            <LabTestsCatalogView />
          </ErrorBoundary>
        );
      case 'results':
        return (
          <ErrorBoundary sectionName="Test Results & Verification" onResetToSafeView={() => setActiveTab('dashboard')}>
            <ResultsView />
          </ErrorBoundary>
        );
      case 'inventory':
        return (
          <ErrorBoundary sectionName="Reagents & Consumables Inventory" onResetToSafeView={() => setActiveTab('dashboard')}>
            <InventoryView />
          </ErrorBoundary>
        );
      case 'equipment':
        return (
          <ErrorBoundary sectionName="Analyzers & Equipment" onResetToSafeView={() => setActiveTab('dashboard')}>
            <EquipmentView />
          </ErrorBoundary>
        );
      case 'staff':
        return (
          <ErrorBoundary sectionName="Staff Directory & Rosters" onResetToSafeView={() => setActiveTab('dashboard')}>
            <StaffView />
          </ErrorBoundary>
        );
      case 'suppliers':
        return (
          <ErrorBoundary sectionName="Suppliers & Vendors" onResetToSafeView={() => setActiveTab('dashboard')}>
            <SuppliersView />
          </ErrorBoundary>
        );
      case 'billing':
        return (
          <ErrorBoundary sectionName="Billing & Revenue Ledger" onResetToSafeView={() => setActiveTab('dashboard')}>
            <BillingView />
          </ErrorBoundary>
        );

      case 'executive-brief':
        return (
          <ErrorBoundary sectionName="Executive Intelligence Brief" onResetToSafeView={() => setActiveTab('dashboard')}>
            <ExecutiveBriefView />
          </ErrorBoundary>
        );
      case 'risk-center':
        return (
          <ErrorBoundary sectionName="AI Risk Center" onResetToSafeView={() => setActiveTab('dashboard')}>
            <RiskCenterView />
          </ErrorBoundary>
        );
      case 'recommendations':
        return (
          <ErrorBoundary sectionName="AI Prescriptive Recommendations" onResetToSafeView={() => setActiveTab('dashboard')}>
            <RecommendationsView />
          </ErrorBoundary>
        );
      case 'what-if':
        return (
          <ErrorBoundary sectionName="What-If Operational Simulator" onResetToSafeView={() => setActiveTab('dashboard')}>
            <WhatIfSimulatorView />
          </ErrorBoundary>
        );
      case 'copilot':
        return (
          <ErrorBoundary sectionName="Smart Lab Copilot" onResetToSafeView={() => setActiveTab('dashboard')}>
            <CopilotView />
          </ErrorBoundary>
        );

      case 'control-center':
        return (
          <ErrorBoundary sectionName="Sovereign Control Center" onResetToSafeView={() => setActiveTab('dashboard')}>
            <ControlCenterView />
          </ErrorBoundary>
        );
      case 'private-processing':
        return (
          <ErrorBoundary sectionName="Private Processing Safeguards" onResetToSafeView={() => setActiveTab('dashboard')}>
            <PrivateProcessingView />
          </ErrorBoundary>
        );
      case 'audit':
        return (
          <ErrorBoundary sectionName="Audit Trail & Cryptographic Logs" onResetToSafeView={() => setActiveTab('dashboard')}>
            <AuditLogView />
          </ErrorBoundary>
        );

      case 'upload':
        return (
          <ErrorBoundary sectionName="CSV Upload & Telemetry Import" onResetToSafeView={() => setActiveTab('dashboard')}>
            <UploadDataView />
          </ErrorBoundary>
        );
      case 'governance':
        return (
          <ErrorBoundary sectionName="Data Governance & Compliance" onResetToSafeView={() => setActiveTab('dashboard')}>
            <DataGovernanceView />
          </ErrorBoundary>
        );
      case 'impact':
        return (
          <ErrorBoundary sectionName="Impact & Operational Metrics" onResetToSafeView={() => setActiveTab('dashboard')}>
            <ImpactDashboardView />
          </ErrorBoundary>
        );

      default:
        return (
          <ErrorBoundary sectionName="Dashboard" onResetToSafeView={() => setActiveTab('dashboard')}>
            <DashboardView />
          </ErrorBoundary>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased">
      <Navbar />
      <DemoWalkthroughBar />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div key={`${activeTab}-${language}`} className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Persistent Global Modals */}
      <UserProfileModal />
      <InspectTraceModal />
    </div>
  );
};

const AppContent: React.FC = () => {
  const { currentUser, isAuthLoading } = useAuth();
  const [showLanding, setShowLanding] = useState(false);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono tracking-wider uppercase text-teal-400">
            Initializing LABGUARD AI Sovereign Runtime...
          </span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginView />;
  }

  if (showLanding) {
    return <LandingScreen onEnter={() => setShowLanding(false)} />;
  }

  return (
    <ErrorBoundary sectionName="Application Shell">
      <MainLayout />
    </ErrorBoundary>
  );
};

export default function App() {
  return (
    <ErrorBoundary sectionName="Hospital Infrastructure Engine">
      <LanguageProvider>
        <AuthProvider>
          <LabDataProvider>
            <AppContent />
          </LabDataProvider>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
