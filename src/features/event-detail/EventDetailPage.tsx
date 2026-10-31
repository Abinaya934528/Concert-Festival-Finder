import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../services/budgetCalculator';
import { calculateVibeMatch } from '../../services/vibeMatcher';
import { 
  ArrowLeft, 
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
  Volume2, 
  TreePine, 
  ChevronRight,
  Disc,
  Compass
} from 'lucide-react';

export const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    allEvents, 
    allArtists,
    vibeProfile, 
    savedEventIds, 
    toggleSavedEvent, 
    currency, 
    updateActiveBudget, 
    addScheduleEntry,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'tickets' | 'stages' | 'access' | 'green'>('overview');

  const event = allEvents.find(e => e.id === id);

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-vybe-surface flex items-center justify-center mx-auto text-slate-400">
          <AlertCircle className="w-8 h-8 text-amber-400" />
        </div>
        <h1 className="font-display font-extrabold text-3xl text-slate-100">Event Not Found</h1>
        <p className="text-xs text-slate-400">
          The event ID "{id}" could not be located in our curated catalog.
        </p>
        <Link
          to="/discover"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-vybe-lime text-black font-extrabold text-xs hover:bg-vybe-lime-hover shadow-glow-lime"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Event Discovery</span>
        </Link>
      </div>
    );
  }

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

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Event link copied to clipboard!');
    }
  };

  const handleBudgetPlanTrigger = (ticketPrice: number) => {
    updateActiveBudget({
      eventId: event.id,
      eventName: event.title,
      ticketPerPerson: ticketPrice
    });
    navigate('/budget');
  };

  const handleSquadSyncTrigger = () => {
    navigate('/squads');
    showToast(`Added "${event.title}" as option for your Squad Sync group!`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      
      {/* Back button & Action Row */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-vybe-surface border border-vybe-border text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            onClick={() => toggleSavedEvent(event.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              isSaved 
                ? 'bg-rose-500 text-white border-rose-500 shadow-lg' 
                : 'bg-vybe-surface text-slate-200 border-vybe-border hover:border-slate-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            <span>{isSaved ? 'Saved to Watchlist' : 'Save Event'}</span>
          </button>
        </div>
      </div>

      {/* Hero Banner Section */}
      <div className="relative rounded-3xl overflow-hidden border border-vybe-border min-h-[360px] sm:min-h-[420px] flex flex-col justify-end p-6 sm:p-10">
        <img 
          src={event.coverImage} 
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-vybe-dark via-vybe-dark/70 to-black/30" />

        {/* Content over banner */}
        <div className="relative z-10 space-y-4 max-w-4xl">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-vybe-lime text-black font-extrabold uppercase">
              {event.type}
            </span>
            <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-vybe-lime border border-vybe-lime/30 font-bold">
              {match.score}% Vibe Match
            </span>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-black/60 text-slate-300 border border-white/10">
              {event.dataSource} (Demo Data)
            </span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
            {event.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl font-medium">
            {event.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300 pt-2 font-mono">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-vybe-lime" />
              <span>{formattedDate} • {formattedTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-vybe-cyan" />
              <span>{event.venueName}, {event.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-vybe-violet-glow" />
              <span>{event.durationHours} Hours Duration</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid: Left Tabs & Right Sticky Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Detailed Tabs */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Transparent Vibe Match Card */}
          <div className="p-6 rounded-2xl glass-panel border border-vybe-lime/40 shadow-glow-lime/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-vybe-lime" />
                <span className="font-display font-bold text-base text-slate-100">
                  Algorithmic Vibe Match Analysis
                </span>
              </div>
              <span className="font-mono font-black text-xl text-vybe-lime">
                {match.score}% Match
              </span>
            </div>

            <p className="text-xs text-slate-300">
              {match.summary}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              {match.reasons.map((r, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-vybe-surface border border-vybe-border text-xs">
                  <div className="flex justify-between font-bold text-slate-200">
                    <span>{r.label}</span>
                    <span className="font-mono text-vybe-lime">+{r.points} pts</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{r.description}</p>
                </div>
              ))}
            </div>

            <p className="text-[10px] font-mono text-slate-500 pt-1">
              *Transparent rule-based matching engine comparing your Vibe DNA genres, atmosphere, energy level, and budget.
            </p>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex border-b border-vybe-border gap-2 overflow-x-auto pb-2">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'tickets', label: 'Tickets & Passes' },
              { id: 'stages', label: `Stages & Schedule (${event.stages?.length || 0})` },
              { id: 'access', label: 'Accessibility Comfort' },
              { id: 'green', label: 'Eco & Transit' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-vybe-lime text-black font-extrabold shadow-glow-lime' 
                    : 'bg-vybe-card text-slate-400 hover:text-slate-200 border border-vybe-border'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              <div className="p-6 rounded-2xl glass-panel border border-vybe-border space-y-4">
                <h3 className="font-display font-bold text-lg text-slate-100">About The Experience</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {event.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {event.genres.map(g => (
                    <span key={g} className="px-3 py-1 rounded-lg bg-vybe-surface border border-vybe-border text-xs font-mono text-slate-200">
                      {g}
                    </span>
                  ))}
                  {event.atmosphere.map(a => (
                    <span key={a} className="px-3 py-1 rounded-lg bg-vybe-violet/20 border border-vybe-violet/30 text-xs font-mono text-vybe-violet-glow">
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              {/* Performing Lineup Grid */}
              <div className="p-6 rounded-2xl glass-panel border border-vybe-border space-y-4">
                <h3 className="font-display font-bold text-lg text-slate-100 flex items-center gap-2">
                  <Disc className="w-4 h-4 text-vybe-cyan" />
                  <span>Performing Artists ({event.artists.length})</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {event.artists.map(artName => {
                    const foundArtist = allArtists.find(a => a.name.toLowerCase().includes(artName.toLowerCase()) || artName.toLowerCase().includes(a.name.toLowerCase()));
                    return (
                      <Link
                        key={artName}
                        to={foundArtist ? `/artist/${foundArtist.id}` : `/artists`}
                        className="p-3.5 rounded-xl bg-vybe-surface border border-vybe-border hover:border-vybe-cyan transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          {foundArtist ? (
                            <img src={foundArtist.image} alt={artName} className="w-10 h-10 rounded-lg object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-vybe-dark flex items-center justify-center text-slate-400 font-bold">
                              {artName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-xs text-slate-100 group-hover:text-vybe-cyan transition-colors block">
                              {artName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">View Artist Spotlight</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-vybe-cyan transition-colors" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Gallery Images */}
              {event.galleryImages && event.galleryImages.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-display font-bold text-base text-slate-100">Ground Atmosphere Photos</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {event.galleryImages.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Venue Ground Atmosphere"
                        className="w-full h-44 rounded-2xl object-cover border border-vybe-border"
                      />
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: TICKETS & PASSES */}
          {activeTab === 'tickets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-100">Ticket Tiers & On-Sale Status</h3>
                  <p className="text-xs text-slate-400">All prices in {currency} • Curated sample pricing</p>
                </div>
              </div>

              <div className="space-y-3">
                {event.ticketTiers.map(tier => (
                  <div
                    key={tier.id}
                    className="p-5 rounded-2xl glass-panel border border-vybe-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-100">{tier.name}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          tier.status === 'available' ? 'bg-emerald-500/20 text-emerald-400' :
                          tier.status === 'selling_fast' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {tier.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-slate-400 pt-1">
                        {tier.benefits.map((b, i) => (
                          <span key={i} className="flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-vybe-lime" />
                            <span>{b}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:flex-col sm:items-end flex-shrink-0">
                      <div className="font-mono font-black text-xl text-vybe-lime">
                        {formatCurrency(tier.price, currency)}
                      </div>
                      <button
                        onClick={() => handleBudgetPlanTrigger(tier.price)}
                        className="px-4 py-2 rounded-xl bg-vybe-surface border border-vybe-border text-xs font-bold text-slate-200 hover:border-vybe-lime hover:text-white transition-all flex items-center gap-1.5"
                      >
                        <Calculator className="w-3.5 h-3.5 text-vybe-lime" />
                        <span>Plan Budget With This Tier</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: STAGES & SCHEDULE */}
          {activeTab === 'stages' && (
            <div className="space-y-6">
              {event.stages && event.stages.length > 0 ? (
                <div className="space-y-6">
                  {/* Stages List */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {event.stages.map(stg => (
                      <div key={stg.id} className="p-4 rounded-2xl bg-vybe-card border border-vybe-border space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-slate-100">{stg.name}</span>
                          <Volume2 className="w-4 h-4 text-vybe-lime" />
                        </div>
                        <p className="text-xs text-slate-400">{stg.locationDescription}</p>
                        <div className="text-[10px] font-mono text-vybe-cyan">
                          Vibe: {stg.simulatedVibe} • Cap: {stg.capacity}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Performances Timeline */}
                  {event.performances && event.performances.length > 0 && (
                    <div className="p-6 rounded-2xl glass-panel border border-vybe-border space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-display font-bold text-base text-slate-100">Live Setlist Schedule</h4>
                        <Link to="/schedule" className="text-xs font-bold text-vybe-lime hover:underline">
                          Open Schedule Builder →
                        </Link>
                      </div>

                      <div className="space-y-2">
                        {event.performances.map(perf => (
                          <div
                            key={perf.id}
                            className="p-3.5 rounded-xl bg-vybe-surface border border-vybe-border flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-100">{perf.artistName}</span>
                                <span className="text-[10px] font-mono text-slate-400">({perf.genre})</span>
                              </div>
                              <span className="text-[11px] text-slate-400 font-mono">
                                {perf.stageName} • {perf.day} ({perf.startTime} - {perf.endTime})
                              </span>
                            </div>

                            <button
                              onClick={() => {
                                const res = addScheduleEntry({
                                  id: `sched-${Date.now()}-${Math.random()}`,
                                  eventId: event.id,
                                  performanceId: perf.id,
                                  artistName: perf.artistName,
                                  stageName: perf.stageName,
                                  startTime: perf.startTime,
                                  endTime: perf.endTime,
                                  day: perf.day,
                                  reminderMinutesBefore: 15
                                });
                                if (res.conflict) {
                                  showToast(`⚠️ Warning: Overlaps with ${res.conflict.artistName}! Added with conflict alert.`);
                                } else {
                                  showToast(`Added ${perf.artistName} to your festival schedule!`);
                                }
                              }}
                              className="px-3 py-1.5 rounded-lg bg-vybe-card border border-vybe-border hover:border-vybe-lime text-[11px] font-bold text-slate-200 flex items-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5 text-vybe-lime" />
                              <span>Add to Timeline</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-vybe-card text-center text-xs text-slate-400">
                  Single stage venue with continuous performance progression.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ACCESSIBILITY & COMFORT */}
          {activeTab === 'access' && (
            <div className="p-6 rounded-2xl glass-panel border border-vybe-border space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-100 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Accessibility & Sensory Comfort Report</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Status: <strong className="text-slate-200">{event.accessibility.verifiedByOrganizer ? 'Verified by Festival Organizers' : 'Curated Sample Assessment'}</strong>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-vybe-surface border border-vybe-border flex items-center justify-between text-xs">
                  <span className="text-slate-300">Wheelchair & Step-Free Viewing:</span>
                  <span className={`font-mono font-bold ${event.accessibility.wheelchair ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {event.accessibility.wheelchair ? 'Verified Available' : 'Limited / Unconfirmed'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-vybe-surface border border-vybe-border flex items-center justify-between text-xs">
                  <span className="text-slate-300">Accessible Restrooms:</span>
                  <span className={`font-mono font-bold ${event.accessibility.accessibleToilets ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {event.accessibility.accessibleToilets ? 'Verified Available' : 'Standard Washrooms'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-vybe-surface border border-vybe-border flex items-center justify-between text-xs">
                  <span className="text-slate-300">Quiet Sensory Relief Zones:</span>
                  <span className={`font-mono font-bold ${event.accessibility.quietSensorySpaces ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {event.accessibility.quietSensorySpaces ? 'Dedicated Space' : 'None Designated'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-vybe-surface border border-vybe-border flex items-center justify-between text-xs">
                  <span className="text-slate-300">Sign Language Interpreters:</span>
                  <span className={`font-mono font-bold ${event.accessibility.signLanguage ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {event.accessibility.signLanguage ? 'Available on Mainstage' : 'Not Provided'}
                  </span>
                </div>
              </div>

              {event.accessibility.companionPolicy && (
                <div className="p-4 rounded-xl bg-vybe-surface border border-vybe-border text-xs space-y-1">
                  <span className="font-bold text-slate-200 block">Companion & Assistant Policy:</span>
                  <p className="text-slate-300">{event.accessibility.companionPolicy}</p>
                </div>
              )}

              {event.accessibility.sensoryNotes && (
                <div className="p-4 rounded-xl bg-vybe-surface border border-vybe-border text-xs space-y-1">
                  <span className="font-bold text-slate-200 block">Sensory & Strobe Lighting Advisory:</span>
                  <p className="text-slate-300">{event.accessibility.sensoryNotes}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: ECO & TRANSIT */}
          {activeTab === 'green' && (
            <div className="p-6 rounded-2xl glass-panel border border-vybe-border space-y-5">
              <div className="flex items-center gap-2">
                <TreePine className="w-5 h-5 text-emerald-400" />
                <h3 className="font-display font-bold text-lg text-slate-100">Green Footprint & Commute</h3>
              </div>

              <div className="p-4 rounded-xl bg-vybe-surface border border-vybe-border text-xs space-y-1">
                <span className="font-bold text-slate-200 block">Public Transportation Advice:</span>
                <p className="text-slate-300">{event.sustainability.transitAdvice}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-vybe-surface border border-vybe-border">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Reusable Cups</span>
                  <span className="font-bold text-xs text-emerald-400">{event.sustainability.reusableCups ? 'Yes' : 'No'}</span>
                </div>
                <div className="p-3 rounded-xl bg-vybe-surface border border-vybe-border">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Free Refill Stations</span>
                  <span className="font-bold text-xs text-emerald-400">{event.sustainability.waterRefillStations ? 'Yes' : 'No'}</span>
                </div>
                <div className="p-3 rounded-xl bg-vybe-surface border border-vybe-border">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Transit Shuttles</span>
                  <span className="font-bold text-xs text-emerald-400">{event.sustainability.shuttleBuses ? 'Yes' : 'No'}</span>
                </div>
                <div className="p-3 rounded-xl bg-vybe-surface border border-vybe-border">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Carbon Offset</span>
                  <span className="font-bold text-xs text-emerald-400">{event.sustainability.carbonOffsetInitiative ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Sticky Summary Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl glass-panel border border-vybe-border space-y-6 lg:sticky lg:top-24">
            
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase text-slate-400 font-bold block">Admissions Starting At</span>
              <div className="font-mono font-black text-3xl text-vybe-lime">
                {event.isFree ? 'Free Admission' : `${formatCurrency(event.ticketPriceMin, currency)}`}
              </div>
              <span className="text-[11px] text-slate-400 block">
                Up to {formatCurrency(event.ticketPriceMax, currency)} for VIP Passes
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => handleBudgetPlanTrigger(event.ticketPriceMin)}
                className="w-full py-3.5 rounded-xl bg-vybe-lime text-black font-extrabold text-xs hover:bg-vybe-lime-hover shadow-glow-lime flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
              >
                <Calculator className="w-4 h-4" />
                <span>Calculate Total Night-Out Budget</span>
              </button>

              <button
                onClick={handleSquadSyncTrigger}
                className="w-full py-3.5 rounded-xl bg-vybe-cyan text-black font-extrabold text-xs hover:bg-cyan-300 shadow-glow-cyan flex items-center justify-center gap-2 transition-all"
              >
                <Users className="w-4 h-4" />
                <span>Plan With Friends (Squad Sync)</span>
              </button>

              {event.officialUrl && (
                <a
                  href={event.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-vybe-surface border border-vybe-border text-center text-xs font-bold text-slate-300 hover:text-white hover:border-slate-500 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Official Event / Ticketing Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <div className="pt-4 border-t border-vybe-border space-y-2 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Age Restriction:</span>
                <span className="text-slate-200 font-semibold">{event.ageRestriction}</span>
              </div>
              <div className="flex justify-between">
                <span>Expected Crowd:</span>
                <span className="text-slate-200 font-semibold">{event.expectedCrowd}</span>
              </div>
              <div className="flex justify-between">
                <span>Venue Setting:</span>
                <span className="text-slate-200 font-semibold">{event.isOutdoor ? 'Outdoor Grounds' : 'Indoor Stage'}</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

