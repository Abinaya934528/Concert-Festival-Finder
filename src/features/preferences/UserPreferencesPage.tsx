import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storageService';
import { 
  Sliders, 
  Moon, 
  Sun, 
  Coins, 
  Download, 
  Trash2, 
  ShieldCheck, 
  RotateCcw,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const UserPreferencesPage: React.FC = () => {
  const { 
    theme, 
    toggleTheme, 
    currency, 
    setCurrency, 
    showToast 
  } = useApp();

  const [confirmClear, setConfirmClear] = useState(false);

  const handleExportData = () => {
    const jsonString = StorageService.exportAllData();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vybe-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('VYBE profile & data exported successfully!');
  };

  const handleClearAllData = () => {
    StorageService.clearAllData();
    showToast('All local saved events, schedules, and vibe preferences cleared.');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vybe-lime/15 border border-vybe-lime/30 text-xs font-mono text-vybe-lime mb-2">
          <Sliders className="w-3.5 h-3.5" />
          <span>Application Settings & Data Control</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-100">
          User Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Control your currency, appearance theme, client storage, and backup your music footprint.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Appearance & Theme */}
        <div className="p-6 rounded-3xl glass-panel border border-vybe-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-display font-bold text-base text-slate-100 block">Theme Mode</span>
              <p className="text-xs text-slate-400">Deep charcoal & neon concert aesthetic vs high-contrast daylight</p>
            </div>

            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-xl bg-vybe-surface border border-vybe-border text-xs font-bold text-slate-200 hover:text-white flex items-center gap-2"
            >
              {theme === 'dark' ? <Moon className="w-4 h-4 text-vybe-violet-glow" /> : <Sun className="w-4 h-4 text-amber-400" />}
              <span>{theme === 'dark' ? 'Dark Mode (Active)' : 'Light Mode (Active)'}</span>
            </button>
          </div>
        </div>

        {/* Currency Preference */}
        <div className="p-6 rounded-3xl glass-panel border border-vybe-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-display font-bold text-base text-slate-100 block">Default Currency</span>
              <p className="text-xs text-slate-400">All festival tickets and night-out budgets will be converted into this currency</p>
            </div>

            <div className="flex gap-1.5">
              {['INR', 'USD', 'EUR', 'GBP'].map(c => (
                <button
                  key={c}
                  onClick={() => {
                    setCurrency(c);
                    showToast(`Currency changed to ${c}`);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-colors ${
                    currency === c 
                      ? 'bg-vybe-lime text-black border-vybe-lime shadow-glow-lime' 
                      : 'bg-vybe-surface border-vybe-border text-slate-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Backup & Export Data */}
        <div className="p-6 rounded-3xl glass-panel border border-vybe-border space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-display font-bold text-base text-slate-100 block">Export All VYBE Data</span>
              <p className="text-xs text-slate-400">Download a JSON snapshot of your Vibe DNA, squad plans, schedule, and memory cards</p>
            </div>

            <button
              onClick={handleExportData}
              className="px-4 py-2.5 rounded-xl bg-vybe-surface border border-vybe-border text-xs font-bold text-slate-200 hover:text-vybe-lime flex items-center gap-2 self-start sm:self-auto"
            >
              <Download className="w-4 h-4 text-vybe-lime" />
              <span>Export JSON Backup</span>
            </button>
          </div>
        </div>

        {/* Reset & Storage Clear */}
        <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-display font-bold text-base text-rose-300 block flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Reset Application Data
              </span>
              <p className="text-xs text-slate-300">
                Permanently wipes all saved events, customized Vibe profiles, and personal memories from this browser.
              </p>
            </div>

            {!confirmClear ? (
              <button
                onClick={() => setConfirmClear(true)}
                className="px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs font-bold text-rose-300 hover:bg-rose-500 hover:text-white transition-colors self-start sm:self-auto"
              >
                Clear All Data
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-3 py-1.5 rounded-xl bg-vybe-surface text-xs font-bold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearAllData}
                  className="px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600"
                >
                  Confirm Reset
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Privacy architecture note */}
        <div className="p-4 rounded-xl bg-vybe-card border border-vybe-border/60 text-xs text-slate-400 space-y-1">
          <span className="font-bold text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Client Storage Privacy Guarantee:
          </span>
          <p>
            VYBE runs local persistence in your browser (LocalStorage). No tracking cookies or advertising pixels are injected. Your music taste and personal journal stay under your complete control.
          </p>
        </div>

      </div>

    </div>
  );
};
