import React from 'react';
import { Sparkles } from 'lucide-react';

export const PageLoader: React.FC = () => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-vybe-lime via-vybe-cyan to-vybe-violet animate-spin p-0.5 shadow-glow-lime">
          <div className="w-full h-full bg-vybe-dark rounded-[14px]" />
        </div>
        <Sparkles className="w-5 h-5 text-vybe-lime absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>
      <span className="text-xs font-mono text-slate-400 tracking-wider uppercase font-semibold">
        Tuning Frequencies...
      </span>
    </div>
  );
};
