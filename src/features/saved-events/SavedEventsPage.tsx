import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EventCard } from '../../components/events/EventCard';
import { 
  Heart, 
  Disc, 
  Clock, 
  Trash2, 
  Sparkles, 
  Calendar, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const SavedEventsPage: React.FC = () => {
  const { 
    savedEventIds, 
    allEvents, 
    favoriteArtistIds, 
    allArtists, 
    toggleFavoriteArtist, 
    recentlyViewedIds, 
    setActiveArtistModal,
    setCurrentPage 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'events' | 'artists' | 'history'>('events');

  const savedEvents = allEvents.filter(e => savedEventIds.includes(e.id));
  const favoriteArtists = allArtists.filter(a => favoriteArtistIds.includes(a.id));
  const recentlyViewed = allEvents.filter(e => recentlyViewedIds.includes(e.id));

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-xs font-mono text-rose-400 mb-2">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Personal Music Radar</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-100">
            Saved & Favorites
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Your curated wishlist of upcoming performances, tracked artists, and recently explored festival memories.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-vybe-border gap-2 pb-1">
        <button
          onClick={() => setActiveTab('events')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'events' ? 'bg-vybe-lime text-black font-extrabold shadow-glow-lime' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Saved Events ({savedEvents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('artists')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'artists' ? 'bg-vybe-lime text-black font-extrabold shadow-glow-lime' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Disc className="w-3.5 h-3.5" />
          <span>Followed Artists ({favoriteArtists.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'history' ? 'bg-vybe-lime text-black font-extrabold shadow-glow-lime' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Recently Viewed ({recentlyViewed.length})</span>
        </button>
      </div>

      {/* Tab: Saved Events */}
      {activeTab === 'events' && (
        <div>
          {savedEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-3xl glass-card border border-vybe-border text-center space-y-4 my-8">
              <div className="w-12 h-12 rounded-full bg-vybe-surface mx-auto flex items-center justify-center text-slate-500">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-200">Your Saved Radar Is Empty</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Click the heart icon on any concert or festival card to save it here for quick access and budget planning.
              </p>
              <button
                onClick={() => setCurrentPage('explore')}
                className="px-5 py-2.5 rounded-xl bg-vybe-lime text-black font-bold text-xs hover:bg-vybe-lime-hover shadow-glow-lime inline-flex items-center gap-1.5"
              >
                <span>Browse Experiences</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab: Followed Artists */}
      {activeTab === 'artists' && (
        <div>
          {favoriteArtists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteArtists.map(artist => (
                <div
                  key={artist.id}
                  onClick={() => setActiveArtistModal(artist)}
                  className="p-4 rounded-2xl glass-card border border-vybe-border flex items-center justify-between cursor-pointer hover:border-vybe-lime/40 group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={artist.image} 
                      alt={artist.name} 
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <span className="font-bold text-sm text-slate-100 group-hover:text-vybe-lime transition-colors block">
                        {artist.name}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {artist.origin}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavoriteArtist(artist.id);
                    }}
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-vybe-surface"
                    title="Unfollow artist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-3xl glass-card border border-vybe-border text-center space-y-4 my-8">
              <Disc className="w-8 h-8 text-slate-500 mx-auto" />
              <h3 className="font-display font-bold text-lg text-slate-200">No Artists Followed</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Follow your favorite musicians in Artist Explorer to receive setlist alerts and tour updates.
              </p>
              <button
                onClick={() => setCurrentPage('artist-explorer')}
                className="px-5 py-2.5 rounded-xl bg-vybe-lime text-black font-bold text-xs"
              >
                Explore Artists
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab: Browsing History */}
      {activeTab === 'history' && (
        <div>
          {recentlyViewed.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentlyViewed.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 text-xs">
              No recent events viewed in this browser session.
            </div>
          )}
        </div>
      )}

    </div>
  );
};
