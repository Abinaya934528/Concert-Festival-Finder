import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Heart, 
  Disc, 
  Music, 
  MapPin, 
  Calendar, 
  Sparkles, 
  CheckSquare, 
  Square, 
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

export const ArtistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    allArtists, 
    allEvents, 
    favoriteArtistIds, 
    toggleFavoriteArtist, 
    vibeProfile, 
    showToast 
  } = useApp();

  const [listenedTrackIds, setListenedTrackIds] = useState<string[]>([]);

  const artist = allArtists.find(a => a.id === id);

  if (!artist) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-vybe-surface flex items-center justify-center mx-auto text-slate-400">
          <AlertCircle className="w-8 h-8 text-amber-400" />
        </div>
        <h1 className="font-display font-extrabold text-3xl text-slate-100">Artist Not Found</h1>
        <p className="text-xs text-slate-400">
          The artist ID "{id}" could not be located in our catalog.
        </p>
        <Link
          to="/artists"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-vybe-lime text-black font-extrabold text-xs hover:bg-vybe-lime-hover shadow-glow-lime"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Artist Explorer</span>
        </Link>
      </div>
    );
  }

  const isFavorite = favoriteArtistIds.includes(artist.id);

  // Vibe compatibility calculation
  const sharedGenres = vibeProfile ? artist.genres.filter(g => vibeProfile.genres.includes(g)) : [];
  const compatibilityScore = Math.min(99, Math.max(40, sharedGenres.length * 25 + (isFavorite ? 20 : 0) + 30));

  const toggleTrackListened = (trackId: string, trackTitle: string) => {
    const updated = listenedTrackIds.includes(trackId)
      ? listenedTrackIds.filter(tid => tid !== trackId)
      : [...listenedTrackIds, trackId];
    setListenedTrackIds(updated);
    if (!listenedTrackIds.includes(trackId)) {
      showToast(`Checked off "${trackTitle}" for your festival prep!`);
    }
  };

  const upcomingEvents = allEvents.filter(e => 
    artist.upcomingEventIds.includes(e.id) || 
    e.artists.some(a => a.toLowerCase().includes(artist.name.toLowerCase()))
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          onClick={() => toggleFavoriteArtist(artist.id)}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
            isFavorite 
              ? 'bg-rose-500 text-white border-rose-500 shadow-lg' 
              : 'bg-vybe-surface text-slate-200 border-vybe-border hover:border-slate-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          <span>{isFavorite ? 'Following Artist' : 'Follow Artist'}</span>
        </button>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-vybe-border min-h-[300px] sm:min-h-[380px] flex flex-col justify-end p-6 sm:p-10">
        <img 
          src={artist.image} 
          alt={artist.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-vybe-dark via-vybe-dark/65 to-black/30" />

        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-vybe-lime text-black font-extrabold uppercase">
              Artist Profile
            </span>
            <span className="text-xs font-mono text-slate-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-vybe-violet-glow" />
              {artist.origin}
            </span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            {artist.name}
          </h1>

          <div className="flex flex-wrap gap-2 pt-1">
            {artist.genres.map(g => (
              <span key={g} className="px-3 py-1 rounded-lg bg-black/60 border border-white/20 text-xs font-mono text-vybe-lime">
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Biography, Top Tracks & Setlist */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Biography */}
          <div className="p-6 rounded-2xl glass-panel border border-vybe-border space-y-3">
            <h3 className="font-display font-bold text-lg text-slate-100">Biography</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {artist.bio}
            </p>
          </div>

          {/* Popular Songs */}
          <div className="p-6 rounded-2xl glass-panel border border-vybe-border space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-100 flex items-center gap-2">
              <Music className="w-4 h-4 text-vybe-lime" />
              <span>Popular Tracks</span>
            </h3>

            <div className="space-y-2">
              {artist.topTracks.map((trk, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-vybe-surface border border-vybe-border flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-500 w-4">0{i + 1}</span>
                    <span className="font-bold text-slate-200">{trk.title}</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
                    <span>{trk.playCount} plays</span>
                    <span>{trk.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Festival Prep Song Checklist */}
          {artist.festivalPrepChecklist && artist.festivalPrepChecklist.length > 0 && (
            <div className="p-6 rounded-2xl glass-panel border border-vybe-violet/30 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-100 flex items-center gap-2">
                    <Disc className="w-4 h-4 text-vybe-violet-glow" />
                    <span>Festival Prep Song Checklist</span>
                  </h3>
                  <p className="text-xs text-slate-400">Essential crowd anthems to learn before singing along live</p>
                </div>
                <span className="text-xs font-mono text-vybe-violet-glow font-bold">
                  {listenedTrackIds.length} / {artist.festivalPrepChecklist.length} Ready
                </span>
              </div>

              <div className="space-y-2.5">
                {artist.festivalPrepChecklist.map(song => {
                  const isChecked = listenedTrackIds.includes(song.id);
                  return (
                    <div
                      key={song.id}
                      onClick={() => toggleTrackListened(song.id, song.songTitle)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isChecked 
                          ? 'bg-vybe-violet/15 border-vybe-violet-glow/60' 
                          : 'bg-vybe-surface border-vybe-border hover:border-slate-500'
                      }`}
                    >
                      <button type="button" className="mt-0.5 text-vybe-violet-glow">
                        {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-500" />}
                      </button>

                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${isChecked ? 'text-vybe-violet-glow line-through' : 'text-slate-200'}`}>
                            {song.songTitle}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-vybe-card text-slate-300">
                            {song.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {song.whyListen}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Historical Setlist */}
          {artist.recentSetlist && (
            <div className="p-6 rounded-2xl glass-panel border border-vybe-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-base text-slate-100">
                  Historical Setlist ({artist.recentSetlist.tourName})
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-amber-400 border border-amber-400/20 font-bold">
                  Historical Data — Not Guaranteed Live Set
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Last recorded performance: {artist.recentSetlist.lastCity} ({artist.recentSetlist.sourceType})
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {artist.recentSetlist.songs.map((s, i) => (
                  <div key={i} className="p-2 rounded-lg bg-vybe-surface text-xs text-slate-300 font-mono">
                    {i + 1}. {s}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Upcoming Events & Vibe Match */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Vibe Compatibility Card */}
          <div className="p-6 rounded-3xl glass-panel border border-vybe-lime/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-bold text-slate-400">Music Compatibility</span>
              <Sparkles className="w-4 h-4 text-vybe-lime" />
            </div>

            <div className="font-mono font-black text-3xl text-vybe-lime">
              {compatibilityScore}% Fit
            </div>

            <p className="text-xs text-slate-300">
              {sharedGenres.length > 0 
                ? `Shares your top sound vectors: ${sharedGenres.join(', ')}.`
                : 'Broadens your sonic horizons into new curated territories.'}
            </p>
          </div>

          {/* Upcoming Events for This Artist */}
          <div className="p-6 rounded-3xl glass-panel border border-vybe-border space-y-4">
            <h3 className="font-display font-bold text-base text-slate-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-vybe-cyan" />
              <span>Upcoming Demo Events ({upcomingEvents.length})</span>
            </h3>

            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map(ev => (
                  <Link
                    key={ev.id}
                    to={`/event/${ev.id}`}
                    className="p-3.5 rounded-xl bg-vybe-surface border border-vybe-border hover:border-vybe-cyan transition-all block group"
                  >
                    <span className="font-bold text-xs text-slate-100 group-hover:text-vybe-cyan transition-colors block">
                      {ev.title}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                      {ev.venueName}, {ev.city}
                    </span>
                    <span className="text-[10px] text-vybe-lime font-mono mt-1 block">
                      From ₹{ev.ticketPriceMin.toLocaleString()} • View Event →
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                No currently scheduled appearances in this demo cycle. Follow artist to receive future tour alerts.
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
