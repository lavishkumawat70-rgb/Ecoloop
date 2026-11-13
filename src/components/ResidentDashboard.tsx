import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  Award,
  CheckCircle2,
  Flame,
  IndianRupee,
  Leaf,
  Scale,
  Sparkles,
  Wallet,
  X,
} from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  getPurityBand,
  RESIDENT_8WEEK_PURITY,
  RESIDENT_DEPOSITS,
  RESIDENT_PURITY_ISSUES,
} from '../data/mockData';
import { TRANSLATIONS } from '../i18n';
import type { BagColor, Language } from '../types';

interface ResidentDashboardProps {
  language: Language;
  darkMode: boolean;
  onGoToAiDemo: () => void;
}

export const ResidentDashboard: React.FC<ResidentDashboardProps> = ({
  language,
  darkMode,
  onGoToAiDemo,
}) => {
  const t = TRANSLATIONS[language];
  const [walletBalance, setWalletBalance] = useState<number>(1485.5);
  const [lifetimeEarnings, setLifetimeEarnings] = useState<number>(6840.0);
  const [bagFilter, setBagFilter] = useState<'all' | BagColor>('all');

  // UPI Modal state
  const [upiModalOpen, setUpiModalOpen] = useState(false);
  const [upiId, setUpiId] = useState('priya.sharma@okicici');
  const [withdrawAmount, setWithdrawAmount] = useState('500');
  const [upiSuccessMsg, setUpiSuccessMsg] = useState<string | null>(null);

  const filteredDeposits = RESIDENT_DEPOSITS.filter((d) =>
    bagFilter === 'all' ? true : d.bagColor === bagFilter
  );

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(withdrawAmount);
    if (!Number.isFinite(amount) || amount <= 0 || amount > walletBalance) {
      return;
    }
    setWalletBalance((prev) => Number((prev - amount).toFixed(2)));
    setUpiSuccessMsg(
      language === 'hi'
        ? `₹${amount.toFixed(2)} सफलतापूर्वक ${upiId} पर भेजा गया।`
        : `₹${amount.toFixed(2)} sent instantly to ${upiId}.`
    );
  };

  const openWithdrawModal = () => {
    setUpiSuccessMsg(null);
    setWithdrawAmount(Math.min(500, Math.floor(walletBalance)).toString());
    setUpiModalOpen(true);
  };

  const gridStroke = darkMode ? '#1e293b' : '#e2e8f0';
  const axisTickColor = darkMode ? '#94a3b8' : '#64748b';

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            {t.residentWelcome}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {t.residentSub}
          </p>
        </div>
        <button
          type="button"
          onClick={onGoToAiDemo}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-[#1565C0]/30 bg-[#1565C0]/10 px-4 py-2 text-sm font-semibold text-[#1565C0] transition-colors hover:bg-[#1565C0]/15 whitespace-nowrap shrink-0 dark:border-blue-500/40 dark:bg-blue-500/15 dark:text-blue-300 dark:hover:bg-blue-500/25"
        >
          <Sparkles className="h-4 w-4" />
          <span>{t.navAiDemo}</span>
        </button>
      </div>

      {/* Top Grid: Wallet Hero Card + 4 Stat Cards */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        {/* Wallet Card */}
        <section className="flex flex-col justify-between rounded-2xl bg-[#2E7D32] p-6 text-white shadow-sm xl:col-span-5">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-100">
                <Wallet className="h-5 w-5" />
                <span className="text-sm font-semibold">{t.walletTitle}</span>
              </div>
              <span className="text-xs font-medium text-emerald-100">
                UPI Instant Payout
              </span>
            </div>

            <div className="mt-5">
              <p className="text-sm font-medium text-emerald-100">{t.availableBalance}</p>
              <p className="font-mono-num mt-1 text-4xl font-bold tracking-tight">
                ₹{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 border-t border-white/20 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-emerald-100">{t.lifetimeEarnings}</p>
              <p className="font-mono-num text-lg font-bold">
                ₹{lifetimeEarnings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <button
              type="button"
              onClick={openWithdrawModal}
              disabled={walletBalance <= 0}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#2E7D32] transition-colors hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap shrink-0"
            >
              <IndianRupee className="h-4 w-4" />
              <span>{t.withdrawUpi}</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </section>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:col-span-7">
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-sm font-semibold">{t.statRecycled}</span>
              <Scale className="h-5 w-5 text-[#1565C0] dark:text-blue-400" />
            </div>
            <div className="mt-3">
              <p className="font-mono-num text-3xl font-bold text-slate-900 dark:text-white">
                142.8 kg
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                84.2 kg {language === 'hi' ? 'गीला' : 'Green'} · 58.6 kg {language === 'hi' ? 'सूखा' : 'Blue'}
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-sm font-semibold">{t.statAvgPurity}</span>
              <Award className="h-5 w-5 text-[#2E7D32] dark:text-emerald-400" />
            </div>
            <div className="mt-3">
              <p className="font-mono-num text-3xl font-bold text-slate-900 dark:text-white">
                88.4%
              </p>
              <p className="mt-1 text-xs font-medium text-[#2E7D32] dark:text-emerald-400">
                {language === 'hi' ? '90%+ पर पूरा इनाम' : '+14% vs last month'}
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-sm font-semibold">{t.statStreak}</span>
              <Flame className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="mt-3">
              <p className="font-mono-num text-3xl font-bold text-slate-900 dark:text-white">
                7
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {t.streakUnit} (90%+ {language === 'hi' ? 'शुद्धता' : 'purity'})
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-sm font-semibold">{t.statCo2}</span>
              <Leaf className="h-5 w-5 text-[#2E7D32] dark:text-emerald-400" />
            </div>
            <div className="mt-3">
              <p className="font-mono-num text-3xl font-bold text-slate-900 dark:text-white">
                114.2 kg
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {t.landfillSub}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: 8-Week Purity Chart + Why Was My Purity Low? */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Line Chart */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-7 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                {t.purityChartTitle}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t.purityChartSub}
              </p>
            </div>
            <span className="font-mono-num text-sm font-semibold text-[#2E7D32] dark:text-emerald-400">
              {language === 'hi' ? 'सप्ताह 8: 95%' : 'Week 8: 95%'}
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={RESIDENT_8WEEK_PURITY}
                margin={{ top: 10, right: 16, left: -12, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis
                  dataKey={language === 'hi' ? 'weekHi' : 'week'}
                  tick={{ fill: axisTickColor, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[50, 100]}
                  tick={{ fill: axisTickColor, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                    borderColor: darkMode ? '#1e293b' : '#e2e8f0',
                    borderRadius: '12px',
                    color: darkMode ? '#f8fafc' : '#0f172a',
                    fontSize: '13px',
                  }}
                  formatter={(value) => [`${value}%`, language === 'hi' ? 'शुद्धता' : 'Purity']}
                />
                <ReferenceLine
                  y={90}
                  stroke="#1565C0"
                  strokeDasharray="4 4"
                  label={{
                    value: language === 'hi' ? '90% पूरा इनाम' : '90% Full Pay',
                    position: 'insideTopRight',
                    fill: darkMode ? '#60a5fa' : '#1565C0',
                    fontSize: 11,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="purity"
                  stroke="#2E7D32"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#2E7D32', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Why was my purity low? panel */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                {t.whyLowTitle}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t.whyLowSub}
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {RESIDENT_PURITY_ISSUES.map((issue) => (
              <div key={issue.id} className="py-4 first:pt-2 last:pb-0">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>
                    {issue.depositDate} ·{' '}
                    {issue.bagColor === 'green'
                      ? language === 'hi'
                        ? 'हरा बैग'
                        : 'Green Bag'
                      : language === 'hi'
                      ? 'नीला बैग'
                      : 'Blue Bag'}
                  </span>
                  <span className="font-mono-num font-semibold text-amber-700 dark:text-amber-400">
                    -{issue.purityDropPct}% {language === 'hi' ? 'शुद्धता' : 'purity'}
                  </span>
                </div>

                <p className="mt-1.5 text-base font-semibold text-slate-900 dark:text-white">
                  {language === 'hi' ? issue.wrongItemHi : issue.wrongItemEn}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {language === 'hi' ? issue.feedbackHi : issue.feedbackEn}
                </p>

                <div className="mt-2.5 flex items-center gap-2 text-xs font-semibold">
                  <span
                    className={`inline-block h-2.5 w-2.5 rounded-sm ${
                      issue.correctBag === 'blue' ? 'bg-[#1565C0]' : 'bg-[#2E7D32]'
                    }`}
                    aria-hidden="true"
                  />
                  <span
                    className={
                      issue.correctBag === 'blue'
                        ? 'text-[#1565C0] dark:text-blue-300'
                        : 'text-[#2E7D32] dark:text-emerald-300'
                    }
                  >
                    {issue.correctBag === 'blue' ? t.moveToBlue : t.moveToGreen}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Deposit History Table */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            {t.depositHistoryTitle}
          </h2>
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            {(['all', 'green', 'blue'] as const).map((f) => {
              const active = bagFilter === f;
              const label =
                f === 'all' ? t.filterAll : f === 'green' ? t.filterGreen : t.filterBlue;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setBagFilter(f)}
                  className={`min-h-[36px] rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <th className="py-3 pr-4">{t.colDate}</th>
                <th className="px-4 py-3">{t.colBag}</th>
                <th className="px-4 py-3 text-right">{t.colWeight}</th>
                <th className="px-4 py-3 text-right">{t.colPurity}</th>
                <th className="px-4 py-3">{t.colBand}</th>
                <th className="py-3 pl-4 text-right">{t.colReward}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredDeposits.map((row) => {
                const bandInfo = getPurityBand(row.purityPct);
                return (
                  <tr
                    key={row.id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="py-3.5 pr-4">
                      <p className="font-medium text-slate-900 dark:text-white">{row.date}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{row.kioskName}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                          row.bagColor === 'green'
                            ? 'bg-[#2E7D32]/12 text-[#2E7D32] dark:bg-emerald-900/40 dark:text-emerald-300'
                            : 'bg-[#1565C0]/12 text-[#1565C0] dark:bg-blue-900/40 dark:text-blue-300'
                        }`}
                      >
                        <span
                          className={`h-2.5 w-2.5 rounded-sm ${
                            row.bagColor === 'green' ? 'bg-[#2E7D32]' : 'bg-[#1565C0]'
                          }`}
                          aria-hidden="true"
                        />
                        <span>
                          {row.bagColor === 'green'
                            ? language === 'hi'
                              ? 'हरा (गीला)'
                              : 'Green · Bio'
                            : language === 'hi'
                            ? 'नीला (सूखा)'
                            : 'Blue · Non-Bio'}
                        </span>
                      </span>
                    </td>
                    <td className="font-mono-num px-4 py-3.5 text-right font-medium text-slate-800 dark:text-slate-200">
                      {row.weightKg.toFixed(1)} kg
                    </td>
                    <td className="font-mono-num px-4 py-3.5 text-right font-bold text-slate-900 dark:text-white">
                      {row.purityPct}%
                    </td>
                    <td className="px-4 py-3.5 text-xs font-semibold">
                      <span
                        className={
                          row.band === 'full'
                            ? 'text-[#2E7D32] dark:text-emerald-400'
                            : row.band === 'half'
                            ? 'text-amber-700 dark:text-amber-400'
                            : 'text-red-700 dark:text-red-400'
                        }
                      >
                        {language === 'hi' ? bandInfo.labelHi : bandInfo.labelEn}
                      </span>
                    </td>
                    <td className="font-mono-num py-3.5 pl-4 text-right font-bold text-slate-900 dark:text-white">
                      ₹{row.rewardInr.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* UPI Withdrawal Modal */}
      {upiModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="upi-modal-heading"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h3
                id="upi-modal-heading"
                className="font-display text-lg font-bold text-slate-900 dark:text-white"
              >
                {t.upiModalTitle}
              </h3>
              <button
                type="button"
                onClick={() => setUpiModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {upiSuccessMsg ? (
              <div className="mt-5 space-y-4">
                <div className="flex items-start gap-3 rounded-xl bg-emerald-50 p-4 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#2E7D32] dark:text-emerald-400" />
                  <div>
                    <p className="font-semibold">{t.upiSuccessTitle}</p>
                    <p className="mt-1 text-sm">{upiSuccessMsg}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setUpiModalOpen(false)}
                  className="min-h-[44px] w-full rounded-xl bg-[#2E7D32] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#256628]"
                >
                  {t.upiClose}
                </button>
              </div>
            ) : (
              <form onSubmit={handleWithdraw} className="mt-4 space-y-4">
                <div>
                  <label
                    htmlFor="upi-id-input"
                    className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
                  >
                    {t.upiIdLabel}
                  </label>
                  <input
                    id="upi-id-input"
                    type="text"
                    required
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="mt-1.5 min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-[#2E7D32] focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="upi-amount-input"
                      className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
                    >
                      {t.upiAmountLabel}
                    </label>
                    <span className="font-mono-num text-xs text-slate-500 dark:text-slate-400">
                      Max: ₹{walletBalance.toFixed(2)}
                    </span>
                  </div>
                  <input
                    id="upi-amount-input"
                    type="number"
                    min="1"
                    max={walletBalance}
                    step="0.01"
                    required
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="font-mono-num mt-1.5 min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-base font-bold text-slate-900 focus:border-[#2E7D32] focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <div className="mt-2 flex gap-2">
                    {[200, 500, 1000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        disabled={preset > walletBalance}
                        onClick={() => setWithdrawAmount(String(preset))}
                        className="font-mono-num rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        ₹{preset}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="min-h-[44px] w-full rounded-xl bg-[#2E7D32] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#256628]"
                >
                  {t.upiSendBtn}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
