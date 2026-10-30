import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_BUDDIES, DemoBuddyProfile } from '../../data/mockReviews';
import { 
  Users, 
  Sparkles, 
  ShieldCheck, 
  Send, 
  Ban, 
  Flag, 
  MapPin, 
  CheckCircle2, 
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

export const EventBuddyPage: React.FC = () => {
  const { vibeProfile, selectedCity, showToast } = useApp();
  const [buddies, setBuddies] = useState<DemoBuddyProfile[]>(MOCK_BUDDIES);
  const [blockedBuddyIds, setBlockedBuddyIds] = useState<string[]>([]);
  const [connectedBuddyIds, setConnectedBuddyIds] = useState<string[]>([]);
  const [profileVisibility, setProfileVisibility] = useState<'Public' | 'Friends Only' | 'Incognito'>('Public');

  const visibleBuddies = buddies.filter(b => !blockedBuddyIds.includes(b.id));

  const handleConnect = (buddy: DemoBuddyProfile) => {
    if (connectedBuddyIds.includes(buddy.id)) {
      setConnectedBuddyIds(connectedBuddyIds.filter(id => id !== buddy.id));
      showToast(`Cancelled hangout interest with ${buddy.name}.`);
    } else {
      setConnectedBuddyIds([...connectedBuddyIds, buddy.id]);
      showToast(`Sent event hangout vibe signal to ${buddy.name}!`);
    }
  };

  const handleBlock = (buddyId: string, name: string) => {
    setBlockedBuddyIds([...blockedBuddyIds, buddyId]);
    showToast(`Blocked ${name}. Profile will no longer appear in your feed.`);
  };

  const handleReport = (name: string) => {
    showToast(`Report submitted for ${name}. Our trust & safety team will review.`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vybe-cyan/15 border border-vybe-cyan/30 text-xs font-mono text-vybe-cyan mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Privacy-Conscious Tribe Discovery</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-100">
            Event Buddies Network
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Find fellow music lovers with compatible Vibe DNA attending the same festivals. Strict privacy by design without revealing personal numbers or exact locations.
          </p>
        </div>

        {/* Profile Visibility Selector */}
        <div className="p-3 rounded-2xl bg-vybe-card border border-vybe-border flex items-center gap-3 self-start sm:self-auto">
          <Lock className="w-4 h-4 text-vybe-lime" />
          <div className="text-xs">
            <span className="text-slate-400 block text-[10px] font-mono uppercase">My Visibility</span>
            <select
              value={profileVisibility}
              onChange={(e) => {
                setProfileVisibility(e.target.value as any);
                showToast(`Profile visibility set to: ${e.target.value}`);
              }}
              className="bg-transparent font-bold text-slate-100 focus:outline-none cursor-pointer"
            >
              <option value="Public" className="bg-vybe-dark">Public Discovery</option>
              <option value="Friends Only" className="bg-vybe-dark">Squad Only</option>
              <option value="Incognito" className="bg-vybe-dark">Incognito (Hidden)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Safety & Demo Label Alert */}
      <div className="p-4 rounded-2xl bg-vybe-card border border-vybe-border/80 flex items-start gap-3 text-xs text-slate-300">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-100 block">Demonstration Social Prototype:</span>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Profiles shown are curated demonstration personas. Direct end-to-end messaging and cross-device peer discovery require an authenticated backend service with full community moderation. Never share financial or personal identification details online.
          </p>
        </div>
      </div>

      {/* Buddies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleBuddies.map(buddy => {
          const isConnected = connectedBuddyIds.includes(buddy.id);

          // Compute simulated compatibility with user's genres
          const shared = vibeProfile ? buddy.topGenres.filter(g => vibeProfile.genres.includes(g)) : [];
          const compatScore = Math.min(98, 65 + shared.length * 12);

          return (
            <div 
              key={buddy.id}
              className="p-6 rounded-3xl glass-card border border-vybe-border space-y-4 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <img 
                      src={buddy.avatar} 
                      alt={buddy.name} 
                      className="w-14 h-14 rounded-2xl object-cover border border-vybe-border shadow-md"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-display font-bold text-base text-slate-100">{buddy.name}</span>
                        {buddy.safetyVerifiedBadge && (
                          <span title="Community safety verified" className="text-emerald-400">
                            <ShieldCheck className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                        <MapPin className="w-3 h-3 text-vybe-violet-glow" />
                        <span>{buddy.city}</span>
                        <span>•</span>
                        <span className="text-vybe-lime font-bold">{compatScore}% Vibe Match</span>
                      </p>
                    </div>
                  </div>

                  {/* Persona Badge */}
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-vybe-surface text-vybe-cyan border border-vybe-cyan/30">
                    {buddy.vibePersonality}
                  </span>
                </div>

                {/* Bio / Tagline */}
                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  "{buddy.tagline}"
                </p>

                {/* Favorite Genres */}
                <div className="flex flex-wrap gap-1.5 pt-3">
                  {buddy.topGenres.map(g => (
                    <span key={g} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-vybe-surface border border-vybe-border text-slate-300">
                      {g}
                    </span>
                  ))}
                </div>

                {/* Looking forward to events */}
                <div className="mt-3 p-3 rounded-xl bg-vybe-surface border border-vybe-border/60 text-xs space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                    Target Festivals
                  </span>
                  <div className="space-y-0.5">
                    {buddy.lookingForEvents.map((ev, i) => (
                      <p key={i} className="text-slate-200 font-medium truncate">
                        • {ev}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions & Safety Controls */}
              <div className="pt-4 border-t border-vybe-border flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleReport(buddy.name)}
                    className="p-2 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-vybe-surface text-xs"
                    title="Report profile"
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleBlock(buddy.id, buddy.name)}
                    className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-vybe-surface text-xs"
                    title="Block buddy"
                  >
                    <Ban className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => handleConnect(buddy)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isConnected 
                      ? 'bg-vybe-lime text-black font-extrabold shadow-glow-lime' 
                      : 'bg-vybe-surface border border-vybe-border text-slate-200 hover:text-vybe-lime'
                  }`}
                >
                  {isConnected ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{isConnected ? 'Hangout Vibe Sent' : 'Connect for Shows'}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
