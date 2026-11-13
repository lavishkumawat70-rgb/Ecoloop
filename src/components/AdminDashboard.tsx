import React, { useState } from 'react';
import {
  CheckCircle2,
  ClipboardCheck,
  Wifi,
  WifiOff,
  XCircle,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ADMIN_CONTAMINATION_SERIES,
  ADMIN_DIVERSION_SERIES,
  ADMIN_FLAGGED_BAGS,
  ADMIN_KIOSKS,
  ADMIN_KPIS,
  ADMIN_PARTICIPATION_SERIES,
  ADMIN_RESALE_SERIES,
} from '../data/mockData';
import { TRANSLATIONS } from '../i18n';
import type { FlaggedBagRecord, Language } from '../types';

interface AdminDashboardProps {
  language: Language;
  darkMode: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ language, darkMode }) => {
  const t = TRANSLATIONS[language];
  const [flaggedBags, setFlaggedBags] = useState<FlaggedBagRecord[]>(ADMIN_FLAGGED_BAGS);
  const [kioskFilter, setKioskFilter] = useState<'all' | 'online' | 'offline'>('all');

  const handleReviewAction = (
    bagId: string,
    decision: 'approved_full' | 'confirmed_reduced' | 'rejected'
  ) => {
    setFlaggedBags((prev) =>
      prev.map((bag) =>
        bag.id === bagId ? { ...bag, reviewStatus: decision } : bag
      )
    );
  };

  const filteredKiosks = ADMIN_KIOSKS.filter((k) => {
    if (kioskFilter === 'online') return k.online;
    if (kioskFilter === 'offline') return !k.online;
    return true;
  });

  const gridStroke = darkMode ? '#1e293b' : '#e2e8f0';
  const axisTickColor = darkMode ? '#94a3b8' : '#64748b';
  const tooltipStyle = {
    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
    borderColor: darkMode ? '#1e293b' : '#e2e8f0',
    borderRadius: '12px',
    color: darkMode ? '#f8fafc' : '#0f172a',
    fontSize: '13px',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          {t.adminWelcome}
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {t.adminSub}
        </p>
      </div>

      {/* 5 Pilot Target KPI Cards */}
      <section aria-label={t.kpiSectionTitle}>
        <h2 className="mb-3 font-display text-sm font-bold text-slate-600 dark:text-slate-300">
          {t.kpiSectionTitle}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {ADMIN_KPIS.map((kpi) => (
            <div
              key={kpi.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {language === 'hi' ? kpi.labelHi : kpi.labelEn}
                </p>
                <p className="font-mono-num mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                  {kpi.valueDisplay}
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-[#2E7D32]"
                    style={{ width: `${Math.min(100, kpi.progressPct)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono-num font-semibold text-[#2E7D32] dark:text-emerald-400">
                    {t.targetPrefix}: {kpi.targetDisplay}
                  </span>
                  <CheckCircle2
                    className="h-4 w-4 text-[#2E7D32] dark:text-emerald-400"
                    aria-label="Target met"
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {language === 'hi' ? kpi.subtextHi : kpi.subtextEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4 Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 1. Participation Over Weeks */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
              {t.chartParticipation}
            </h2>
            <span className="font-mono-num text-xs font-semibold text-[#2E7D32] dark:text-emerald-400">
              {t.targetPrefix}: 40%
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={ADMIN_PARTICIPATION_SERIES}
                margin={{ top: 10, right: 12, left: -16, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis
                  dataKey="week"
                  tick={{ fill: axisTickColor, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 60]}
                  tick={{ fill: axisTickColor, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v) => [`${v}%`, language === 'hi' ? 'भागीदारी' : 'Participation']}
                />
                <ReferenceLine
                  y={40}
                  stroke="#1565C0"
                  strokeDasharray="4 4"
                  label={{
                    value: '40%',
                    position: 'insideTopRight',
                    fill: darkMode ? '#60a5fa' : '#1565C0',
                    fontSize: 11,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="participation"
                  stroke="#2E7D32"
                  strokeWidth={2.5}
                  fill="#2E7D32"
                  fillOpacity={0.14}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* 2. Contamination Before vs After */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
              {t.chartContamination}
            </h2>
            <span className="font-mono-num text-xs font-semibold text-[#1565C0] dark:text-blue-400">
              -54.2% avg
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ADMIN_CONTAMINATION_SERIES}
                margin={{ top: 10, right: 12, left: -16, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis
                  dataKey="ward"
                  tick={{ fill: axisTickColor, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: axisTickColor, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}%`} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar
                  dataKey="before"
                  name={language === 'hi' ? 'पहले (%)' : 'Before EcoLoop (%)'}
                  fill={darkMode ? '#64748b' : '#94a3b8'}
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="after"
                  name={language === 'hi' ? 'अब (%)' : 'After EcoLoop (%)'}
                  fill="#2E7D32"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* 3. Landfill Diversion in kg */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
              {t.chartDiversion}
            </h2>
            <span className="font-mono-num text-xs font-semibold text-slate-600 dark:text-slate-300">
              6,300 kg in W8
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ADMIN_DIVERSION_SERIES}
                margin={{ top: 10, right: 12, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis
                  dataKey="week"
                  tick={{ fill: axisTickColor, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: axisTickColor, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v} kg`} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar
                  dataKey="greenKg"
                  stackId="a"
                  name={language === 'hi' ? 'हरा बैग (kg)' : 'Green Bio (kg)'}
                  fill="#2E7D32"
                />
                <Bar
                  dataKey="blueKg"
                  stackId="a"
                  name={language === 'hi' ? 'नीला बैग (kg)' : 'Blue Dry (kg)'}
                  fill="#1565C0"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* 4. Material Resale Revenue */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
              {t.chartRevenue}
            </h2>
            <span className="font-mono-num text-xs font-semibold text-[#1565C0] dark:text-blue-400">
              Total: ₹1,07,300
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ADMIN_RESALE_SERIES}
                margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis
                  dataKey="material"
                  tick={{ fill: axisTickColor, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: axisTickColor, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, language === 'hi' ? 'आय' : 'Revenue']}
                />
                <Bar
                  dataKey="revenueInr"
                  name={language === 'hi' ? 'रीसेल आय (₹)' : 'Resale Revenue (₹)'}
                  fill="#1565C0"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Kiosk Status Table */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            {t.kioskTableTitle}
          </h2>
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            {(['all', 'online', 'offline'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setKioskFilter(status)}
                className={`min-h-[34px] rounded-lg px-3 py-1 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  kioskFilter === status
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
                }`}
              >
                {status === 'all'
                  ? language === 'hi'
                    ? 'सभी (6)'
                    : 'All (6)'
                  : status === 'online'
                  ? t.onlineLabel
                  : t.offlineLabel}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <th className="py-3 pr-4">{t.colKioskId}</th>
                <th className="px-4 py-3">{t.colLocation}</th>
                <th className="px-4 py-3">{t.colBagStock}</th>
                <th className="px-4 py-3">{t.colBinFill}</th>
                <th className="py-3 pl-4 text-right">{t.colStatus}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredKiosks.map((kiosk) => (
                <tr
                  key={kiosk.id}
                  className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="font-mono-num py-3.5 pr-4 font-bold text-slate-900 dark:text-white">
                    {kiosk.id}
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-medium text-slate-900 dark:text-white">{kiosk.location}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {kiosk.ward} · {kiosk.lastSync}
                    </p>
                  </td>
                  <td className="font-mono-num px-4 py-3.5 text-xs font-semibold">
                    <span className="text-[#2E7D32] dark:text-emerald-400">
                      {kiosk.greenBagStock} {language === 'hi' ? 'हरा' : 'Green'}
                    </span>
                    <span className="mx-2 text-slate-400">·</span>
                    <span className="text-[#1565C0] dark:text-blue-400">
                      {kiosk.blueBagStock} {language === 'hi' ? 'नीला' : 'Blue'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className={`h-full rounded-full ${
                            kiosk.binFillPct >= 85
                              ? 'bg-amber-600'
                              : 'bg-[#1565C0]'
                          }`}
                          style={{ width: `${kiosk.binFillPct}%` }}
                        />
                      </div>
                      <span className="font-mono-num text-xs font-bold text-slate-700 dark:text-slate-300">
                        {kiosk.binFillPct}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 pl-4 text-right">
                    {kiosk.online ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2E7D32] dark:text-emerald-400">
                        <Wifi className="h-4 w-4" />
                        <span>{t.onlineLabel}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 dark:text-red-400">
                        <WifiOff className="h-4 w-4" />
                        <span>{t.offlineLabel}</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Flagged Bags Awaiting Attendant Review */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center gap-3">
          <ClipboardCheck className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            {t.flaggedTableTitle}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <th className="py-3 pr-4">ID</th>
                <th className="px-4 py-3">{t.colResident}</th>
                <th className="px-4 py-3">{t.colBag}</th>
                <th className="px-4 py-3 text-right">{t.colPurity}</th>
                <th className="px-4 py-3">{t.colReason}</th>
                <th className="py-3 pl-4 text-right">{t.colAction}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {flaggedBags.map((bag) => (
                <tr
                  key={bag.id}
                  className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="py-3.5 pr-4">
                    <p className="font-mono-num font-bold text-slate-900 dark:text-white">
                      {bag.bagCode}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {bag.kioskId} · {bag.timestamp}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-white">
                    {bag.residentName}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                        bag.bagColor === 'green'
                          ? 'text-[#2E7D32] dark:text-emerald-400'
                          : 'text-[#1565C0] dark:text-blue-400'
                      }`}
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-sm ${
                          bag.bagColor === 'green' ? 'bg-[#2E7D32]' : 'bg-[#1565C0]'
                        }`}
                        aria-hidden="true"
                      />
                      <span>
                        {bag.bagColor === 'green'
                          ? language === 'hi'
                            ? 'हरा'
                            : 'Green'
                          : language === 'hi'
                          ? 'नीला'
                          : 'Blue'}{' '}
                        ({bag.weightKg} kg)
                      </span>
                    </span>
                  </td>
                  <td className="font-mono-num px-4 py-3.5 text-right font-bold text-slate-900 dark:text-white">
                    {bag.aiPurityPct}%
                  </td>
                  <td className="max-w-xs px-4 py-3.5 text-slate-600 dark:text-slate-300">
                    {language === 'hi' ? bag.reasonHi : bag.reasonEn}
                  </td>
                  <td className="py-3.5 pl-4 text-right">
                    {bag.reviewStatus === 'awaiting' ? (
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleReviewAction(bag.id, 'approved_full')}
                          className="min-h-[36px] rounded-lg bg-[#2E7D32] px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-[#256628] whitespace-nowrap"
                        >
                          {t.approveFull}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReviewAction(bag.id, 'confirmed_reduced')}
                          className="min-h-[36px] rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 whitespace-nowrap dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                        >
                          {t.confirmReduced}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReviewAction(bag.id, 'rejected')}
                          className="min-h-[36px] rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 whitespace-nowrap dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
                        >
                          {t.rejectBag}
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                          bag.reviewStatus === 'rejected'
                            ? 'text-red-700 dark:text-red-400'
                            : 'text-[#2E7D32] dark:text-emerald-400'
                        }`}
                      >
                        {bag.reviewStatus === 'rejected' ? (
                          <XCircle className="h-4 w-4" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" />
                        )}
                        <span>
                          {bag.reviewStatus === 'approved_full'
                            ? language === 'hi'
                              ? 'पूरा भुगतान स्वीकृत'
                              : 'Full Pay Approved'
                            : bag.reviewStatus === 'confirmed_reduced'
                            ? language === 'hi'
                              ? 'आधा भुगतान स्वीकृत'
                              : 'Half Pay Confirmed'
                            : language === 'hi'
                            ? 'अस्वीकृत'
                            : 'Rejected'}
                        </span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
