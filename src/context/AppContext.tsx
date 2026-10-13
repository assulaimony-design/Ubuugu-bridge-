import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  MicroLoan,
  Transaction,
  CommunityCircle,
  Currency,
  CurrencyRate,
  LoanScheduleItem,
} from '../types';
import {
  INITIAL_PERSONAS,
  INITIAL_LOANS,
  INITIAL_TRANSACTIONS,
  INITIAL_CIRCLES,
  CURRENCY_RATES,
} from '../data/initialData';

interface SendTransferParams {
  recipientName: string;
  recipientHandle?: string;
  sourceCurrency: Currency;
  sourceAmount: number;
  targetCurrency: Currency;
  deliveryMethod: 'Ubuntu Wallet' | 'M-Pesa Mobile Money' | 'MTN MoMo' | 'Direct Bank ACH/NIP';
  accountDetails?: string;
  notes?: string;
}

interface ApplyLoanParams {
  amount: number;
  currency: Currency;
  termMonths: number;
  purpose: MicroLoan['purpose'];
  lenderType: MicroLoan['lenderType'];
}

interface AppContextType {
  currentUser: UserProfile;
  allPersonas: UserProfile[];
  switchPersona: (id: string) => void;
  transactions: Transaction[];
  loans: MicroLoan[];
  circles: CommunityCircle[];
  rates: CurrencyRate[];
  activeTab: 'dashboard' | 'loans' | 'transfers' | 'circles' | 'ledger' | 'education';
  setActiveTab: (tab: 'dashboard' | 'loans' | 'transfers' | 'circles' | 'ledger' | 'education') => void;
  selectedReceipt: Transaction | null;
  setSelectedReceipt: (tx: Transaction | null) => void;
  isApplyLoanOpen: boolean;
  setIsApplyLoanOpen: (open: boolean) => void;
  isTransferModalOpen: boolean;
  setIsTransferModalOpen: (open: boolean) => void;
  sendTransfer: (params: SendTransferParams) => { success: boolean; error?: string; transaction?: Transaction };
  applyForMicroloan: (params: ApplyLoanParams) => { success: boolean; error?: string; loan?: MicroLoan };
  repayLoanInstallment: (loanId: string) => { success: boolean; error?: string };
  contributeToCircle: (circleId: string) => { success: boolean; error?: string };
  swapCurrency: (fromCurrency: Currency, toCurrency: Currency, amount: number) => { success: boolean; error?: string };
  faucetDeposit: (amount: number, currency: Currency) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'ub_current_user_id',
  PERSONAS: 'ub_personas_v1',
  LOANS: 'ub_loans_v1',
  TRANSACTIONS: 'ub_transactions_v1',
  CIRCLES: 'ub_circles_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allPersonas, setAllPersonas] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PERSONAS);
    return saved ? JSON.parse(saved) : INITIAL_PERSONAS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'user_marcus';
  });

  const [loans, setLoans] = useState<MicroLoan[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOANS);
    return saved ? JSON.parse(saved) : INITIAL_LOANS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [circles, setCircles] = useState<CommunityCircle[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CIRCLES);
    return saved ? JSON.parse(saved) : INITIAL_CIRCLES;
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'loans' | 'transfers' | 'circles' | 'ledger' | 'education'>('dashboard');
  const [selectedReceipt, setSelectedReceipt] = useState<Transaction | null>(null);
  const [isApplyLoanOpen, setIsApplyLoanOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PERSONAS, JSON.stringify(allPersonas));
  }, [allPersonas]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));
  }, [loans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CIRCLES, JSON.stringify(circles));
  }, [circles]);

  const currentUser = allPersonas.find((p) => p.id === currentUserId) || allPersonas[0];

  const switchPersona = (id: string) => {
    setCurrentUserId(id);
  };

  const getRate = (code: Currency) => {
    const found = CURRENCY_RATES.find((r) => r.code === code);
    return found ? found.ratePerUSD : 1;
  };

  const sendTransfer = (params: SendTransferParams) => {
    const currentBalance = currentUser.wallets[params.sourceCurrency] || 0;
    const fee = params.sourceCurrency === 'USD' ? 0.75 : 100;
    const totalRequired = params.sourceAmount + fee;

    if (currentBalance < totalRequired) {
      return {
        success: false,
        error: `Insufficient balance in ${params.sourceCurrency} wallet. Available: ${currentBalance.toLocaleString()} ${params.sourceCurrency}, Required: ${totalRequired.toLocaleString()} (including transparent fee of ${fee} ${params.sourceCurrency}).`,
      };
    }

    // Convert
    const srcRateUSD = getRate(params.sourceCurrency);
    const targetRateUSD = getRate(params.targetCurrency);
    const usdValue = params.sourceAmount / srcRateUSD;
    const targetAmount = usdValue * targetRateUSD;
    const exchangeRate = targetRateUSD / srcRateUSD;

    const txId = `tx_${Date.now()}`;
    const refId = `UBR-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTx: Transaction = {
      id: txId,
      type: 'transfer_sent',
      title: `Transfer to ${params.recipientName}`,
      amount: params.sourceAmount,
      currency: params.sourceCurrency,
      fee,
      date: new Date().toISOString(),
      status: 'completed',
      sender: `${currentUser.name} (${currentUser.handle})`,
      recipient: params.recipientName,
      recipientMethod: params.deliveryMethod,
      referenceId: refId,
      convertedAmount: params.sourceCurrency !== params.targetCurrency ? Number(targetAmount.toFixed(2)) : undefined,
      convertedCurrency: params.sourceCurrency !== params.targetCurrency ? params.targetCurrency : undefined,
      exchangeRate: params.sourceCurrency !== params.targetCurrency ? Number(exchangeRate.toFixed(4)) : undefined,
      notes: params.notes || `Direct low-fee transfer delivered via ${params.deliveryMethod}.`,
    };

    // Deduct from current user
    setAllPersonas((prev) =>
      prev.map((p) => {
        if (p.id === currentUser.id) {
          return {
            ...p,
            wallets: {
              ...p.wallets,
              [params.sourceCurrency]: Number((p.wallets[params.sourceCurrency] - totalRequired).toFixed(2)),
            },
            trustScore: Math.min(850, p.trustScore + 2), // Positive activity increases trust
          };
        }
        return p;
      })
    );

    setTransactions((prev) => [newTx, ...prev]);
    setSelectedReceipt(newTx);

    return { success: true, transaction: newTx };
  };

  const applyForMicroloan = (params: ApplyLoanParams) => {
    // Ubuntu Low Interest: 3.2% - 4.2% APR depending on term
    const apr = params.termMonths <= 6 ? 3.5 : params.termMonths <= 12 ? 3.8 : 4.2;
    const monthlyRate = apr / 100 / 12;
    const n = params.termMonths;
    // Standard amortization formula
    const monthlyPayment = Number(
      ((params.amount * (monthlyRate * Math.pow(1 + monthlyRate, n))) / (Math.pow(1 + monthlyRate, n) - 1)).toFixed(2)
    );
    const totalRepayment = Number((monthlyPayment * n).toFixed(2));
    const totalInterest = Number((totalRepayment - params.amount).toFixed(2));

    // Comparison with typical storefront predatory payday loan (typically 391% APR or 15% per 2 weeks rolled over)
    const predatoryPaydayCost = Number((params.amount * 0.72).toFixed(2)); // typical 6-month predatory roll
    const savings = Math.max(150, Number((predatoryPaydayCost - totalInterest).toFixed(2)));

    // Generate schedule
    const schedule: LoanScheduleItem[] = [];
    let remPrincipal = params.amount;
    const now = new Date();

    for (let i = 1; i <= n; i++) {
      const d = new Date(now);
      d.setMonth(d.getMonth() + i);
      const interestPart = Number((remPrincipal * monthlyRate).toFixed(2));
      const principalPart = Number((monthlyPayment - interestPart).toFixed(2));
      remPrincipal = Math.max(0, Number((remPrincipal - principalPart).toFixed(2)));

      schedule.push({
        installmentNumber: i,
        dueDate: d.toISOString().split('T')[0],
        paymentAmount: monthlyPayment,
        principalAmount: principalPart,
        interestAmount: interestPart,
        remainingPrincipal: remPrincipal,
        status: 'upcoming',
      });
    }

    const nextDueDate = schedule[0]?.dueDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
    const loanId = `loan_${Date.now()}`;

    const newLoan: MicroLoan = {
      id: loanId,
      borrowerId: currentUser.id,
      amount: params.amount,
      currency: params.currency,
      interestRateApr: apr,
      termMonths: params.termMonths,
      monthlyPayment,
      totalInterest,
      totalRepayment,
      remainingBalance: totalRepayment,
      appliedDate: new Date().toISOString().split('T')[0],
      disbursedDate: new Date().toISOString().split('T')[0],
      nextDueDate,
      purpose: params.purpose,
      status: 'active',
      schedule,
      savingsVersusPayday: savings,
      lenderType: params.lenderType,
    };

    // Add disbursement transaction
    const refId = `UBR-DISB-${Math.floor(1000 + Math.random() * 9000)}`;
    const disbTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'loan_disbursement',
      title: `${params.purpose} Low-Interest Microloan Disbursed`,
      amount: params.amount,
      currency: params.currency,
      fee: 0,
      date: new Date().toISOString(),
      status: 'completed',
      sender: `Ubuntu ${params.lenderType}`,
      recipient: `${currentUser.name} (${currentUser.handle})`,
      referenceId: refId,
      notes: `Disbursed instantly at fair ${apr}% APR. Zero origination fee. Funds available immediately.`,
    };

    // Update state: Add loan, update user wallet balance, add transaction
    setLoans((prev) => [newLoan, ...prev]);
    setTransactions((prev) => [disbTx, ...prev]);

    setAllPersonas((prev) =>
      prev.map((p) => {
        if (p.id === currentUser.id) {
          return {
            ...p,
            wallets: {
              ...p.wallets,
              [params.currency]: Number((p.wallets[params.currency] + params.amount).toFixed(2)),
            },
            trustScore: Math.min(850, p.trustScore + 5),
          };
        }
        return p;
      })
    );

    return { success: true, loan: newLoan };
  };

  const repayLoanInstallment = (loanId: string) => {
    const loan = loans.find((l) => l.id === loanId);
    if (!loan) return { success: false, error: 'Loan not found.' };

    const upcomingInstallment = loan.schedule.find((s) => s.status === 'upcoming');
    const paymentAmount = upcomingInstallment ? upcomingInstallment.paymentAmount : Math.min(loan.monthlyPayment, loan.remainingBalance);

    const userBalance = currentUser.wallets[loan.currency] || 0;
    if (userBalance < paymentAmount) {
      return {
        success: false,
        error: `Insufficient balance in ${loan.currency} wallet. Balance: ${userBalance.toLocaleString()} ${loan.currency}, Required: ${paymentAmount.toLocaleString()} ${loan.currency}.`,
      };
    }

    // Update loan schedule
    let nextBalance = Math.max(0, Number((loan.remainingBalance - paymentAmount).toFixed(2)));
    const updatedSchedule = loan.schedule.map((item) => {
      if (item.installmentNumber === upcomingInstallment?.installmentNumber) {
        return { ...item, status: 'paid' as const };
      }
      return item;
    });

    const nextUpcoming = updatedSchedule.find((s) => s.status === 'upcoming');
    const isFullyPaid = nextBalance <= 0 || !nextUpcoming;

    setLoans((prev) =>
      prev.map((l) => {
        if (l.id === loanId) {
          return {
            ...l,
            remainingBalance: nextBalance,
            status: isFullyPaid ? ('paid' as const) : ('active' as const),
            nextDueDate: nextUpcoming ? nextUpcoming.dueDate : 'Fully Paid',
            schedule: updatedSchedule,
          };
        }
        return l;
      })
    );

    // Record repayment tx
    const refId = `UBR-LN-${Math.floor(1000 + Math.random() * 9000)}`;
    const repayTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'loan_repayment',
      title: `Loan Installment Repayment (${loan.purpose})`,
      amount: paymentAmount,
      currency: loan.currency,
      fee: 0,
      date: new Date().toISOString(),
      status: 'completed',
      sender: `${currentUser.name} (${currentUser.handle})`,
      recipient: `Ubuntu ${loan.lenderType}`,
      referenceId: refId,
      notes: isFullyPaid
        ? 'Loan successfully settled in full! Reported positive completion to alternative credit ledger (+25 pts).'
        : 'On-time installment registered to TrustBridge credit engine (+10 pts).',
    };

    setTransactions((prev) => [repayTx, ...prev]);

    // Deduct from wallet and award trust score points
    setAllPersonas((prev) =>
      prev.map((p) => {
        if (p.id === currentUser.id) {
          return {
            ...p,
            wallets: {
              ...p.wallets,
              [loan.currency]: Number((p.wallets[loan.currency] - paymentAmount).toFixed(2)),
            },
            trustScore: Math.min(850, p.trustScore + (isFullyPaid ? 25 : 10)),
            trustScoreFactors: {
              ...p.trustScoreFactors,
              onTimeRepayments: Math.min(100, p.trustScoreFactors.onTimeRepayments + 2),
            },
          };
        }
        return p;
      })
    );

    return { success: true };
  };

  const contributeToCircle = (circleId: string) => {
    const circle = circles.find((c) => c.id === circleId);
    if (!circle) return { success: false, error: 'Community circle not found.' };

    const currentBalance = currentUser.wallets[circle.currency] || 0;
    if (currentBalance < circle.monthlyContribution) {
      return {
        success: false,
        error: `Insufficient balance in ${circle.currency} wallet. Balance: ${currentBalance.toLocaleString()}, Required: ${circle.monthlyContribution.toLocaleString()}.`,
      };
    }

    // Deduct contribution
    setAllPersonas((prev) =>
      prev.map((p) => {
        if (p.id === currentUser.id) {
          return {
            ...p,
            wallets: {
              ...p.wallets,
              [circle.currency]: Number((p.wallets[circle.currency] - circle.monthlyContribution).toFixed(2)),
            },
            trustScore: Math.min(850, p.trustScore + 8),
            trustScoreFactors: {
              ...p.trustScoreFactors,
              circleParticipation: Math.min(100, p.trustScoreFactors.circleParticipation + 5),
            },
          };
        }
        return p;
      })
    );

    // Update circle status
    setCircles((prev) =>
      prev.map((c) => {
        if (c.id === circleId) {
          return {
            ...c,
            userRole: 'Active Participant',
          };
        }
        return c;
      })
    );

    const refId = `UBR-CR-${Math.floor(1000 + Math.random() * 9000)}`;
    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'circle_contribution',
      title: `${circle.name} Contribution`,
      amount: circle.monthlyContribution,
      currency: circle.currency,
      fee: 0,
      date: new Date().toISOString(),
      status: 'completed',
      sender: `${currentUser.name} (${currentUser.handle})`,
      recipient: circle.name,
      referenceId: refId,
      notes: `Cycle ${circle.currentCycle} community contribution deposited to rotational payout pool.`,
    };

    setTransactions((prev) => [tx, ...prev]);
    return { success: true };
  };

  const swapCurrency = (fromCurrency: Currency, toCurrency: Currency, amount: number) => {
    const currentBalance = currentUser.wallets[fromCurrency] || 0;
    if (currentBalance < amount) {
      return { success: false, error: `Insufficient ${fromCurrency} balance.` };
    }

    const srcRateUSD = getRate(fromCurrency);
    const targetRateUSD = getRate(toCurrency);
    const usdVal = amount / srcRateUSD;
    const targetAmt = usdVal * targetRateUSD;
    const fee = fromCurrency === 'USD' ? 0.25 : 50;

    setAllPersonas((prev) =>
      prev.map((p) => {
        if (p.id === currentUser.id) {
          return {
            ...p,
            wallets: {
              ...p.wallets,
              [fromCurrency]: Number((p.wallets[fromCurrency] - amount).toFixed(2)),
              [toCurrency]: Number((p.wallets[toCurrency] + (targetAmt - fee / targetRateUSD)).toFixed(2)),
            },
          };
        }
        return p;
      })
    );

    const refId = `UBR-SWAP-${Math.floor(1000 + Math.random() * 9000)}`;
    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'currency_swap',
      title: `Currency Swap: ${fromCurrency} to ${toCurrency}`,
      amount,
      currency: fromCurrency,
      fee,
      date: new Date().toISOString(),
      status: 'completed',
      sender: `${currentUser.name} (${currentUser.handle})`,
      recipient: `Self (${toCurrency} Wallet)`,
      referenceId: refId,
      convertedAmount: Number(targetAmt.toFixed(2)),
      convertedCurrency: toCurrency,
      exchangeRate: Number((targetRateUSD / srcRateUSD).toFixed(4)),
      notes: 'Instant interbank FX swap with zero predatory markup.',
    };

    setTransactions((prev) => [tx, ...prev]);
    return { success: true };
  };

  const faucetDeposit = (amount: number, currency: Currency) => {
    setAllPersonas((prev) =>
      prev.map((p) => {
        if (p.id === currentUser.id) {
          return {
            ...p,
            wallets: {
              ...p.wallets,
              [currency]: Number((p.wallets[currency] + amount).toFixed(2)),
            },
          };
        }
        return p;
      })
    );

    const refId = `UBR-TOPUP-${Math.floor(1000 + Math.random() * 9000)}`;
    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'wallet_topup',
      title: `Community Faucet Credit (${currency})`,
      amount,
      currency,
      fee: 0,
      date: new Date().toISOString(),
      status: 'completed',
      sender: 'Ubuntu Community Seed Faucet',
      recipient: `${currentUser.name} (${currentUser.handle})`,
      referenceId: refId,
      notes: 'Educational testnet funds added to wallet balance.',
    };

    setTransactions((prev) => [tx, ...prev]);
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.PERSONAS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    localStorage.removeItem(STORAGE_KEYS.LOANS);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.CIRCLES);
    setAllPersonas(INITIAL_PERSONAS);
    setCurrentUserId('user_marcus');
    setLoans(INITIAL_LOANS);
    setTransactions(INITIAL_TRANSACTIONS);
    setCircles(INITIAL_CIRCLES);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allPersonas,
        switchPersona,
        transactions,
        loans,
        circles,
        rates: CURRENCY_RATES,
        activeTab,
        setActiveTab,
        selectedReceipt,
        setSelectedReceipt,
        isApplyLoanOpen,
        setIsApplyLoanOpen,
        isTransferModalOpen,
        setIsTransferModalOpen,
        sendTransfer,
        applyForMicroloan,
        repayLoanInstallment,
        contributeToCircle,
        swapCurrency,
        faucetDeposit,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
