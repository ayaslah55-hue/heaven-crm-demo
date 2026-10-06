/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CrmProvider, useCrm } from './context/CrmContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { LeadsManager } from './components/LeadsManager';
import { FollowUpsManager } from './components/FollowUpsManager';
import { InventoryManager } from './components/InventoryManager';
import { CallsManager } from './components/CallsManager';
import { TasksManager } from './components/TasksManager';
import { MeetingsManager } from './components/MeetingsManager';
import { ReservationsAndDeals } from './components/ReservationsAndDeals';
import { SalesTeamManager } from './components/SalesTeamManager';
import { SalesManagerDashboard } from './components/SalesManagerDashboard';
import { LostLeadsAnalysis } from './components/LostLeadsAnalysis';
import { ReportsCenter } from './components/ReportsCenter';
import { LeadDistributionSimulator } from './components/LeadDistributionSimulator';
import { AiAssistant } from './components/AiAssistant';
import { AdminCenter } from './components/AdminCenter';

// Modals
import { LeadProfileModal } from './components/LeadProfileModal';
import { CallModal } from './components/Modals/CallModal';
import { WhatsAppModal } from './components/Modals/WhatsAppModal';
import { NewLeadModal } from './components/Modals/NewLeadModal';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, activeTab } = useCrm();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'leads':
        return <LeadsManager />;
      case 'calls':
        // Specifically Sales Reports & Calls ("تقارير السيلز")
        return <CallsManager />;
      case 'followups':
        return <FollowUpsManager />;
      case 'inventory':
        return <InventoryManager />;
      case 'reservations':
        return <ReservationsAndDeals />;
      case 'meetings':
        return <MeetingsManager />;
      case 'tasks':
        return <TasksManager />;
      case 'salesteam':
        return <SalesTeamManager />;
      case 'salesmanager':
        return <SalesManagerDashboard />;
      case 'lostleads':
        return <LostLeadsAnalysis />;
      case 'reports':
        return <ReportsCenter />;
      case 'autodistribution':
        return <LeadDistributionSimulator />;
      case 'aiassistant':
        return <AiAssistant />;
      case 'admin':
        return <AdminCenter />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-100 overflow-hidden text-slate-900">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main App Layout */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Navbar */}
        <Navbar />

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/70">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <LeadProfileModal />
      <CallModal />
      <WhatsAppModal />
      <NewLeadModal />
    </div>
  );
};

export default function App() {
  return (
    <CrmProvider>
      <MainAppContent />
    </CrmProvider>
  );
}
