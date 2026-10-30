import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { EventCard } from '../../components/events/EventCard';
import type { MusicGenre, EventType } from '../../types';
import { CITIES_LIST } from '../../data/mockEvents';
import { calculateVibeMatch } from '../../services/vibeMatcher';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  Sparkles, 
  RotateCcw,
  ShieldCheck,
  Check
} from 'lucide-react';

const GENRES: MusicGenre[] = [
  'Electronic', 'Indie', 'Rock', 'Techno', 'House', 'EDM', 
  'Hip-hop', 'Jazz', 'Classical', 'Carnatic', 'Folk', 'Ambient', 'Tamil Music', 'Pop'
];

const EVENT_TYPES: EventType[] = [
  'Music Festival', 'Concert', 'Club Gig', 'Warehouse Rave', 'Acoustic Session', 'Cultural Festival', 'Multi-day Campout'
];

export const ExploreEvents: React.FC = () => {
  const { 
    allEvents, 
    vibeProfile, 
    selectedCity, 
    setSelectedCity,
    collectionFilter,
    setCollectionFilter,
    budgetFilterLimit,
    setBudgetFilterLimit
  } = useApp();

  const [searchParams] = useSearchParams();

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const urlQuery = searchParams.get('search');
    if (urlQuery !== null) {
      setSearchQuery(urlQuery);
    }
  }, [searchParams]);
  const [selectedGenres, setSelectedGenres] = useState<MusicGenre[]>([]);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [settingFilter, setSettingFilter] = useState<'All' | 'Outdoor' | 'Indoor'>('All');
  const [freeOnly, setFreeOnly] = useState(false);
  const [familyFriendlyOnly, setFamilyFriendlyOnly] = useState(false);
  const [accessibilityOnly, setAccessibilityOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'vibe' | 'date' | 'price-asc' | 'price-desc'>('vibe');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Synchronize budgetFilterLimit if passed
  const maxPriceFilter = budgetFilterLimit;

  // Filter and sort computation
  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      // 1. Text Search (title, description, venue, artists)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(q);
        const matchesDesc = event.description.toLowerCase().includes(q);
        const matchesVenue = event.venueName.toLowerCase().includes(q);
        const matchesCity = event.city.toLowerCase().includes(q);
        const matchesArtists = event.artists.some(a => a.toLowerCase().includes(q));
        const matchesGenres = event.genres.some(g => g.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesVenue && !matchesCity && !matchesArtists && !matchesGenres) {
          return false;
        }
      }

      // 2. City Filter
      if (selectedCity !== 'All Cities') {
        if (event.city.toLowerCase() !== selectedCity.toLowerCase()) return false;
      }

      // 3. Editorial Collection Filter (from Homepage)
      if (collectionFilter) {
        if (!event.collectionTags.includes(collectionFilter)) return false;
      }

      // 4. Budget Max Filter
      if (maxPriceFilter !== null && maxPriceFilter > 0) {
        if (event.ticketPriceMin > maxPriceFilter && !event.isFree) return false;
      }

      // 5. Free Only
      if (freeOnly && !event.isFree) return false;

      // 6. Genres Filter
      if (selectedGenres.length > 0) {
        const hasGenre = event.genres.some(g => selectedGenres.includes(g));
        if (!hasGenre) return false;
      }

      // 7. Event Type Filter
      if (selectedType !== 'All') {
        if (event.type !== selectedType) return false;
      }

      // 8. Setting (Indoor / Outdoor)
      if (settingFilter === 'Outdoor' && !event.isOutdoor) return false;
      if (settingFilter === 'Indoor' && event.isOutdoor) return false;

      // 9. Family Friendly
      if (familyFriendlyOnly && !event.isFamilyFriendly) return false;

      // 10. Accessibility
      if (accessibilityOnly && !event.accessibility.wheelchair) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'vibe') {
        const scoreA = calculateVibeMatch(a, vibeProfile).score;
        const scoreB = calculateVibeMatch(b, vibeProfile).score;
        return scoreB - scoreA;
      }
      if (sortBy === 'date') {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      }
      if (sortBy === 'price-asc') {
        return a.ticketPriceMin - b.ticketPriceMin;
      }
      if (sortBy === 'price-desc') {
        return b.ticketPriceMin - a.ticketPriceMin;
      }
      return 0;
    });
  }, [
    allEvents, 
    searchQuery, 
    selectedCity, 
    collectionFilter, 
    maxPriceFilter, 
    freeOnly, 
    selectedGenres, 
    selectedType, 
    settingFilter, 
    familyFriendlyOnly, 
    accessibilityOnly, 
    sortBy, 
    vibeProfile
  ]);

  const toggleGenre = (genre: MusicGenre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGenres([]);
    setSelectedType('All');
    setSettingFilter('All');
    setFreeOnly(false);
    setFamilyFriendlyOnly(false);
    setAccessibilityOnly(false);
    setSortBy('vibe');
    setCollectionFilter(null);
    setBudgetFilterLimit(null);
  };

  const hasActiveFilters = 
    searchQuery || 
    selectedGenres.length > 0 || 
    selectedType !== 'All' || 
    settingFilter !== 'All' || 
    freeOnly || 
    familyFriendlyOnly || 
    accessibilityOnly || 
    collectionFilter !== null ||
    budgetFilterLimit !== null;

  return (
    <div className="space-y-8">
      
      {/* Header & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-100">
              Explore Experiences
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Showing {filteredEvents.length} live gigs and festivals matching your criteria
            </p>
          </div>

          <button
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className="sm:hidden px-4 py-2 rounded-xl bg-vybe-card border border-vybe-border text-xs font-bold text-slate-200 flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4 text-vybe-lime" />
            <span>Filters & Sorting</span>
          </button>
        </div>

        {/* Search input with City Dropdown */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by event, artist, venue, or genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-xl bg-vybe-card border border-vybe-border text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-vybe-lime transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="sm:col-span-4 flex items-center gap-2">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-1/2 py-3 px-3 rounded-xl bg-vybe-card border border-vybe-border text-xs text-slate-200 focus:outline-none focus:border-vybe-lime font-medium"
            >
              {CITIES_LIST.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-1/2 py-3 px-3 rounded-xl bg-vybe-card border border-vybe-border text-xs text-slate-200 focus:outline-none focus:border-vybe-lime font-medium"
            >
              <option value="vibe">Vibe Match %</option>
              <option value="date">Date (Earliest)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Active Filter Tags Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="font-mono text-slate-400 text-[11px]">Active Filters:</span>
            
            {collectionFilter && (
              <span className="px-2.5 py-1 rounded-full bg-vybe-violet/20 border border-vybe-violet/40 text-vybe-violet-glow flex items-center gap-1 font-mono">
                Collection: {collectionFilter}
                <button onClick={() => setCollectionFilter(null)}><X className="w-3 h-3" /></button>
              </span>
            )}

            {budgetFilterLimit !== null && (
              <span className="px-2.5 py-1 rounded-full bg-vybe-lime/20 border border-vybe-lime/40 text-vybe-lime flex items-center gap-1 font-mono">
                Under ₹{budgetFilterLimit.toLocaleString()}
                <button onClick={() => setBudgetFilterLimit(null)}><X className="w-3 h-3" /></button>
              </span>
            )}

            {selectedType !== 'All' && (
              <span className="px-2.5 py-1 rounded-full bg-vybe-surface border border-vybe-border text-slate-200 flex items-center gap-1">
                Type: {selectedType}
                <button onClick={() => setSelectedType('All')}><X className="w-3 h-3" /></button>
              </span>
            )}

            {selectedGenres.map(g => (
              <span key={g} className="px-2.5 py-1 rounded-full bg-vybe-surface border border-vybe-border text-slate-200 flex items-center gap-1">
                {g}
                <button onClick={() => toggleGenre(g)}><X className="w-3 h-3" /></button>
              </span>
            ))}

            {freeOnly && (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                Free Only
                <button onClick={() => setFreeOnly(false)}><X className="w-3 h-3" /></button>
              </span>
            )}

            <button
              onClick={handleResetFilters}
              className="text-xs text-slate-400 hover:text-vybe-lime flex items-center gap-1 underline ml-2"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* Main Content Layout with Sidebar Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className={`lg:block ${showFilterDrawer ? 'block' : 'hidden'} space-y-6 lg:col-span-1`}>
          <div className="p-5 rounded-2xl glass-panel border border-vybe-border space-y-5">
            
            <div className="flex items-center justify-between border-b border-vybe-border pb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                Filter Parameters
              </span>
              {hasActiveFilters && (
                <button 
                  onClick={handleResetFilters}
                  className="text-[11px] text-vybe-lime hover:underline"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Event Type Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">Experience Format</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-vybe-surface border border-vybe-border text-xs text-slate-200 focus:outline-none focus:border-vybe-lime"
              >
                <option value="All">All Formats</option>
                {EVENT_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Setting Filter (Indoor / Outdoor) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">Environment</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['All', 'Outdoor', 'Indoor'] as const).map(setVal => (
                  <button
                    key={setVal}
                    onClick={() => setSettingFilter(setVal)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-colors ${
                      settingFilter === setVal 
                        ? 'bg-vybe-lime text-black font-bold border-vybe-lime' 
                        : 'bg-vybe-card border-vybe-border text-slate-400 hover:text-white'
                    }`}
                  >
                    {setVal}
                  </button>
                ))}
              </div>
            </div>

            {/* Music Genre Cloud */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">Genres & Sounds</label>
              <div className="flex flex-wrap gap-1.5">
                {GENRES.map(genre => {
                  const isSelected = selectedGenres.includes(genre);
                  return (
                    <button
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      className={`text-[11px] font-mono px-2.5 py-1 rounded-full border transition-all ${
                        isSelected 
                          ? 'bg-vybe-lime text-black border-vybe-lime font-bold shadow-glow-lime' 
                          : 'bg-vybe-card border-vybe-border text-slate-400 hover:text-slate-200 hover:border-slate-600'
                      }`}
                    >
                      {genre}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inclusivity & Extras Checkboxes */}
            <div className="space-y-2.5 pt-2 border-t border-vybe-border">
              <label className="text-xs font-bold text-slate-300 block">Preferences</label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={freeOnly}
                  onChange={(e) => setFreeOnly(e.target.checked)}
                  className="rounded border-vybe-border text-vybe-lime focus:ring-0"
                />
                <span>Free Entry Events</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={accessibilityOnly}
                  onChange={(e) => setAccessibilityOnly(e.target.checked)}
                  className="rounded border-vybe-border text-vybe-lime focus:ring-0"
                />
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Wheelchair Access Verified
                </span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={familyFriendlyOnly}
                  onChange={(e) => setFamilyFriendlyOnly(e.target.checked)}
                  className="rounded border-vybe-border text-vybe-lime focus:ring-0"
                />
                <span>All Ages / Family Welcome</span>
              </label>
            </div>

          </div>
        </aside>

        {/* Results Grid */}
        <main className="lg:col-span-3 space-y-6">
          
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-3xl glass-card border border-vybe-border text-center space-y-4 my-8">
              <div className="w-14 h-14 rounded-full bg-vybe-surface border border-vybe-border mx-auto flex items-center justify-center text-slate-400">
                <Search className="w-6 h-6 text-vybe-violet-glow" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-200">No Experiences Found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No events currently match all applied filters in {selectedCity}. Try expanding your search terms, clearing selected genres, or resetting your filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-vybe-lime text-black font-extrabold text-xs hover:bg-vybe-lime-hover shadow-glow-lime inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};
