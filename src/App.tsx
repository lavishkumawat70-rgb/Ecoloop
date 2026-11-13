import { useEffect, useState } from 'react';
import { Languages, Menu, Moon, Recycle, Sun } from 'lucide-react';
import { AdminDashboard } from './components/AdminDashboard';
import { AiPurityDemo } from './components/AiPurityDemo';
import { ResidentDashboard } from './components/ResidentDashboard';
import { Sidebar } from './components/Sidebar';
import { WorkerDashboard } from './components/WorkerDashboard';
import { TRANSLATIONS } from './i18n';
import type { Language, PageId, UserRole } from './types';

export default function App() {
  const [activeRole, setActiveRole] = useState<UserRole>('resident');
  const [activePage, setActivePage] = useState<PageId>('resident');
  const [language, setLanguage] = useState<Language>('en');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSelectRole = (role: UserRole) => {
    setActiveRole(role);
    setActivePage(role);
  };

  const handleSelectPage = (page: PageId) => {
    setActivePage(page);
    if (page === 'resident' || page === 'worker' || page === 'admin') {
      setActiveRole(page);
    }
  };

  const t = TRANSLATIONS[language];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="flex min-h-screen">
        {/* Sidebar Navigation (Desktop fixed + Mobile Drawer) */}
        <Sidebar
          activeRole={activeRole}
          activePage={activePage}
          language={language}
          darkMode={darkMode}
          mobileOpen={mobileOpen}
          onSelectRole={handleSelectRole}
          onSelectPage={handleSelectPage}
          onToggleLanguage={() => setLanguage((l) => (l === 'en' ? 'hi' : 'en'))}
          onToggleDarkMode={() => setDarkMode((d) => !d)}
          onCloseMobile={() => setMobileOpen(false)}
        />

        {/* Main Viewport */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Compact Mobile Header (<= 56px, respects 15% mobile sticky cap) */}
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xs lg:hidden dark:border-slate-800 dark:bg-slate-900/95">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2E7D32] text-white">
                  <Recycle className="h-4 w-4" />
                </div>
                <span className="font-display text-base font-bold text-slate-900 dark:text-white">
                  {t.brandName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setLanguage((l) => (l === 'en' ? 'hi' : 'en'))}
                aria-label="Toggle language"
                className="flex h-10 items-center gap-1 rounded-lg border border-slate-200 px-2.5 text-xs font-bold text-[#1565C0] dark:border-slate-700 dark:text-blue-300"
              >
                <Languages className="h-4 w-4" />
                <span>{language === 'en' ? 'हिन्दी' : 'EN'}</span>
              </button>
              <button
                type="button"
                onClick={() => setDarkMode((d) => !d)}
                aria-label="Toggle dark mode"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200"
              >
                {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>
          </header>

          {/* Page Content */}
          <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {activePage === 'resident' && (
              <ResidentDashboard
                language={language}
                darkMode={darkMode}
                onGoToAiDemo={() => handleSelectPage('ai-demo')}
              />
            )}
            {activePage === 'worker' && (
              <WorkerDashboard language={language} darkMode={darkMode} />
            )}
            {activePage === 'admin' && (
              <AdminDashboard language={language} darkMode={darkMode} />
            )}
            {activePage === 'ai-demo' && <AiPurityDemo language={language} />}
          </main>
        </div>
      </div>
    </div>
  );
}
