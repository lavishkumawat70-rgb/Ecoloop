import React, { useState } from 'react';
import {
  BadgeCheck,
  CheckCircle2,
  Clock,
  IndianRupee,
  MapPin,
  PackageCheck,
  Truck,
  UserCheck,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { WORKER_INITIAL_PICKUPS, WORKER_WEEKLY_STATS } from '../data/mockData';
import { TRANSLATIONS } from '../i18n';
import type { Language, PickupStatus, PickupTask, WorkerRoleType } from '../types';

interface WorkerDashboardProps {
  language: Language;
  darkMode: boolean;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({ language, darkMode }) => {
  const t = TRANSLATIONS[language];
  const [workerRole, setWorkerRole] = useState<WorkerRoleType>('Kiosk Attendant');
  const [pickups, setPickups] = useState<PickupTask[]>(WORKER_INITIAL_PICKUPS);
  const [weeklyCommission, setWeeklyCommission] = useState<number>(2140);

  const workerRoles: {
    id: WorkerRoleType;
    labelEn: string;
    labelHi: string;
  }[] = [
    { id: 'Collection Partner', labelEn: 'Collection Partner', labelHi: 'संग्रह साथी' },
    { id: 'Kiosk Attendant', labelEn: 'Kiosk Attendant', labelHi: 'कियोस्क सहायक' },
    { id: 'Material Handler', labelEn: 'Material Handler', labelHi: 'सामग्री प्रबंधक' },
  ];

  const handleAdvancePickup = (taskId: string) => {
    setPickups((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;
        if (task.status === 'pending') {
          return { ...task, status: 'collected' };
        }
        if (task.status === 'collected') {
          setWeeklyCommission((c) => Number((c + task.commissionInr).toFixed(2)));
          return { ...task, status: 'deposited' };
        }
        return task;
      })
    );
  };

  const statusMeta = (status: PickupStatus) => {
    if (status === 'deposited') {
      return {
        label: t.statusDeposited,
        icon: <CheckCircle2 className="h-4 w-4 text-[#2E7D32] dark:text-emerald-400" />,
        textClass: 'text-[#2E7D32] dark:text-emerald-400',
      };
    }
    if (status === 'collected') {
      return {
        label: t.statusCollected,
        icon: <Truck className="h-4 w-4 text-[#1565C0] dark:text-blue-400" />,
        textClass: 'text-[#1565C0] dark:text-blue-400',
      };
    }
    return {
      label: t.statusPending,
      icon: <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
      textClass: 'text-amber-700 dark:text-amber-400',
    };
  };

  const gridStroke = darkMode ? '#1e293b' : '#e2e8f0';
  const axisTickColor = darkMode ? '#94a3b8' : '#64748b';

  const completedCount = pickups.filter((p) => p.status === 'deposited').length;
  const totalKgToday = pickups.reduce((sum, p) => sum + p.estWeightKg, 0);

  return (
    <div className="space-y-6">
      {/* Header + Interactive Role Badge Selector */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            {t.workerWelcome}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {t.workerSub}
          </p>
        </div>

        {/* Role Badge Switcher */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {t.workerRoleTitle}
          </span>
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
            {workerRoles.map((role) => {
              const active = workerRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setWorkerRole(role.id)}
                  className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#1565C0] text-white'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <BadgeCheck className="h-3.5 w-3.5" />
                  <span>{language === 'hi' ? role.labelHi : role.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Earnings & Stipend Cards */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Per-kg Instant Commission Card */}
        <section
          className={`flex flex-col justify-between rounded-2xl bg-[#1565C0] p-6 text-white ${
            workerRole === 'Kiosk Attendant' ? 'lg:col-span-7' : 'lg:col-span-8'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-100">{t.workerEarningsTitle}</p>
              <p className="font-mono-num mt-2 text-4xl font-bold tracking-tight">
                ₹{weeklyCommission.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="mt-1 text-xs font-medium text-blue-100">
                {t.workerThisWeek} · {t.workerPerKgHint}
              </p>
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
              <IndianRupee className="h-6 w-6" />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/20 pt-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-blue-100">
                {language === 'hi' ? 'सक्रिय भूमिका' : 'Verified Role'}
              </p>
              <p className="mt-0.5 text-sm font-bold">
                {language === 'hi'
                  ? workerRoles.find((r) => r.id === workerRole)?.labelHi
                  : workerRole}
              </p>
            </div>
            <div>
              <p className="text-xs text-blue-100">
                {language === 'hi' ? 'आज का लक्ष्य' : "Today's Route"}
              </p>
              <p className="font-mono-num mt-0.5 text-sm font-bold">
                {completedCount}/{pickups.length} {language === 'hi' ? 'पूर्ण' : 'deposited'}
              </p>
            </div>
            <div>
              <p className="text-xs text-blue-100">
                {language === 'hi' ? 'अनुमानित वजन' : 'Route Load'}
              </p>
              <p className="font-mono-num mt-0.5 text-sm font-bold">
                {totalKgToday.toFixed(1)} kg
              </p>
            </div>
          </div>
        </section>

        {/* Stipend / Role Summary Card */}
        <section
          className={`flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 ${
            workerRole === 'Kiosk Attendant' ? 'lg:col-span-5' : 'lg:col-span-4'
          }`}
        >
          {workerRole === 'Kiosk Attendant' ? (
            <>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#2E7D32] dark:text-emerald-400">
                    {t.workerStipendLabel}
                  </span>
                  <UserCheck className="h-5 w-5 text-[#2E7D32] dark:text-emerald-400" />
                </div>
                <p className="font-mono-num mt-3 text-3xl font-bold text-slate-900 dark:text-white">
                  ₹4,500 <span className="text-sm font-medium text-slate-500">/ mo</span>
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {t.workerStipendNote}
                </p>
              </div>
              <div className="mt-5 border-t border-slate-200 pt-3 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">
                {language === 'hi'
                  ? 'असाइन कियोस्क: K-BLR-01 (इंदिरानगर 100ft रोड)'
                  : 'Assigned Kiosk: K-BLR-01 (Indiranagar 100ft Rd)'}
              </div>
            </>
          ) : (
            <>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {workerRole === 'Collection Partner'
                      ? language === 'hi'
                        ? 'डोरस्टेप बोनस'
                        : 'Doorstep Punctuality Bonus'
                      : language === 'hi'
                      ? 'छंटाई गुणवत्ता बोनस'
                      : 'Bale Sorting Quality Bonus'}
                  </span>
                  <PackageCheck className="h-5 w-5 text-[#2E7D32] dark:text-emerald-400" />
                </div>
                <p className="font-mono-num mt-3 text-3xl font-bold text-slate-900 dark:text-white">
                  ₹1,250 <span className="text-sm font-medium text-slate-500">/ wk</span>
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {language === 'hi'
                    ? 'कियोस्क सहायक भूमिका चुनने पर ₹4,500/माह मानदेय जुड़ता है।'
                    : 'Switch badge to Kiosk Attendant to view the ₹4,500/mo fixed kiosk stipend.'}
                </p>
              </div>
              <div className="mt-5 border-t border-slate-200 pt-3 text-xs font-semibold text-[#2E7D32] dark:border-slate-800 dark:text-emerald-400">
                {language === 'hi' ? 'UPI खाता सत्यापित · तुरंत भुगतान सक्रिय' : 'UPI Verified · Instant Payout Active'}
              </div>
            </>
          )}
        </section>
      </div>

      {/* Main Content Split: Today's Pickups + Weekly Bar Chart */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Today's Pickups List */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-7 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {t.todaysPickupsTitle}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t.todaysPickupsSub}
            </p>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {pickups.map((task) => {
              const meta = statusMeta(task.status);
              return (
                <div
                  key={task.id}
                  className="flex flex-col gap-3 py-4 first:pt-2 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-mono-num font-semibold text-slate-700 dark:text-slate-300">
                        {task.timeSlot}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{task.ward}</span>
                      <span aria-hidden="true">·</span>
                      <span className={`inline-flex items-center gap-1 font-semibold ${meta.textClass}`}>
                        {meta.icon}
                        <span>{meta.label}</span>
                      </span>
                    </div>

                    <p className="text-base font-bold text-slate-900 dark:text-white">
                      {task.household}
                    </p>
                    <p className="flex items-start gap-1.5 text-sm text-slate-600 dark:text-slate-300">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                      <span>{task.address}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-semibold">
                      <span className="inline-flex items-center gap-1.5 text-[#2E7D32] dark:text-emerald-400">
                        <span className="h-2.5 w-2.5 rounded-sm bg-[#2E7D32]" aria-hidden="true" />
                        <span className="font-mono-num">{task.greenBags}</span>
                        <span>{language === 'hi' ? 'हरा' : 'Green'}</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[#1565C0] dark:text-blue-400">
                        <span className="h-2.5 w-2.5 rounded-sm bg-[#1565C0]" aria-hidden="true" />
                        <span className="font-mono-num">{task.blueBags}</span>
                        <span>{language === 'hi' ? 'नीला' : 'Blue'}</span>
                      </span>
                      <span className="font-mono-num text-slate-600 dark:text-slate-400">
                        {task.estWeightKg.toFixed(1)} kg · +₹{task.commissionInr.toFixed(0)}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {task.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => handleAdvancePickup(task.id)}
                        className="min-h-[44px] w-full rounded-xl bg-[#1565C0] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#104f99] whitespace-nowrap sm:w-auto"
                      >
                        {t.markCollected}
                      </button>
                    )}
                    {task.status === 'collected' && (
                      <button
                        type="button"
                        onClick={() => handleAdvancePickup(task.id)}
                        className="min-h-[44px] w-full rounded-xl bg-[#2E7D32] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#246327] whitespace-nowrap sm:w-auto"
                      >
                        {t.markDeposited}
                      </button>
                    )}
                    {task.status === 'deposited' && (
                      <span className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-[#2E7D32] dark:border-emerald-800/60 dark:bg-emerald-950/50 dark:text-emerald-300">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="font-mono-num">+₹{task.commissionInr.toFixed(0)}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bar Chart: Weekly kg Collected and Earnings */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {t.workerChartTitle}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {language === 'hi'
                ? 'कुल: 543 kg संग्रह · ₹2,220 कमीशन'
                : 'Total: 543 kg collected · ₹2,220 commission'}
            </p>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={WORKER_WEEKLY_STATS}
                margin={{ top: 10, right: 8, left: -12, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis
                  dataKey={language === 'hi' ? 'dayHi' : 'day'}
                  tick={{ fill: axisTickColor, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: axisTickColor, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: axisTickColor, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                    borderColor: darkMode ? '#1e293b' : '#e2e8f0',
                    borderRadius: '12px',
                    color: darkMode ? '#f8fafc' : '#0f172a',
                    fontSize: '13px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar
                  yAxisId="left"
                  dataKey="kgCollected"
                  name={language === 'hi' ? 'वजन (kg)' : 'Weight (kg)'}
                  fill="#2E7D32"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  yAxisId="right"
                  dataKey="earningsInr"
                  name={language === 'hi' ? 'कमाई (₹)' : 'Earnings (₹)'}
                  fill="#1565C0"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
};
