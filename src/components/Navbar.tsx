import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserCheck, RefreshCw, ChevronDown, PlusCircle, ArrowUpRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    allPersonas,
    switchPersona,
    activeTab,
    setActiveTab,
    setIsApplyLoanOpen,
    setIsTransferModalOpen,
  } = useApp();

  const [personaDropdownOpen, setPersonaDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strictly compliant 3-zone Top Bar Contract: Brand — 4-5 single-line Nav Links — 1 Primary Action Area */}
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <span className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-300 font-extrabold flex items-center justify-center text-sm shadow-xs">
              UB
            </span>
            <span className="font-semibold text-slate-900 tracking-tight">UbuntuBridge</span>
          </button>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                activeTab === 'dashboard' ? 'text-emerald-800 font-semibold border-b-2 border-emerald-800' : ''
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('loans')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                activeTab === 'loans' ? 'text-emerald-800 font-semibold border-b-2 border-emerald-800' : ''
              }`}
            >
              Low-Rate Loans
            </button>
            <button
              onClick={() => setActiveTab('transfers')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                activeTab === 'transfers' ? 'text-emerald-800 font-semibold border-b-2 border-emerald-800' : ''
              }`}
            >
              Transfers & FX
            </button>
            <button
              onClick={() => setActiveTab('circles')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                activeTab === 'circles' ? 'text-emerald-800 font-semibold border-b-2 border-emerald-800' : ''
              }`}
            >
              Esusu Circles
            </button>
            <button
              onClick={() => setActiveTab('ledger')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                activeTab === 'ledger' ? 'text-emerald-800 font-semibold border-b-2 border-emerald-800' : ''
              }`}
            >
              Ledger
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
                activeTab === 'education' ? 'text-emerald-800 font-semibold border-b-2 border-emerald-800' : ''
              }`}
            >
              Credit Guides
            </button>
          </nav>

          {/* Zone 3: Primary actions & persona switch */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Persona Switcher */}
            <div className="relative">
              <button
                onClick={() => setPersonaDropdownOpen(!personaDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
                title="Switch test persona"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-5 h-5 rounded-full object-cover border border-slate-300"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="font-semibold">{currentUser.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {personaDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-xs text-slate-500 font-medium">
                    Switch Test Account:
                  </div>
                  {allPersonas.map((persona) => (
                    <button
                      key={persona.id}
                      onClick={() => {
                        switchPersona(persona.id);
                        setPersonaDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-slate-50 transition-colors ${
                        persona.id === currentUser.id ? 'bg-emerald-50/60' : ''
                      }`}
                    >
                      <img
                        src={persona.avatar}
                        alt={persona.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-slate-900 truncate">{persona.name}</div>
                        <div className="text-xs text-slate-500 truncate">{persona.city} · {persona.handle}</div>
                      </div>
                      {persona.id === currentUser.id && (
                        <span className="text-xs text-emerald-800 font-semibold shrink-0">Active</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <button
              onClick={() => setIsApplyLoanOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition-colors whitespace-nowrap shrink-0 shadow-xs flex items-center gap-1.5"
            >
              <span>Apply for Microloan</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-between border-t border-slate-100 py-2 overflow-x-auto text-xs gap-3">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`whitespace-nowrap px-2 py-1 ${activeTab === 'dashboard' ? 'text-emerald-800 font-bold' : 'text-slate-600'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('loans')}
            className={`whitespace-nowrap px-2 py-1 ${activeTab === 'loans' ? 'text-emerald-800 font-bold' : 'text-slate-600'}`}
          >
            Microloans
          </button>
          <button
            onClick={() => setActiveTab('transfers')}
            className={`whitespace-nowrap px-2 py-1 ${activeTab === 'transfers' ? 'text-emerald-800 font-bold' : 'text-slate-600'}`}
          >
            Transfers
          </button>
          <button
            onClick={() => setActiveTab('circles')}
            className={`whitespace-nowrap px-2 py-1 ${activeTab === 'circles' ? 'text-emerald-800 font-bold' : 'text-slate-600'}`}
          >
            Esusu
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`whitespace-nowrap px-2 py-1 ${activeTab === 'ledger' ? 'text-emerald-800 font-bold' : 'text-slate-600'}`}
          >
            Ledger
          </button>
          <button
            onClick={() => setActiveTab('education')}
            className={`whitespace-nowrap px-2 py-1 ${activeTab === 'education' ? 'text-emerald-800 font-bold' : 'text-slate-600'}`}
          >
            Credit Guides
          </button>
        </div>
      </div>
    </header>
  );
};
