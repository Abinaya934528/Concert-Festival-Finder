import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_VENUES, VenueDetail } from '../../data/mockVenues';
import { 
  MapPin, 
  Volume2, 
  Utensils, 
  Heart, 
  ShieldCheck, 
  AlertCircle, 
  Compass, 
  Users, 
  Droplets, 
  LifeBuoy, 
  DoorOpen, 
  Coffee, 
  X, 
  CheckCircle2, 
  Eye, 
  Layers,
  Sparkles
} from 'lucide-react';

type POICategory = 'all' | 'stages' | 'food' | 'rest' | 'water' | 'medical' | 'entry' | 'accessibility' | 'restrooms';

interface MapPOI {
  id: string;
  name: string;
  category: POICategory;
  x: number; // percentage on map (0-100)
  y: number; // percentage on map (0-100)
  simulatedDensity: 'Light' | 'Moderate' | 'Heavy' | 'Peak';
  waitMinutes: number;
  description: string;
  features: string[];
}

const VENUE_POIS: Record<string, MapPOI[]> = {
  'embassy-riding-school': [
    { id: 'p1', name: 'Earth Mainstage', category: 'stages', x: 50, y: 35, simulatedDensity: 'Peak', waitMinutes: 0, description: 'L-Acoustics K1 line arrays, 400 sqm LED canvas, upcycled bamboo arch.', features: ['Full Wheelchair Deck', 'Sign Language Zone', 'Hi-Fi Audio'] },
    { id: 'p2', name: 'Canopy Forest Arena', category: 'stages', x: 22, y: 28, simulatedDensity: 'Heavy', waitMinutes: 0, description: 'Dense tree canopy stage with immersive 3D laser mapping.', features: ['Deep Bass Rig', 'Step-Free Access'] },
    { id: 'p3', name: 'Acoustic Nest', category: 'stages', x: 78, y: 30, simulatedDensity: 'Moderate', waitMinutes: 0, description: 'Lake terrace amphitheater with hammocks and ambient soundscapes.', features: ['Seating Available', 'Low Strobe Lights'] },
    { id: 'p4', name: 'Artisan Food Village', category: 'food', x: 38, y: 65, simulatedDensity: 'Heavy', waitMinutes: 12, description: 'Over 20 regional artisanal stalls, vegan bowls, and wood-fired flatbreads.', features: ['Cashless Cards', 'Seated Dining'] },
    { id: 'p5', name: 'Eco Craft Beer Lounge', category: 'food', x: 62, y: 65, simulatedDensity: 'Moderate', waitMinutes: 5, description: 'Zero-waste local microbrews and fresh fruit botanicals in reusable cups.', features: ['Reusable Cup Returns', 'Cocktails'] },
    { id: 'p6', name: 'Sensory Quiet Zone', category: 'rest', x: 85, y: 60, simulatedDensity: 'Light', waitMinutes: 0, description: 'Low-light decompression lounge with weighted blankets and noise-canceling headsets.', features: ['Quiet Space', 'Soft Seating', 'Sensory Relief'] },
    { id: 'p7', name: 'Hydration Station North', category: 'water', x: 30, y: 48, simulatedDensity: 'Light', waitMinutes: 1, description: 'Free purified mountain spring water refill station with 8 dispensers.', features: ['Free Refills', 'Touchless'] },
    { id: 'p8', name: 'Hydration Station South', category: 'water', x: 70, y: 48, simulatedDensity: 'Light', waitMinutes: 2, description: 'Free cold drinking water station near stage crossover.', features: ['Free Refills', 'Eco Station'] },
    { id: 'p9', name: 'Emergency Medical Care', category: 'medical', x: 50, y: 88, simulatedDensity: 'Light', waitMinutes: 0, description: 'Fully equipped field hospital with paramedics, hydration packs, and first aid.', features: ['24/7 Paramedics', 'AED Defibrillators', 'Free Electrolytes'] },
    { id: 'p10', name: 'Main North Gate (Entry/Exit)', category: 'entry', x: 50, y: 10, simulatedDensity: 'Moderate', waitMinutes: 8, description: 'RFID wristband scan, bag checks, and accessibility express lanes.', features: ['Express Lane', 'Fast Track', 'Security'] },
    { id: 'p11', name: 'South Transit Gate', category: 'entry', x: 15, y: 85, simulatedDensity: 'Light', waitMinutes: 3, description: 'Dedicated electric shuttle pickup/dropoff terminal.', features: ['Metro Shuttles', 'Cab Pickups'] },
    { id: 'p12', name: 'Accessibility Hub & Assistance', category: 'accessibility', x: 42, y: 15, simulatedDensity: 'Light', waitMinutes: 0, description: 'Wheelchair charging, all-terrain escort buggies, and assistive listening kits.', features: ['Power Wheelchair Charging', 'Companion Passes'] },
    { id: 'p13', name: 'Eco Restrooms East', category: 'restrooms', x: 88, y: 42, simulatedDensity: 'Moderate', waitMinutes: 4, description: 'Vacuum-flush waterless bio-toilets with running sanitization attendants.', features: ['Accessible Stalls', 'Running Water'] },
    { id: 'p14', name: 'Eco Restrooms West', category: 'restrooms', x: 12, y: 42, simulatedDensity: 'Moderate', waitMinutes: 5, description: 'Sanitized bio-toilets with step-free entry ramps.', features: ['Accessible Stalls', 'Infant Care'] },
  ]
};

export const CrowdMoodMapPage: React.FC = () => {
  const { allEvents } = useApp();

  const venueKeys = Object.keys(MOCK_VENUES);
  const [selectedVenueKey, setSelectedVenueKey] = useState<string>(venueKeys[0]);
  const [activeCategory, setActiveCategory] = useState<POICategory>('all');
  const [showDensityOverlay, setShowDensityOverlay] = useState<boolean>(true);
  const [selectedPOI, setSelectedPOI] = useState<MapPOI | null>(null);

  const venue: VenueDetail = MOCK_VENUES[selectedVenueKey] || MOCK_VENUES[venueKeys[0]];
  const pois = VENUE_POIS[selectedVenueKey] || VENUE_POIS['embassy-riding-school'];

  const filteredPOIs = pois.filter(p => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  const getDensityColor = (density: MapPOI['simulatedDensity']) => {
    switch (density) {
      case 'Peak': return 'bg-rose-500 shadow-rose-500/50';
      case 'Heavy': return 'bg-amber-400 shadow-amber-400/50';
      case 'Moderate': return 'bg-vybe-cyan shadow-vybe-cyan/50';
      case 'Light': return 'bg-emerald-400 shadow-emerald-400/50';
    }
  };

  const getCategoryIcon = (cat: POICategory) => {
    switch (cat) {
      case 'stages': return <Volume2 className="w-3.5 h-3.5" />;
      case 'food': return <Utensils className="w-3.5 h-3.5" />;
      case 'rest': return <Coffee className="w-3.5 h-3.5" />;
      case 'water': return <Droplets className="w-3.5 h-3.5" />;
      case 'medical': return <LifeBuoy className="w-3.5 h-3.5" />;
      case 'entry': return <DoorOpen className="w-3.5 h-3.5" />;
      case 'accessibility': return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'restrooms': return <Sparkles className="w-3.5 h-3.5" />;
      default: return <MapPin className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-10 pb-16 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vybe-cyan/15 border border-vybe-cyan/30 text-xs font-mono text-vybe-cyan mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive Grounds & Density Telemetry</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-100">
            Crowd Mood & Venue Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Explore festival grounds, pinpoint water refill hubs, locate medical help, and check simulated crowd wait times.
          </p>
        </div>

        {/* Venue Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-mono text-slate-400">Festival Venue:</label>
          <select
            value={selectedVenueKey}
            onChange={(e) => {
              setSelectedVenueKey(e.target.value);
              setSelectedPOI(null);
            }}
            className="py-2.5 px-3.5 rounded-xl bg-vybe-card border border-vybe-border text-xs text-slate-100 font-bold focus:outline-none focus:border-vybe-lime"
          >
            {venueKeys.map(k => (
              <option key={k} value={k}>{MOCK_VENUES[k].name} ({MOCK_VENUES[k].city})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Mandatory Demo Simulation Label Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs text-amber-300">
        <div className="flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            <strong>Demo Simulation — Not Live Crowd Data.</strong> Displayed queue wait times and crowd heatmaps illustrate simulated festival ground scenarios.
          </span>
        </div>

        {/* Density Overlay Toggle */}
        <button
          onClick={() => setShowDensityOverlay(!showDensityOverlay)}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 border transition-all whitespace-nowrap ${
            showDensityOverlay 
              ? 'bg-vybe-lime text-black border-vybe-lime' 
              : 'bg-vybe-surface border-vybe-border text-slate-400'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{showDensityOverlay ? 'Heatmap: ON' : 'Heatmap: OFF'}</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {[
          { id: 'all', label: 'All POIs' },
          { id: 'stages', label: 'Stages (3)' },
          { id: 'food', label: 'Food & Bars (2)' },
          { id: 'rest', label: 'Rest Areas (1)' },
          { id: 'water', label: 'Water Stations (2)' },
          { id: 'medical', label: 'Medical (1)' },
          { id: 'entry', label: 'Entry / Exit (2)' },
          { id: 'accessibility', label: 'Accessibility (1)' },
          { id: 'restrooms', label: 'Restrooms (2)' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as POICategory)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
              activeCategory === cat.id 
                ? 'bg-vybe-lime text-black border-vybe-lime font-bold shadow-glow-lime' 
                : 'bg-vybe-card border-vybe-border text-slate-300 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Interactive Festival Map Canvas */}
      <div className="p-6 sm:p-10 rounded-3xl bg-[#090b12] border border-vybe-border relative overflow-hidden min-h-[520px] flex flex-col justify-between shadow-2xl">
        
        {/* Subtle Map Grid lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e2436_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        {/* Heatmap Simulation Radial Gradients if enabled */}
        {showDensityOverlay && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Stage 1 Crowd Glow */}
            <div className="absolute top-[35%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-rose-500/20 blur-3xl" />
            {/* Food Court Crowd Glow */}
            <div className="absolute top-[65%] left-[45%] -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-amber-400/20 blur-3xl" />
            {/* Stage 2 Crowd Glow */}
            <div className="absolute top-[28%] left-[22%] -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-vybe-cyan/20 blur-3xl" />
          </div>
        )}

        {/* Top Header Information Overlay */}
        <div className="relative z-10 flex items-center justify-between text-xs font-mono text-slate-400 border-b border-vybe-border/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-vybe-lime animate-ping" />
            <span className="text-slate-200 font-bold">{venue.name} Grounds</span>
            <span>•</span>
            <span>Cap: {venue.capacity}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Light</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-vybe-cyan" /> Moderate</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> Heavy</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /> Peak</span>
          </div>
        </div>

        {/* Central Map Canvas Nodes */}
        <div className="relative z-10 w-full h-[400px] my-4">
          {filteredPOIs.map(poi => {
            const isSelected = selectedPOI?.id === poi.id;
            return (
              <div
                key={poi.id}
                style={{ left: `${poi.x}%`, top: `${poi.y}%` }}
                onClick={() => setSelectedPOI(poi)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group z-20 ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                }`}
              >
                {/* Node Pin Marker */}
                <div className={`p-2.5 rounded-2xl backdrop-blur-md border shadow-lg flex items-center gap-2 transition-all ${
                  isSelected 
                    ? 'bg-vybe-lime text-black border-vybe-lime shadow-glow-lime' 
                    : 'bg-vybe-card/90 text-slate-200 border-vybe-border group-hover:border-vybe-lime/60'
                }`}>
                  {getCategoryIcon(poi.category)}
                  <span className="text-[11px] font-bold whitespace-nowrap hidden sm:inline">
                    {poi.name}
                  </span>

                  {/* Density Status Dot */}
                  <span className={`w-2.5 h-2.5 rounded-full ${getDensityColor(poi.simulatedDensity)}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Legend Overlay */}
        <div className="relative z-10 flex items-center justify-between text-xs font-mono text-slate-400 border-t border-vybe-border/60 pt-3">
          <span>Click any zone pin to view simulated queue wait and facility details.</span>
          <span className="text-vybe-lime">Compass: North Facing</span>
        </div>

      </div>

      {/* POI Information Flyout / Detail Modal */}
      {selectedPOI && (
        <div className="p-6 rounded-3xl glass-panel border border-vybe-lime/50 shadow-glow-lime/20 space-y-4 relative">
          <button
            onClick={() => setSelectedPOI(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-vybe-surface text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pr-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-vybe-surface text-vybe-cyan uppercase font-bold">
                  {selectedPOI.category}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Simulated Density: <strong className="text-slate-200">{selectedPOI.simulatedDensity}</strong>
                </span>
              </div>
              <h3 className="font-display font-extrabold text-2xl text-slate-100 mt-1">
                {selectedPOI.name}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-vybe-surface border border-vybe-border text-center min-w-[110px]">
                <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Estimated Queue</span>
                <span className="font-mono font-bold text-lg text-vybe-lime">
                  {selectedPOI.waitMinutes === 0 ? 'No Wait' : `~${selectedPOI.waitMinutes} mins`}
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {selectedPOI.description}
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {selectedPOI.features.map((feat, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-vybe-surface border border-vybe-border text-xs text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-vybe-lime" />
                <span>{feat}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Transit & Commute Details */}
      <div className="p-6 rounded-2xl glass-panel border border-vybe-border space-y-3">
        <h4 className="font-display font-bold text-base text-slate-100 flex items-center gap-2">
          <Compass className="w-4 h-4 text-vybe-cyan" />
          <span>Getting to {venue.name}</span>
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          {venue.transitSummary}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {venue.transitOptions.map((opt, i) => (
            <div key={i} className="p-3 rounded-xl bg-vybe-surface border border-vybe-border text-xs">
              <div className="flex justify-between font-bold text-slate-200">
                <span>{opt.type}</span>
                <span className="font-mono text-slate-400 font-normal">{opt.distance}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{opt.detail}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
