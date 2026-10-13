import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Currency } from '../types';
import {
  ArrowRightLeft,
  ShieldCheck,
  Send,
  Zap,
  Globe2,
  ReceiptText,
  Clock,
  CheckCircle2,
  Building2,
  Smartphone,
  Wallet,
} from 'lucide-react';

export const TransfersView: React.FC = () => {
  const {
    currentUser,
    rates,
    transactions,
    setIsTransferModalOpen,
    setSelectedReceipt,
    sendTransfer,
  } = useApp();

  const [fromCurr, setFromCurr] = useState<Currency>('USD');
  const [toCurr, setToCurr] = useState<Currency>('NGN');
  const [sendAmount, setSendAmount] = useState<number>(150);
  const [recipient, setRecipient] = useState<string>('');
  const [channel, setChannel] = useState<'Direct Bank ACH/NIP' | 'M-Pesa Mobile Money' | 'MTN MoMo' | 'Ubuntu Wallet'>('Direct Bank ACH/NIP');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const getRate = (code: Currency) => {
    const found = rates.find((r) => r.code === code);
    return found ? found.ratePerUSD : 1;
  };

  const srcRate = getRate(fromCurr);
  const tgtRate = getRate(toCurr);
  const usdVal = sendAmount / srcRate;
  const receiveAmount = Number((usdVal * tgtRate).toFixed(2));
  const rateRatio = Number((tgtRate / srcRate).toFixed(4));
  const fee = fromCurr === 'USD' ? 0.75 : 100;

  const transferList = transactions.filter(
    (t) => t.type === 'transfer_sent' || t.type === 'transfer_received' || t.type === 'currency_swap'
  );

  const handleQuickSend = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!recipient.trim()) {
      setFeedback({ type: 'error', message: 'Please provide a recipient name.' });
      return;
    }

    const res = sendTransfer({
      recipientName: recipient,
      sourceCurrency: fromCurr,
      sourceAmount: sendAmount,
      targetCurrency: toCurr,
      deliveryMethod: channel,
      notes: `Direct remittance via UbuntuBridge corridor (${fromCurr} to ${toCurr})`,
    });

    if (!res.success) {
      setFeedback({ type: 'error', message: res.error || 'Transfer failed.' });
    } else {
      setFeedback({
        type: 'success',
        message: `Successfully transferred ${sendAmount} ${fromCurr} (${receiveAmount.toLocaleString()} ${toCurr}) to ${recipient}!`,
      });
      setRecipient('');
    }
  };

  const SAVED_BENEFICIARIES = [
    { name: 'Chioma Vance', handle: 'Zenith Bank · 012399120', country: 'Nigeria', flag: '🇳🇬', currency: 'NGN' as Currency },
    { name: 'Wanjiku Mwangi', handle: 'M-Pesa · +254 712 990 123', country: 'Kenya', flag: '🇰🇪', currency: 'KES' as Currency },
    { name: 'Kofi Mensah', handle: 'MTN MoMo · +233 24 555 881', country: 'Ghana', flag: '🇬🇭', currency: 'GHS' as Currency },
    { name: 'David Washington', handle: 'Ubuntu Wallet · $dwash_atl', country: 'USA', flag: '🇺🇸', currency: 'USD' as Currency },
  ];

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              Cross-Border & Peer-to-Peer
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              African & American Financial Corridors
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Send money directly between the US and African nations with genuine mid-market FX rates, flat $0.75 fees,
              and instant mobile money settlements that keep more resources with families and businesses.
            </p>
          </div>

          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors shadow-xs whitespace-nowrap self-start md:self-auto flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>New Custom Transfer</span>
          </button>
        </div>
      </div>

      {/* Main Transfer Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Transfer Form Box */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Direct Remittance Dispatch</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Instant payout straight to African bank accounts (NIP, ACH) or Mobile Wallets (M-Pesa, MTN MoMo).
            </p>
          </div>

          {feedback && (
            <div
              className={`p-3.5 rounded-lg text-xs flex items-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-rose-700 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          <form onSubmit={handleQuickSend} className="space-y-4">
            {/* Amount inputs */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Send Amount</span>
                  <span className="font-mono text-slate-500">
                    Wallet: {currentUser.wallets[fromCurr].toLocaleString()} {fromCurr}
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(Number(e.target.value))}
                    className="flex-1 p-2.5 font-mono text-base font-bold bg-white border border-slate-300 rounded-lg focus:outline-hidden"
                  />
                  <select
                    value={fromCurr}
                    onChange={(e) => setFromCurr(e.target.value as Currency)}
                    className="w-28 p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-hidden"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="NGN">NGN (₦)</option>
                    <option value="KES">KES (KSh)</option>
                    <option value="GHS">GHS (GH₵)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 text-slate-500 font-mono">
                <span>1 {fromCurr} = {rateRatio} {toCurr}</span>
                <span className="text-emerald-800 font-medium">Flat Fee: ${fee.toFixed(2)} (No FX Markup)</span>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-700 mb-1">Recipient Will Receive</div>
                <div className="flex gap-2">
                  <div className="flex-1 p-2.5 font-mono text-base font-bold bg-slate-100 rounded-lg text-slate-900">
                    {receiveAmount.toLocaleString()}
                  </div>
                  <select
                    value={toCurr}
                    onChange={(e) => setToCurr(e.target.value as Currency)}
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

            {/* Recipient Input */}
            <div>
              <label className="text-xs font-semibold text-slate-900 block mb-1">Recipient Full Name</label>
              <input
                type="text"
                required
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. Chioma Vance or $chioma_vance"
                className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-800"
              />
            </div>

            {/* Quick Beneficiary Shortcuts */}
            <div>
              <div className="text-xs font-medium text-slate-500 mb-1.5">Quick Beneficiaries:</div>
              <div className="grid grid-cols-2 gap-2">
                {SAVED_BENEFICIARIES.map((ben) => (
                  <button
                    key={ben.name}
                    type="button"
                    onClick={() => {
                      setRecipient(ben.name);
                      setToCurr(ben.currency);
                    }}
                    className="p-2 text-left bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors text-xs"
                  >
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <span>{ben.flag}</span>
                      <span className="truncate">{ben.name}</span>
                    </div>
                    <div className="text-slate-400 text-xs truncate mt-0.5">{ben.handle}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Channel selector */}
            <div>
              <label className="text-xs font-semibold text-slate-900 block mb-1">Delivery Channel</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'Direct Bank ACH/NIP', label: 'Local Bank Account', desc: 'Direct NIP / ACH' },
                  { id: 'M-Pesa Mobile Money', label: 'M-Pesa (Kenya)', desc: 'Instant Mobile Phone' },
                  { id: 'MTN MoMo', label: 'MTN Mobile Money', desc: 'Ghana & West Africa' },
                  { id: 'Ubuntu Wallet', label: 'Ubuntu Peer Tag', desc: 'Zero-Fee Direct Wallet' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setChannel(item.id as any)}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-colors ${
                      channel === item.id
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-semibold">{item.label}</div>
                    <div className={channel === item.id ? 'text-slate-300' : 'text-slate-400'}>{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Authorize & Send {sendAmount} {fromCurr}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Live Rates & Anti-Gouging Comparison Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900">Mid-Market FX Corridors</h3>
              <span className="text-xs font-medium text-emerald-800">Live Rates</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Direct central-bank-indexed exchange rates updated in real time. We charge zero hidden spread.
            </p>

            <div className="space-y-2 text-xs">
              {rates.map((r) => (
                <div key={r.code} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{r.flag}</span>
                    <span className="font-semibold text-slate-900">{r.code}</span>
                    <span className="text-slate-500 text-xs">{r.name}</span>
                  </div>
                  <div className="font-mono font-bold text-slate-900">
                    1 USD = {r.ratePerUSD.toLocaleString()} {r.symbol}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transparent Fee Comparison */}
          <div className="bg-emerald-900 text-white rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              <span>The Remittance Justice Promise</span>
            </div>

            <h3 className="text-lg font-bold">Why UbuntuBridge saves $11.25 per transaction</h3>
            <p className="text-xs text-emerald-200 leading-relaxed">
              Traditional international money transfer companies strip up to 10% in hidden rate margins and $12 wire fees
              when underbanked African diaspora members send money back home.
            </p>

            <div className="p-3 bg-emerald-950/60 rounded-lg text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-emerald-300">Western Wire Monopolies:</span>
                <span className="text-rose-400 font-bold">$12.50 fee + 6.8% FX Markup</span>
              </div>
              <div className="flex justify-between border-t border-emerald-800 pt-1.5">
                <span className="text-emerald-300">UbuntuBridge Community:</span>
                <span className="text-amber-300 font-bold">$0.75 flat + 0% FX Markup</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Remittance Deliveries</h3>
            <p className="text-xs text-slate-500">Every dollar tracked with cryptographically verifiable receipts.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Recipient</th>
                <th className="py-2.5 px-3">Network Channel</th>
                <th className="py-2.5 px-3 text-right">Amount Sent</th>
                <th className="py-2.5 px-3 text-right">Amount Received</th>
                <th className="py-2.5 px-3 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {transferList.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-3 font-mono text-slate-500">
                    {new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">{tx.recipient}</div>
                    <div className="text-xs text-slate-400 font-mono">{tx.referenceId}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{tx.recipientMethod || 'Direct Wallet'}</td>
                  <td className="py-3 px-3 text-right font-mono font-semibold text-slate-900">
                    ${tx.amount.toFixed(2)} {tx.currency}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-semibold text-emerald-800">
                    {tx.convertedAmount ? `${tx.convertedAmount.toLocaleString()} ${tx.convertedCurrency}` : '—'}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => setSelectedReceipt(tx)}
                      className="p-1.5 text-slate-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-md transition-colors"
                      title="Download receipt"
                    >
                      <ReceiptText className="w-4 h-4 mx-auto" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
