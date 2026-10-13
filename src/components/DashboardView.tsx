import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  TrendingUp,
  Percent,
  PlusCircle,
  ArrowRightLeft,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ReceiptText,
} from 'lucide-react';
import { Currency } from '../types';
import { CurrencySwapModal } from './CurrencySwapModal';
import { DepositModal } from './DepositModal';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    loans,
    transactions,
    circles,
    setActiveTab,
    setIsApplyLoanOpen,
    setIsTransferModalOpen,
    setSelectedReceipt,
    repayLoanInstallment,
  } = useApp();

  const [isSwapOpen, setIsSwapOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [repayFeedback, setRepayFeedback] = useState<string | null>(null);

  const activeLoan = loans.find((l) => l.borrowerId === currentUser.id && l.status === 'active');
  const userCircle = circles.find((c) => c.userRole === 'Active Participant');
  const recentTxList = transactions.slice(0, 5);

  const handleQuickRepay = (loanId: string) => {
    const res = repayLoanInstallment(loanId);
    if (res.success) {
      setRepayFeedback('Installment successfully paid! Alternative credit score increased.');
      setTimeout(() => setRepayFeedback(null), 3000);
    } else {
      setRepayFeedback(res.error || 'Payment failed.');
      setTimeout(() => setRepayFeedback(null), 3500);
    }
  };

  return (
    <div className="space-y-8">
      {/* Editorial Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[300px]">
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                <span>Inclusive Community Banking</span>
                <span aria-hidden="true">·</span>
                <span>Atlanta & Diaspora Corridor</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                Dignified microloans and direct transactions for underbanked communities.
              </h1>
              <p className="mt-3 text-sm text-slate-300 max-w-xl leading-relaxed">
                Replacing predatory 391% payday lenders and costly remittance brokers with transparent fixed 3.5% APR microloans,
                verified cash-flow underwriting, and ancestral community savings circles.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button
                onClick={() => setIsApplyLoanOpen(true)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shadow-xs flex items-center gap-1.5"
              >
                <span>Apply for 3.5% Microloan</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsTransferModalOpen(true)}
                className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                <span>Send Money to Africa or US</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full">
            <img
              src="/src/assets/images/hero_community_finance_1791921557667.jpg"
              alt="Community entrepreneurs gathering"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900 via-transparent to-transparent opacity-80" />
          </div>
        </div>
      </div>

      {/* Main Multi-Currency Balance Bar & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wallet Balances Card */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs font-medium text-slate-500">Active Account & Handle</div>
                <div className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>{currentUser.name}</span>
                  <span className="text-xs font-mono font-medium text-slate-500">{currentUser.handle}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSwapOpen(true)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                  title="Exchange currencies"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>Swap FX</span>
                </button>
                <button
                  onClick={() => setIsDepositOpen(true)}
                  className="px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Funds</span>
                </button>
              </div>
            </div>

            {/* Balances Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-xs text-slate-500 font-medium">USD Balance</div>
                <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                  ${currentUser.wallets.USD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Primary US</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-xs text-slate-500 font-medium">NGN (Nigeria)</div>
                <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                  ₦{currentUser.wallets.NGN.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Remittance Pool</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-xs text-slate-500 font-medium">KES (Kenya)</div>
                <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                  KSh{currentUser.wallets.KES.toLocaleString()}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">M-Pesa Ready</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="text-xs text-slate-500 font-medium">GHS (Ghana)</div>
                <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-1">
                  GH₵{currentUser.wallets.GHS.toLocaleString()}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">MoMo Ready</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>KYC: {currentUser.kycTier} · Community Guaranteed</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsTransferModalOpen(true)}
                className="font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
              >
                Send Transfer →
              </button>
            </div>
          </div>
        </div>

        {/* Alternative Credit Score Card ("TrustBridge Score") */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Alternative Credit Health
              </span>
              <span className="text-xs text-emerald-800 font-semibold">Tier 1: Prime Community</span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-extrabold font-mono tabular-nums text-slate-900">
                {currentUser.trustScore}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ 850</span>
              <span className="text-xs text-emerald-700 font-medium ml-auto flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+14 pts this cycle</span>
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Scored via verified utility records, cash-flow stability, and peer vouches—bypassing traditional credit deserts.
            </p>

            {/* Score Pillars */}
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Repayment Track Record</span>
                  <span className="font-mono font-medium">{currentUser.trustScoreFactors.onTimeRepayments}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-700 h-full rounded-full"
                    style={{ width: `${currentUser.trustScoreFactors.onTimeRepayments}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Community Peer Vouches</span>
                  <span className="font-mono font-medium">{currentUser.trustScoreFactors.communityVouches}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-700 h-full rounded-full"
                    style={{ width: `${currentUser.trustScoreFactors.communityVouches}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Cash-Flow Inflow Health</span>
                  <span className="font-mono font-medium">{currentUser.trustScoreFactors.cashFlowStability}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-700 h-full rounded-full"
                    style={{ width: `${currentUser.trustScoreFactors.cashFlowStability}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('education')}
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center justify-between"
          >
            <span>Learn how alternative underwriting works</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* Repayment notification feedback */}
      {repayFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{repayFeedback}</span>
        </div>
      )}

      {/* Active Loan & Community Circle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Loan Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Active Low-Interest Loan
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                {activeLoan ? activeLoan.purpose : 'No Active Loan'}
              </h3>
            </div>
            {activeLoan && (
              <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                {activeLoan.interestRateApr}% Fixed APR
              </span>
            )}
          </div>

          {activeLoan ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg text-xs">
                <div>
                  <div className="text-slate-500">Remaining</div>
                  <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">
                    ${activeLoan.remainingBalance.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Monthly Payment</div>
                  <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">
                    ${activeLoan.monthlyPayment.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Next Due Date</div>
                  <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">
                    {activeLoan.nextDueDate}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Repayment Progress</span>
                  <span className="font-mono">
                    {Math.round(((activeLoan.totalRepayment - activeLoan.remainingBalance) / activeLoan.totalRepayment) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-800 h-full rounded-full transition-all"
                    style={{
                      width: `${Math.round(
                        ((activeLoan.totalRepayment - activeLoan.remainingBalance) / activeLoan.totalRepayment) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Payday loan comparison proof */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-lg text-xs text-emerald-950 flex items-start justify-between">
                <div>
                  <div className="font-semibold text-emerald-900">Fair Lending Impact:</div>
                  <div className="text-emerald-800/90 text-xs mt-0.5">
                    Saved <span className="font-mono font-bold">${activeLoan.savingsVersusPayday.toFixed(2)}</span> in fees
                    versus typical 391% storefront payday loan roll-overs.
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setActiveTab('loans')}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  View Full Schedule →
                </button>
                <button
                  onClick={() => handleQuickRepay(activeLoan.id)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
                >
                  Pay Next Installment (${activeLoan.monthlyPayment.toFixed(2)})
                </button>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-slate-500 space-y-3">
              <p>You currently do not have an active loan balance.</p>
              <button
                onClick={() => setIsApplyLoanOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs"
              >
                Apply for Low-Interest Loan (3.5% APR)
              </button>
            </div>
          )}
        </div>

        {/* Esusu Community Circle Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Ancestral Community Savings
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {userCircle ? userCircle.name : circles[0].name}
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                {userCircle ? userCircle.originTradition : circles[0].originTradition}
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              {userCircle ? userCircle.description : circles[0].description}
            </p>

            <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg text-xs mb-4">
              <div>
                <div className="text-slate-500">Monthly Share</div>
                <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">
                  ${userCircle ? userCircle.monthlyContribution : circles[0].monthlyContribution}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Total Pool</div>
                <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">
                  ${userCircle ? userCircle.totalCyclePool : circles[0].totalCyclePool}
                </div>
              </div>
              <div>
                <div className="text-slate-500">Your Turn</div>
                <div className="font-mono font-bold text-emerald-800 text-xs mt-0.5">
                  {userCircle ? userCircle.userNextTurnMonth : 'Join Cohort'}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('circles')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Explore All Esusu Circles →
            </button>
            <button
              onClick={() => setActiveTab('circles')}
              className="px-4 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              View Circle Rotation
            </button>
          </div>
        </div>
      </div>

      {/* Recent Transactions Ledger Excerpt */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Transactions</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live peer transfers, low-rate loan disbursements, and Esusu pool allocations.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('ledger')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
          >
            Full Ledger Audit →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Transaction / Purpose</th>
                <th className="py-3 px-4">Entity & Channel</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-right">Flat Fee</th>
                <th className="py-3 px-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentTxList.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{tx.title}</div>
                    <div className="text-xs text-slate-400 font-mono">
                      {new Date(tx.date).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      · <span className="select-all">{tx.referenceId}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800">{tx.recipient}</div>
                    <div className="text-xs text-slate-500">{tx.recipientMethod || 'Internal Transfer'}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums font-semibold text-slate-900">
                    {tx.type === 'transfer_sent' || tx.type === 'loan_repayment' || tx.type === 'circle_contribution'
                      ? '-'
                      : '+'}
                    {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                    {tx.currency}
                    {tx.convertedAmount && (
                      <div className="text-xs text-slate-400 font-normal">
                        ≈ {tx.convertedAmount.toLocaleString()} {tx.convertedCurrency}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-500">
                    {tx.fee === 0 ? 'Free' : `$${tx.fee.toFixed(2)}`}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => setSelectedReceipt(tx)}
                      className="p-1.5 text-slate-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-md transition-colors"
                      title="View digital receipt"
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

      {/* Currency Swap Modal */}
      <CurrencySwapModal isOpen={isSwapOpen} onClose={() => setIsSwapOpen(false)} />

      {/* Deposit Modal */}
      <DepositModal isOpen={isDepositOpen} onClose={() => setIsDepositOpen(false)} />
    </div>
  );
};
