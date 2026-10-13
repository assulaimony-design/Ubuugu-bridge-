import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Percent,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  CreditCard,
  ArrowRight,
  Info,
} from 'lucide-react';
import { Currency } from '../types';

export const LoansView: React.FC = () => {
  const {
    currentUser,
    loans,
    repayLoanInstallment,
    setIsApplyLoanOpen,
  } = useApp();

  const [calcAmount, setCalcAmount] = useState<number>(750);
  const [calcTerm, setCalcTerm] = useState<number>(6);
  const [payError, setPayError] = useState<string | null>(null);
  const [paySuccess, setPaySuccess] = useState<string | null>(null);

  const userLoans = loans.filter((l) => l.borrowerId === currentUser.id);

  // Amortization calculation
  const calcApr = calcTerm <= 6 ? 3.5 : calcTerm <= 12 ? 3.8 : 4.2;
  const monthlyRate = calcApr / 100 / 12;
  const calcMonthlyPayment = Number(
    ((calcAmount * (monthlyRate * Math.pow(1 + monthlyRate, calcTerm))) / (Math.pow(1 + monthlyRate, calcTerm) - 1)).toFixed(2)
  );
  const calcTotalInterest = Number((calcMonthlyPayment * calcTerm - calcAmount).toFixed(2));
  const calcTotalRepayment = Number((calcAmount + calcTotalInterest).toFixed(2));

  // Payday lender comparison
  const typicalPaydayFee = Number((calcAmount * (calcTerm * 0.12)).toFixed(2));
  const moneySaved = Math.max(140, Number((typicalPaydayFee - calcTotalInterest).toFixed(2)));

  const handleRepay = (loanId: string) => {
    setPayError(null);
    setPaySuccess(null);
    const res = repayLoanInstallment(loanId);
    if (!res.success) {
      setPayError(res.error || 'Repayment failed.');
    } else {
      setPaySuccess('Installment successfully paid! Reported to community credit ledger (+10 pts).');
      setTimeout(() => setPaySuccess(null), 4000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              Low-Interest Microfinance
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Fair Microloans at 3.5% APR — Ending Predatory Payday Debt
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              In underbanked African and American zip codes, traditional lenders charge 391% APR or demand unattainable FICO scores.
              UbuntuBridge provides fixed, low-interest working capital backed by community mutual guarantees.
            </p>
          </div>

          <button
            onClick={() => setIsApplyLoanOpen(true)}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors shadow-xs whitespace-nowrap self-start md:self-auto flex items-center gap-1.5"
          >
            <span>Apply for Microloan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Side-by-Side Rate Comparison Table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-slate-200 bg-white text-slate-700">
          <div className="text-xs text-rose-600 font-semibold uppercase tracking-wider">Traditional Storefront</div>
          <div className="text-lg font-bold text-slate-900 mt-1">Payday / Check-Cashing</div>
          <div className="text-3xl font-extrabold font-mono text-rose-600 mt-2 tabular-nums">391% APR</div>
          <div className="text-xs text-slate-500 mt-2 space-y-1">
            <div>· $60 fee every 2 weeks per $400</div>
            <div>· Infinite rollover debt traps</div>
            <div>· Doesn't report positive payments</div>
          </div>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 bg-white text-slate-700">
          <div className="text-xs text-amber-600 font-semibold uppercase tracking-wider">Fintech Subprime</div>
          <div className="text-lg font-bold text-slate-900 mt-1">Online Installment Loans</div>
          <div className="text-3xl font-extrabold font-mono text-amber-600 mt-2 tabular-nums">180% - 250%</div>
          <div className="text-xs text-slate-500 mt-2 space-y-1">
            <div>· Hidden origination deductions (10%)</div>
            <div>· Daily compounding interest</div>
            <div>· High aggressive collection tactics</div>
          </div>
        </div>

        <div className="p-5 rounded-xl border-2 border-emerald-700 bg-emerald-50/60 text-slate-900 shadow-xs relative">
          <div className="text-xs text-emerald-800 font-bold uppercase tracking-wider">UbuntuBridge Guarantee</div>
          <div className="text-lg font-bold text-slate-900 mt-1">Community Microloan</div>
          <div className="text-3xl font-extrabold font-mono text-emerald-800 mt-2 tabular-nums">3.5% Fixed APR</div>
          <div className="text-xs text-emerald-950 mt-2 space-y-1 font-medium">
            <div>· Flat transparent amortization schedule</div>
            <div>· $0 origination fees & $0 prepayment penalty</div>
            <div>· Builds certified alternative credit rating</div>
          </div>
        </div>
      </div>

      {/* Interactive Microloan Calculator & Comparison Slider */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl">
          <h2 className="text-lg font-bold text-slate-900">Interactive Loan Cost & Savings Simulator</h2>
          <p className="text-xs text-slate-600 mt-1">
            Test loan amounts and repayment terms to see exactly what you pay in interest and how much money stays in your pocket.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-700">Principal Needed:</span>
                <span className="text-lg font-bold font-mono text-slate-900">${calcAmount.toLocaleString()} USD</span>
              </div>
              <input
                type="range"
                min="100"
                max="2500"
                step="50"
                value={calcAmount}
                onChange={(e) => setCalcAmount(Number(e.target.value))}
                className="w-full accent-emerald-800 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-400 font-mono mt-1">
                <span>$100</span>
                <span>$1,000</span>
                <span>$2,500</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-700 block mb-2">Repayment Period:</span>
              <div className="grid grid-cols-4 gap-2">
                {[3, 6, 12, 18].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setCalcTerm(term)}
                    className={`py-2 text-xs rounded-lg border text-center font-medium transition-colors ${
                      calcTerm === term
                        ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {term} Months
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg text-xs text-slate-600 space-y-1 border border-slate-100">
              <div className="font-semibold text-slate-800">Underwriting Safeguard:</div>
              <p>
                Loans on UbuntuBridge do not require collateral or traditional FICO scores. Approvals are grounded in your
                mobile money cash flow, utility history, and peer vouches.
              </p>
            </div>
          </div>

          {/* Live Outcome Box */}
          <div className="lg:col-span-5 bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Transparent Repayment Breakdown
              </div>

              <div className="mt-3 space-y-2.5 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>Monthly Installment:</span>
                  <span className="font-mono font-bold text-base text-slate-900">
                    ${calcMonthlyPayment.toFixed(2)} / mo
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Fixed Annual Percentage Rate:</span>
                  <span className="font-mono font-bold text-emerald-800">{calcApr}% APR</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Interest Paid (Life of loan):</span>
                  <span className="font-mono font-semibold text-slate-900">${calcTotalInterest.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Loan Repayment:</span>
                  <span className="font-mono font-semibold text-slate-900">${calcTotalRepayment.toFixed(2)}</span>
                </div>
              </div>

              {/* Real savings calculation */}
              <div className="mt-4 p-3 bg-emerald-100/80 rounded-lg border border-emerald-200 text-emerald-950 text-xs">
                <div className="font-bold text-emerald-900">Estimated Community Savings:</div>
                <div className="mt-0.5">
                  You save <span className="font-mono font-bold text-sm text-emerald-800">+${moneySaved.toFixed(2)}</span>{' '}
                  in non-predatory fees compared to a standard payday installment.
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsApplyLoanOpen(true)}
              className="w-full mt-4 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors shadow-xs"
            >
              Apply with This Configuration
            </button>
          </div>
        </div>
      </div>

      {/* Active Loans & Schedules */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Your Active & Historical Microloans</h2>

        {payError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{payError}</span>
          </div>
        )}

        {paySuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{paySuccess}</span>
          </div>
        )}

        {userLoans.length === 0 ? (
          <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-500 space-y-3">
            <p>You have no active microloans right now.</p>
            <button
              onClick={() => setIsApplyLoanOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg"
            >
              Apply for 3.5% Working Capital Microloan
            </button>
          </div>
        ) : (
          userLoans.map((loan) => (
            <div key={loan.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{loan.purpose}</h3>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {loan.interestRateApr}% APR
                    </span>
                    <span className="text-xs text-slate-500">· {loan.status === 'paid' ? 'Settled in Full' : 'Active'}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Disbursed on {loan.disbursedDate} by {loan.lenderType} · ${loan.amount.toFixed(2)} {loan.currency}
                  </p>
                </div>

                {loan.status === 'active' && (
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs text-slate-500">Remaining Balance</div>
                      <div className="font-mono font-bold text-slate-900 text-base">
                        ${loan.remainingBalance.toFixed(2)}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRepay(loan.id)}
                      className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
                    >
                      Pay Next Installment (${loan.monthlyPayment.toFixed(2)})
                    </button>
                  </div>
                )}
              </div>

              {/* Schedule Table */}
              <div className="p-5">
                <div className="text-xs font-semibold text-slate-700 mb-3">Installment Schedule & Status:</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Due Date</th>
                        <th className="py-2.5 px-3 text-right">Payment</th>
                        <th className="py-2.5 px-3 text-right">Principal</th>
                        <th className="py-2.5 px-3 text-right">Low Interest</th>
                        <th className="py-2.5 px-3 text-right">Remaining</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {loan.schedule.map((item) => (
                        <tr key={item.installmentNumber} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 font-mono">{item.installmentNumber}</td>
                          <td className="py-2.5 px-3 font-mono">{item.dueDate}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-semibold">${item.paymentAmount.toFixed(2)}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-600">${item.principalAmount.toFixed(2)}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-emerald-800">${item.interestAmount.toFixed(2)}</td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-500">${item.remainingPrincipal.toFixed(2)}</td>
                          <td className="py-2.5 px-3 text-center">
                            {item.status === 'paid' ? (
                              <span className="text-emerald-700 font-semibold flex items-center justify-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Paid</span>
                              </span>
                            ) : (
                              <span className="text-slate-500 font-medium">Upcoming</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Alternative Underwriting Explanation */}
      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <h3 className="text-base font-bold text-slate-900">How Ubuntu Alternative Underwriting Works</h3>
        <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Traditional credit algorithms intentionally disadvantage individuals without conventional credit card history.
          Our TrustBridge model uses verifiable positive human signals to qualify members for 3.5% APR rates:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-xs">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="font-bold text-slate-900 mb-1">1. Cash-Flow Continuity</div>
            <p className="text-slate-600">
              Weekly revenue from client services or payroll direct deposits proves debt service capability.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="font-bold text-slate-900 mb-1">2. Utility & Rental Consistency</div>
            <p className="text-slate-600">
              Timely phone, electric, and rent payments demonstrate reliable behavioral discipline.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="font-bold text-slate-900 mb-1">3. Community Peer Vouches</div>
            <p className="text-slate-600">
              Endorsements from fellow business operators and elders in your neighborhood network.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="font-bold text-slate-900 mb-1">4. Esusu Circle History</div>
            <p className="text-slate-600">
              Participating in rotational savings circles guarantees mutual accountability and solidarity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
