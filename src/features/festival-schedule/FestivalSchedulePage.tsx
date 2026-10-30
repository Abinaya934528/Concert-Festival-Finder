import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { PersonalScheduleEntry, FestivalPerformance } from '../../types';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Trash2, 
  Plus, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  Volume2, 
  Coffee, 
  Printer,
  ChevronRight,
  Info
} from 'lucide-react';

export const FestivalSchedulePage: React.FC = () => {
  const { 
    festivalSchedule, 
    removeScheduleEntry, 
    addScheduleEntry, 
    allEvents, 
    showToast 
  } = useApp();

  // Find festivals that have performances
  const festivalsWithStages = allEvents.filter(e => e.performances && e.performances.length > 0);
  const [selectedEventId, setSelectedEventId] = useState<string>(festivalsWithStages[0]?.id || allEvents[0]?.id || '');
  
  const currentEvent = allEvents.find(e => e.id === selectedEventId) || festivalsWithStages[0];
  const availablePerformances = currentEvent?.performances || [];

  // Available days for this festival
  const eventDays = Array.from(new Set(availablePerformances.map(p => p.day)));
  const [selectedDay, setSelectedDay] = useState<string>(eventDays[0] || 'Day 1 - Saturday');

  // Filter performances for selected day
  const dayPerformances = availablePerformances.filter(p => p.day === selectedDay);

  // Filter user's saved schedule entries for this festival and day
  const userDaySchedule = festivalSchedule
    .filter(s => (s.eventId === selectedEventId || !s.eventId) && s.day === selectedDay)
    .sort((a, b) => parseInt(a.startTime.replace(':', ''), 10) - parseInt(b.startTime.replace(':', ''), 10));

  // Detect time clashes in user's saved schedule for this day
  const clashes: { setA: PersonalScheduleEntry; setB: PersonalScheduleEntry }[] = [];
  for (let i = 0; i < userDaySchedule.length; i++) {
    for (let j = i + 1; j < userDaySchedule.length; j++) {
      const a = userDaySchedule[i];
      const b = userDaySchedule[j];
      const startA = parseInt(a.startTime.replace(':', ''), 10);
      const endA = parseInt(a.endTime.replace(':', ''), 10);
      const startB = parseInt(b.startTime.replace(':', ''), 10);
      const endB = parseInt(b.endTime.replace(':', ''), 10);
      if (Math.max(startA, startB) < Math.min(endA, endB)) {
        clashes.push({ setA: a, setB: b });
      }
    }
  }

  const handleAddPerformance = (perf: FestivalPerformance) => {
    const newEntry: PersonalScheduleEntry = {
      id: `sched-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      eventId: currentEvent.id,
      performanceId: perf.id,
      artistName: perf.artistName,
      stageName: perf.stageName,
      startTime: perf.startTime,
      endTime: perf.endTime,
      day: perf.day,
      reminderMinutesBefore: 15,
      notes: `${perf.genre} set on ${perf.stageName}`
    };

    const res = addScheduleEntry(newEntry);
    if (res.conflict) {
      showToast(`⚠️ Schedule Conflict: Overlaps with ${res.conflict.artistName}! Both are marked on your timeline.`);
    } else {
      showToast(`Added ${perf.artistName} to ${perf.day} itinerary!`);
    }
  };

  const handleAddBreakReminder = () => {
    const breakEntry: PersonalScheduleEntry = {
      id: `break-${Date.now()}`,
      eventId: currentEvent.id,
      performanceId: 'break-slot',
      artistName: '☕ Hydration & Dinner Recharge Break',
      stageName: 'Artisan Food Village / Rest Lawn',
      startTime: '19:30',
      endTime: '20:15',
      day: selectedDay,
      reminderMinutesBefore: 10,
      notes: 'Refill water bottle, grab healthy food, rest ears before headliners.'
    };

    addScheduleEntry(breakEntry);
    showToast('Recharge break added to itinerary!');
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(festivalSchedule, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `vybe-schedule-${currentEvent.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Schedule exported as JSON!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-10 pb-16 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vybe-lime/15 border border-vybe-lime/30 text-xs font-mono text-vybe-lime mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Smart Timeline & Clash Resolution Engine</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-100">
            Festival Schedule Builder
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Build your personalized stage hop timeline, detect headliner time clashes with instant alerts, and schedule hydration breaks.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleAddBreakReminder}
            className="px-4 py-2.5 rounded-xl bg-vybe-surface border border-vybe-border text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5"
          >
            <Coffee className="w-4 h-4 text-vybe-cyan" />
            <span>+ Add Break</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-4 py-2.5 rounded-xl bg-vybe-surface border border-vybe-border text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-vybe-lime" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-vybe-lime text-black text-xs font-extrabold hover:bg-vybe-lime-hover shadow-glow-lime flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Itinerary</span>
          </button>
        </div>
      </div>

      {/* Festival Selector Bar */}
      <div className="p-4 rounded-2xl bg-vybe-card border border-vybe-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase text-slate-400 font-bold">Active Festival:</span>
          <span className="text-sm font-bold text-slate-200">{currentEvent?.title}</span>
        </div>

        <select
          value={selectedEventId}
          onChange={(e) => {
            setSelectedEventId(e.target.value);
            const ev = allEvents.find(event => event.id === e.target.value);
            const days = Array.from(new Set(ev?.performances?.map(p => p.day) || []));
            if (days.length > 0) setSelectedDay(days[0]);
          }}
          className="px-3 py-2 rounded-xl bg-vybe-surface border border-vybe-border text-xs text-slate-200 focus:outline-none focus:border-vybe-lime font-medium"
        >
          {festivalsWithStages.map(ev => (
            <option key={ev.id} value={ev.id}>{ev.title}</option>
          ))}
        </select>
      </div>

      {/* Day Selection Tabs */}
      <div className="flex items-center gap-2 border-b border-vybe-border pb-3">
        {eventDays.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedDay === day 
                ? 'bg-vybe-lime text-black font-extrabold shadow-glow-lime' 
                : 'bg-vybe-card text-slate-400 hover:text-slate-200 border border-vybe-border'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Overlapping Artist Clashes Warning Banner */}
      {clashes.length > 0 && (
        <div className="p-5 rounded-2xl bg-rose-500/15 border border-rose-500/40 space-y-3">
          <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <span>Schedule Conflict Alert ({clashes.length} Overlapping Sets Detected)</span>
          </div>
          <p className="text-xs text-rose-200">
            You have selected multiple performances that overlap in time on {selectedDay}. Pick your priority act or plan to split sets:
          </p>

          <div className="space-y-2 pt-1">
            {clashes.map((c, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-black/40 border border-rose-500/30 text-xs text-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <strong className="text-rose-400">{c.setA.artistName}</strong> ({c.setA.startTime} - {c.setA.endTime}) 
                  <span className="text-slate-400 mx-2">clashes with</span>
                  <strong className="text-rose-400">{c.setB.artistName}</strong> ({c.setB.startTime} - {c.setB.endTime})
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {c.setA.stageName} vs {c.setB.stageName}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Layout: Available Performances vs My Personal Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Official Festival Performances for this Day */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-slate-100 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-vybe-cyan" />
              <span>Available Sets on {selectedDay}</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">{dayPerformances.length} Artists</span>
          </div>

          <div className="space-y-3">
            {dayPerformances.length > 0 ? (
              dayPerformances.map(perf => {
                const isAlreadyScheduled = festivalSchedule.some(s => s.performanceId === perf.id);
                return (
                  <div
                    key={perf.id}
                    className="p-4 rounded-2xl glass-panel border border-vybe-border flex items-center justify-between gap-3 hover:border-slate-500 transition-all"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-100 truncate">{perf.artistName}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-vybe-surface text-vybe-cyan">
                          {perf.genre}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-vybe-lime" />
                          <span>{perf.startTime} - {perf.endTime}</span>
                        </span>
                        <span>•</span>
                        <span>{perf.stageName}</span>
                      </div>
                    </div>

                    <button
                      disabled={isAlreadyScheduled}
                      onClick={() => handleAddPerformance(perf)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all flex-shrink-0 ${
                        isAlreadyScheduled 
                          ? 'bg-vybe-surface border border-vybe-border text-slate-500 cursor-not-allowed' 
                          : 'bg-vybe-lime text-black hover:bg-vybe-lime-hover shadow-glow-lime'
                      }`}
                    >
                      {isAlreadyScheduled ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="p-8 rounded-2xl bg-vybe-card text-center text-xs text-slate-400">
                No performances scheduled for this day yet.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: User's Personalized Schedule Timeline */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-vybe-lime" />
              <span>My Personal Itinerary ({userDaySchedule.length} Sets)</span>
            </h3>
            <span className="text-xs font-mono text-vybe-lime font-bold">{selectedDay}</span>
          </div>

          {userDaySchedule.length > 0 ? (
            <div className="space-y-3 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-vybe-border/60">
              {userDaySchedule.map((entry, idx) => {
                const isBreak = entry.performanceId === 'break-slot';
                return (
                  <div
                    key={entry.id}
                    className={`relative ml-8 p-4 rounded-2xl border transition-all ${
                      isBreak 
                        ? 'bg-vybe-cyan/10 border-vybe-cyan/40' 
                        : 'glass-panel border-vybe-border hover:border-vybe-lime/40'
                    }`}
                  >
                    {/* Node Dot on Timeline */}
                    <span className={`absolute -left-10 top-5 w-4 h-4 rounded-full border-2 border-vybe-dark ${
                      isBreak ? 'bg-vybe-cyan' : 'bg-vybe-lime'
                    }`} />

                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-sm ${isBreak ? 'text-vybe-cyan' : 'text-slate-100'}`}>
                            {entry.artistName}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-vybe-dark text-slate-300 font-bold">
                            {entry.startTime} - {entry.endTime}
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                          <MapPin className="w-3.5 h-3.5 text-vybe-violet-glow" />
                          <span>{entry.stageName}</span>
                        </p>

                        {entry.notes && (
                          <p className="text-[11px] text-slate-400 italic pt-1">
                            "{entry.notes}"
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          removeScheduleEntry(entry.id);
                          showToast(`Removed "${entry.artistName}" from schedule.`);
                        }}
                        className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Remove from itinerary"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 rounded-3xl glass-panel border border-vybe-border text-center space-y-3">
              <Calendar className="w-8 h-8 text-slate-500 mx-auto" />
              <h4 className="font-bold text-sm text-slate-200">No Performances Added for {selectedDay}</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Click "+ Add" on any artist set on the left to map out your day and prevent headliner overlaps.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
