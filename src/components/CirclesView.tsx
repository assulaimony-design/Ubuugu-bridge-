import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  History,
  Sparkles,
} from 'lucide-react';

export const CirclesView: React.FC = () => {
  const {
    currentUser,
    circles,
    contributeToCircle,
  } = useApp();

  const [selectedCircleId, setSelectedCircleId] = useState<string>(circles[0].id);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const selectedCircle = circles.find((c) => c.id === selectedCircleId) || circles[0];

  const handleContribute = (circleId: string) => {
    setFeedback(null);
    const res = contributeToCircle(circleId);
    if (!res.success) {
      setFeedback({ type: 'error', message: res.error || 'Failed to deposit contribution.' });
    } else {
      setFeedback({
        type: 'success',
        message: `Successfully contributed $${selectedCircle.monthlyContribution} to ${selectedCircle.name}! Alternative credit score boosted (+8 pts).`,
      });
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              Mutual Aid & Rotating Credit (ROSCA)
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Esusu, Chama & Sou-Sou Community Circles
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Before exclusionary banking cartels existed, African communities and Black mutual aid societies built wealth
              together through trusted rotating credit. We digitize this ancestral wisdom so your solidarity builds modern credit.
            </p>
          </div>
        </div>
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
            <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Circle Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {circles.map((circle) => {
          const isSelected = circle.id === selectedCircleId;
          return (
            <button
              key={circle.id}
              onClick={() => setSelectedCircleId(circle.id)}
              className={`p-5 rounded-xl border text-left transition-all relative ${
                isSelected
                  ? 'border-emerald-800 bg-emerald-50/40 ring-1 ring-emerald-800 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                {circle.originTradition}
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">{circle.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{circle.location}</p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs">
                <div>
                  <span className="text-slate-400">Share: </span>
                  <span className="font-mono font-bold text-slate-900">${circle.monthlyContribution}/mo</span>
                </div>
                <div>
                  <span className="text-slate-400">Pool: </span>
                  <span className="font-mono font-bold text-emerald-800">${circle.totalCyclePool}</span>
                </div>
              </div>

              {circle.userRole === 'Active Participant' && (
                <div className="mt-2 text-xs text-emerald-800 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Your Active Circle</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Detailed Active Circle Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-800">{selectedCircle.originTradition}</span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500">{selectedCircle.location}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">{selectedCircle.name}</h2>
            <p className="text-xs text-slate-600 mt-1 max-w-xl">{selectedCircle.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleContribute(selectedCircle.id)}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors shadow-xs"
            >
              Contribute Share (${selectedCircle.monthlyContribution} USD)
            </button>
          </div>
        </div>

        {/* Vital stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-slate-500">Monthly Deposit</div>
            <div className="text-xl font-mono font-bold text-slate-900 mt-1">
              ${selectedCircle.monthlyContribution.toFixed(2)}
            </div>
            <div className="text-slate-400 text-xs mt-0.5">Fixed per cycle</div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-slate-500">Lump-Sum Pot</div>
            <div className="text-xl font-mono font-bold text-emerald-800 mt-1">
              ${selectedCircle.totalCyclePool.toFixed(2)}
            </div>
            <div className="text-slate-400 text-xs mt-0.5">{selectedCircle.membersCount} participants</div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-slate-500">Current Payout Due</div>
            <div className="text-base font-semibold text-slate-900 mt-1">
              {selectedCircle.nextRecipientName}
            </div>
            <div className="text-slate-400 text-xs mt-0.5">Disbursed on {selectedCircle.nextPayoutDate}</div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-slate-500">Your Turn To Receive</div>
            <div className="text-base font-semibold text-emerald-800 mt-1">
              {selectedCircle.userNextTurnMonth}
            </div>
            <div className="text-slate-400 text-xs mt-0.5">0% interest rotational grant</div>
          </div>
        </div>

        {/* Rotation Cycle Schedule Visualizer */}
        <div>
          <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">
            Cycle #{selectedCircle.currentCycle} Payout Rotation Schedule
          </h3>

          <div className="space-y-2">
            {[
              { month: 'August 2026', recipient: 'Amara Okafor', status: 'completed', amount: '$1,000' },
              { month: 'September 2026', recipient: 'Kwame Boateng', status: 'completed', amount: '$1,000' },
              { month: 'October 2026', recipient: 'Keisha Thorne', status: 'current', amount: '$1,000' },
              { month: 'November 2026', recipient: 'Babatunde Adeleke', status: 'upcoming', amount: '$1,000' },
              { month: 'December 2026', recipient: `${currentUser.name} (Your Turn)`, status: 'upcoming', amount: '$1,000' },
              { month: 'January 2027', recipient: 'Nia Robinson', status: 'upcoming', amount: '$1,000' },
            ].map((slot, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border flex items-center justify-between text-xs ${
                  slot.status === 'current'
                    ? 'border-emerald-700 bg-emerald-50/70 font-semibold'
                    : slot.recipient.includes('(Your Turn)')
                    ? 'border-amber-300 bg-amber-50/50'
                    : 'border-slate-100 bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-500 w-28">{slot.month}</span>
                  <span className="font-medium text-slate-900">{slot.recipient}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono font-bold text-slate-900">{slot.amount}</span>
                  <span className="w-20 text-right">
                    {slot.status === 'completed' && <span className="text-slate-400">Paid Out</span>}
                    {slot.status === 'current' && <span className="text-emerald-800 font-bold">This Month</span>}
                    {slot.status === 'upcoming' && <span className="text-slate-500">Upcoming</span>}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Esusu builds real credit */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>Digital Ledger Credit Certification</span>
          </div>
          <p>
            Historically, Esusu contributions happened entirely off the books in cash, so participants received zero credit
            rating for decades of immaculate payments. UbuntuBridge cryptographically certifies each monthly deposit,
            automatically updating your TrustBridge Score and opening doors to low-rate commercial microloans.
          </p>
        </div>
      </div>
    </div>
  );
};
