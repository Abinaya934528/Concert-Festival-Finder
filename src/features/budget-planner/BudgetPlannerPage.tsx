import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { calculateNightOutBudget, formatCurrency } from '../../services/budgetCalculator';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis 
} from 'recharts';
import { 
  Calculator, 
  Coins, 
  Users, 
  Sparkles, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  PieChart as PieIcon,
  TrendingDown,
  Info
} from 'lucide-react';

const CHART_COLORS = [
  '#ccff00', // vybe-lime
  '#06b6d4', // vybe-cyan
  '#a855f7', // vybe-violet
  '#f59e0b', // amber
  '#ec4899', // pink
  '#3b82f6', // blue
  '#10b981', // emerald
  '#8b5cf6', // purple
  '#e11d48'  // rose
];

export const BudgetPlannerPage: React.FC = () => {
  const { 
    activeBudget, 
    updateActiveBudget, 
    currency, 
    applyBudgetFilterToDiscovery, 
    allEvents 
  } = useApp();

  const navigate = useNavigate();
  const [targetCap, setTargetCap] = useState<number>(10000);

  const result = calculateNightOutBudget(activeBudget);
  const remainingBudget = targetCap - result.totalPerPerson;
  const isOverBudget = remainingBudget < 0;
  const percentCapConsumed = Math.round((result.totalPerPerson / targetCap) * 100);

  const handleFieldChange = (field: keyof typeof activeBudget, value: number) => {
    updateActiveBudget({ [field]: value });
  };

  const handleSelectEvent = (eventId: string) => {
    const ev = allEvents.find(e => e.id === eventId);
    if (ev) {
      updateActiveBudget({
        eventId: ev.id,
        eventName: ev.title,
        ticketPerPerson: ev.ticketPriceMin
      });
    }
  };

  // Recharts chart data
  const chartData = result.breakdown.map((item, index) => ({
    name: item.label,
    value: Math.round(item.costPerPerson),
    percent: item.percentOfTotal,
    color: CHART_COLORS[index % CHART_COLORS.length]
  }));

  // Comparison Bar Chart data (Individual vs Squad Breakdown)
  const barData = [
    { name: 'Per Person', amount: Math.round(result.totalPerPerson) },
    { name: 'Squad Total', amount: Math.round(result.totalForSquad) }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vybe-lime/15 border border-vybe-lime/30 text-xs font-mono text-vybe-lime mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Complete Concert & Festival Expense Calculator</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-100">
            Night-Out Budget Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Factor in ticket passes, transportation, accommodation, food, drinks, parking, merch, and an emergency buffer before you book.
          </p>
        </div>

        {/* Find Events Within This Budget */}
        <button
          onClick={() => {
            applyBudgetFilterToDiscovery(activeBudget.ticketPerPerson || 3500);
            navigate('/discover');
          }}
          className="px-5 py-3 rounded-2xl bg-vybe-lime text-black font-extrabold text-xs hover:bg-vybe-lime-hover shadow-glow-lime flex items-center gap-2 self-start sm:self-auto transition-transform hover:scale-105"
        >
          <span>Find Events In This Budget</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Select Associated Event / Context */}
      <div className="p-4 rounded-2xl bg-vybe-card border border-vybe-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase text-slate-400 font-bold">Event Context:</span>
          <span className="text-sm font-bold text-slate-200">{activeBudget.eventName}</span>
        </div>

        <select
          value={activeBudget.eventId}
          onChange={(e) => handleSelectEvent(e.target.value)}
          className="px-3 py-2 rounded-xl bg-vybe-surface border border-vybe-border text-xs text-slate-200 focus:outline-none focus:border-vybe-lime font-medium"
        >
          {allEvents.map(e => (
            <option key={e.id} value={e.id}>{e.title}</option>
          ))}
        </select>
      </div>

      {/* Primary KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Total Per Person */}
        <div className="p-6 rounded-2xl glass-panel border border-vybe-border space-y-2">
          <span className="text-[11px] font-mono uppercase text-slate-400 block font-bold">
            Total Per Person
          </span>
          <div className="font-mono font-black text-3xl sm:text-4xl text-vybe-lime">
            {formatCurrency(result.totalPerPerson, currency)}
          </div>
          <p className="text-xs text-slate-400">
            Base expenses + {activeBudget.bufferPercent}% safety cushion
          </p>
        </div>

        {/* Squad Total */}
        <div className="p-6 rounded-2xl glass-panel border border-vybe-border space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-bold">
              Squad Total ({activeBudget.partySize} Pax)
            </span>
            <Users className="w-4 h-4 text-vybe-cyan" />
          </div>
          <div className="font-mono font-black text-3xl sm:text-4xl text-vybe-cyan">
            {formatCurrency(result.totalForSquad, currency)}
          </div>
          <p className="text-xs text-slate-400">
            Shared rides and accommodation divided equally
          </p>
        </div>

        {/* Budget Remaining vs Spending Cap */}
        <div className="p-6 rounded-2xl glass-panel border border-vybe-border space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-bold">
              Budget Remaining
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${isOverBudget ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              {isOverBudget ? 'Budget Exceeded' : 'Under Cap'}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className={`font-mono font-black text-3xl ${isOverBudget ? 'text-rose-400' : 'text-slate-100'}`}>
              {isOverBudget ? `-${formatCurrency(Math.abs(remainingBudget), currency)}` : formatCurrency(remainingBudget, currency)}
            </span>
            <span className="text-xs text-slate-400">of {formatCurrency(targetCap, currency)} cap</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-vybe-dark h-2 rounded-full overflow-hidden mt-2">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${isOverBudget ? 'bg-rose-500' : 'bg-vybe-lime'}`}
              style={{ width: `${Math.min(100, percentCapConsumed)}%` }}
            />
          </div>
        </div>

      </div>

      {/* Budget Warning Banner if Exceeded */}
      {isOverBudget && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 flex items-center gap-3 text-xs text-rose-300">
          <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <div>
            <strong>Budget Alert:</strong> Your projected night-out cost exceeds your target cap by{' '}
            <strong className="text-rose-200 font-mono">{formatCurrency(Math.abs(remainingBudget), currency)}</strong>.
            Consider adjusting hotel stays or ridesharing with squad members below.
          </div>
        </div>
      )}

      {/* Two Column Layout: Sliders & Recharts Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Allocator Sliders */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl glass-panel border border-vybe-border space-y-6">
            <h3 className="font-display font-bold text-lg text-slate-100 flex items-center gap-2">
              <Coins className="w-4 h-4 text-vybe-lime" />
              <span>Interactive Expense Allocator</span>
            </h3>

            {/* Party Size & Target Cap */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-vybe-border">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Squad / Party Size</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={activeBudget.partySize}
                    onChange={(e) => handleFieldChange('partySize', Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full px-3 py-2 rounded-xl bg-vybe-surface border border-vybe-border text-xs text-slate-100 font-mono font-bold"
                  />
                  <span className="text-xs text-slate-400">people</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Personal Target Cap (₹)</label>
                <input
                  type="number"
                  min={1000}
                  max={100000}
                  step={1000}
                  value={targetCap}
                  onChange={(e) => setTargetCap(Math.max(1000, parseInt(e.target.value, 10) || 1000))}
                  className="w-full px-3 py-2 rounded-xl bg-vybe-surface border border-vybe-border text-xs text-slate-100 font-mono font-bold"
                />
              </div>
            </div>

            {/* Itemized Sliders */}
            {[
              { key: 'ticketPerPerson', label: 'Ticket / Admission (Per Person)', max: 15000, step: 200 },
              { key: 'transitCost', label: 'Total Rides / Fuel / Flights (Group Shared)', max: 10000, step: 100 },
              { key: 'accommodationCost', label: 'Total Hotel / Camping / Stay (Group Shared)', max: 20000, step: 500 },
              { key: 'foodCost', label: 'Food & Meals (Per Person)', max: 5000, step: 100 },
              { key: 'drinksCost', label: 'Drinks & Hydration (Per Person)', max: 6000, step: 100 },
              { key: 'parkingCost', label: 'Parking & Tolls (Group Shared)', max: 2000, step: 50 },
              { key: 'merchCost', label: 'Official Merch & Vinyl (Per Person)', max: 6000, step: 200 },
              { key: 'activitiesCost', label: 'Afterparties & Extras (Per Person)', max: 5000, step: 100 },
              { key: 'bufferPercent', label: 'Emergency Cushion Buffer (%)', max: 30, step: 2, isPercent: true },
            ].map(item => {
              const currentValue = (activeBudget as any)[item.key];
              return (
                <div key={item.key} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-300">{item.label}</span>
                    <span className="font-mono font-bold text-vybe-lime">
                      {item.isPercent ? `${currentValue}%` : formatCurrency(currentValue, currency)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={item.max}
                    step={item.step}
                    value={currentValue}
                    onChange={(e) => handleFieldChange(item.key as any, parseInt(e.target.value, 10) || 0)}
                    className="w-full accent-vybe-lime cursor-pointer"
                  />
                </div>
              );
            })}

          </div>
        </div>

        {/* Right Column: Recharts Visualizations & Money-Saving Suggestions */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Recharts Pie / Donut Chart */}
          <div className="p-6 rounded-2xl glass-panel border border-vybe-border space-y-4">
            <h3 className="font-display font-bold text-base text-slate-100 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-vybe-cyan" />
              <span>Expense Breakdown Chart</span>
            </h3>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-2.5 rounded-xl bg-vybe-dark/95 border border-vybe-border shadow-xl text-xs">
                            <span className="font-bold text-slate-100 block">{data.name}</span>
                            <span className="font-mono text-vybe-lime font-bold">
                              {formatCurrency(data.value, currency)} ({data.percent}%)
                            </span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Legend */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-vybe-border/60">
              {chartData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[11px]">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 truncate">{item.name}</span>
                  <span className="font-mono text-slate-400 font-bold ml-auto">{item.percent}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Money-Saving Suggestions */}
          <div className="p-6 rounded-2xl glass-panel border border-vybe-border space-y-4">
            <h3 className="font-display font-bold text-base text-slate-100 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-emerald-400" />
              <span>Money-Saving Recommendations</span>
            </h3>

            <div className="space-y-2.5">
              {result.savingTips.map((tip, i) => (
                <div key={i} className="p-3 rounded-xl bg-vybe-surface border border-vybe-border flex items-start gap-2.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300 leading-relaxed">{tip}</span>
                </div>
              ))}
              
              <div className="p-3 rounded-xl bg-vybe-surface border border-vybe-border flex items-start gap-2.5 text-xs">
                <Info className="w-4 h-4 text-vybe-cyan flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 leading-relaxed">
                  Car pooling 4 people cuts transportation costs down to {formatCurrency(Math.round(activeBudget.transitCost / 4), currency)} per person.
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
