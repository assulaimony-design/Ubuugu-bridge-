import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Currency } from '../types';
import { X, PlusCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DepositModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { currentUser, faucetDeposit } = useApp();
  const [amount, setAmount] = useState<number>(250);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [sourceType, setSourceType] = useState('Neighborhood Cash-In Partner');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;
    faucetDeposit(amount, currency);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-emerald-900 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-300 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-xs uppercase font-semibold text-emerald-300 tracking-wider mb-0.5">
            Wallet Liquidity
          </div>
          <h2 className="text-lg font-bold">Add Funds to Wallet</h2>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Funds Added!</h3>
            <p className="text-xs text-slate-600">
              +{amount} {currency} has been added to your {currentUser.name} wallet.
            </p>
          </div>
        ) : (
          <form onSubmit={handleDeposit} className="p-6 space-y-4 text-sm text-slate-700">
            <div>
              <label className="text-xs font-semibold text-slate-900 block mb-1">Deposit Amount</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="flex-1 p-2.5 font-mono text-base font-semibold bg-white border border-slate-300 rounded-lg focus:outline-hidden"
                />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="w-28 p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-hidden"
                >
                  <option value="USD">USD ($)</option>
                  <option value="NGN">NGN (₦)</option>
                  <option value="KES">KES (KSh)</option>
                  <option value="GHS">GHS (GH₵)</option>
                </select>
              </div>
              <div className="flex gap-2 mt-2">
                {[100, 250, 500, 1000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className="flex-1 py-1 text-xs font-mono rounded border border-slate-200 bg-slate-50 hover:bg-slate-100"
                  >
                    +${val}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-900 block mb-1">Funding Method</label>
              <select
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-hidden"
              >
                <option value="Neighborhood Cash-In Partner">Neighborhood Cash-In (Corner Store / Agent)</option>
                <option value="Direct Payroll Direct Deposit">Direct Payroll Deposit (ACH)</option>
                <option value="Mobile Money Cash Deposit">Mobile Money Agent (M-Pesa / MTN)</option>
                <option value="Debit Card Top-up">Debit Card Instant Link</option>
              </select>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600">
              Direct deposit enables unbanked workers without checking accounts to receive funds instantly with $0 check-cashing fees.
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 shadow-xs"
              >
                Confirm Deposit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
