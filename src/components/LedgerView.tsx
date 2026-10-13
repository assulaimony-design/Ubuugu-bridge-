import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TransactionType } from '../types';
import {
  Search,
  ReceiptText,
  Filter,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  RotateCcw,
} from 'lucide-react';

export const LedgerView: React.FC = () => {
  const { transactions, setSelectedReceipt } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.notes && tx.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterType === 'all') return true;
    if (filterType === 'transfers') return tx.type === 'transfer_sent' || tx.type === 'transfer_received';
    if (filterType === 'loans') return tx.type === 'loan_disbursement' || tx.type === 'loan_repayment';
    if (filterType === 'circles') return tx.type === 'circle_contribution' || tx.type === 'circle_payout';
    if (filterType === 'swaps') return tx.type === 'currency_swap';

    return true;
  });

  const handleExportCSV = () => {
    const headers = ['Date', 'Reference', 'Type', 'Title', 'Recipient', 'Amount', 'Currency', 'Fee', 'Status'];
    const rows = filtered.map((t) => [
      t.date,
      t.referenceId,
      t.type,
      `"${t.title}"`,
      `"${t.recipient}"`,
      t.amount,
      t.currency,
      t.fee,
      t.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `UbuntuBridge_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              Accountability & Transparency
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Community Audit Ledger
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Every loan disbursement, peer transfer, and rotating circle contribution logged with permanent reference IDs.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 self-start md:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV Statement</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by recipient, ref ID, notes..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-emerald-800"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto w-full md:w-auto">
          {[
            { id: 'all', label: 'All Operations' },
            { id: 'transfers', label: 'Transfers' },
            { id: 'loans', label: 'Microloans' },
            { id: 'circles', label: 'Esusu Circles' },
            { id: 'swaps', label: 'FX Swaps' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                filterType === tab.id
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Date / Time</th>
                <th className="py-3 px-4">Description & Ref ID</th>
                <th className="py-3 px-4">Sender & Recipient</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-right">Fee</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No transactions match your search filter.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {new Date(tx.date).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{tx.title}</div>
                      <div className="text-xs text-slate-400 font-mono select-all">{tx.referenceId}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-900 font-medium">{tx.recipient}</div>
                      <div className="text-slate-400 text-xs">from {tx.sender}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums font-semibold text-slate-900 whitespace-nowrap">
                      {tx.type === 'transfer_sent' || tx.type === 'loan_repayment' || tx.type === 'circle_contribution'
                        ? '-'
                        : '+'}
                      {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                      {tx.currency}
                      {tx.convertedAmount && (
                        <div className="text-xs text-emerald-800 font-normal">
                          ≈ {tx.convertedAmount.toLocaleString()} {tx.convertedCurrency}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-500 whitespace-nowrap">
                      {tx.fee === 0 ? 'Free' : `$${tx.fee.toFixed(2)}`}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="text-emerald-700 font-medium flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Done</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedReceipt(tx)}
                        className="p-1.5 text-slate-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-md transition-colors"
                        title="View receipt"
                      >
                        <ReceiptText className="w-4 h-4 mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
