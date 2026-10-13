import React from 'react';
import { Transaction } from '../types';
import { CheckCircle2, X, Download, ShieldCheck, ArrowRight } from 'lucide-react';

interface Props {
  transaction: Transaction | null;
  onClose: () => void;
}

export const TransactionReceiptModal: React.FC<Props> = ({ transaction, onClose }) => {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Receipt Header */}
        <div className="bg-emerald-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-amber-300 flex items-center justify-center text-xs font-bold">
              ✓
            </span>
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-200">
              Verified Transaction Receipt
            </span>
          </div>
          <h2 className="text-2xl font-bold font-mono tabular-nums">
            {transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
            {transaction.currency}
          </h2>
          {transaction.convertedAmount && (
            <p className="text-sm text-emerald-200 font-mono tabular-nums mt-0.5">
              ≈ {transaction.convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
              {transaction.convertedCurrency}
            </p>
          )}
          <div className="mt-3 text-xs text-emerald-200">
            Reference ID: <span className="font-mono text-white select-all">{transaction.referenceId}</span>
          </div>
        </div>

        {/* Receipt Body */}
        <div className="p-6 space-y-4 text-sm text-slate-700">
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">Status</div>
              <div className="font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Completed</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">Timestamp</div>
              <div className="font-mono text-xs text-slate-800 mt-0.5">
                {new Date(transaction.date).toLocaleString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>

          <div className="space-y-3 pb-4 border-b border-slate-100 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Sender:</span>
              <span className="font-medium text-slate-900">{transaction.sender}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Recipient:</span>
              <span className="font-medium text-slate-900">{transaction.recipient}</span>
            </div>
            {transaction.recipientMethod && (
              <div className="flex justify-between">
                <span className="text-slate-500">Channel / Network:</span>
                <span className="font-medium text-slate-900">{transaction.recipientMethod}</span>
              </div>
            )}
            {transaction.exchangeRate && (
              <div className="flex justify-between">
                <span className="text-slate-500">Exchange Rate:</span>
                <span className="font-mono font-medium text-slate-900">
                  1 {transaction.currency} = {transaction.exchangeRate} {transaction.convertedCurrency}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">Platform Transfer Fee:</span>
              <span className="font-mono font-medium text-emerald-800">
                {transaction.fee === 0 ? 'Free ($0.00)' : `${transaction.fee.toFixed(2)} ${transaction.currency}`}
              </span>
            </div>
          </div>

          {transaction.notes && (
            <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-600">
              <span className="font-medium text-slate-800">Note: </span>
              {transaction.notes}
            </div>
          )}

          {/* Underbanked fair transparency pledge */}
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-50 text-emerald-900 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-900">Zero Predatory Markups</p>
              <p className="text-emerald-800/90 mt-0.5">
                Every transaction directly benefits community liquidity. No hidden FX spread or arbitrary check-cashing deductions.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save / Print</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
