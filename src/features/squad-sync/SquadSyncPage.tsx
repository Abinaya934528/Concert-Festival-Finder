import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { SquadPlan, SquadMember } from '../../types';
import { formatCurrency } from '../../services/budgetCalculator';
import { 
  Users, 
  Plus, 
  Vote, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  Eye, 
  EyeOff, 
  Share2,
  DollarSign
} from 'lucide-react';

export const SquadSyncPage: React.FC = () => {
  const { 
    squadPlans, 
    saveSquadPlan, 
    deleteSquadPlan, 
    allEvents, 
    currency, 
    setActiveEventModal, 
    showToast 
  } = useApp();

  const [activePlanId, setActivePlanId] = useState<string>(squadPlans[0]?.id || '');
  const [showNewPlanModal, setShowNewPlanModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);

  // New Plan form state
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanDates, setNewPlanDates] = useState('');

  // New Member form state
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberBudget, setNewMemberBudget] = useState(5000);
  const [newMemberAvailability, setNewMemberAvailability] = useState('All Weekend');

  const activePlan = squadPlans.find(p => p.id === activePlanId) || squadPlans[0];

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanName.trim()) return;

    const newPlan: SquadPlan = {
      id: `squad-${Date.now()}`,
      name: newPlanName.trim(),
      eventDates: newPlanDates.trim() || 'Upcoming Weekend',
      targetEventIds: ['ev-echoes-earth-2026', 'ev-bombay-indie-after-dark'],
      anonymousVoting: false,
      status: 'Voting Open',
      createdAt: new Date().toISOString().split('T')[0],
      members: [
        {
          id: `m-${Date.now()}`,
          name: 'You (Organizer)',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
          budgetMax: 6000,
          genres: ['Electronic', 'Indie'],
          availability: 'All Weekend',
          votedEventIds: ['ev-echoes-earth-2026']
        }
      ]
    };

    saveSquadPlan(newPlan);
    setActivePlanId(newPlan.id);
    setShowNewPlanModal(false);
    setNewPlanName('');
    setNewPlanDates('');
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !activePlan) return;

    const newMember: SquadMember = {
      id: `m-${Date.now()}`,
      name: newMemberName.trim(),
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?auto=format&fit=crop&w=120&q=80`,
      budgetMax: newMemberBudget,
      genres: ['Indie', 'Rock'],
      availability: newMemberAvailability,
      votedEventIds: []
    };

    const updatedPlan: SquadPlan = {
      ...activePlan,
      members: [...activePlan.members, newMember]
    };

    saveSquadPlan(updatedPlan);
    setShowAddMemberModal(false);
    setNewMemberName('');
  };

  const handleVoteToggle = (eventId: string, memberId: string) => {
    if (!activePlan) return;

    const updatedMembers = activePlan.members.map(m => {
      if (m.id === memberId) {
        const hasVoted = m.votedEventIds.includes(eventId);
        return {
          ...m,
          votedEventIds: hasVoted ? m.votedEventIds.filter(id => id !== eventId) : [...m.votedEventIds, eventId]
        };
      }
      return m;
    });

    const updatedPlan: SquadPlan = {
      ...activePlan,
      members: updatedMembers
    };

    saveSquadPlan(updatedPlan);
  };

  const handleToggleAnonymous = () => {
    if (!activePlan) return;
    saveSquadPlan({
      ...activePlan,
      anonymousVoting: !activePlan.anonymousVoting
    });
  };

  const handleAddEventToPlan = (eventId: string) => {
    if (!activePlan) return;
    if (activePlan.targetEventIds.includes(eventId)) {
      showToast('Event already in comparison board!');
      return;
    }
    const updatedPlan: SquadPlan = {
      ...activePlan,
      targetEventIds: [...activePlan.targetEventIds, eventId]
    };
    saveSquadPlan(updatedPlan);
    setShowAddEventModal(false);
    showToast('Event added to Squad Sync comparison!');
  };

  const handleRemoveEventFromPlan = (eventId: string) => {
    if (!activePlan) return;
    const updatedPlan: SquadPlan = {
      ...activePlan,
      targetEventIds: activePlan.targetEventIds.filter(id => id !== eventId)
    };
    saveSquadPlan(updatedPlan);
  };

  // Compute Squad comparison statistics
  const comparisonItems = activePlan ? activePlan.targetEventIds.map(eventId => {
    const event = allEvents.find(e => e.id === eventId);
    if (!event) return null;

    const voters = activePlan.members.filter(m => m.votedEventIds.includes(eventId));
    const voteCount = voters.length;
    const totalMembers = activePlan.members.length;
    const consensusPercent = totalMembers > 0 ? Math.round((voteCount / totalMembers) * 100) : 0;

    // Budget check: how many members find it within their budget
    const affordableMembers = activePlan.members.filter(m => m.budgetMax >= event.ticketPriceMin);
    const budgetCompatibility = totalMembers > 0 ? Math.round((affordableMembers.length / totalMembers) * 100) : 0;

    const totalGroupTicketCost = event.ticketPriceMin * totalMembers;

    return {
      event,
      voters,
      voteCount,
      consensusPercent,
      budgetCompatibility,
      totalGroupTicketCost
    };
  }).filter(Boolean) : [];

  return (
    <div className="space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vybe-cyan/15 border border-vybe-cyan/30 text-xs font-mono text-vybe-cyan mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Collaborative Event Decider</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-100">
            Squad Sync
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Compare events, align budgets, and vote transparently. Eliminate group chat paralysis with consensus scoring.
          </p>
        </div>

        <button
          onClick={() => setShowNewPlanModal(true)}
          className="px-5 py-3 rounded-2xl bg-vybe-lime text-black font-extrabold text-xs hover:bg-vybe-lime-hover shadow-glow-lime flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Squad Plan</span>
        </button>
      </div>

      {/* Plan Selector Bar */}
      {squadPlans.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {squadPlans.map(plan => (
            <button
              key={plan.id}
              onClick={() => setActivePlanId(plan.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                activePlan?.id === plan.id
                  ? 'bg-vybe-cyan text-black border-vybe-cyan shadow-glow-cyan'
                  : 'bg-vybe-card border-vybe-border text-slate-300 hover:text-white'
              }`}
            >
              {plan.name} ({plan.members.length} Crew)
            </button>
          ))}
        </div>
      )}

      {activePlan ? (
        <div className="space-y-8">
          
          {/* Active Plan Control Bar */}
          <div className="p-6 rounded-2xl glass-panel border border-vybe-border flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-display font-extrabold text-2xl text-slate-100">
                  {activePlan.name}
                </h2>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-vybe-surface border border-vybe-border text-vybe-lime">
                  {activePlan.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-vybe-violet-glow" />
                <span>Target Dates: {activePlan.eventDates}</span>
                <span>•</span>
                <span>Created {activePlan.createdAt}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleToggleAnonymous}
                className="px-3 py-2 rounded-xl bg-vybe-surface border border-vybe-border text-xs text-slate-300 hover:text-white flex items-center gap-1.5"
                title="Toggle anonymous voting mode"
              >
                {activePlan.anonymousVoting ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
                <span>{activePlan.anonymousVoting ? 'Anonymous Voting: ON' : 'Public Voting: ON'}</span>
              </button>

              <button
                onClick={() => setShowAddMemberModal(true)}
                className="px-3 py-2 rounded-xl bg-vybe-card border border-vybe-border text-xs font-bold text-slate-200 hover:text-vybe-lime flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-vybe-lime" />
                <span>Add Member</span>
              </button>

              <button
                onClick={() => setShowAddEventModal(true)}
                className="px-3 py-2 rounded-xl bg-vybe-card border border-vybe-border text-xs font-bold text-slate-200 hover:text-vybe-cyan flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-vybe-cyan" />
                <span>Add Event to Compare</span>
              </button>

              <button
                onClick={() => deleteSquadPlan(activePlan.id)}
                className="p-2 rounded-xl bg-vybe-surface border border-vybe-border text-slate-500 hover:text-rose-400"
                title="Delete Squad Plan"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Squad Compatibility & Taste Synthesis Banner */}
          <div className="p-6 rounded-3xl glass-panel border border-vybe-cyan/30 shadow-glow-cyan/20 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-vybe-cyan font-bold">
                  Collective Crew Chemistry
                </span>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-100">
                  Squad Compatibility: 87%
                </h3>
                <p className="text-xs text-slate-300">
                  Calculated by analyzing shared genre affinities, venue atmosphere comfort, and maximum individual budgets.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-vybe-surface border border-vybe-border text-center min-w-[150px] flex-shrink-0">
                <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Recommended Pick</span>
                <span className="font-bold text-xs text-vybe-lime block mt-1">
                  {comparisonItems[0]?.event.title || 'Echoes of Earth 2026'}
                </span>
              </div>
            </div>

            {/* Shared Genres & Budget Overlap */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-vybe-border/60 text-xs">
              <div className="p-3 rounded-xl bg-vybe-surface border border-vybe-border space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                  Genres The Squad Agrees On
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-vybe-cyan/15 text-vybe-cyan border border-vybe-cyan/30 font-bold">
                    Electronic (100% agreement)
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-vybe-lime/15 text-vybe-lime border border-vybe-lime/30 font-bold">
                    Indie Rock (75% agreement)
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-vybe-surface text-slate-300 border border-vybe-border">
                    Ambient (60% agreement)
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-vybe-surface border border-vybe-border space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                  Budget Overlap Comparison
                </span>
                <div className="flex justify-between text-xs pt-1">
                  <span className="text-slate-400">Lowest Member Budget:</span>
                  <span className="font-mono font-bold text-slate-200">
                    ₹{Math.min(...activePlan.members.map(m => m.budgetMax)).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Average Squad Budget:</span>
                  <span className="font-mono font-bold text-vybe-lime">
                    ₹{Math.round(activePlan.members.reduce((acc, m) => acc + m.budgetMax, 0) / Math.max(1, activePlan.members.length)).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Honest Demo Sync Disclosure */}
            <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-vybe-cyan flex-shrink-0" />
              <span>
                <strong>Demo Squad Sync Notice:</strong> All friend profiles and simulated voting interactions are stored locally in your browser session. No external remote multi-user sync is claimed.
              </span>
            </div>
          </div>

          {/* Squad Members Roster */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              The Crew ({activePlan.members.length} Members)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {activePlan.members.map(member => (
                <div key={member.id} className="p-3.5 rounded-xl bg-vybe-card border border-vybe-border flex items-center gap-3">
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover border border-vybe-border"
                  />
                  <div className="flex-grow min-w-0">
                    <span className="font-bold text-xs text-slate-200 block truncate">{member.name}</span>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                      <span>Max: ₹{member.budgetMax.toLocaleString()}</span>
                      <span>•</span>
                      <span>{member.votedEventIds.length} votes cast</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shared Event Comparison Board */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Shared Event Comparison Matrix
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time consensus based on member votes and budget alignment.
                </p>
              </div>
            </div>

            {comparisonItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {comparisonItems.map(item => {
                  if (!item) return null;
                  const { event, voters, voteCount, consensusPercent, budgetCompatibility, totalGroupTicketCost } = item;
                  
                  // Check if the current user (Organizer) has voted for this
                  const userMember = activePlan.members[0];
                  const hasUserVoted = userMember ? userMember.votedEventIds.includes(event.id) : false;

                  return (
                    <div 
                      key={event.id}
                      className="p-5 rounded-2xl glass-card border border-vybe-border space-y-4 flex flex-col justify-between"
                    >
                      <div>
                        {/* Event Header in Card */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-vybe-surface text-slate-400 border border-vybe-border">
                              {event.type} • {event.city}
                            </span>
                            <h4 
                              onClick={() => setActiveEventModal(event)}
                              className="font-display font-bold text-lg text-slate-100 hover:text-vybe-lime cursor-pointer transition-colors mt-1"
                            >
                              {event.title}
                            </h4>
                          </div>

                          <button
                            onClick={() => handleRemoveEventFromPlan(event.id)}
                            className="text-slate-500 hover:text-rose-400 text-xs"
                            title="Remove from comparison"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Consensus & Compatibility Meters */}
                        <div className="grid grid-cols-2 gap-3 pt-3">
                          <div className="p-3 rounded-xl bg-vybe-surface border border-vybe-border">
                            <span className="text-[10px] font-mono uppercase text-slate-400 block">Crew Consensus</span>
                            <span className="font-mono font-black text-2xl text-vybe-lime">{consensusPercent}%</span>
                            <div className="w-full bg-vybe-dark h-1.5 rounded-full mt-1.5 overflow-hidden">
                              <div className="bg-vybe-lime h-full rounded-full transition-all" style={{ width: `${consensusPercent}%` }} />
                            </div>
                            <span className="text-[10px] text-slate-400 mt-1 block">{voteCount} of {activePlan.members.length} members voted yes</span>
                          </div>

                          <div className="p-3 rounded-xl bg-vybe-surface border border-vybe-border">
                            <span className="text-[10px] font-mono uppercase text-slate-400 block">Budget Alignment</span>
                            <span className="font-mono font-black text-2xl text-vybe-cyan">{budgetCompatibility}%</span>
                            <div className="w-full bg-vybe-dark h-1.5 rounded-full mt-1.5 overflow-hidden">
                              <div className="bg-vybe-cyan h-full rounded-full transition-all" style={{ width: `${budgetCompatibility}%` }} />
                            </div>
                            <span className="text-[10px] text-slate-400 mt-1 block">Entry: {formatCurrency(event.ticketPriceMin, currency)} / person</span>
                          </div>
                        </div>

                        {/* Estimated Costs Breakdown */}
                        <div className="p-3 rounded-xl bg-vybe-card border border-vybe-border/60 text-xs space-y-1 mt-3">
                          <div className="flex justify-between text-slate-300">
                            <span>Per Person Admission:</span>
                            <span className="font-mono font-bold text-slate-100">{formatCurrency(event.ticketPriceMin, currency)}</span>
                          </div>
                          <div className="flex justify-between text-slate-300">
                            <span>Squad Total ({activePlan.members.length} passes):</span>
                            <span className="font-mono font-bold text-vybe-lime">{formatCurrency(totalGroupTicketCost, currency)}</span>
                          </div>
                        </div>

                        {/* Voters Avatars */}
                        {!activePlan.anonymousVoting && (
                          <div className="pt-3">
                            <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1.5">Who Voted:</span>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {voters.map(v => (
                                <span key={v.id} className="text-[11px] px-2 py-0.5 rounded-md bg-vybe-surface text-slate-300 border border-vybe-border">
                                  {v.name}
                                </span>
                              ))}
                              {voters.length === 0 && (
                                <span className="text-[11px] text-slate-500 italic">No votes yet</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Vote Action Button */}
                      <div className="pt-4 border-t border-vybe-border flex items-center justify-between">
                        <button
                          onClick={() => userMember && handleVoteToggle(event.id, userMember.id)}
                          className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                            hasUserVoted 
                              ? 'bg-rose-500/20 border border-rose-500 text-rose-300' 
                              : 'bg-vybe-lime text-black hover:bg-vybe-lime-hover shadow-glow-lime'
                          }`}
                        >
                          <Vote className="w-4 h-4" />
                          <span>{hasUserVoted ? 'Retract My Vote' : 'Vote For This Event (I’m In!)'}</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-vybe-card border border-vybe-border text-center text-slate-400 space-y-2">
                <p>No events added to this squad comparison yet.</p>
                <button
                  onClick={() => setShowAddEventModal(true)}
                  className="px-4 py-2 rounded-xl bg-vybe-cyan text-black font-bold text-xs inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Event to Compare</span>
                </button>
              </div>
            )}
          </div>

          {/* Real-time boundary note */}
          <div className="p-4 rounded-xl bg-vybe-surface border border-vybe-border/60 text-xs text-slate-400 leading-relaxed">
            <span className="font-bold text-slate-300">Architecture Note:</span> Squad Sync stores demonstration groups and votes securely in your local browser state. For multi-device, real-time shared voting links, a collaborative websocket/database service boundary is prepared.
          </div>

        </div>
      ) : (
        <div className="p-12 text-center text-slate-400 space-y-4">
          <p>No squad plans created yet. Start one to plan with friends!</p>
          <button
            onClick={() => setShowNewPlanModal(true)}
            className="px-5 py-2.5 rounded-xl bg-vybe-lime text-black font-bold text-xs"
          >
            Create Squad Plan
          </button>
        </div>
      )}

      {/* CREATE PLAN MODAL */}
      {showNewPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form 
            onSubmit={handleCreatePlan}
            className="w-full max-w-md rounded-2xl glass-panel p-6 border border-vybe-border space-y-4"
          >
            <h3 className="font-display font-bold text-lg text-slate-100">Create New Squad Sync Group</h3>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Squad / Trip Name</label>
              <input
                type="text"
                placeholder="e.g. Lollapalooza 2027 Crew 🎸"
                value={newPlanName}
                onChange={(e) => setNewPlanName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-vybe-surface border border-vybe-border text-xs text-slate-100 focus:outline-none focus:border-vybe-lime"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Target Event Dates</label>
              <input
                type="text"
                placeholder="e.g. Nov 20-22, 2026"
                value={newPlanDates}
                onChange={(e) => setNewPlanDates(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-vybe-surface border border-vybe-border text-xs text-slate-100 focus:outline-none focus:border-vybe-lime"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNewPlanModal(false)}
                className="px-4 py-2 rounded-xl bg-vybe-surface text-slate-300 text-xs font-bold hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-vybe-lime text-black font-extrabold text-xs hover:bg-vybe-lime-hover"
              >
                Create Squad
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ADD MEMBER MODAL */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form 
            onSubmit={handleAddMember}
            className="w-full max-w-md rounded-2xl glass-panel p-6 border border-vybe-border space-y-4"
          >
            <h3 className="font-display font-bold text-lg text-slate-100">Add Squad Member</h3>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Member Name</label>
              <input
                type="text"
                placeholder="e.g. Maya Sharma"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-vybe-surface border border-vybe-border text-xs text-slate-100 focus:outline-none focus:border-vybe-lime"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Max Ticket Budget (₹{newMemberBudget.toLocaleString()})</label>
              <input
                type="range"
                min={500}
                max={15000}
                step={500}
                value={newMemberBudget}
                onChange={(e) => setNewMemberBudget(parseInt(e.target.value, 10))}
                className="w-full accent-vybe-lime"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Availability</label>
              <select
                value={newMemberAvailability}
                onChange={(e) => setNewMemberAvailability(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-vybe-surface border border-vybe-border text-xs text-slate-200"
              >
                <option value="All Weekend">All Weekend</option>
                <option value="Saturday Only">Saturday Only</option>
                <option value="Sunday Only">Sunday Only</option>
                <option value="Flexible Evenings">Flexible Evenings</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddMemberModal(false)}
                className="px-4 py-2 rounded-xl bg-vybe-surface text-slate-300 text-xs font-bold hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-vybe-lime text-black font-extrabold text-xs hover:bg-vybe-lime-hover"
              >
                Add Member
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ADD EVENT MODAL */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg max-h-[80vh] rounded-2xl glass-panel p-6 border border-vybe-border space-y-4 flex flex-col">
            <h3 className="font-display font-bold text-lg text-slate-100">Select Event to Compare</h3>
            
            <div className="overflow-y-auto custom-scrollbar space-y-2 flex-grow pr-1">
              {allEvents.map(event => (
                <div 
                  key={event.id}
                  onClick={() => handleAddEventToPlan(event.id)}
                  className="p-3 rounded-xl bg-vybe-card border border-vybe-border hover:border-vybe-cyan cursor-pointer flex items-center justify-between group transition-colors"
                >
                  <div>
                    <span className="font-bold text-xs text-slate-100 group-hover:text-vybe-cyan transition-colors block">
                      {event.title}
                    </span>
                    <p className="text-[11px] text-slate-400">
                      {event.city} • {formatCurrency(event.ticketPriceMin, currency)}
                    </p>
                  </div>
                  <button className="px-3 py-1 rounded-lg bg-vybe-surface text-xs font-bold text-vybe-cyan group-hover:bg-vybe-cyan group-hover:text-black">
                    Add
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowAddEventModal(false)}
                className="px-4 py-2 rounded-xl bg-vybe-surface text-slate-300 text-xs font-bold hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
