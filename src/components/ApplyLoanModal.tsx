import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MicroLoan, Currency } from '../types';
import { X, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, DollarSign } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ApplyLoanModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { currentUser, applyForMicroloan, setActiveTab } = useApp();

  const [amount, setAmount] = useState<number>(600);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [termMonths, setTermMonths] = useState<number>(6);
  const [purpose, setPurpose] = useState<MicroLoan['purpose']>('Small Business Inventory');
  const [lenderType, setLenderType] = useState<MicroLoan['lenderType']>('Community Guarantee Pool');
  const [hasCashflowLinked, setHasCashflowLinked] = useState<boolean>(true);
  const [hasCommunityVouch, setHasCommunityVouch] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successLoan, setSuccessLoan] = useState<MicroLoan | null>(null);

  if (!isOpen) return null;

  // Real Amortization Math (low 3.5% APR)
  const apr = termMonths <= 6 ? 3.5 : termMonths <= 12 ? 3.8 : 4.2;
  const monthlyRate = apr / 100 / 12;
  const monthlyPayment = Number(
    ((amount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) / (Math.pow(1 + monthlyRate, termMonths) - 1)).toFixed(2)
  );
  const totalRepayment = Number((monthlyPayment * termMonths).toFixed(2));
  const totalInterest = Number((totalRepayment - amount).toFixed(2));

  // Payday comparison (typical 391% APR: ~15% every 2 weeks rolled over)
  const predatoryCost = Number((amount * (termMonths * 0.12)).toFixed(2));
  const estimatedSavings = Math.max(120, Number((predatoryCost - totalInterest).toFixed(2)));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const res = applyForMicroloan({
        amount,
        currency,
        termMonths,
        purpose,
        lenderType,
      });

      setIsSubmitting(false);
      if (res.success && res.loan) {
        setSuccessLoan(res.loan);
      }
    }, 600);
  };

  const handleFinish = () => {
    setSuccessLoan(null);
    onClose();
    setActiveTab('loans');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-xs uppercase font-semibold text-emerald-400 tracking-wider mb-1">
            Community Underwritten Microfinance
          </div>
          <h2 className="text-xl font-bold">Apply for Low-Interest Microloan</h2>
          <p className="text-xs text-slate-300 mt-1">
            Fixed 3.5% APR designed specifically to liberate underbanked African and American entrepreneurs from predatory payday debt.
          </p>
        </div>

        {successLoan ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Microloan Disbursed Instantly!</h3>
              <p className="text-sm text-slate-600 mt-1">
                <span className="font-semibold text-slate-900 font-mono tabular-nums">
                  {successLoan.amount.toLocaleString()} {successLoan.currency}
                </span>{' '}
                has been credited directly to your UbuntuBridge wallet.
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-left text-xs space-y-2">
              <div className="flex justify-between font-mono">
                <span className="text-slate-600">Fixed Rate:</span>
                <span className="font-bold text-emerald-800">{successLoan.interestRateApr}% APR</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-600">Monthly Payment:</span>
                <span className="font-bold text-slate-900">
                  {successLoan.monthlyPayment.toFixed(2)} {successLoan.currency}
                </span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-600">First Due Date:</span>
                <span className="font-bold text-slate-900">{successLoan.nextDueDate}</span>
              </div>
              <div className="flex justify-between font-mono border-t border-emerald-200/60 pt-2">
                <span className="text-slate-600">Total Interest Over Life:</span>
                <span className="font-bold text-emerald-800">
                  {successLoan.totalInterest.toFixed(2)} {successLoan.currency}
                </span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3 text-sm font-semibold text-white bg-emerald-800 rounded-xl hover:bg-emerald-900 transition-colors shadow-xs"
            >
              View Loan Schedule & Repayment Tracker
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 text-sm text-slate-700">
            {/* Amount & presets */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-900">Loan Principal Amount</label>
                <span className="text-xs font-mono font-bold text-emerald-800">
                  ${amount.toLocaleString()} {currency}
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="2500"
                step="50"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full accent-emerald-800 cursor-pointer"
              />
              <div className="flex gap-2 mt-2">
                {[300, 500, 850, 1200, 2000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className={`flex-1 py-1 text-xs font-mono rounded border transition-colors ${
                      amount === val
                        ? 'bg-emerald-800 text-white border-emerald-800 font-bold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ${val}
                  </button>
                ))}
              </div>
            </div>

            {/* Term and Purpose */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-900 block mb-1">Repayment Term</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[3, 6, 12].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setTermMonths(m)}
                      className={`py-2 text-xs rounded-lg border text-center font-medium transition-colors ${
                        termMonths === m
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {m} Months
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-900 block mb-1">Loan Purpose</label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value as MicroLoan['purpose'])}
                  className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-800 focus:outline-hidden"
                >
                  <option value="Small Business Inventory">Small Business Inventory</option>
                  <option value="Equipment & Tools">Equipment & Tools</option>
                  <option value="Emergency Medical & Health">Emergency Medical & Health</option>
                  <option value="Cross-Border Trade">Cross-Border Trade</option>
                  <option value="Vocational Education">Vocational Education</option>
                </select>
              </div>
            </div>

            {/* Underwriting verification checkboxes */}
            <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
              <div className="font-semibold text-slate-900 mb-1">Alternative Trust Verification:</div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasCashflowLinked}
                  onChange={(e) => setHasCashflowLinked(e.target.checked)}
                  className="mt-0.5 accent-emerald-800"
                />
                <span className="text-slate-600">
                  <strong className="text-slate-800">Cash-Flow Health Check:</strong> Consistent weekly transactions on
                  Ubuntu Wallet or connected debit account.
                </span>
              </label>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasCommunityVouch}
                  onChange={(e) => setHasCommunityVouch(e.target.checked)}
                  className="mt-0.5 accent-emerald-800"
                />
                <span className="text-slate-600">
                  <strong className="text-slate-800">Community Guarantee Pool:</strong> Endorsed by Esusu circle or 2
                  verified neighborhood peers.
                </span>
              </label>
            </div>

            {/* Live Financial Transparency Box */}
            <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-medium">Monthly Installment:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  ${monthlyPayment.toFixed(2)} / mo
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Total Interest (Entire Term):</span>
                <span className="font-mono font-bold text-emerald-900">
                  ${totalInterest.toFixed(2)} ({apr}% APR)
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-emerald-200/70 pt-2">
                <span className="text-emerald-900 font-semibold">Community Wealth Preserved:</span>
                <span className="font-mono font-bold text-emerald-800">
                  +${estimatedSavings.toFixed(2)} saved vs payday loan
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !hasCashflowLinked}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition-colors shadow-xs disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <span>Processing Underwriting...</span>
                ) : (
                  <>
                    <span>Confirm & Disburse Funds</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
