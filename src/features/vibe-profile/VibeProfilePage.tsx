import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import type { VibeProfile, MusicGenre, AtmosphereType, CrowdSize } from '../../types';
import { determineDiscoveryPersonality, calculateVibeMatch } from '../../services/vibeMatcher';
import { EventCard } from '../../components/events/EventCard';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Check, 
  RotateCcw, 
  Save, 
  Sliders, 
  Radio, 
  Flame, 
  ShieldCheck, 
  Coins, 
  Compass, 
  ArrowRight,
  Users,
  Building,
  HeartHandshake
} from 'lucide-react';

const ALL_GENRES: MusicGenre[] = [
  'Electronic', 'EDM', 'Techno', 'House', 'Indie', 'Rock', 'Pop',
  'Hip-hop', 'R&B', 'Jazz', 'Classical', 'Carnatic', 'Hindustani',
  'Tamil Music', 'Folk', 'Metal', 'Ambient', 'Psytrance', 'Bollywood', 'Punjabi'
];

const ALL_ATMOSPHERES: AtmosphereType[] = [
  'High-energy', 'Relaxed', 'Intimate', 'Experimental',
  'Family-friendly', 'Cultural', 'Outdoors', 'Party-focused'
];

const CROWD_SIZES: CrowdSize[] = [
  'Intimate (<500)',
  'Medium (500-3,000)',
  'Massive (3,000+)'
];

const ACCESSIBILITY_OPTIONS = [
  'Wheelchair Access',
  'Step-Free Venue',
  'Quiet Sensory Spaces',
  'Sign Language Interpreter',
  'Accessible Washrooms'
];

const POPULAR_ARTISTS_SUGGESTIONS = [
  'Bonobo', 'Prateek Kuhad', 'Four Tet', 'Floating Points', 'DIVINE', 
  'Peter Cat Recording Co.', 'Kavya Trehan', 'TM Krishna', 'Agam Live', 'When Chai Met Toast'
];

export const VibeProfilePage: React.FC = () => {
  const { vibeProfile, saveVibeProfile, allEvents, showToast } = useApp();
  const navigate = useNavigate();

  // Form state initialized from current profile
  const [selectedGenres, setSelectedGenres] = useState<MusicGenre[]>(vibeProfile?.genres || ['Electronic', 'Techno']);
  const [favoriteArtists, setFavoriteArtists] = useState<string[]>(vibeProfile?.favoriteArtists || ['Bonobo']);
  const [newArtistInput, setNewArtistInput] = useState('');
  const [selectedAtmospheres, setSelectedAtmospheres] = useState<AtmosphereType[]>(vibeProfile?.atmospheres || ['Party-focused', 'Outdoors']);
  const [selectedCrowds, setSelectedCrowds] = useState<CrowdSize[]>(vibeProfile?.crowdSizePreference || ['Medium (500-3,000)']);
  const [setting, setSetting] = useState<'Indoor' | 'Outdoor' | 'Either'>(vibeProfile?.setting || 'Either');
  const [energyLevel, setEnergyLevel] = useState<number>(vibeProfile?.energyLevel || 4);
  const [budgetMax, setBudgetMax] = useState<number>(vibeProfile?.budgetMax || 5000);
  const [travelDistanceKm, setTravelDistanceKm] = useState<number>(vibeProfile?.travelDistanceKm || 150);
  const [socialPreference, setSocialPreference] = useState<'Solo Explorer' | 'Small Tight Crew' | 'Big Festival Tribe'>(
    vibeProfile?.socialPreference || 'Small Tight Crew'
  );
  const [scalePreference, setScalePreference] = useState<'Intimate Club & Sessions' | 'Multi-Stage Mega Festivals' | 'Balanced Mix'>(
    vibeProfile?.scalePreference || 'Multi-Stage Mega Festivals'
  );
  const [accessibilityNeeds, setAccessibilityNeeds] = useState<string[]>(vibeProfile?.accessibilityNeeds || []);

  const toggleGenre = (genre: MusicGenre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const toggleAtmosphere = (atmo: AtmosphereType) => {
    setSelectedAtmospheres(prev => 
      prev.includes(atmo) ? prev.filter(a => a !== atmo) : [...prev, atmo]
    );
  };

  const toggleCrowd = (crowd: CrowdSize) => {
    setSelectedCrowds(prev => 
      prev.includes(crowd) ? prev.filter(c => c !== crowd) : [...prev, crowd]
    );
  };

  const toggleAccessibility = (need: string) => {
    setAccessibilityNeeds(prev => 
      prev.includes(need) ? prev.filter(n => n !== need) : [...prev, need]
    );
  };

  const handleAddArtist = (artistName: string) => {
    const trimmed = artistName.trim();
    if (trimmed && !favoriteArtists.includes(trimmed)) {
      setFavoriteArtists(prev => [...prev, trimmed]);
      setNewArtistInput('');
    }
  };

  const handleRemoveArtist = (name: string) => {
    setFavoriteArtists(prev => prev.filter(a => a !== name));
  };

  // Live calculated personality result
  const personalityPreview = determineDiscoveryPersonality(
    selectedGenres, 
    selectedAtmospheres, 
    energyLevel,
    scalePreference
  );

  // Synthesize draft profile for live event recommendations
  const draftProfile: VibeProfile = {
    genres: selectedGenres.length > 0 ? selectedGenres : ['Electronic', 'Indie'],
    favoriteArtists,
    atmospheres: selectedAtmospheres.length > 0 ? selectedAtmospheres : ['High-energy', 'Outdoors'],
    crowdSizePreference: selectedCrowds,
    setting,
    energyLevel,
    budgetMax,
    travelDistanceKm,
    socialPreference,
    scalePreference,
    culturalInterests: ['Live Acoustics', 'Immersive Stage Visuals'],
    accessibilityNeeds,
    discoveryPersonality: personalityPreview,
    lastUpdated: new Date().toISOString()
  };

  // Recommendations calculated with draftProfile
  const topMatches = [...allEvents]
    .map(event => ({
      event,
      match: calculateVibeMatch(event, draftProfile)
    }))
    .sort((a, b) => b.match.score - a.match.score)
    .slice(0, 3);

  const handleSave = () => {
    saveVibeProfile(draftProfile);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    showToast(`Vibe DNA saved! Archetype: "${personalityPreview.title}"`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-16">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-vybe-violet/20 border border-vybe-violet/40 text-xs font-mono text-vybe-violet-glow">
          <Sparkles className="w-3.5 h-3.5 text-vybe-lime" />
          <span>Transparent Rule-Based Vibe Engine</span>
        </div>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-slate-100">
          Vibe DNA Lab
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Tune your musical frequencies across 8 taste vectors to calculate your core concert archetype and explainable compatibility scores.
        </p>
      </div>

      {/* Generated Personality Result Card */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-vybe-lime/40 shadow-glow-lime/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-vybe-lime/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-vybe-lime to-vybe-cyan flex items-center justify-center text-4xl shadow-glow-lime flex-shrink-0">
            {personalityPreview.badgeEmoji}
          </div>

          <div className="space-y-2 flex-grow">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-vybe-lime font-bold">
                Your Calculated Archetype
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-[11px] font-mono text-slate-400">
                Energy Vector: Level {energyLevel}/5
              </span>
            </div>

            <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-100">
              {personalityPreview.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              {personalityPreview.description}
            </p>

            <div className="pt-2 text-xs font-mono text-vybe-cyan flex items-center justify-center sm:justify-start gap-1.5">
              <span>Superpower:</span>
              <span className="text-slate-200">{personalityPreview.superpower}</span>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-xl bg-vybe-lime text-black font-extrabold text-xs hover:bg-vybe-lime-hover shadow-glow-lime flex items-center gap-2 flex-shrink-0 transition-transform hover:scale-105"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </div>

      {/* 8 INTERACTIVE QUESTIONNAIRE SECTIONS */}
      <div className="space-y-8">
        
        {/* Question 1: Essential Music Genres */}
        <section className="p-6 rounded-2xl bg-vybe-card border border-vybe-border space-y-4">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-100 flex items-center gap-2">
              <Radio className="w-4 h-4 text-vybe-lime" />
              <span>1. Your Essential Music Genres</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select 2 to 6 genres that define your current rotation.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {ALL_GENRES.map(genre => {
              const isSelected = selectedGenres.includes(genre);
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 border ${
                    isSelected 
                      ? 'bg-vybe-lime text-black border-vybe-lime font-bold shadow-glow-lime' 
                      : 'bg-vybe-surface border-vybe-border text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  <span>{genre}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Question 2: Favorite Artists */}
        <section className="p-6 rounded-2xl bg-vybe-card border border-vybe-border space-y-4">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-vybe-violet-glow" />
              <span>2. Artists You Never Miss Live</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Lineups featuring these performers will automatically receive a priority score boost.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add an artist (e.g. Floating Points, DIVINE)..."
              value={newArtistInput}
              onChange={(e) => setNewArtistInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddArtist(newArtistInput);
                }
              }}
              className="flex-grow px-4 py-2.5 rounded-xl bg-vybe-surface border border-vybe-border text-xs text-slate-100 focus:outline-none focus:border-vybe-lime"
            />
            <button
              type="button"
              onClick={() => handleAddArtist(newArtistInput)}
              className="px-4 py-2.5 rounded-xl bg-vybe-lime text-black font-bold text-xs hover:bg-vybe-lime-hover"
            >
              Add
            </button>
          </div>

          {/* Current artist tags */}
          <div className="flex flex-wrap gap-2">
            {favoriteArtists.map(artist => (
              <span
                key={artist}
                className="px-3 py-1 rounded-xl bg-vybe-surface border border-vybe-border text-xs font-semibold text-slate-200 flex items-center gap-2"
              >
                <span>{artist}</span>
                <button 
                  type="button" 
                  onClick={() => handleRemoveArtist(artist)}
                  className="text-slate-400 hover:text-rose-400 font-bold"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          {/* Quick Suggestions */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[11px] font-mono uppercase text-slate-500">Quick Add:</span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_ARTISTS_SUGGESTIONS.filter(a => !favoriteArtists.includes(a)).slice(0, 6).map(a => (
                <button
                  key={a}
                  type="button"
                  onClick={() => handleAddArtist(a)}
                  className="text-[11px] px-2 py-0.5 rounded-lg bg-vybe-surface/60 border border-vybe-border text-slate-400 hover:text-vybe-lime"
                >
                  + {a}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Question 3: Preferred Concert Atmosphere */}
        <section className="p-6 rounded-2xl bg-vybe-card border border-vybe-border space-y-4">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-100 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>3. Preferred Concert Atmosphere</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              What environmental vibe gives you goosebumps?
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ALL_ATMOSPHERES.map(atmo => {
              const isSelected = selectedAtmospheres.includes(atmo);
              return (
                <button
                  key={atmo}
                  type="button"
                  onClick={() => toggleAtmosphere(atmo)}
                  className={`p-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                    isSelected 
                      ? 'bg-vybe-violet/20 border-vybe-violet-glow text-vybe-violet-glow font-bold' 
                      : 'bg-vybe-surface border-vybe-border text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {atmo}
                </button>
              );
            })}
          </div>
        </section>

        {/* Question 4: Budget Slider */}
        <section className="p-6 rounded-2xl bg-vybe-card border border-vybe-border space-y-4">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-100 flex items-center gap-2">
              <Coins className="w-4 h-4 text-vybe-lime" />
              <span>4. Target Ticket Budget</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Your comfort ceiling for single or multi-day festival admissions.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300">Max Ticket Price:</span>
              <span className="font-mono text-vybe-lime font-bold">₹{budgetMax.toLocaleString()}</span>
            </div>
            <input 
              type="range"
              min={500}
              max={25000}
              step={500}
              value={budgetMax}
              onChange={(e) => setBudgetMax(parseInt(e.target.value, 10))}
              className="w-full accent-vybe-lime cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>₹500 (Club gig)</span>
              <span>₹10,000 (Weekend pass)</span>
              <span>₹25,000+ (VIP pass)</span>
            </div>
          </div>
        </section>

        {/* Question 5: Preferred Travel Distance */}
        <section className="p-6 rounded-2xl bg-vybe-card border border-vybe-border space-y-4">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-100 flex items-center gap-2">
              <Compass className="w-4 h-4 text-vybe-cyan" />
              <span>5. Preferred Travel Distance</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              How far are you willing to travel for the right music experience?
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300">Travel Radius:</span>
              <span className="font-mono text-vybe-cyan font-bold">{travelDistanceKm} km</span>
            </div>
            <input 
              type="range"
              min={15}
              max={500}
              step={15}
              value={travelDistanceKm}
              onChange={(e) => setTravelDistanceKm(parseInt(e.target.value, 10))}
              className="w-full accent-vybe-cyan cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>15 km (Local Metro)</span>
              <span>150 km (Day Road Trip)</span>
              <span>500 km (Festival Pilgrimage)</span>
            </div>
          </div>
        </section>

        {/* Question 6: Indoor vs Outdoor Events */}
        <section className="p-6 rounded-2xl bg-vybe-card border border-vybe-border space-y-4">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-100 flex items-center gap-2">
              <Building className="w-4 h-4 text-amber-400" />
              <span>6. Indoor vs Outdoor Events</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Open-air lawns, covered concert halls, or flexible about both?
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {(['Either', 'Outdoor', 'Indoor'] as const).map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => setSetting(opt)}
                className={`py-3 rounded-xl text-xs font-bold border text-center transition-all ${
                  setting === opt 
                    ? 'bg-vybe-lime text-black border-vybe-lime font-extrabold shadow-glow-lime' 
                    : 'bg-vybe-surface border-vybe-border text-slate-400 hover:text-white'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </section>

        {/* Question 7: Solo vs Group Experiences */}
        <section className="p-6 rounded-2xl bg-vybe-card border border-vybe-border space-y-4">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-vybe-cyan" />
              <span>7. Solo vs Group Experiences</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Do you prefer wandering stages alone, with a close partner, or rolling with a large tribe?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'Solo Explorer', desc: 'Freedom to hop stages on instinct' },
              { id: 'Small Tight Crew', desc: '2 to 4 close music companions' },
              { id: 'Big Festival Tribe', desc: '5+ group campsite energy' },
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSocialPreference(item.id as any)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  socialPreference === item.id 
                    ? 'bg-vybe-cyan text-black border-vybe-cyan font-bold shadow-glow-cyan' 
                    : 'bg-vybe-surface border-vybe-border text-slate-300 hover:border-slate-500'
                }`}
              >
                <span className="font-bold text-xs block">{item.id}</span>
                <span className={`text-[11px] block mt-0.5 ${socialPreference === item.id ? 'text-black/80' : 'text-slate-400'}`}>
                  {item.desc}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Question 8: Festival vs Intimate Concert Preferences */}
        <section className="p-6 rounded-2xl bg-vybe-card border border-vybe-border space-y-4">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-100 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-rose-400" />
              <span>8. Festival vs Intimate Concert Preference</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Do you prefer multi-stage weekend camping or intimate acoustic listening rooms?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'Intimate Club & Sessions', desc: 'Acoustic basements & club sets' },
              { id: 'Multi-Stage Mega Festivals', desc: 'Expansive multi-stage weekenders' },
              { id: 'Balanced Mix', desc: 'Equally enjoy both scales' },
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => setScalePreference(item.id as any)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  scalePreference === item.id 
                    ? 'bg-vybe-violet-glow text-black border-vybe-violet-glow font-bold' 
                    : 'bg-vybe-surface border-vybe-border text-slate-300 hover:border-slate-500'
                }`}
              >
                <span className="font-bold text-xs block">{item.id}</span>
                <span className={`text-[11px] block mt-0.5 ${scalePreference === item.id ? 'text-black/80' : 'text-slate-400'}`}>
                  {item.desc}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Save Button Bar */}
        <div className="pt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-4 rounded-2xl bg-vybe-lime text-black font-black text-sm hover:bg-vybe-lime-hover shadow-glow-lime flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
          >
            <Save className="w-4 h-4" />
            <span>Lock In My Vibe DNA Profile</span>
          </button>
        </div>

      </div>

      {/* RECOMMENDED EVENTS BASED ON LIVE PREFERENCES */}
      <div className="space-y-6 pt-6 border-t border-vybe-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-extrabold text-2xl text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-vybe-lime" />
              <span>Recommended Events for {personalityPreview.title}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Calculated using our transparent rule-based algorithm (no black-box AI)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topMatches.map(({ event, match }) => (
            <div key={event.id} className="space-y-2">
              <EventCard event={event} />
              <div className="p-3 rounded-xl bg-vybe-card border border-vybe-border text-xs space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-200">Why It Matches:</span>
                  <span className="font-mono text-vybe-lime font-black">{match.score}% Vibe Match</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {match.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
