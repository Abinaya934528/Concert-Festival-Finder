import React, { useState } from 'react';
import type { EventItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../services/budgetCalculator';
import { calculateVibeMatch } from '../../services/vibeMatcher';
import { 
  X, 
  Calendar, 
  MapPin, 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  Calculator, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Share2,
  TreePine,
  Volume2,
  ChevronRight
} from 'lucide-react';

interface EventDetailModalProps {
  event: EventItem;
  onClose: () => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, onClose }) => {
  const { 
    vibeProfile, 
    savedEventIds, 
    toggleSavedEvent, 
    currency, 
    setCurrentPage, 
    updateActiveBudget, 
    addScheduleEntry,
    allArtists,
    setActiveArtistModal,
    saveTicketAlert,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'tickets' | 'stages' | 'access' | 'green'>('overview');

  const match = calculateVibeMatch(event, vibeProfile);
  const isSaved = savedEventIds.includes(event.id);

  const eventDate = new Date(event.startDate);
  const formattedDate = eventDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  });

  const handleBudgetPlanTrigger = (ticketPrice: number) => {
    updateActiveBudget({
      eventId: event.id,
      eventName: event.title,
      ticketPerPerson: ticketPrice
    });
    onClose();
    setCurrentPage('budget-planner');
  };

  const handleSquadSyncTrigger = () => {
    onClose();
    setCurrentPage('squad-sync');
    showToast(`Added "${event.title}" as option for your Squad Sync group!`);
  };

  const handleArtistClick = (artistName: string) => {
    const found = allArtists.find(a => a.name.toLowerCase().includes(artistName.toLowerCase()) || artistName.toLowerCase().includes(a.name.toLowerCase()));
    if (found) {
      setActiveArtistModal(found);
    } else {
      showToast(`Showing artist catalog for ${artistName}`);
      onClose();
      setCurrentPage('artist-explorer');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl max-h-[92vh] rounded-3xl glass-panel border border-vybe-border shadow-2xl flex flex-col overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header & Hero Image */}
        <div className="relative h-64 sm:h-80 w-full flex-shrink-0">
          <img 
            src={event.coverImage} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-vybe-card via-vybe-dark/50 to-black/30" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Info Bar */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-vybe-lime text-black shadow-glow-lime">
              {match.score}% VIBE MATCH
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-black/60 text-vybe-cyan backdrop-blur-md border border-vybe-cyan/30">
              {event.type}
            </span>
            {event.dataSource === 'Verified Official' && (
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Official Feed
              </span>
            )}
          </div>

          {/* Title & Metadata over hero */}
          <div className="absolute bottom-4 left-4 right-4 space-y-1.5 z-10">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white leading-tight">
              {event.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl line-clamp-1">
              {event.tagline}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-vybe-border bg-vybe-card/80 px-4 sm:px-6 overflow-x-auto custom-scrollbar flex-shrink-0">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'tickets', label: 'Ticket Tiers' },
            { id: 'stages', label: `Stages & Lineup ${event.stages ? `(${event.stages.length})` : ''}` },
            { id: 'access', label: 'Access Comfort' },
            { id: 'green', label: 'Transport & Eco' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? 'border-vybe-lime text-vybe-lime' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-grow space-y-6">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-vybe-surface border border-vybe-border flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-vybe-lime" />
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Date & Time</span>
                    <span className="text-xs font-semibold text-slate-200">{formattedDate}</span>
                    <p className="text-[11px] text-slate-400">{formattedTime}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-vybe-surface border border-vybe-border flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-vybe-violet-glow" />
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Venue & City</span>
                    <span className="text-xs font-semibold text-slate-200">{event.venueName}</span>
                    <p className="text-[11px] text-slate-400">{event.city}, {event.country}</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-vybe-surface border border-vybe-border flex items-center gap-3">
                  <Clock className="w-5 h-5 text-vybe-cyan" />
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Admission & Age</span>
                    <span className="text-xs font-semibold text-slate-200">
                      {event.isFree ? 'Free Admission' : `From ${formatCurrency(event.ticketPriceMin, currency)}`}
                    </span>
                    <p className="text-[11px] text-slate-400">{event.ageRestriction}</p>
                  </div>
                </div>
              </div>

              {/* Vibe Match Insight Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-vybe-violet/20 via-vybe-surface to-vybe-lime/10 border border-vybe-lime/30">
                <div className="flex items-center gap-2 text-vybe-lime font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>Why VYBE AI recommends this for your profile:</span>
                </div>
                <p className="text-xs text-slate-300 mt-1 italic">
                  "{match.summary}"
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">About The Experience</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Performing Artists Tag Cloud */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Featured Artists & Performers</h4>
                <div className="flex flex-wrap gap-2">
                  {event.artists.map(art => (
                    <button
                      key={art}
                      onClick={() => handleArtistClick(art)}
                      className="px-3 py-1.5 rounded-xl bg-vybe-card border border-vybe-border hover:border-vybe-lime text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors group"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-vybe-lime" />
                      <span>{art}</span>
                      <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-vybe-lime" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Atmospheric Tags */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Vibe & Atmosphere</h4>
                <div className="flex flex-wrap gap-1.5">
                  {event.atmosphere.map(a => (
                    <span key={a} className="text-xs px-2.5 py-1 rounded-lg bg-vybe-surface border border-vybe-border text-slate-300">
                      ⚡ {a}
                    </span>
                  ))}
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-vybe-surface border border-vybe-border text-slate-300">
                    👥 Crowd: {event.expectedCrowd}
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* TICKETS TAB */}
          {activeTab === 'tickets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-slate-100">Official Ticket Tiers</h4>
                  <p className="text-xs text-slate-400">Select any tier to automatically calculate your total night-out budget.</p>
                </div>
                {event.officialUrl && (
                  <a
                    href={event.officialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-vybe-lime hover:underline"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {event.ticketTiers.map(tier => (
                  <div key={tier.id} className="p-4 rounded-xl bg-vybe-surface border border-vybe-border flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-100">{tier.name}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          tier.status === 'available' ? 'bg-emerald-500/20 text-emerald-400' :
                          tier.status === 'selling_fast' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {tier.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="font-mono font-black text-xl text-vybe-lime mt-1">
                        {tier.price === 0 ? 'Free' : formatCurrency(tier.price, currency)}
                      </div>
                      <ul className="text-xs text-slate-400 space-y-1 mt-2">
                        {tier.benefits.map((b, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-vybe-lime" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => handleBudgetPlanTrigger(tier.price)}
                      className="w-full py-2 rounded-lg bg-vybe-card border border-vybe-lime/40 text-xs font-bold text-vybe-lime hover:bg-vybe-lime hover:text-black transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Calculator className="w-3.5 h-3.5" />
                      <span>Calculate Trip with This Tier</span>
                    </button>
                  </div>
                ))}
              </div>

              {event.ticketDropDate && (
                <div className="p-3.5 rounded-xl bg-vybe-card border border-vybe-violet/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-vybe-violet-glow">Ticket Drop Announcement</span>
                    <p className="text-[11px] text-slate-400">On-sale opens {new Date(event.ticketDropDate).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => {
                      saveTicketAlert({
                        id: `alt-${Date.now()}`,
                        eventId: event.id,
                        eventName: event.title,
                        eventDate: event.startDate,
                        dropDate: event.ticketDropDate || event.startDate,
                        tierName: event.ticketTiers[0]?.name || 'General Admission',
                        notifyAtSale: true,
                        notify1DayBefore: true,
                        notify1HourBefore: true,
                        createdAt: new Date().toISOString()
                      });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-vybe-violet text-white text-xs font-bold hover:bg-vybe-violet-glow hover:text-black transition-colors"
                  >
                    Track in Drop Radar
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STAGES & LINEUP TAB */}
          {activeTab === 'stages' && (
            <div className="space-y-4">
              {event.stages && event.stages.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {event.stages.map(stg => (
                      <div key={stg.id} className="p-3.5 rounded-xl bg-vybe-surface border border-vybe-border space-y-2">
                        <span className="font-bold text-xs text-slate-200 block">{stg.name}</span>
                        <p className="text-[11px] text-slate-400">{stg.locationDescription}</p>
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-vybe-lime">⚡ {stg.simulatedVibe}</span>
                          <span className="text-slate-400">Cap: {stg.capacity}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {event.performances && (
                    <div className="space-y-2 pt-2">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Schedule & Sets</h4>
                      <div className="space-y-2">
                        {event.performances.map(perf => (
                          <div key={perf.id} className="p-3 rounded-xl bg-vybe-card border border-vybe-border flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-slate-100">{perf.artistName}</span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-vybe-surface text-slate-300">{perf.genre}</span>
                              </div>
                              <p className="text-xs text-slate-400">{perf.stageName} • {perf.day}</p>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono text-vybe-lime font-bold">{perf.startTime} - {perf.endTime}</span>
                              <button
                                onClick={() => {
                                  addScheduleEntry({
                                    id: `sch-${Date.now()}`,
                                    eventId: event.id,
                                    performanceId: perf.id,
                                    artistName: perf.artistName,
                                    stageName: perf.stageName,
                                    startTime: perf.startTime,
                                    endTime: perf.endTime,
                                    day: perf.day,
                                    reminderMinutesBefore: 30
                                  });
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-vybe-lime/10 border border-vybe-lime/40 text-xs font-bold text-vybe-lime hover:bg-vybe-lime hover:text-black transition-colors flex items-center gap-1"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add to Schedule</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <p>Single stage acoustic performance. Detailed stage breakdown not required.</p>
                  <p className="text-xs">Artists perform sequentially at {event.venueName}.</p>
                </div>
              )}
            </div>
          )}

          {/* ACCESSIBILITY TAB */}
          {activeTab === 'access' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-slate-100">Accessibility & Sensory Comfort</h4>
                  <p className="text-xs text-slate-400">Verified venue access features for an inclusive experience.</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-mono ${
                  event.accessibility.verifiedByOrganizer 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {event.accessibility.verifiedByOrganizer ? 'Organizer Confirmed' : 'Self-Reported / Pending Verification'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'Wheelchair Ramps & Viewing', available: event.accessibility.wheelchair },
                  { label: 'Step-Free Navigation', available: event.accessibility.stepFree },
                  { label: 'Accessible Washrooms', available: event.accessibility.accessibleToilets },
                  { label: 'Quiet / Sensory Decompression', available: event.accessibility.quietSensorySpaces },
                  { label: 'Sign Language (ISL/ASL)', available: event.accessibility.signLanguage },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-vybe-surface border border-vybe-border flex items-center justify-between">
                    <span className="text-xs text-slate-300">{item.label}</span>
                    <span className={`text-xs font-bold font-mono ${item.available ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {item.available ? '✓ Yes' : '✕ Not Provided'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-vybe-card border border-vybe-border space-y-2 text-xs">
                <span className="font-bold text-slate-200 block">Companion & Caregiver Policy</span>
                <p className="text-slate-400">{event.accessibility.companionPolicy}</p>
                
                <span className="font-bold text-slate-200 block pt-2">Sensory Notes</span>
                <p className="text-slate-400">{event.accessibility.sensoryNotes}</p>
              </div>
            </div>
          )}

          {/* GREEN & TRANSPORT TAB */}
          {activeTab === 'green' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <TreePine className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="font-display font-bold text-slate-100">Green Footprint & Transport Guide</h4>
                  <p className="text-xs text-slate-400">Travel options and organizer eco-initiatives.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-vybe-surface border border-vybe-border space-y-3">
                <span className="text-xs font-bold text-slate-200 block">Transit Advice</span>
                <p className="text-xs text-slate-300">{event.sustainability.transitAdvice}</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                  <div className="p-2.5 rounded-lg bg-vybe-card text-[11px] text-slate-300">
                    <span className="text-vybe-lime font-bold">Reusable Cups:</span> {event.sustainability.reusableCups ? 'Yes (Deposit Scheme)' : 'Standard'}
                  </div>
                  <div className="p-2.5 rounded-lg bg-vybe-card text-[11px] text-slate-300">
                    <span className="text-vybe-lime font-bold">Water Refills:</span> {event.sustainability.waterRefillStations ? 'Free Stations Available' : 'Purchased Only'}
                  </div>
                  <div className="p-2.5 rounded-lg bg-vybe-card text-[11px] text-slate-300">
                    <span className="text-vybe-lime font-bold">Metro Shuttles:</span> {event.sustainability.shuttleBuses ? 'Dedicated Service' : 'Self Commute'}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-5 border-t border-vybe-border bg-vybe-card/90 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSavedEvent(event.id)}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                isSaved ? 'bg-rose-500 text-white border-rose-500' : 'bg-vybe-surface border-vybe-border text-slate-300 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleSquadSyncTrigger}
              className="p-2.5 rounded-xl bg-vybe-surface border border-vybe-border text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5"
            >
              <Users className="w-4 h-4 text-vybe-cyan" />
              <span>Share to Squad</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBudgetPlanTrigger(event.ticketPriceMin)}
              className="px-4 py-2.5 rounded-xl bg-vybe-surface border border-vybe-border text-xs font-bold text-slate-200 hover:text-vybe-lime flex items-center gap-1.5"
            >
              <Calculator className="w-4 h-4 text-vybe-lime" />
              <span>Night-Out Budget</span>
            </button>

            {event.officialUrl ? (
              <a
                href={event.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-vybe-lime text-black font-extrabold text-xs hover:bg-vybe-lime-hover shadow-glow-lime flex items-center gap-1.5 transition-all"
              >
                <span>Get Tickets</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <button
                onClick={() => handleBudgetPlanTrigger(event.ticketPriceMin)}
                className="px-5 py-2.5 rounded-xl bg-vybe-lime text-black font-extrabold text-xs hover:bg-vybe-lime-hover shadow-glow-lime"
              >
                Plan Attendance
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
