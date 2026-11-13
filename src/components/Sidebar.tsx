import React from 'react';
import {
  Camera,
  Home,
  Languages,
  Moon,
  Recycle,
  ShieldCheck,
  Sun,
  Truck,
  X,
} from 'lucide-react';
import { TRANSLATIONS } from '../i18n';
import type { Language, PageId, UserRole } from '../types';

interface SidebarProps {
  activeRole: UserRole;
  activePage: PageId;
  language: Language;
  darkMode: boolean;
  mobileOpen: boolean;
  onSelectRole: (role: UserRole) => void;
  onSelectPage: (page: PageId) => void;
  onToggleLanguage: () => void;
  onToggleDarkMode: () => void;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeRole,
  activePage,
  language,
  darkMode,
  mobileOpen,
  onSelectRole,
  onSelectPage,
  onToggleLanguage,
  onToggleDarkMode,
  onCloseMobile,
}) => {
  const t = TRANSLATIONS[language];

  const roleOptions: { id: UserRole; label: string }[] = [
    { id: 'resident', label: t.roleResident },
    { id: 'worker', label: t.roleWorker },
    { id: 'admin', label: t.roleAdmin },
  ];

  const navItems: { id: PageId; label: string; icon: React.ReactNode }[] = [
    { id: 'resident', label: t.navResident, icon: <Home className="h-4 w-4 shrink-0" /> },
    { id: 'worker', label: t.navWorker, icon: <Truck className="h-4 w-4 shrink-0" /> },
    { id: 'admin', label: t.navAdmin, icon: <ShieldCheck className="h-4 w-4 shrink-0" /> },
    { id: 'ai-demo', label: t.navAiDemo, icon: <Camera className="h-4 w-4 shrink-0" /> },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-white px-4 py-5 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2E7D32] text-white">
              <Recycle className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
                {t.brandName}
              </p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {t.tagline}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Role Switcher at Top */}
        <div>
          <p className="mb-2 px-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            {t.roleSwitcherLabel}
          </p>
          <div
            role="group"
            aria-label={t.roleSwitcherLabel}
            className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800"
          >
            {roleOptions.map((role) => {
              const active = activeRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => {
                    onSelectRole(role.id);
                    onCloseMobile();
                  }}
                  className={`min-h-[38px] truncate rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E7D32] ${
                    active
                      ? 'bg-[#2E7D32] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                  }`}
                >
                  {role.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary Navigation */}
        <nav aria-label="Main navigation" className="space-y-1">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectPage(item.id);
                  onCloseMobile();
                }}
                className={`flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E7D32] ${
                  isActive
                    ? 'bg-[#2E7D32]/10 text-[#2E7D32] dark:bg-[#2E7D32]/25 dark:text-emerald-300'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Simple Bag Key for Low-Literacy Clarity */}
        <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
          <p className="mb-2.5 px-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            {t.bagGuideTitle}
          </p>
          <div className="space-y-2 px-1 text-sm font-medium">
            <div className="flex items-center gap-2.5">
              <span
                className="h-3.5 w-3.5 shrink-0 rounded-sm bg-[#2E7D32]"
                aria-hidden="true"
              />
              <span className="text-slate-700 dark:text-slate-200">{t.greenBagShort}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span
                className="h-3.5 w-3.5 shrink-0 rounded-sm bg-[#1565C0]"
                aria-hidden="true"
              />
              <span className="text-slate-700 dark:text-slate-200">{t.blueBagShort}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls: Language + Dark Mode */}
      <div className="space-y-2 border-t border-slate-200 pt-4 dark:border-slate-800">
        <button
          type="button"
          onClick={onToggleLanguage}
          className="flex min-h-[44px] w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <span className="flex items-center gap-2.5">
            <Languages className="h-4 w-4 text-[#1565C0] dark:text-blue-400" />
            <span>{t.languageLabel}</span>
          </span>
          <span className="font-mono-num text-xs font-bold text-[#1565C0] dark:text-blue-300">
            {language === 'en' ? 'EN / हिन्दी' : 'हिन्दी / EN'}
          </span>
        </button>

        <button
          type="button"
          onClick={onToggleDarkMode}
          className="flex min-h-[44px] w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <span className="flex items-center gap-2.5">
            {darkMode ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600" />
            )}
            <span>{darkMode ? t.lightMode : t.darkMode}</span>
          </span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {darkMode ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-[264px] shrink-0 border-r border-slate-200 lg:block dark:border-slate-800">
        <div className="sticky top-0 h-screen overflow-y-auto">{sidebarContent}</div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative z-10 h-full w-[280px] max-w-[85vw] border-r border-slate-200 shadow-xl dark:border-slate-800">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
