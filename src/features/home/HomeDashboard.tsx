import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { EventCard } from '../../components/events/EventCard';
import { EDITORIAL_COLLECTIONS } from '../../data/mockEvents';
import { calculateVibeMatch } from '../../services/vibeMatcher';
import { 
  Sparkles, 
  ArrowRight, 
  Search, 
  Calendar, 
  MapPin, 
  Flame, 
  Clock, 
  Music, 
  ShieldCheck, 
  Users, 
  ChevronRight, 
  TrendingUp, 
  Volume2,
  Radio,
  Disc,
  HeartHandshake,
  CheckCircle2,
  Layers,
  Award
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const { 
    allEvents, 
    allArtists, 
    selectedCity, 
    vibeProfile, 
    setCollectionFilter,
    setActiveArtistModal,
    recentlyViewedIds 
  } = useApp();

  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');
  const [selectedTimelineFilter, setSelectedTimelineFilter] = useState<'All' | 'This Month' | 'Next Month'>('All');

  // Filter events based on selected city (if not "All Cities")
  const cityFiltered = selectedCity === 'All Cities' 
    ? allEvents 
    : allEvents.filter(e => e.city.toLowerCase() === selectedCity.toLowerCase());

  // Featured festival spotlight
  const featuredEvent = cityFiltered.find(e => e.featured) || allEvents[0];

  // Trending experiences
  const trendingEvents = cityFiltered.slice(0, 3);

  // Personalized event recommendations with Vibe Match Scores
  const personalizedEvents = [...cityFiltered]
    .map(event => ({
      event,
      match: calculateVibeMatch(event, vibeProfile)
    }))
    .sort((a, b) => b.match.score - a.match.score)
    .slice(0, 3);

  // Timeline events
  const timelineEvents = cityFiltered.slice(0, 4);

  // Recently viewed
  const recentlyViewedEvents = allEvents.filter(e => recentlyViewedIds.includes(e.id));

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/discover?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/discover');
    }
  };

  const handleCollectionClick = (tag: string) => {
    setCollectionFilter(tag);
    navigate('/discover');
  };

  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. FULL-SCREEN IMMERSIVE HERO SECTION */}
      <section className="relative min-h-[82vh] flex items-center justify-center overflow-hidden rounded-3xl border border-vybe-border bg-gradient-to-b from-[#0b0d14] via-[#0f121d] to-[#0b0d14] p-6 sm:p-12 lg:p-16">
        
        {/* Animated Background Music-Inspired Visuals */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Glowing Ambient Light Orbs */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-vybe-lime/15 blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-vybe-violet/20 blur-[140px]" />
          <div className="absolute top-1/2 right-1/3 w-80 h-80 rounded-full bg-vybe-cyan/15 blur-[100px]" />

          {/* Soundwave Grid Equalizer Bars Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-40 flex items-end justify-between px-4 sm:px-12 opacity-25">
            {[35, 60, 45, 90, 75, 40, 85, 95, 70, 50, 80, 100, 65, 45, 90, 80, 55, 95, 40, 70, 85, 60, 90, 75, 40, 65, 80, 100, 50, 70].map((h, i) => (
              <div
                key={i}
                className="w-1.5 sm:w-2 bg-gradient-to-t from-vybe-lime via-vybe-cyan to-vybe-violet-glow rounded-t-full transition-all duration-700"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>

          {/* Concentric Audio Wave Rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/5 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full border border-white/5 pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl text-center space-y-8">
          
          {/* Eyebrow tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-vybe-surface/80 border border-vybe-lime/30 text-xs font-mono text-vybe-lime backdrop-blur-md shadow-glow-lime/20">
            <span className="w-2 h-2 rounded-full bg-vybe-lime animate-ping" />
            <span>Next-Gen Live Music Discovery</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">City: {selectedCity}</span>
          </div>

          {/* 2. BOLD HEADLINE */}
          <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.05]">
            YOUR NEXT UNFORGETTABLE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-vybe-lime via-vybe-cyan to-vybe-violet-glow">
              NIGHT STARTS HERE.
            </span>
          </h1>

          {/* Tagline & Subhead */}
          <p className="text-base sm:text-xl text-slate-300 font-sans max-w-2xl mx-auto leading-relaxed">
            Find Your People. Feel The Music. Make The Moment. Decode your Vibe DNA, rally your squad, and lock in festival core memories.
          </p>

          {/* 4. SEARCH BAR FOR ARTIST, CITY, EVENT, OR GENRE */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto pt-2">
            <div className="relative flex items-center shadow-2xl">
              <Search className="absolute left-4 sm:left-5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by artist, city, event, or genre (e.g. Bonobo, Bengaluru, Techno)..."
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                className="w-full pl-12 sm:pl-14 pr-32 sm:pr-36 py-4 sm:py-5 rounded-2xl bg-vybe-card/95 backdrop-blur-xl border border-vybe-border text-sm sm:text-base text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-vybe-lime focus:shadow-glow-lime transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-vybe-lime text-black font-extrabold text-xs sm:text-sm hover:bg-vybe-lime-hover shadow-glow-lime transition-all"
              >
                Discover
              </button>
            </div>
          </form>

          {/* Quick CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/vibe-dna"
              className="px-6 py-3.5 rounded-2xl bg-vybe-lime text-black font-black text-sm hover:bg-vybe-lime-hover shadow-glow-lime flex items-center gap-2 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>Unlock My Vibe DNA</span>
            </Link>

            <Link
              to="/discover"
              className="px-6 py-3.5 rounded-2xl bg-vybe-card border border-vybe-border text-slate-200 font-bold text-sm hover:border-vybe-cyan hover:text-white transition-all flex items-center gap-2"
            >
              <span>Explore All Experiences</span>
              <ArrowRight className="w-4 h-4 text-vybe-cyan" />
            </Link>
          </div>

          {/* Transparent demo data & personality notice */}
          <div className="pt-4 flex items-center justify-center gap-3 text-xs text-slate-400">
            <span className="text-lg">{vibeProfile?.discoveryPersonality.badgeEmoji || '✨'}</span>
            <span>
              Curated for <strong className="text-slate-200">{vibeProfile?.discoveryPersonality.title || 'Music Lover'}</strong> • Transparent algorithmic match engine
            </span>
          </div>

        </div>
      </section>

      {/* 5. TRENDING EXPERIENCES */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-vybe-lime" />
              <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-100">
                Trending Experiences
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              High-velocity ticket momentum and most-talked-about gigs in {selectedCity}
            </p>
          </div>

          <Link
            to="/discover"
            className="text-xs font-bold text-vybe-lime hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Trending</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trendingEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* 6. PERSONALIZED EVENT RECOMMENDATIONS */}
      <section className="p-6 sm:p-10 rounded-3xl glass-panel border border-vybe-lime/30 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-vybe-lime/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-vybe-lime animate-pulse" />
              <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-100">
                Personalized For Your Vibe
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Matched against your favorite genres, atmosphere, and energy vectors
            </p>
          </div>

          <Link
            to="/vibe-dna"
            className="px-4 py-2 rounded-xl bg-vybe-surface border border-vybe-border text-xs font-bold text-slate-200 hover:border-vybe-lime hover:text-white transition-all self-start sm:self-auto flex items-center gap-1.5"
          >
            <span>Customize Taste Profile</span>
            <ChevronRight className="w-3.5 h-3.5 text-vybe-lime" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {personalizedEvents.map(({ event, match }) => (
            <div key={event.id} className="space-y-2">
              <EventCard event={event} />
              <div className="p-2.5 rounded-xl bg-vybe-surface border border-vybe-border text-xs flex items-center justify-between">
                <span className="text-slate-300 truncate max-w-[70%]">{match.summary}</span>
                <span className="font-mono font-black text-vybe-lime whitespace-nowrap">
                  {match.score}% Match
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FEATURED FESTIVAL SPOTLIGHT */}
      {featuredEvent && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-vybe-cyan" />
              <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-100">
                Featured Festival Spotlight
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">Curator Selection</span>
          </div>

          <EventCard event={featuredEvent} featured={true} />
        </section>
      )}

      {/* 8. UPCOMING EVENTS TIMELINE */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-vybe-violet-glow" />
              <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-100">
                Upcoming Events Timeline
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Chronological tour stops and multi-day gatherings
            </p>
          </div>

          <div className="flex gap-2">
            {(['All', 'This Month', 'Next Month'] as const).map(f => (
              <button
                key={f}
                onClick={() => setSelectedTimelineFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                  selectedTimelineFilter === f 
                    ? 'bg-vybe-violet-glow text-black font-bold' 
                    : 'bg-vybe-surface border border-vybe-border text-slate-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {timelineEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* 9. GENRE EXPLORATION */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-100">
              Genre Subcultures
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Dive into curated soundscapes from underground warehouse techno to acoustic storytelling
            </p>
          </div>
          <Link to="/discover" className="text-xs font-bold text-vybe-lime hover:underline flex items-center gap-1">
            <span>All Genres</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {EDITORIAL_COLLECTIONS.map(col => (
            <div
              key={col.id}
              onClick={() => handleCollectionClick(col.tag)}
              className="p-5 rounded-2xl glass-card border border-vybe-border cursor-pointer hover:border-vybe-lime/60 transition-all flex flex-col justify-between h-36 group"
            >
              <div>
                <span className="font-display font-bold text-base text-slate-100 group-hover:text-vybe-lime transition-colors block">
                  {col.title}
                </span>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {col.subtitle}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 group-hover:text-vybe-lime pt-2 border-t border-vybe-border/40">
                <span>Explore Vibe</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. HOW VYBE WORKS — 3-STEP JOURNEY */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-vybe-card via-vybe-surface to-vybe-card border border-vybe-border space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vybe-cyan/15 text-vybe-cyan text-xs font-mono">
            <Radio className="w-3.5 h-3.5" />
            <span>The VYBE Ecosystem</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-100">
            How VYBE Powers Your Music Life
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            From discovering underground acts to planning group budgets and reliving unforgettable moments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-vybe-surface border border-vybe-border space-y-4 relative group hover:border-vybe-lime transition-all">
            <div className="w-12 h-12 rounded-xl bg-vybe-lime/20 border border-vybe-lime/40 flex items-center justify-center text-vybe-lime font-mono font-black text-lg">
              01
            </div>
            <h3 className="font-display font-bold text-lg text-slate-100">Decode Your Vibe DNA</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Answer 8 interactive questions regarding sound vectors, venue atmospheres, and travel comfort to unlock your distinctive music archetype.
            </p>
            <Link to="/vibe-dna" className="inline-flex items-center gap-1 text-xs font-bold text-vybe-lime hover:underline">
              <span>Start Vibe Quiz</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-vybe-surface border border-vybe-border space-y-4 relative group hover:border-vybe-cyan transition-all">
            <div className="w-12 h-12 rounded-xl bg-vybe-cyan/20 border border-vybe-cyan/40 flex items-center justify-center text-vybe-cyan font-mono font-black text-lg">
              02
            </div>
            <h3 className="font-display font-bold text-lg text-slate-100">Squad-Sync & Budget</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Invite friends, compare music tastes, vote on dates, and calculate total night-out costs with tickets, rides, food, and drinks factored in.
            </p>
            <Link to="/squads" className="inline-flex items-center gap-1 text-xs font-bold text-vybe-cyan hover:underline">
              <span>Launch Squad Sync</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-vybe-surface border border-vybe-border space-y-4 relative group hover:border-vybe-violet-glow transition-all">
            <div className="w-12 h-12 rounded-xl bg-vybe-violet/20 border border-vybe-violet/40 flex items-center justify-center text-vybe-violet-glow font-mono font-black text-lg">
              03
            </div>
            <h3 className="font-display font-bold text-lg text-slate-100">Schedule & Capsule</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detect stage overlap conflicts with real-time clash warnings, then immortalize attended shows in your personal digital concert scrapbook.
            </p>
            <Link to="/schedule" className="inline-flex items-center gap-1 text-xs font-bold text-vybe-violet-glow hover:underline">
              <span>Build Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* 11. DEMO DATA DISCLOSURE STRIP */}
      <section className="p-4 rounded-2xl bg-vybe-card border border-vybe-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2 text-slate-300">
          <ShieldCheck className="w-4 h-4 text-vybe-lime flex-shrink-0" />
          <span>
            <strong>Transparency First:</strong> All events, ticket tiers, and crowd density indicators on VYBE are curated demonstration data. We never fabricate unverified live availability.
          </span>
        </div>
        <Link to="/profile" className="text-vybe-lime font-bold hover:underline whitespace-nowrap">
          Preferences & Data Control →
        </Link>
      </section>

    </div>
  );
};
