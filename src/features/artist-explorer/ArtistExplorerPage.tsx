import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import type { Artist, MusicGenre } from '../../types';
import { 
  Disc, 
  Search, 
  Heart, 
  Music, 
  MapPin, 
  ChevronRight, 
  Sparkles,
  Calendar
} from 'lucide-react';

export const ArtistExplorerPage: React.FC = () => {
  const navigate = useNavigate();
  const { allArtists, favoriteArtistIds, toggleFavoriteArtist, allEvents } = useApp();
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');

  const genres = ['All', 'Electronic', 'Indie', 'Rock', 'Techno', 'Ambient', 'Hip-hop', 'Carnatic', 'Jazz'];

  const filteredArtists = allArtists.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(search.toLowerCase()) || 
                          artist.bio.toLowerCase().includes(search.toLowerCase()) ||
                          artist.origin.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || artist.genres.includes(selectedGenre as MusicGenre);
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vybe-violet/20 border border-vybe-violet/40 text-xs font-mono text-vybe-violet-glow mb-2">
            <Disc className="w-3.5 h-3.5" />
            <span>Setlist & Discography Explorer</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-100">
            Artist Explorer
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Explore performing artists, inspect recent tour setlists, and prepare with interactive festival prep song checklists.
          </p>
        </div>
      </div>

      {/* Search & Genre Cloud Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search artists by name, city, or bio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-vybe-card border border-vybe-border text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-vybe-lime transition-all"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="w-full py-3 px-3.5 rounded-xl bg-vybe-card border border-vybe-border text-xs text-slate-200 focus:outline-none focus:border-vybe-lime font-medium"
          >
            {genres.map(g => (
              <option key={g} value={g}>{g === 'All' ? 'All Genres' : g}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Artists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtists.map(artist => {
          const isFav = favoriteArtistIds.includes(artist.id);
          const upcomingShows = allEvents.filter(e => artist.upcomingEventIds.includes(e.id));

          return (
            <div
              key={artist.id}
              onClick={() => navigate(`/artist/${artist.id}`)}
              className="rounded-2xl glass-card border border-vybe-border overflow-hidden cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Artist Photo */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img 
                    src={artist.image} 
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-vybe-card via-black/20 to-transparent" />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavoriteArtist(artist.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all ${
                      isFav ? 'bg-rose-500 text-white border-rose-400' : 'bg-black/50 text-slate-300 border-white/20 hover:text-white'
                    }`}
                    title={isFav ? 'Unfavorite' : 'Follow artist'}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-current text-white' : ''}`} />
                  </button>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/60 text-slate-300 backdrop-blur-md border border-white/10 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-vybe-violet-glow" />
                      {artist.origin}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 space-y-3">
                  <h3 className="font-display font-bold text-lg text-slate-100 group-hover:text-vybe-lime transition-colors">
                    {artist.name}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {artist.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {artist.genres.map(g => (
                      <span key={g} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-vybe-surface border border-vybe-border text-slate-300">
                        {g}
                      </span>
                    ))}
                  </div>

                  {/* Prep Checklist Teaser */}
                  <div className="p-3 rounded-xl bg-vybe-surface border border-vybe-border/60 text-xs space-y-1">
                    <span className="text-[10px] font-mono uppercase text-vybe-lime font-bold block">
                      Festival Prep Playlist
                    </span>
                    <span className="text-slate-300 font-semibold block truncate">
                      Key Track: {artist.festivalPrepChecklist[0]?.songTitle}
                    </span>
                    <span className="text-[11px] text-slate-400 italic block">
                      "{artist.festivalPrepChecklist[0]?.whyListen}"
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5 pt-3 border-t border-vybe-border flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">
                  {upcomingShows.length} upcoming {upcomingShows.length === 1 ? 'gig' : 'gigs'}
                </span>
                <span className="text-vybe-lime font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>View Setlist</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
