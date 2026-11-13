export type UserRole = 'resident' | 'worker' | 'admin';

export type PageId = 'resident' | 'worker' | 'admin' | 'ai-demo';

export type Language = 'en' | 'hi';

export type BagColor = 'green' | 'blue';

export type WorkerRoleType = 'Collection Partner' | 'Kiosk Attendant' | 'Material Handler';

export type PickupStatus = 'pending' | 'collected' | 'deposited';

export type PurityBandKey = 'full' | 'half' | 'low' | 'reject';

export interface DepositRecord {
  id: string;
  date: string;
  kioskName: string;
  bagColor: BagColor;
  weightKg: number;
  purityPct: number;
  band: PurityBandKey;
  rewardInr: number;
}

export interface PurityIssue {
  id: string;
  depositDate: string;
  bagColor: BagColor;
  wrongItemEn: string;
  wrongItemHi: string;
  feedbackEn: string;
  feedbackHi: string;
  correctBag: BagColor;
  purityDropPct: number;
}

export interface WeeklyPurityPoint {
  week: string;
  weekHi: string;
  purity: number;
  target: number;
}

export interface PickupTask {
  id: string;
  household: string;
  address: string;
  ward: string;
  greenBags: number;
  blueBags: number;
  estWeightKg: number;
  commissionInr: number;
  timeSlot: string;
  status: PickupStatus;
}

export interface WorkerWeeklyPoint {
  day: string;
  dayHi: string;
  kgCollected: number;
  earningsInr: number;
}

export interface AdminKpi {
  id: string;
  labelEn: string;
  labelHi: string;
  valueDisplay: string;
  targetDisplay: string;
  progressPct: number;
  metTarget: boolean;
  subtextEn: string;
  subtextHi: string;
}

export interface KioskRecord {
  id: string;
  location: string;
  ward: string;
  greenBagStock: number;
  blueBagStock: number;
  binFillPct: number;
  online: boolean;
  lastSync: string;
}

export interface FlaggedBagRecord {
  id: string;
  bagCode: string;
  residentName: string;
  kioskId: string;
  bagColor: BagColor;
  weightKg: number;
  aiPurityPct: number;
  reasonEn: string;
  reasonHi: string;
  timestamp: string;
  reviewStatus: 'awaiting' | 'approved_full' | 'confirmed_reduced' | 'rejected';
}

export interface DetectedItem {
  nameEn: string;
  nameHi: string;
  confidencePct: number;
  isCorrectForBag: boolean;
  noteEn: string;
  noteHi: string;
}

export interface SampleBagScenario {
  id: string;
  titleEn: string;
  titleHi: string;
  imageUrl: string;
  bagColor: BagColor;
  weightKg: number;
  purityPct: number;
  items: DetectedItem[];
}
