import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { calculateVibeMatch } from '../../services/vibeMatcher';
import { formatCurrency } from '../../services/budgetCalculator';
import { EventCard } from '../../components/events/EventCard';
import { 
  Sparkles, 
  Calendar, 
  Heart, 
  Disc, 
  Users, 
  Calculator, 
  Award, 
  Camera, 
  ArrowRight, 
  Clock, 
  MapPin, 
  AlertCircle,
  TrendingUp,
  Compass,
  CheckCircle2
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { 
    vibeProfile, 
    allEvents, 
    allArtists, 
    savedEventIds, 
    favoriteArtistIds, 
    squadPlans, 
    activeBudget, 
    festivalSchedule, 
    quests, 
    memories,
    currency,
    toggleSavedEvent,
    toggleFavoriteArtist
  } = useApp();

  const navigate = useNavigate();

  // Saved events list
  const savedEvents = allEvents.filter(e => savedEventIds.includes(e.id));

  // Favorite artists list
  const favoriteArtists = allArtists.filter(a => favoriteArtistIds.includes(a.id));

  // Top algorithmic recommendations based on Vibe DNA
  const recommendedEvents = [...allEvents]
    .map(event => ({
      event,
      match: calculateVibeMatch(event, vibeProfile)
    }))
    .sort((a, b) => b.match.score - a.match.score)
    .slice(0, 3);

  // Quest calculations
  const completedQuests = quests.filter(q => q.completed);
  const totalXP = completedQuests.reduce((sum, q) => sum + (q.xpPoints || 100), 0);
  const userLevel = Math.floor(totalXP / 300) + 1;
  const xpInCurrentLevel = totalXP % 300;
  const levelProgressPercent = Math.min(100, Math.round((xpInCurrentLevel / 300) * 100));

  // Greeting based on time
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      
      {/* 1. WELCOME & VIBE DNA HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl border border-vybe-border bg-gradient-to-br from-vybe-card via-vybe-surface to-vybe-dark p-6 sm:p-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-vybe-lime/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-vybe-violet/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-vybe-lime/15 border border-vybe-lime/30 text-xs font-mono text-vybe-lime">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Personalized Music Sanctuary</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">Level {userLevel} Pathfinder</span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-5xl text-slate-100 tracking-tight leading-tight">
              {timeGreeting}, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-vybe-lime via-vybe-cyan to-vybe-violet-glow">
                {vibeProfile?.discoveryPersonality.title || 'Music Explorer'}.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {vibeProfile?.discoveryPersonality.description || 
                'Tune your Vibe DNA to generate customized recommendations, sync festival schedules, and track ticket drops.'}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/vibe-dna"
                className="px-5 py-2.5 rounded-xl bg-vybe-lime text-black font-extrabold text-xs hover:bg-vybe-lime-hover shadow-glow-lime flex items-center gap-2 transition-transform hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                <span>Re-Tune Vibe DNA</span>
              </Link>
              <Link
                to="/discover"
                className="px-5 py-2.5 rounded-xl bg-vybe-surface border border-vybe-border text-slate-200 font-bold text-xs hover:border-vybe-lime/40 transition-colors flex items-center gap-1.5"
              >
                <span>Browse All Gigs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Vibe DNA Card Snapshot */}
          <div className="p-6 rounded-2xl glass-panel border border-vybe-lime/30 w-full lg:w-80 space-y-4 flex-shrink-0 shadow-glow-lime/20">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400 uppercase font-bold tracking-wider">
                Vibe Archetype
              </span>
              <span className="text-2xl">{vibeProfile?.discoveryPersonality.badgeEmoji || '✨'}</span>
            </div>

            <div>
              <span className="font-display font-extrabold text-xl text-slate-100 block">
                {vibeProfile?.discoveryPersonality.title || 'Eclectic Explorer'}
              </span>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Superpower: {vibeProfile?.discoveryPersonality.superpower || 'Uncovering underground gems.'}
              </p>
            </div>

            <div className="pt-2 border-t border-vybe-border/60">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1.5 font-bold">Top Genres</span>
              <div className="flex flex-wrap gap-1.5">
                {(vibeProfile?.genres || ['Electronic', 'Indie', 'Rock']).slice(0, 4).map(g => (
                  <span key={g} className="text-[10px] font-mono px-2 py-0.5 rounded bg-vybe-surface text-vybe-lime border border-vybe-lime/20">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. QUICK STATS SUMMARY BANNER */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl glass-panel border border-vybe-border space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase font-bold">Saved Events</span>
            <Heart className="w-4 h-4 text-rose-400" />
          </div>
          <div className="font-mono font-black text-2xl sm:text-3xl text-slate-100">
            {savedEvents.length}
          </div>
          <p className="text-[11px] text-slate-400">Wishlist & reminders</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-vybe-border space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase font-bold">Artists Tracked</span>
            <Disc className="w-4 h-4 text-vybe-violet-glow" />
          </div>
          <div className="font-mono font-black text-2xl sm:text-3xl text-slate-100">
            {favoriteArtists.length}
          </div>
          <p className="text-[11px] text-slate-400">Tour updates active</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-vybe-border space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase font-bold">Quest XP</span>
            <Award className="w-4 h-4 text-vybe-lime" />
          </div>
          <div className="font-mono font-black text-2xl sm:text-3xl text-vybe-lime">
            {totalXP} XP
          </div>
          <p className="text-[11px] text-slate-400">{completedQuests.length} of {quests.length} badges</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-vybe-border space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase font-bold">Memories</span>
            <Camera className="w-4 h-4 text-vybe-cyan" />
          </div>
          <div className="font-mono font-black text-2xl sm:text-3xl text-vybe-cyan">
            {memories.length}
          </div>
          <p className="text-[11px] text-slate-400">Logged concert moments</p>
        </div>

      </section>

      {/* 3. ALGORITHMIC RECOMMENDATIONS (VIBE MATCH ENGINE) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-vybe-lime" />
              <h2 className="font-display font-extrabold text-2xl text-slate-100">
                Top Vibe Matches for You
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Ranked by your Vibe DNA vectors (transparent rule-based algorithm)
            </p>
          </div>

          <Link
            to="/discover"
            className="text-xs font-bold text-vybe-lime hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Explore All Recommended</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedEvents.map(({ event, match }) => (
            <div key={event.id} className="relative group">
              <EventCard event={event} />
              
              {/* Match explanation strip */}
              <div className="mt-2 p-2.5 rounded-xl bg-vybe-card border border-vybe-border text-xs flex items-center justify-between">
                <span className="text-slate-300 truncate max-w-[70%]">{match.summary}</span>
                <span className="font-mono font-black text-vybe-lime text-xs whitespace-nowrap">
                  {match.score}% Match
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. UPCOMING SAVED EVENTS & TIMELINE */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400" />
            <div>
              <h2 className="font-display font-extrabold text-2xl text-slate-100">
                Your Saved Watchlist ({savedEvents.length})
              </h2>
              <p className="text-xs text-slate-400">Concerts and festivals you are tracking</p>
            </div>
          </div>
          
          <Link
            to="/discover"
            className="text-xs font-bold text-vybe-lime hover:underline flex items-center gap-1"
          >
            <span>Find More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {savedEvents.length === 0 ? (
          <div className="p-8 rounded-3xl glass-panel border border-vybe-border text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-vybe-surface flex items-center justify-center mx-auto text-slate-400">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-100">No Saved Events Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Explore upcoming concerts, festivals, or underground sessions and click the heart icon to save them to your dashboard.
            </p>
            <Link
              to="/discover"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-vybe-lime text-black font-extrabold text-xs hover:bg-vybe-lime-hover shadow-glow-lime transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Events Now</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {savedEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* 5. TWO COLUMN SECTION: SQUAD SYNC & BUDGET SNAPSHOT */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Squad Sync Overview */}
        <div className="p-6 rounded-3xl glass-panel border border-vybe-border space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-vybe-cyan" />
                <h3 className="font-display font-bold text-xl text-slate-100">Active Squad Sync</h3>
              </div>
              <Link to="/squads" className="text-xs font-bold text-vybe-cyan hover:underline">
                Manage Squad →
              </Link>
            </div>

            {squadPlans.length > 0 ? (
              <div className="space-y-3">
                {squadPlans.slice(0, 2).map(plan => (
                  <div key={plan.id} className="p-4 rounded-2xl bg-vybe-surface border border-vybe-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-sm text-slate-100">{plan.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-vybe-cyan/15 text-vybe-cyan border border-vybe-cyan/30 font-bold">
                        {plan.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{plan.members.length} Squad Members</span>
                      <span className="font-mono text-vybe-lime font-bold">87% Group Compatibility</span>
                    </div>

                    {/* Member Avatars */}
                    <div className="flex items-center gap-2 pt-1">
                      <div className="flex -space-x-2">
                        {plan.members.map(m => (
                          <img
                            key={m.id}
                            src={m.avatar}
                            alt={m.name}
                            className="w-7 h-7 rounded-full border-2 border-vybe-dark object-cover"
                            title={m.name}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Top shared genre: <strong className="text-slate-200">Electronic</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                No active squads. Invite friends or create demo profiles to compare music tastes and vote on events.
              </p>
            )}
          </div>

          <Link
            to="/squads"
            className="w-full py-3 rounded-xl bg-vybe-surface border border-vybe-border text-center text-xs font-bold text-slate-200 hover:border-vybe-cyan hover:text-white transition-all block"
          >
            Open Squad Sync Planner
          </Link>
        </div>

        {/* Budget Planner Snapshot */}
        <div className="p-6 rounded-3xl glass-panel border border-vybe-border space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-vybe-lime" />
                <h3 className="font-display font-bold text-xl text-slate-100">Night-Out Budget Summary</h3>
              </div>
              <Link to="/budget" className="text-xs font-bold text-vybe-lime hover:underline">
                Full Calculator →
              </Link>
            </div>

            <div className="p-4 rounded-2xl bg-vybe-surface border border-vybe-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold">Planned Gig</span>
                <span className="text-xs font-bold text-slate-200 truncate max-w-[180px]">
                  {activeBudget.eventName}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-vybe-card border border-vybe-border">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Per Person</span>
                  <span className="font-mono font-bold text-lg text-vybe-lime">
                    {formatCurrency(
                      activeBudget.ticketPerPerson + 
                      Math.round(activeBudget.transitCost / activeBudget.partySize) +
                      activeBudget.foodCost +
                      activeBudget.drinksCost,
                      currency
                    )}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-vybe-card border border-vybe-border">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Squad Size</span>
                  <span className="font-mono font-bold text-lg text-vybe-cyan">
                    {activeBudget.partySize} People
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 pt-1">
                Calculates tickets, fuel, cabs, drinks, food, merch, and an emergency buffer.
              </p>
            </div>
          </div>

          <Link
            to="/budget"
            className="w-full py-3 rounded-xl bg-vybe-surface border border-vybe-border text-center text-xs font-bold text-slate-200 hover:border-vybe-lime hover:text-white transition-all block"
          >
            Customize Expense Allocation
          </Link>
        </div>

      </section>

      {/* 6. FESTIVAL SCHEDULE & QUEST PROGRESS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Schedule Itinerary */}
        <div className="p-6 rounded-3xl glass-panel border border-vybe-border space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-vybe-violet-glow" />
              <h3 className="font-display font-bold text-xl text-slate-100">Festival Itinerary</h3>
            </div>
            <Link to="/schedule" className="text-xs font-bold text-vybe-violet-glow hover:underline">
              Build Timeline →
            </Link>
          </div>

          {festivalSchedule.length > 0 ? (
            <div className="space-y-2">
              {festivalSchedule.slice(0, 3).map(entry => (
                <div key={entry.id} className="p-3.5 rounded-xl bg-vybe-surface border border-vybe-border flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-100 block">{entry.artistName}</span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {entry.stageName} • {entry.startTime} - {entry.endTime}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-vybe-violet/20 text-vybe-violet-glow border border-vybe-violet/30 font-bold">
                    {entry.day}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-vybe-surface border border-vybe-border text-center space-y-2">
              <p className="text-xs text-slate-400">
                Your personal timeline is currently empty. Head over to any festival to schedule your favorite acts and detect stage time clashes.
              </p>
              <Link to="/schedule" className="text-xs font-bold text-vybe-lime hover:underline block pt-1">
                Open Schedule Builder →
              </Link>
            </div>
          )}
        </div>

        {/* Quests & Achievements Level */}
        <div className="p-6 rounded-3xl glass-panel border border-vybe-border space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-vybe-lime" />
              <h3 className="font-display font-bold text-xl text-slate-100">Festival Quests</h3>
            </div>
            <Link to="/quests" className="text-xs font-bold text-vybe-lime hover:underline">
              All Quests →
            </Link>
          </div>

          <div className="p-4 rounded-2xl bg-vybe-surface border border-vybe-border space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300">Level {userLevel} Pathfinder</span>
              <span className="font-mono text-vybe-lime font-bold">{totalXP} Total XP</span>
            </div>

            {/* Level Progress Bar */}
            <div className="w-full bg-vybe-dark h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-vybe-lime to-vybe-cyan rounded-full transition-all duration-500"
                style={{ width: `${levelProgressPercent}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-500 block text-right">
              {300 - xpInCurrentLevel} XP until Level {userLevel + 1}
            </span>

            {/* Recent Completed Quests */}
            <div className="space-y-1.5 pt-1">
              {quests.slice(0, 3).map(q => (
                <div key={q.id} className="flex items-center justify-between text-xs">
                  <span className={`truncate max-w-[70%] ${q.completed ? 'text-slate-300 line-through' : 'text-slate-400'}`}>
                    {q.title}
                  </span>
                  <span className={`text-[10px] font-mono font-bold ${q.completed ? 'text-vybe-lime' : 'text-slate-500'}`}>
                    +{q.xpPoints || 100} XP
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* 7. RECENT MEMORY SCRAPBOOK HIGHLIGHTS */}
      {memories.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-vybe-cyan" />
              <h2 className="font-display font-extrabold text-2xl text-slate-100">
                Recent Memories ({memories.length})
              </h2>
            </div>
            <Link to="/memories" className="text-xs font-bold text-vybe-cyan hover:underline">
              View Memory Capsule Scrapbook →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {memories.slice(0, 3).map(mem => (
              <div key={mem.id} className="p-4 rounded-2xl glass-card border border-vybe-border space-y-3">
                {mem.photos && mem.photos.length > 0 && (
                  <img
                    src={mem.photos[0]}
                    alt={mem.eventName}
                    className="w-full h-36 rounded-xl object-cover"
                  />
                )}
                <div>
                  <span className="font-display font-bold text-sm text-slate-100 block">{mem.eventName}</span>
                  <span className="text-[11px] text-slate-400 font-mono">{mem.eventDate} • {mem.venue}</span>
                </div>
                <p className="text-xs text-slate-300 italic line-clamp-2">
                  "{mem.favoriteMoment}"
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
