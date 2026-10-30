import React, { useState } from 'react';
import type { Artist } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Heart, Music, CheckSquare, Square, Disc, MapPin, Calendar, ExternalLink } from 'lucide-react';

interface ArtistDetailModalProps {
  artist: Artist;
  onClose: () => void;
}

export const ArtistDetailModal: React.FC<ArtistDetailModalProps> = ({ artist, onClose }) => {
  const { 
    favoriteArtistIds, 
    toggleFavoriteArtist, 
    allEvents, 
    setActiveEventModal, 
    showToast 
  } = useApp();

  const isFavorite = favoriteArtistIds.includes(artist.id);
  const [listenedTrackIds, setListenedTrackIds] = useState<string[]>([]);

  const toggleTrackListened = (trackId: string, trackTitle: string) => {
    const updated = listenedTrackIds.includes(trackId)
      ? listenedTrackIds.filter(id => id !== trackId)
      : [...listenedTrackIds, trackId];
    setListenedTrackIds(updated);
    if (!listenedTrackIds.includes(trackId)) {
      showToast(`Checked off "${trackTitle}" for your festival prep!`);
    }
  };

  const upcomingEvents = allEvents.filter(e => artist.upcomingEventIds.includes(e.id) || e.artists.some(a => a.toLowerCase().includes(artist.name.toLowerCase())));

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-3xl max-h-[90vh] rounded-3xl glass-panel border border-vybe-border shadow-2xl flex flex-col overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header & Artist Banner */}
        <div className="relative h-56 sm:h-64 w-full flex-shrink-0">
          <img 
            src={artist.image} 
            alt={artist.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-vybe-card via-black/40 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Artist details on banner */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-vybe-lime text-black font-bold">
                  ARTIST SPOTLIGHT
                </span>
                <span className="text-xs text-slate-300 font-mono flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-vybe-violet-glow" />
                  {artist.origin}
                </span>
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                {artist.name}
              </h2>
            </div>

            <button
              onClick={() => toggleFavoriteArtist(artist.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all ${
                isFavorite 
                  ? 'bg-rose-500 text-white border-rose-500 shadow-lg' 
                  : 'bg-black/60 text-slate-200 border-white/20 hover:bg-white/20'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
              <span>{isFavorite ? 'Favorited' : 'Follow Artist'}</span>
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar space-y-6 flex-grow">
          
          {/* Biography */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Biography</h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {artist.bio}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {artist.genres.map(g => (
                <span key={g} className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-vybe-surface border border-vybe-border text-slate-300">
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Festival Prep Checklist */}
          <div className="p-4 rounded-2xl bg-vybe-surface border border-vybe-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Disc className="w-4 h-4 text-vybe-lime" />
                <h4 className="font-display font-bold text-slate-100 text-sm">Get Festival Ready: Prep Checklist</h4>
              </div>
              <span className="text-[11px] font-mono text-vybe-lime font-bold">
                {listenedTrackIds.length} / {artist.festivalPrepChecklist.length} Listened
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Essential tracks to know before you hear them live in the crowd:
            </p>

            <div className="space-y-2">
              {artist.festivalPrepChecklist.map(prep => {
                const isListened = listenedTrackIds.includes(prep.id);
                return (
                  <div 
                    key={prep.id}
                    onClick={() => toggleTrackListened(prep.id, prep.songTitle)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isListened ? 'bg-vybe-lime/10 border-vybe-lime/40' : 'bg-vybe-card border-vybe-border hover:border-slate-600'
                    }`}
                  >
                    <button className="mt-0.5 text-vybe-lime">
                      {isListened ? <CheckSquare className="w-4 h-4 text-vybe-lime" /> : <Square className="w-4 h-4 text-slate-500" />}
                    </button>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isListened ? 'text-vybe-lime line-through' : 'text-slate-200'}`}>
                          {prep.songTitle}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-vybe-dark text-slate-400">
                          {prep.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{prep.whyListen}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Setlist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Recent Setlist</h4>
                <p className="text-[11px] text-slate-400">
                  {artist.recentSetlist.tourName} • {artist.recentSetlist.lastCity}
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-vybe-card text-slate-400 border border-vybe-border">
                {artist.recentSetlist.sourceType} {artist.recentSetlist.isConfirmed ? '(Verified)' : '(Community Unconfirmed)'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {artist.recentSetlist.songs.map((song, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-vybe-surface border border-vybe-border/70 flex items-center gap-2.5 text-xs text-slate-300">
                  <span className="font-mono text-[10px] text-slate-500 w-4">{i + 1}.</span>
                  <Music className="w-3 h-3 text-vybe-violet-glow" />
                  <span className="font-medium truncate">{song}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Live Performances */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Upcoming Tour Dates & Festivals</h4>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-2">
                {upcomingEvents.map(ev => (
                  <div 
                    key={ev.id}
                    onClick={() => {
                      onClose();
                      setActiveEventModal(ev);
                    }}
                    className="p-3 rounded-xl bg-vybe-card border border-vybe-border hover:border-vybe-lime cursor-pointer flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <span className="font-bold text-xs text-slate-100 group-hover:text-vybe-lime transition-colors block">
                        {ev.title}
                      </span>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-vybe-violet-glow" />
                        {ev.venueName}, {ev.city}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono text-slate-300">
                        {new Date(ev.startDate).toLocaleDateString()}
                      </span>
                      <span className="text-xs font-bold text-vybe-lime flex items-center">
                        View Show →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No tour dates in current discovery catalog. Follow artist to get alerts.</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
