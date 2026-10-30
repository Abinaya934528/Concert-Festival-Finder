import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { EventItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { calculateVibeMatch } from '../../services/vibeMatcher';
import { formatCurrency } from '../../services/budgetCalculator';
import { Calendar, MapPin, Heart, Sparkles, ShieldCheck, ArrowUpRight, Zap, Info } from 'lucide-react';

interface EventCardProps {
  event: EventItem;
  featured?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, featured = false }) => {
  const navigate = useNavigate();
  const { 
    vibeProfile, 
    savedEventIds, 
    toggleSavedEvent, 
    currency,
    recordViewedEvent 
  } = useApp();

  const [showMatchModal, setShowMatchModal] = useState(false);

  const match = calculateVibeMatch(event, vibeProfile);
  const isSaved = savedEventIds.includes(event.id);

  // Format date nicely
  const eventDate = new Date(event.startDate);
  const dateFormatted = eventDate.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
  const timeFormatted = eventDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  });

  const handleCardClick = () => {
    recordViewedEvent(event.id);
    navigate(`/event/${event.id}`);
  };

  return (
    <>
      <article 
        className={`group relative rounded-2xl overflow-hidden glass-card cursor-pointer flex flex-col justify-between ${
          featured ? 'md:grid md:grid-cols-12 md:gap-6 bg-gradient-to-r from-vybe-surface via-vybe-card to-vybe-surface' : ''
        }`}
        onClick={handleCardClick}
      >
        {/* Cover Image & Overlays */}
        <div className={`relative overflow-hidden ${featured ? 'md:col-span-7 h-72 md:h-full' : 'h-52 w-full'}`}>
          <img 
            src={event.coverImage} 
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />

          {/* Gradient shadow for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-vybe-dark via-vybe-dark/30 to-transparent" />

          {/* Top Floating Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            {/* Vibe Match Badge */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowMatchModal(true);
              }}
              title="Click to view match explanation"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold tracking-tight shadow-glass backdrop-blur-md border transition-transform hover:scale-105 ${
                match.score >= 85 
                  ? 'bg-vybe-lime text-black border-vybe-lime shadow-glow-lime' 
                  : match.score >= 70
                    ? 'bg-vybe-violet/90 text-white border-vybe-violet-glow'
                    : 'bg-vybe-surface/90 text-slate-200 border-white/20'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{match.score}% MATCH</span>
              <Info className="w-3 h-3 opacity-70" />
            </button>

            {/* Save / Wishlist Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleSavedEvent(event.id);
              }}
              className={`p-2 rounded-full backdrop-blur-md border transition-all ${
                isSaved 
                  ? 'bg-rose-500/90 text-white border-rose-400 shadow-lg scale-110' 
                  : 'bg-black/50 text-slate-300 border-white/20 hover:text-white hover:bg-black/80'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save to personal radar'}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current text-white' : ''}`} />
            </button>
          </div>

          {/* Bottom Floating Info Over Image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-vybe-lime font-semibold border border-vybe-lime/30">
              {event.type}
            </span>

            {event.dataSource === 'Verified Official' && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Verified
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className={`p-5 flex flex-col justify-between flex-grow ${featured ? 'md:col-span-5 md:py-6 md:pr-6 md:pl-0' : ''}`}>
          
          <div className="space-y-2.5">
            {/* Date & Location */}
            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-vybe-lime" />
                {dateFormatted} • {timeFormatted}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-300 truncate">
                <MapPin className="w-3.5 h-3.5 text-vybe-violet-glow" />
                {event.city}
              </span>
            </div>

            {/* Title & Tagline */}
            <div>
              <h3 className="font-display font-bold text-lg text-slate-100 group-hover:text-vybe-lime transition-colors leading-snug line-clamp-2">
                {event.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {event.tagline || event.description}
              </p>
            </div>

            {/* Genre Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {event.genres.slice(0, 3).map(g => (
                <span 
                  key={g} 
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-vybe-surface border border-vybe-border text-slate-300"
                >
                  {g}
                </span>
              ))}
              {event.isOutdoor && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Open Air
                </span>
              )}
            </div>
          </div>

          {/* Pricing & CTA Footer */}
          <div className="mt-5 pt-3.5 border-t border-vybe-border flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">Admission</span>
              <span className="font-mono font-bold text-sm text-slate-100">
                {event.isFree ? (
                  <span className="text-emerald-400 font-bold">Free RSVP</span>
                ) : (
                  <>From {formatCurrency(event.ticketPriceMin, currency)}</>
                )}
              </span>
            </div>

            <button 
              type="button"
              className="flex items-center gap-1 text-xs font-bold text-vybe-lime group-hover:translate-x-1 transition-transform"
            >
              <span>Explore</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </article>

      {/* Match Breakdown Modal */}
      {showMatchModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setShowMatchModal(false)}
        >
          <div 
            className="w-full max-w-md rounded-2xl glass-panel p-6 border border-vybe-lime/40 shadow-glow-lime space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-vybe-border pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-vybe-lime text-black flex items-center justify-center font-bold">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-100">Vibe Match Analysis</h4>
                  <p className="text-xs text-slate-400">Transparent Compatibility Score</p>
                </div>
              </div>
              <span className="font-mono font-black text-2xl text-vybe-lime">{match.score}%</span>
            </div>

            <p className="text-xs text-slate-300 italic bg-vybe-card p-3 rounded-xl border border-vybe-border">
              "{match.summary}"
            </p>

            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Scoring Factors</span>
              {match.reasons.map((r, i) => (
                <div key={i} className="flex items-start justify-between p-2.5 rounded-lg bg-vybe-surface text-xs">
                  <div>
                    <span className="font-semibold text-slate-200">{r.label}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{r.description}</p>
                  </div>
                  <span className="font-mono font-bold text-vybe-lime ml-3">+{r.points}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowMatchModal(false)}
                className="px-4 py-2 rounded-xl bg-vybe-lime text-black font-bold text-xs hover:bg-vybe-lime-hover"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
