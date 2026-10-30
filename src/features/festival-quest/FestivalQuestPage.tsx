import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { FestivalQuest } from '../../types';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Compass, 
  Sun, 
  Leaf, 
  Palette, 
  Camera, 
  Utensils, 
  Users, 
  ShieldCheck, 
  Edit3,
  Calendar,
  Heart,
  Radio,
  Trophy,
  Zap
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-5 h-5 text-vybe-lime" />,
  Heart: <Heart className="w-5 h-5 text-rose-400" />,
  Calendar: <Calendar className="w-5 h-5 text-vybe-violet-glow" />,
  Compass: <Compass className="w-5 h-5 text-vybe-cyan" />,
  Users: <Users className="w-5 h-5 text-vybe-lime" />,
  Radio: <Radio className="w-5 h-5 text-amber-400" />,
  Leaf: <Leaf className="w-5 h-5 text-emerald-400" />,
  Camera: <Camera className="w-5 h-5 text-pink-400" />,
  Sun: <Sun className="w-5 h-5 text-amber-400" />,
  Palette: <Palette className="w-5 h-5 text-purple-400" />,
  Utensils: <Utensils className="w-5 h-5 text-orange-400" />
};

export const FestivalQuestPage: React.FC = () => {
  const { quests, toggleQuest, showToast } = useApp();
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const completedQuests = quests.filter(q => q.completed);
  const totalXP = completedQuests.reduce((sum, q) => sum + (q.xpPoints || 100), 0);
  const maxXP = quests.reduce((sum, q) => sum + (q.xpPoints || 100), 0);
  
  const userLevel = Math.floor(totalXP / 300) + 1;
  const levelNames = [
    'Bedroom Listener',
    'Club Regular',
    'Festival Voyager',
    'Stage VIP',
    'Festival Legend'
  ];
  const levelTitle = levelNames[Math.min(userLevel - 1, levelNames.length - 1)];
  const xpInCurrentLevel = totalXP % 300;
  const levelProgressPercent = Math.min(100, Math.round((xpInCurrentLevel / 300) * 100));

  const handleToggle = (quest: FestivalQuest) => {
    const isNowCompleted = !quest.completed;
    toggleQuest(quest.id, quest.userNotes);
    if (isNowCompleted) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
      showToast(`🏆 Quest Unlocked: "${quest.title}" (+${quest.xpPoints || 100} XP)`);
    }
  };

  const handleOpenNotes = (quest: FestivalQuest) => {
    setEditingNotesId(quest.id);
    setNoteText(quest.userNotes || '');
  };

  const handleSaveNotes = (questId: string) => {
    toggleQuest(questId, noteText);
    setEditingNotesId(null);
    showToast('Journal note saved to quest badge!');
  };

  const filteredQuests = filterCategory === 'All' 
    ? quests 
    : quests.filter(q => q.category === filterCategory);

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vybe-lime/15 border border-vybe-lime/30 text-xs font-mono text-vybe-lime mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>Gamified Music Milestones & Quests</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-100">
            Festival Quest & Badges
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Challenge yourself to expand your musical horizons, explore new soundscapes, and earn XP badges persisted on your device.
          </p>
        </div>
      </div>

      {/* Level & XP Progress Showcase Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-vybe-lime/40 shadow-glow-lime/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-vybe-lime/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vybe-surface text-vybe-lime text-xs font-mono font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>Level {userLevel}: {levelTitle}</span>
            </div>

            <h2 className="font-display font-black text-3xl text-slate-100">
              {totalXP} / {maxXP} XP Earned
            </h2>
            <p className="text-xs text-slate-300 max-w-md leading-relaxed">
              {300 - xpInCurrentLevel} XP required to rank up to Level {userLevel + 1}. Complete quests below to level up your status.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-vybe-surface border border-vybe-border min-w-[150px]">
            <span className="font-mono font-black text-4xl text-vybe-lime">
              {completedQuests.length}/{quests.length}
            </span>
            <span className="text-[10px] font-mono text-slate-400 mt-1 uppercase font-bold">
              Badges Unlocked
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-vybe-dark h-2.5 rounded-full overflow-hidden mt-6">
          <div 
            className="h-full bg-gradient-to-r from-vybe-lime via-vybe-cyan to-vybe-violet-glow rounded-full transition-all duration-500"
            style={{ width: `${levelProgressPercent}%` }}
          />
        </div>
      </div>

      {/* Unlocked Badges Shelf */}
      {completedQuests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-vybe-lime" />
            <span>Unlocked Trophy Shelf</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {completedQuests.map(q => (
              <div 
                key={q.id}
                className="p-4 rounded-2xl glass-card border border-vybe-lime/30 text-center space-y-2 flex flex-col items-center justify-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-vybe-surface border border-vybe-lime/40 flex items-center justify-center text-xl shadow-glow-lime/20">
                  {ICON_MAP[q.badgeIcon] || <Award className="w-5 h-5 text-vybe-lime" />}
                </div>
                <span className="font-display font-bold text-xs text-slate-100 block">
                  {q.badgeReward}
                </span>
                <span className="text-[10px] font-mono text-vybe-lime font-bold">
                  +{q.xpPoints || 100} XP
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['All', 'Music Discovery', 'Exploration', 'Community', 'Eco Impact', 'Moments'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
              filterCategory === cat 
                ? 'bg-vybe-lime text-black border-vybe-lime font-bold shadow-glow-lime' 
                : 'bg-vybe-card border-vybe-border text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Quests List */}
      <div className="space-y-4">
        {filteredQuests.map(quest => (
          <div
            key={quest.id}
            className={`p-6 rounded-2xl border transition-all ${
              quest.completed 
                ? 'glass-panel border-vybe-lime/30 bg-vybe-surface/60' 
                : 'glass-panel border-vybe-border hover:border-slate-500'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  onClick={() => handleToggle(quest)}
                  className={`mt-1 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                    quest.completed 
                      ? 'bg-vybe-lime text-black shadow-glow-lime' 
                      : 'border border-slate-600 hover:border-vybe-lime'
                  }`}
                >
                  {quest.completed ? <CheckCircle2 className="w-4 h-4 fill-current" /> : null}
                </button>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-vybe-dark text-slate-400 font-bold">
                      {quest.category}
                    </span>
                    <span className="text-[10px] font-mono text-vybe-lime font-bold">
                      +{quest.xpPoints || 100} XP
                    </span>
                    {quest.completed && (
                      <span className="text-[10px] font-mono text-emerald-400">
                        • Completed on {quest.completedAt || 'Recently'}
                      </span>
                    )}
                  </div>

                  <h4 className={`font-display font-bold text-base ${quest.completed ? 'text-slate-300' : 'text-slate-100'}`}>
                    {quest.title}
                  </h4>

                  <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                    {quest.description}
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-xs font-mono text-vybe-violet-glow">
                    <span>Reward:</span>
                    <strong className="text-slate-200">{quest.badgeReward}</strong>
                  </div>

                  {/* Personal User Note on quest if present */}
                  {quest.userNotes && (
                    <div className="mt-2 p-2.5 rounded-xl bg-vybe-dark/80 border border-vybe-border text-xs text-slate-300 italic">
                      "{quest.userNotes}"
                    </div>
                  )}
                </div>
              </div>

              {/* Add Note Button */}
              <button
                onClick={() => handleOpenNotes(quest)}
                className="p-2 rounded-xl text-slate-400 hover:text-vybe-lime transition-colors flex-shrink-0"
                title="Add personal moment note"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            {/* Note Editor Drawer */}
            {editingNotesId === quest.id && (
              <div className="mt-4 pt-4 border-t border-vybe-border space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  Add Personal Event Note or Memory:
                </label>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="e.g. Discovered Floating Points at 2 AM under the canopy tree stage, life-changing sound design..."
                  className="w-full p-3 rounded-xl bg-vybe-surface border border-vybe-border text-xs text-slate-100 focus:outline-none focus:border-vybe-lime"
                  rows={2}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingNotesId(null)}
                    className="px-3 py-1.5 rounded-lg bg-vybe-surface text-slate-400 text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveNotes(quest.id)}
                    className="px-4 py-1.5 rounded-lg bg-vybe-lime text-black text-xs font-bold hover:bg-vybe-lime-hover"
                  >
                    Save Note
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
