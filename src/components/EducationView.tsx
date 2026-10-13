import React, { useState } from 'react';
import { FINANCIAL_GUIDES } from '../data/initialData';
import { FinancialGuide } from '../types';
import { BookOpen, Sparkles, ShieldAlert, ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export const EducationView: React.FC = () => {
  const [selectedGuideId, setSelectedGuideId] = useState<string>(FINANCIAL_GUIDES[0].id);
  const [expandedId, setExpandedId] = useState<string | null>(FINANCIAL_GUIDES[0].id);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
          Financial Sovereignty & Underbanked Rights
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Credit Building & Anti-Predatory Financial Guides
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Knowledge is the first defense against predatory financial systems. Learn how alternative credit works,
          how to dismantle the payday lending cycle, and how to preserve wealth across the African diaspora.
        </p>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FINANCIAL_GUIDES.map((guide) => {
          const isExpanded = expandedId === guide.id;
          return (
            <div
              key={guide.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
            >
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-emerald-800">{guide.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{guide.readTime}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-snug">{guide.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{guide.summary}</p>

                {/* Actionable tip callout */}
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200/60 text-xs text-amber-950">
                  <span className="font-bold text-amber-900">Practical Action: </span>
                  {guide.actionableTip}
                </div>

                {isExpanded && (
                  <div className="pt-3 border-t border-slate-100 text-xs text-slate-700 space-y-2.5 animate-in fade-in duration-150">
                    {guide.fullContent.map((paragraph, idx) => (
                      <p key={idx} className="leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs">
                <button
                  onClick={() => toggleExpand(guide.id)}
                  className="font-semibold text-slate-900 hover:text-emerald-800 transition-colors flex items-center gap-1"
                >
                  <span>{isExpanded ? 'Show Less' : 'Read Full Guide'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Underbanked Rights Checklist */}
      <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-8 shadow-xs">
        <h3 className="text-lg font-bold text-white mb-2">The Underbanked Borrower Bill of Rights</h3>
        <p className="text-xs text-slate-300 max-w-2xl mb-6">
          Every human being deserves transparent access to fair capital. If you or someone you know uses alternative finance,
          always demand these 4 guarantees:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-slate-800/80 rounded-lg border border-slate-700 space-y-1.5">
            <div className="font-bold text-amber-400">1. Full APR Disclosure</div>
            <p className="text-slate-300">
              Never accept a lender expressing interest as "just a $15 fee per $100." Demand the annual percentage rate (APR) in writing.
            </p>
          </div>
          <div className="p-4 bg-slate-800/80 rounded-lg border border-slate-700 space-y-1.5">
            <div className="font-bold text-amber-400">2. Zero Prepayment Penalties</div>
            <p className="text-slate-300">
              You must always be permitted to settle debt early without penalty to save on future interest.
            </p>
          </div>
          <div className="p-4 bg-slate-800/80 rounded-lg border border-slate-700 space-y-1.5">
            <div className="font-bold text-amber-400">3. Dual-Way Credit Reporting</div>
            <p className="text-slate-300">
              Predatory lenders only report defaults, never on-time payments. Legitimate lenders report every successful installment.
            </p>
          </div>
          <div className="p-4 bg-slate-800/80 rounded-lg border border-slate-700 space-y-1.5">
            <div className="font-bold text-amber-400">4. Transparent FX Spreads</div>
            <p className="text-slate-300">
              When sending remittances, demand to see the official interbank rate. Never lose 8% of your money to hidden currency margins.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
