export type Currency = 'USD' | 'NGN' | 'KES' | 'GHS' | 'ZAR' | 'RWF';

export interface CurrencyRate {
  code: Currency;
  name: string;
  symbol: string;
  ratePerUSD: number; // e.g. 1 USD = 1450 NGN
  flag: string;
}

export interface WalletBalances {
  USD: number;
  NGN: number;
  KES: number;
  GHS: number;
  ZAR: number;
  RWF: number;
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  country: string;
  city: string;
  bio: string;
  phone: string;
  accountType: 'Personal & Micro-Business' | 'Diaspora Remittance' | 'Community Co-op';
  trustScore: number; // Alternative credit score (300-850 scale)
  trustScoreFactors: {
    cashFlowStability: number; // 0-100
    communityVouches: number; // 0-100
    onTimeRepayments: number; // 0-100
    circleParticipation: number; // 0-100
  };
  wallets: WalletBalances;
  kycTier: 'Verified Tier 2' | 'Verified Community Tier 1';
}

export interface LoanScheduleItem {
  installmentNumber: number;
  dueDate: string;
  paymentAmount: number;
  principalAmount: number;
  interestAmount: number;
  remainingPrincipal: number;
  status: 'paid' | 'upcoming' | 'overdue';
}

export interface MicroLoan {
  id: string;
  borrowerId: string;
  amount: number;
  currency: Currency;
  interestRateApr: number; // e.g., 3.8% APR (vs 391% payday loan)
  termMonths: number;
  monthlyPayment: number;
  totalInterest: number;
  totalRepayment: number;
  remainingBalance: number;
  appliedDate: string;
  disbursedDate: string;
  nextDueDate: string;
  purpose: 'Small Business Inventory' | 'Emergency Medical & Health' | 'Cross-Border Trade' | 'Vocational Education' | 'Equipment & Tools';
  status: 'active' | 'paid' | 'pending';
  schedule: LoanScheduleItem[];
  savingsVersusPayday: number; // Estimated dollar amount saved vs predatory 350-400% payday loans
  lenderType: 'Community Guarantee Pool' | 'Ubuntu Micro-Fund' | 'Diaspora Peer Backed';
}

export type TransactionType =
  | 'transfer_sent'
  | 'transfer_received'
  | 'loan_disbursement'
  | 'loan_repayment'
  | 'circle_contribution'
  | 'circle_payout'
  | 'currency_swap'
  | 'wallet_topup';

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  amount: number;
  currency: Currency;
  fee: number;
  date: string;
  status: 'completed' | 'processing' | 'failed';
  sender: string;
  recipient: string;
  recipientMethod?: 'Ubuntu Wallet' | 'M-Pesa Mobile Money' | 'MTN MoMo' | 'Direct Bank ACH/NIP';
  referenceId: string;
  convertedAmount?: number;
  convertedCurrency?: Currency;
  exchangeRate?: number;
  notes?: string;
}

export interface CommunityCircle {
  id: string;
  name: string;
  originTradition: 'Esusu (Yoruba / West Africa)' | 'Chama (East Africa)' | 'Susu (Caribbean & Diaspora)' | 'Sou-Sou (Black American)';
  description: string;
  location: string;
  monthlyContribution: number;
  currency: Currency;
  membersCount: number;
  totalCyclePool: number;
  currentCycle: number;
  nextPayoutDate: string;
  nextRecipientName: string;
  userRole: 'Active Participant' | 'Organizer' | 'Non-Member';
  userNextTurnMonth: string;
  verifiedTrustLevel: 'High' | 'Pioneer';
}

export interface FinancialGuide {
  id: string;
  title: string;
  category: 'Underbanked Rights' | 'Microloans vs Payday' | 'Cross-Border Wealth' | 'Credit Building';
  readTime: string;
  summary: string;
  actionableTip: string;
  fullContent: string[];
}
