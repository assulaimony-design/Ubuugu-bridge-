import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Currency } from '../types';
import { X, ArrowRightLeft, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CurrencySwapModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { currentUser, rates, swapCurrency } = useApp();

  const [fromCurrency, setFromCurrency] = useState<Currency>('USD');
  const [toCurrency, setToCurrency] = useState<Currency>('NGN');
  const [amount, setAmount] = useState<number>(50);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const getRate = (code: Currency) => {
    const found = rates.find((r) => r.code === code);
    return found ? found.ratePerUSD : 1;
  };

  const srcRate = getRate(fromCurrency);
  const tgtRate = getRate(toCurrency);
  const usdVal = amount / srcRate;
  const targetAmt = Number((usdVal * tgtRate).toFixed(2));
  const rateRatio = Number((tgtRate / srcRate).toFixed(4));
  const available = currentUser.wallets[fromCurrency] || 0;

  const handleSwap = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (amount <= 0) {
      setError('Amount must be greater than zero.');
      return;
    }
    const res = swapCurrency(fromCurrency, toCurrency, amount);
    if (!res.success) {
      setError(res.error || 'Failed to exchange currencies.');
    } else {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-slate-900 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-xs uppercase font-semibold text-emerald-400 tracking-wider mb-0.5">
            Fair Market FX Conversion
          </div>
          <h2 className="text-lg font-bold">Swap Multi-Currency Balances</h2>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Exchange Complete!</h3>
            <p className="text-xs text-slate-600">
              Successfully converted {amount} {fromCurrency} into {targetAmt} {toCurrency}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSwap} className="p-6 space-y-4 text-sm text-slate-700">
            {error && <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg">{error}</div>}

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>From Currency</span>
                  <span className="font-mono text-slate-500">Available: {available.toLocaleString()} {fromCurrency}</span>
                </div>
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
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value as Currency)}
                    className="w-28 p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-hidden"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="NGN">NGN (₦)</option>
                    <option value="KES">KES (KSh)</option>
                    <option value="GHS">GHS (GH₵)</option>
                    <option value="ZAR">ZAR (R)</option>
                    <option value="RWF">RWF (FRw)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-center my-1">
                <button
                  type="button"
                  onClick={() => {
                    const temp = fromCurrency;
                    setFromCurrency(toCurrency);
                    setToCurrency(temp);
                  }}
                  className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                  title="Invert currencies"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-700 mb-1">To Currency</div>
                <div className="flex gap-2">
                  <div className="flex-1 p-2.5 font-mono text-base font-semibold bg-slate-100 rounded-lg text-slate-800">
                    {targetAmt.toLocaleString()}
                  </div>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value as Currency)}
                    className="w-28 p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-hidden"
                  >
                    <option value="NGN">NGN (₦)</option>
                    <option value="KES">KES (KSh)</option>
                    <option value="GHS">GHS (GH₵)</option>
                    <option value="USD">USD ($)</option>
                    <option value="ZAR">ZAR (R)</option>
                    <option value="RWF">RWF (FRw)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-xs font-mono text-slate-600 flex justify-between">
              <span>Fair Interbank Rate:</span>
              <span className="font-semibold text-slate-900">
                1 {fromCurrency} = {rateRatio} {toCurrency}
              </span>
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
                className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
              >
                Execute Swap
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
