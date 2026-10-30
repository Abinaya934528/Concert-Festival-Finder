import { 
  VibeProfile, 
  SquadPlan, 
  PersonalScheduleEntry, 
  FestivalQuest, 
  EventReview, 
  MemoryCapsule, 
  TicketAlert,
  NightOutBudget
} from '../types';

const STORAGE_KEYS = {
  VIBE_PROFILE: 'vybe_profile',
  SAVED_EVENTS: 'vybe_saved_events',
  FAV_ARTISTS: 'vybe_favorite_artists',
  SQUAD_PLANS: 'vybe_squad_plans',
  ACTIVE_BUDGET: 'vybe_active_budget',
  SCHEDULE: 'vybe_festival_schedule',
  QUESTS: 'vybe_festival_quests',
  REVIEWS: 'vybe_user_reviews',
  MEMORIES: 'vybe_memory_capsules',
  TICKET_ALERTS: 'vybe_ticket_alerts',
  RECENT_EVENTS: 'vybe_recent_events',
  PREFS: 'vybe_user_preferences',
};

// Safe JSON parser
function safeGet<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (err) {
    console.warn(`Failed reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed writing ${key} to localStorage:`, err);
  }
}

export const StorageService = {
  // Vibe Profile
  getProfile: (): VibeProfile | null => safeGet<VibeProfile | null>(STORAGE_KEYS.VIBE_PROFILE, null),
  saveProfile: (profile: VibeProfile): void => safeSet(STORAGE_KEYS.VIBE_PROFILE, profile),

  // Saved / Wishlisted Events
  getSavedEventIds: (): string[] => safeGet<string[]>(STORAGE_KEYS.SAVED_EVENTS, []),
  toggleSavedEvent: (eventId: string): string[] => {
    const current = safeGet<string[]>(STORAGE_KEYS.SAVED_EVENTS, []);
    const updated = current.includes(eventId) ? current.filter(id => id !== eventId) : [...current, eventId];
    safeSet(STORAGE_KEYS.SAVED_EVENTS, updated);
    return updated;
  },

  // Favorite Artists
  getFavoriteArtists: (): string[] => safeGet<string[]>(STORAGE_KEYS.FAV_ARTISTS, []),
  toggleFavoriteArtist: (artistId: string): string[] => {
    const current = safeGet<string[]>(STORAGE_KEYS.FAV_ARTISTS, []);
    const updated = current.includes(artistId) ? current.filter(id => id !== artistId) : [...current, artistId];
    safeSet(STORAGE_KEYS.FAV_ARTISTS, updated);
    return updated;
  },

  // Squad Sync Plans
  getSquadPlans: (): SquadPlan[] => safeGet<SquadPlan[]>(STORAGE_KEYS.SQUAD_PLANS, []),
  saveSquadPlan: (plan: SquadPlan): SquadPlan[] => {
    const list = safeGet<SquadPlan[]>(STORAGE_KEYS.SQUAD_PLANS, []);
    const existingIndex = list.findIndex(p => p.id === plan.id);
    let updated: SquadPlan[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = plan;
    } else {
      updated = [plan, ...list];
    }
    safeSet(STORAGE_KEYS.SQUAD_PLANS, updated);
    return updated;
  },
  deleteSquadPlan: (planId: string): SquadPlan[] => {
    const current = safeGet<SquadPlan[]>(STORAGE_KEYS.SQUAD_PLANS, []);
    const updated = current.filter(p => p.id !== planId);
    safeSet(STORAGE_KEYS.SQUAD_PLANS, updated);
    return updated;
  },

  // Active Night Out Budget
  getActiveBudget: (): NightOutBudget | null => safeGet<NightOutBudget | null>(STORAGE_KEYS.ACTIVE_BUDGET, null),
  saveActiveBudget: (budget: NightOutBudget): void => safeSet(STORAGE_KEYS.ACTIVE_BUDGET, budget),

  // Festival Schedule
  getSchedule: (): PersonalScheduleEntry[] => safeGet<PersonalScheduleEntry[]>(STORAGE_KEYS.SCHEDULE, []),
  saveScheduleEntry: (entry: PersonalScheduleEntry): PersonalScheduleEntry[] => {
    const list = safeGet<PersonalScheduleEntry[]>(STORAGE_KEYS.SCHEDULE, []);
    const updated = [...list.filter(e => e.id !== entry.id), entry];
    safeSet(STORAGE_KEYS.SCHEDULE, updated);
    return updated;
  },
  removeScheduleEntry: (entryId: string): PersonalScheduleEntry[] => {
    const list = safeGet<PersonalScheduleEntry[]>(STORAGE_KEYS.SCHEDULE, []);
    const updated = list.filter(e => e.id !== entryId);
    safeSet(STORAGE_KEYS.SCHEDULE, updated);
    return updated;
  },

  // Quests
  getQuests: (defaultQuests: FestivalQuest[]): FestivalQuest[] => {
    const stored = safeGet<FestivalQuest[]>(STORAGE_KEYS.QUESTS, []);
    if (stored.length === 0) return defaultQuests;
    // Merge any missing default quests
    const merged = defaultQuests.map(dq => {
      const found = stored.find(s => s.id === dq.id);
      return found || dq;
    });
    return merged;
  },
  saveQuests: (quests: FestivalQuest[]): void => safeSet(STORAGE_KEYS.QUESTS, quests),

  // Reviews
  getUserReviews: (): EventReview[] => safeGet<EventReview[]>(STORAGE_KEYS.REVIEWS, []),
  addUserReview: (review: EventReview): EventReview[] => {
    const current = safeGet<EventReview[]>(STORAGE_KEYS.REVIEWS, []);
    const updated = [review, ...current];
    safeSet(STORAGE_KEYS.REVIEWS, updated);
    return updated;
  },

  // Memories
  getMemories: (): MemoryCapsule[] => safeGet<MemoryCapsule[]>(STORAGE_KEYS.MEMORIES, []),
  saveMemory: (memory: MemoryCapsule): MemoryCapsule[] => {
    const current = safeGet<MemoryCapsule[]>(STORAGE_KEYS.MEMORIES, []);
    const updated = [memory, ...current.filter(m => m.id !== memory.id)];
    safeSet(STORAGE_KEYS.MEMORIES, updated);
    return updated;
  },
  deleteMemory: (memoryId: string): MemoryCapsule[] => {
    const current = safeGet<MemoryCapsule[]>(STORAGE_KEYS.MEMORIES, []);
    const updated = current.filter(m => m.id !== memoryId);
    safeSet(STORAGE_KEYS.MEMORIES, updated);
    return updated;
  },

  // Ticket Alerts
  getTicketAlerts: (): TicketAlert[] => safeGet<TicketAlert[]>(STORAGE_KEYS.TICKET_ALERTS, []),
  saveTicketAlert: (alert: TicketAlert): TicketAlert[] => {
    const list = safeGet<TicketAlert[]>(STORAGE_KEYS.TICKET_ALERTS, []);
    const updated = [alert, ...list.filter(a => a.eventId !== alert.eventId)];
    safeSet(STORAGE_KEYS.TICKET_ALERTS, updated);
    return updated;
  },
  removeTicketAlert: (eventId: string): TicketAlert[] => {
    const list = safeGet<TicketAlert[]>(STORAGE_KEYS.TICKET_ALERTS, []);
    const updated = list.filter(a => a.eventId !== eventId);
    safeSet(STORAGE_KEYS.TICKET_ALERTS, updated);
    return updated;
  },

  // Recently Viewed Events
  getRecentlyViewedIds: (): string[] => safeGet<string[]>(STORAGE_KEYS.RECENT_EVENTS, []),
  addRecentlyViewedId: (eventId: string): string[] => {
    const current = safeGet<string[]>(STORAGE_KEYS.RECENT_EVENTS, []);
    const filtered = current.filter(id => id !== eventId);
    const updated = [eventId, ...filtered].slice(0, 10);
    safeSet(STORAGE_KEYS.RECENT_EVENTS, updated);
    return updated;
  },

  // Export / Backup / Reset
  exportAllData: (): string => {
    const data: Record<string, unknown> = {};
    Object.values(STORAGE_KEYS).forEach(k => {
      try {
        const val = localStorage.getItem(k);
        if (val) data[k] = JSON.parse(val);
      } catch (e) {
        // ignore
      }
    });
    return JSON.stringify(data, null, 2);
  },
  clearAllData: (): void => {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  }
};
