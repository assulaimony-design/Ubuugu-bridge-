import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { LoansView } from './components/LoansView';
import { TransfersView } from './components/TransfersView';
import { CirclesView } from './components/CirclesView';
import { LedgerView } from './components/LedgerView';
import { EducationView } from './components/EducationView';
import { ApplyLoanModal } from './components/ApplyLoanModal';
import { NewTransferModal } from './components/NewTransferModal';
import { TransactionReceiptModal } from './components/TransactionReceiptModal';
import { RotateCcw, Heart, ShieldCheck } from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    activeTab,
    isApplyLoanOpen,
    setIsApplyLoanOpen,
    isTransferModalOpen,
    setIsTransferModalOpen,
    selectedReceipt,
    setSelectedReceipt,
    resetAllData,
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* 3-Zone Header Contract */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'loans' && <LoansView />}
        {activeTab === 'transfers' && <TransfersView />}
        {activeTab === 'circles' && <CirclesView />}
        {activeTab === 'ledger' && <LedgerView />}
        {activeTab === 'education' && <EducationView />}
      </main>

      {/* Modals */}
      <ApplyLoanModal isOpen={isApplyLoanOpen} onClose={() => setIsApplyLoanOpen(false)} />
      <NewTransferModal isOpen={isTransferModalOpen} onClose={() => setIsTransferModalOpen(false)} />
      <TransactionReceiptModal transaction={selectedReceipt} onClose={() => setSelectedReceipt(null)} />

      {/* Clean Footer (No fake telemetry or mechanical indicators) */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">UbuntuBridge Financial</span>
            <span aria-hidden="true">·</span>
            <span>Empowering Underbanked African & American Communities</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Certified Alternative Credit Partner</span>
            </span>
            <button
              onClick={resetAllData}
              className="text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1 text-xs"
              title="Reset all demo state to initial defaults"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Demo State</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
