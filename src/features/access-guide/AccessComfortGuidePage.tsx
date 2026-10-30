import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  VolumeX, 
  MapPin, 
  HeartHandshake, 
  ExternalLink,
  Search
} from 'lucide-react';

export const AccessComfortGuidePage: React.FC = () => {
  const { allEvents, setActiveEventModal } = useApp();
  const [filterWheelchair, setFilterWheelchair] = useState(false);
  const [filterQuietSpace, setFilterQuietSpace] = useState(false);
  const [filterSignLanguage, setFilterSignLanguage] = useState(false);
  const [search, setSearch] = useState('');

  const filteredEvents = allEvents.filter(ev => {
    if (filterWheelchair && !ev.accessibility.wheelchair) return false;
    if (filterQuietSpace && !ev.accessibility.quietSensorySpaces) return false;
    if (filterSignLanguage && !ev.accessibility.signLanguage) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return ev.title.toLowerCase().includes(q) || ev.venueName.toLowerCase().includes(q) || ev.city.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-xs font-mono text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Inclusive Experience Architecture</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-100">
          Access Comfort Guide
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Detailed, verified venue accessibility data for wheelchair users, neurodivergent attendees, and deaf or hard-of-hearing music lovers.
        </p>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-5 rounded-2xl glass-panel border border-vybe-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-mono uppercase text-slate-300 font-bold">
            Filter by Accessibility Accommodation
          </span>

          <div className="relative flex-grow sm:max-w-xs">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter venue or event..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-vybe-surface border border-vybe-border text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input 
              type="checkbox"
              checked={filterWheelchair}
              onChange={(e) => setFilterWheelchair(e.target.checked)}
              className="rounded border-vybe-border text-emerald-500 focus:ring-0"
            />
            <span>Wheelchair & Step-Free Viewing</span>
          </label>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input 
              type="checkbox"
              checked={filterQuietSpace}
              onChange={(e) => setFilterQuietSpace(e.target.checked)}
              className="rounded border-vybe-border text-emerald-500 focus:ring-0"
            />
            <span>Sensory Quiet Rooms</span>
          </label>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input 
              type="checkbox"
              checked={filterSignLanguage}
              onChange={(e) => setFilterSignLanguage(e.target.checked)}
              className="rounded border-vybe-border text-emerald-500 focus:ring-0"
            />
            <span>Sign Language (ISL/ASL) Interpreters</span>
          </label>
        </div>
      </div>

      {/* Event Accessibility Breakdown Cards */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
          Venue Access Audits ({filteredEvents.length} Events)
        </h3>

        <div className="space-y-4">
          {filteredEvents.map(event => {
            const acc = event.accessibility;

            return (
              <div 
                key={event.id}
                className="p-6 rounded-2xl glass-card border border-vybe-border space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        acc.verifiedByOrganizer ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {acc.verifiedByOrganizer ? 'Organizer Verified' : 'Awaiting Organizer Confirmation'}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{event.city}</span>
                    </div>

                    <h4 
                      onClick={() => setActiveEventModal(event)}
                      className="font-display font-bold text-lg text-slate-100 hover:text-vybe-lime cursor-pointer transition-colors mt-1"
                    >
                      {event.title}
                    </h4>

                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-vybe-violet-glow" />
                      <span>{event.venueName}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveEventModal(event)}
                    className="px-4 py-2 rounded-xl bg-vybe-surface border border-vybe-border text-xs font-bold text-slate-200 hover:text-white self-start"
                  >
                    Event Details
                  </button>
                </div>

                {/* Structured Feature Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  <div className="p-3 rounded-xl bg-vybe-surface border border-vybe-border">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Wheelchair</span>
                    <span className={`text-xs font-bold ${acc.wheelchair ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {acc.wheelchair ? '✓ Verified Ramp/Deck' : '✕ Inaccessible'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-vybe-surface border border-vybe-border">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Step-Free</span>
                    <span className={`text-xs font-bold ${acc.stepFree ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {acc.stepFree ? '✓ Seamless Paths' : '✕ Steps Encountered'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-vybe-surface border border-vybe-border">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Accessible WC</span>
                    <span className={`text-xs font-bold ${acc.accessibleToilets ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {acc.accessibleToilets ? '✓ Dedicated Stalls' : '✕ Standard Only'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-vybe-surface border border-vybe-border">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Quiet Space</span>
                    <span className={`text-xs font-bold ${acc.quietSensorySpaces ? 'text-vybe-lime' : 'text-slate-500'}`}>
                      {acc.quietSensorySpaces ? '✓ Decompression Zone' : '✕ None Reported'}
                    </span>
                  </div>
                </div>

                {/* Companion Policy & Sensory notes */}
                <div className="p-4 rounded-xl bg-vybe-surface/60 border border-vybe-border/60 text-xs space-y-2">
                  <div>
                    <span className="font-bold text-slate-200 flex items-center gap-1.5">
                      <HeartHandshake className="w-4 h-4 text-vybe-lime" />
                      Companion & Carer Ticket Policy:
                    </span>
                    <p className="text-slate-300 mt-0.5">{acc.companionPolicy}</p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-200 flex items-center gap-1.5">
                      <VolumeX className="w-4 h-4 text-vybe-cyan" />
                      Sensory Considerations:
                    </span>
                    <p className="text-slate-300 mt-0.5">{acc.sensoryNotes}</p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Access Disclaimer */}
      <div className="p-4 rounded-xl bg-vybe-card border border-vybe-border/60 text-xs text-slate-400 leading-relaxed space-y-1">
        <span className="font-bold text-slate-300 block">Verification Standard:</span>
        <p>
          Never assume that historic venues or open fields are wheelchair-navigable unless explicitly confirmed by event organizers. If your accessibility requirements are not listed above, contact the organizer box office before traveling.
        </p>
      </div>

    </div>
  );
};
