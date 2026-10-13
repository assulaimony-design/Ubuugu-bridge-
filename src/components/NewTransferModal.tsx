import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Currency } from '../types';
import { X, ArrowRight, ShieldCheck, ArrowRightLeft, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NewTransferModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { currentUser, rates, sendTransfer } = useApp();

  const [recipientName, setRecipientName] = useState('');
  const [recipientHandle, setRecipientHandle] = useState('');
  const [sourceCurrency, setSourceCurrency] = useState<Currency>('USD');
  const [sourceAmount, setSourceAmount] = useState<number>(100);
  const [targetCurrency, setTargetCurrency] = useState<Currency>('NGN');
  const [deliveryMethod, setDeliveryMethod] = useState<
    'Ubuntu Wallet' | 'M-Pesa Mobile Money' | 'MTN MoMo' | 'Direct Bank ACH/NIP'
  >('Direct Bank ACH/NIP');
  const [accountDetails, setAccountDetails] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const getRate = (code: Currency) => {
    const found = rates.find((r) => r.code === code);
    return found ? found.ratePerUSD : 1;
  };

  const srcRate = getRate(sourceCurrency);
  const tgtRate = getRate(targetCurrency);
  const usdVal = sourceAmount / srcRate;
  const targetAmount = Number((usdVal * tgtRate).toFixed(2));
  const rateRatio = Number((tgtRate / srcRate).toFixed(4));
  const fee = sourceCurrency === 'USD' ? 0.75 : 100;
  const availableBal = currentUser.wallets[sourceCurrency] || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!recipientName.trim()) {
      setErrorMessage('Please specify the recipient name.');
      return;
    }

    if (sourceAmount <= 0) {
      setErrorMessage('Please enter an amount greater than zero.');
      return;
    }

    const res = sendTransfer({
      recipientName,
      recipientHandle,
      sourceCurrency,
      sourceAmount,
      targetCurrency,
      deliveryMethod,
      accountDetails,
      notes,
    });

    if (!res.success) {
      setErrorMessage(res.error || 'Failed to complete transaction.');
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-emerald-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-300 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-xs uppercase font-semibold text-emerald-400 tracking-wider mb-1">
            Global African & American Remittance
          </div>
          <h2 className="text-xl font-bold">Send Money Seamlessly</h2>
          <p className="text-xs text-emerald-200 mt-1">
            Real mid-market FX rates with zero hidden spreads. Direct delivery to Mobile Money or bank accounts.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm text-slate-700">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Amount and Currencies */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>You Send</span>
              <span className="font-mono text-slate-500">
                Available: {availableBal.toLocaleString()} {sourceCurrency}
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                step="any"
                value={sourceAmount}
                onChange={(e) => setSourceAmount(Number(e.target.value))}
                className="flex-1 p-2.5 text-base font-mono font-semibold bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-800 focus:outline-hidden"
                placeholder="0.00"
              />
              <select
                value={sourceCurrency}
                onChange={(e) => setSourceCurrency(e.target.value as Currency)}
                className="w-28 p-2.5 bg-white border border-slate-300 rounded-lg font-semibold text-xs focus:outline-hidden"
              >
                <option value="USD">USD ($)</option>
                <option value="NGN">NGN (₦)</option>
                <option value="KES">KES (KSh)</option>
                <option value="GHS">GHS (GH₵)</option>
                <option value="ZAR">ZAR (R)</option>
                <option value="RWF">RWF (FRw)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="text-xs text-slate-500 font-mono">
                1 {sourceCurrency} = {rateRatio} {targetCurrency}
              </div>
              <div className="text-xs text-emerald-800 font-medium">Flat Fee: ${fee.toFixed(2)}</div>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 pt-2 border-t border-slate-200">
              <span>Recipient Receives</span>
              <span className="font-mono font-bold text-emerald-800 text-base">
                {targetAmount.toLocaleString()} {targetCurrency}
              </span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 p-2.5 bg-slate-100 rounded-lg font-mono font-bold text-slate-900 text-sm">
                {targetAmount.toLocaleString()}
              </div>
              <select
                value={targetCurrency}
                onChange={(e) => setTargetCurrency(e.target.value as Currency)}
                className="w-28 p-2.5 bg-white border border-slate-300 rounded-lg font-semibold text-xs focus:outline-hidden"
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

          {/* Recipient info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-900 block mb-1">Recipient Name</label>
              <input
                type="text"
                required
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Babatunde Vance"
                className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-800 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-900 block mb-1">Delivery Channel</label>
              <select
                value={deliveryMethod}
                onChange={(e) => setDeliveryMethod(e.target.value as any)}
                className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-800 focus:outline-hidden"
              >
                <option value="Direct Bank ACH/NIP">Direct Bank (ACH / NIP)</option>
                <option value="M-Pesa Mobile Money">M-Pesa (Kenya / East Africa)</option>
                <option value="MTN MoMo">MTN Mobile Money (Ghana/Nigeria)</option>
                <option value="Ubuntu Wallet">Ubuntu Peer Wallet ($tag)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-900 block mb-1">
              Account / Phone / Tag Details
            </label>
            <input
              type="text"
              value={accountDetails}
              onChange={(e) => setAccountDetails(e.target.value)}
              placeholder="e.g. Zenith Bank 0123456789 or +254 712 345 678"
              className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-800 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-900 block mb-1">Transfer Purpose / Note</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. School supplies and clinic inventory"
              className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-800 focus:outline-hidden"
            />
          </div>

          {/* Anti-predatory remittance pledge */}
          <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-900 rounded-lg text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Guaranteed zero predatory spread: Western wire transfer services typically charge $12 + 6% hidden FX markups.</span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition-colors shadow-xs flex items-center gap-1.5"
            >
              <span>Send Funds Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
