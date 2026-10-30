import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  VibeProfile, 
  EventItem, 
  Artist, 
  SquadPlan, 
  NightOutBudget, 
  PersonalScheduleEntry, 
  FestivalQuest, 
  EventReview, 
  MemoryCapsule, 
  TicketAlert 
} from '../types';
import { MOCK_EVENTS } from '../data/mockEvents';
import { MOCK_ARTISTS } from '../data/mockArtists';
import { DEFAULT_FESTIVAL_QUESTS } from '../data/mockQuests';
import { MOCK_REVIEWS } from '../data/mockReviews';
import { StorageService } from '../services/storageService';
import { determineDiscoveryPersonality } from '../services/vibeMatcher';
import confetti from 'canvas-confetti';

export type NavigationPage = 
  | 'discover' 
  | 'explore' 
  | 'vibe-dna' 
  | 'artist-explorer' 
  | 'squad-sync' 
  | 'budget-planner' 
  | 'crowd-mood-map' 
  | 'festival-schedule' 
  | 'festival-quest' 
  | 'ticket-drop-radar' 
  | 'accessibility-guide' 
  | 'saved-events' 
  | 'memory-capsule' 
  | 'reviews' 
  | 'event-buddy'
  | 'user-preferences';

interface AppContextType {
  currentPage: NavigationPage;
  setCurrentPage: (page: NavigationPage) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  currency: string;
  setCurrency: (c: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  
  // Events & Artists
  allEvents: EventItem[];
  allArtists: Artist[];
  activeEventModal: EventItem | null;
  setActiveEventModal: (event: EventItem | null) => void;
  activeArtistModal: Artist | null;
  setActiveArtistModal: (artist: Artist | null) => void;
  
  // Vibe Profile
  vibeProfile: VibeProfile | null;
  saveVibeProfile: (profile: VibeProfile) => void;
  
  // Saved & Favorites
  savedEventIds: string[];
  toggleSavedEvent: (id: string) => void;
  favoriteArtistIds: string[];
  toggleFavoriteArtist: (id: string) => void;
  recentlyViewedIds: string[];
  recordViewedEvent: (id: string) => void;
  
  // Squad Sync
  squadPlans: SquadPlan[];
  saveSquadPlan: (plan: SquadPlan) => void;
  deleteSquadPlan: (id: string) => void;
  
  // Budget Planner
  activeBudget: NightOutBudget;
  updateActiveBudget: (budget: Partial<NightOutBudget>) => void;
  budgetFilterLimit: number | null;
  setBudgetFilterLimit: (val: number | null) => void;
  applyBudgetFilterToDiscovery: (maxTicketPrice: number) => void;
  
  // Schedule
  festivalSchedule: PersonalScheduleEntry[];
  addScheduleEntry: (entry: PersonalScheduleEntry) => { success: boolean; conflict?: PersonalScheduleEntry };
  removeScheduleEntry: (id: string) => void;
  
  // Quests
  quests: FestivalQuest[];
  toggleQuest: (id: string, notes?: string) => void;
  
  // Reviews & Memories
  reviews: EventReview[];
  addReview: (review: Omit<EventReview, 'id' | 'createdAt' | 'isDemoSample'>) => void;
  memories: MemoryCapsule[];
  saveMemory: (memory: MemoryCapsule) => void;
  deleteMemory: (id: string) => void;
  
  // Ticket Alerts
  ticketAlerts: TicketAlert[];
  saveTicketAlert: (alert: TicketAlert) => void;
  removeTicketAlert: (eventId: string) => void;
  
  // Discovery Navigation helper
  collectionFilter: string | null;
  setCollectionFilter: (tag: string | null) => void;
  
  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Default Vibe Profile so new users have smart recommendations out of the box
const DEFAULT_VIBE_PROFILE: VibeProfile = {
  genres: ['Electronic', 'Indie', 'Ambient', 'Rock'],
  favoriteArtists: ['Bonobo', 'Prateek Kuhad'],
  atmospheres: ['Outdoors', 'Relaxed', 'High-energy'],
  crowdSizePreference: ['Medium (500-3,000)', 'Massive (3,000+)'],
  setting: 'Either',
  energyLevel: 4,
  budgetMax: 5000,
  travelDistanceKm: 150,
  culturalInterests: ['Modern Art Installations', 'Live Acoustics'],
  accessibilityNeeds: [],
  discoveryPersonality: determineDiscoveryPersonality(['Electronic', 'Indie'], ['Outdoors', 'High-energy'], 4),
  lastUpdated: new Date().toISOString()
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('discover');
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [currency, setCurrency] = useState<string>('INR');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [collectionFilter, setCollectionFilter] = useState<string | null>(null);
  const [budgetFilterLimit, setBudgetFilterLimit] = useState<number | null>(null);

  const [activeEventModal, setActiveEventModal] = useState<EventItem | null>(null);
  const [activeArtistModal, setActiveArtistModal] = useState<Artist | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // LocalStorage state
  const [vibeProfile, setVibeProfileState] = useState<VibeProfile | null>(() => {
    return StorageService.getProfile() || DEFAULT_VIBE_PROFILE;
  });

  const [savedEventIds, setSavedEventIds] = useState<string[]>(() => StorageService.getSavedEventIds());
  const [favoriteArtistIds, setFavoriteArtistIds] = useState<string[]>(() => StorageService.getFavoriteArtists());
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => StorageService.getRecentlyViewedIds());
  const [squadPlans, setSquadPlans] = useState<SquadPlan[]>(() => {
    const existing = StorageService.getSquadPlans();
    if (existing.length > 0) return existing;
    // Default initial mock squad plan to demonstrate feature immediately
    return [
      {
        id: 'squad-demo-1',
        name: 'Echoes of Earth Weekend Crew 🌿',
        eventDates: 'Dec 5-6, 2026',
        targetEventIds: ['ev-echoes-earth-2026', 'ev-goa-sun-bass-camp'],
        anonymousVoting: false,
        status: 'Voting Open',
        createdAt: '2026-10-25',
        members: [
          { id: 'm-1', name: 'You (Host)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80', budgetMax: 6000, genres: ['Electronic', 'Indie'], availability: 'All Weekend', votedEventIds: ['ev-echoes-earth-2026'] },
          { id: 'm-2', name: 'Rohan K.', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80', budgetMax: 5000, genres: ['Electronic', 'Techno'], availability: 'Saturday Only', votedEventIds: ['ev-echoes-earth-2026'] },
          { id: 'm-3', name: 'Pooja V.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80', budgetMax: 8000, genres: ['Indie', 'Jazz'], availability: 'All Weekend', votedEventIds: ['ev-echoes-earth-2026', 'ev-goa-sun-bass-camp'] }
        ]
      }
    ];
  });

  const [activeBudget, setActiveBudget] = useState<NightOutBudget>(() => {
    return StorageService.getActiveBudget() || {
      eventId: 'ev-echoes-earth-2026',
      eventName: 'Echoes of Earth 2026',
      partySize: 2,
      ticketPerPerson: 4499,
      transitCost: 1200,
      accommodationCost: 3500,
      foodCost: 1400,
      drinksCost: 1600,
      parkingCost: 400,
      merchCost: 1500,
      activitiesCost: 500,
      bufferPercent: 12
    };
  });

  const [festivalSchedule, setFestivalSchedule] = useState<PersonalScheduleEntry[]>(() => {
    const existing = StorageService.getSchedule();
    if (existing.length > 0) return existing;
    return [
      {
        id: 'sch-1',
        eventId: 'ev-echoes-earth-2026',
        performanceId: 'perf-1',
        artistName: 'Bonobo (Live Ensemble)',
        stageName: 'The Johnnie Walker Earth Stage',
        startTime: '20:30',
        endTime: '22:15',
        day: 'Day 1 - Saturday',
        reminderMinutesBefore: 30
      }
    ];
  });

  const [quests, setQuests] = useState<FestivalQuest[]>(() => StorageService.getQuests(DEFAULT_FESTIVAL_QUESTS));
  
  const [reviews, setReviews] = useState<EventReview[]>(() => {
    const userReviews = StorageService.getUserReviews();
    return [...userReviews, ...MOCK_REVIEWS];
  });

  const [memories, setMemories] = useState<MemoryCapsule[]>(() => {
    const userMemories = StorageService.getMemories();
    if (userMemories.length > 0) return userMemories;
    // Sample initial memory
    return [
      {
        id: 'mem-sample-1',
        eventId: 'ev-bombay-indie-after-dark',
        eventName: 'Bombay Indie After Dark (Previous Edition)',
        eventDate: 'Nov 14, 2025',
        venue: 'The Dome at Bayview, Bandra West',
        notes: 'Unforgettable golden hour breeze. Tanmaya Bhatnagar sang an unreleased ballad that silenced the entire rooftop.',
        favoriteMoment: 'Singing the chorus of cold/mess with 400 people while the sunset lit up the Arabian Sea.',
        bestSet: 'Prateek Kuhad Unplugged',
        memorableQuote: '"The ocean remembers all the songs we forgot to sing."',
        rating: 5,
        photos: [
          'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80'
        ],
        createdAt: '2025-11-15'
      }
    ];
  });

  const [ticketAlerts, setTicketAlerts] = useState<TicketAlert[]>(() => StorageService.getTicketAlerts());

  // Keep Theme updated in document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  const saveVibeProfile = (profile: VibeProfile) => {
    setVibeProfileState(profile);
    StorageService.saveProfile(profile);
    showToast('Your Vibe DNA was updated! Recommendations refreshed.');
  };

  const toggleSavedEvent = (id: string) => {
    const updated = StorageService.toggleSavedEvent(id);
    setSavedEventIds(updated);
    const isSaved = updated.includes(id);
    showToast(isSaved ? 'Event saved to your personal radar.' : 'Event removed from saved list.');
  };

  const toggleFavoriteArtist = (id: string) => {
    const updated = StorageService.toggleFavoriteArtist(id);
    setFavoriteArtistIds(updated);
    const isFav = updated.includes(id);
    showToast(isFav ? 'Artist added to your favorites!' : 'Artist removed from favorites.');
  };

  const recordViewedEvent = (id: string) => {
    const updated = StorageService.addRecentlyViewedId(id);
    setRecentlyViewedIds(updated);
  };

  const saveSquadPlan = (plan: SquadPlan) => {
    const updated = StorageService.saveSquadPlan(plan);
    setSquadPlans(updated);
    showToast(`Squad Plan "${plan.name}" saved!`);
  };

  const deleteSquadPlan = (id: string) => {
    const updated = StorageService.deleteSquadPlan(id);
    setSquadPlans(updated);
    showToast('Squad plan removed.');
  };

  const updateActiveBudget = (partial: Partial<NightOutBudget>) => {
    const updated = { ...activeBudget, ...partial };
    setActiveBudget(updated);
    StorageService.saveActiveBudget(updated);
  };

  const applyBudgetFilterToDiscovery = (maxTicketPrice: number) => {
    setBudgetFilterLimit(maxTicketPrice);
    setCurrentPage('explore');
    showToast(`Filtering experiences under ₹${maxTicketPrice.toLocaleString()}!`);
  };

  const addScheduleEntry = (entry: PersonalScheduleEntry): { success: boolean; conflict?: PersonalScheduleEntry } => {
    // Check for overlap on the same day!
    const conflict = festivalSchedule.find(existing => {
      if (existing.day !== entry.day) return false;
      // Simple time overlap check
      const startA = parseInt(entry.startTime.replace(':', ''), 10);
      const endA = parseInt(entry.endTime.replace(':', ''), 10);
      const startB = parseInt(existing.startTime.replace(':', ''), 10);
      const endB = parseInt(existing.endTime.replace(':', ''), 10);
      return Math.max(startA, startB) < Math.min(endA, endB);
    });

    if (conflict) {
      showToast(`⚠️ Schedule Conflict: ${entry.artistName} overlaps with ${conflict.artistName}!`);
      // We still allow adding, but flag conflict
    }

    const updated = StorageService.saveScheduleEntry(entry);
    setFestivalSchedule(updated);
    if (!conflict) {
      showToast(`Added ${entry.artistName} to your festival schedule!`);
    }
    return { success: true, conflict };
  };

  const removeScheduleEntry = (id: string) => {
    const updated = StorageService.removeScheduleEntry(id);
    setFestivalSchedule(updated);
    showToast('Performance removed from personal schedule.');
  };

  const toggleQuest = (id: string, notes?: string) => {
    const updated = quests.map(q => {
      if (q.id === id) {
        const nextState = !q.completed;
        if (nextState) {
          // Trigger celebratory confetti effect
          try {
            confetti({
              particleCount: 60,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#ccff00', '#9d4edd', '#00f5d4', '#ff007f']
            });
          } catch (e) {
            // fallback
          }
          showToast(`🏆 Unlocked: ${q.badgeReward}!`);
        }
        return {
          ...q,
          completed: nextState,
          completedAt: nextState ? new Date().toISOString() : undefined,
          userNotes: notes !== undefined ? notes : q.userNotes
        };
      }
      return q;
    });
    setQuests(updated);
    StorageService.saveQuests(updated);
  };

  const addReview = (reviewData: Omit<EventReview, 'id' | 'createdAt' | 'isDemoSample'>) => {
    const newRev: EventReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      isDemoSample: false
    };
    const updated = StorageService.addUserReview(newRev);
    setReviews([newRev, ...reviews]);
    showToast('Review submitted! Thank you for sharing your experience.');
  };

  const saveMemory = (mem: MemoryCapsule) => {
    const updated = StorageService.saveMemory(mem);
    setMemories(updated);
    showToast('Memory locked into your digital capsule!');
  };

  const deleteMemory = (id: string) => {
    const updated = StorageService.deleteMemory(id);
    setMemories(updated);
    showToast('Memory entry deleted.');
  };

  const saveTicketAlert = (alert: TicketAlert) => {
    const updated = StorageService.saveTicketAlert(alert);
    setTicketAlerts(updated);
    showToast(`Ticket Drop Radar active for ${alert.eventName}!`);
    // Attempt browser notification permission request if supported
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const removeTicketAlert = (eventId: string) => {
    const updated = StorageService.removeTicketAlert(eventId);
    setTicketAlerts(updated);
    showToast('Ticket alert cancelled.');
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedCity,
        setSelectedCity,
        currency,
        setCurrency,
        theme,
        toggleTheme,
        allEvents: MOCK_EVENTS,
        allArtists: MOCK_ARTISTS,
        activeEventModal,
        setActiveEventModal,
        activeArtistModal,
        setActiveArtistModal,
        vibeProfile,
        saveVibeProfile,
        savedEventIds,
        toggleSavedEvent,
        favoriteArtistIds,
        toggleFavoriteArtist,
        recentlyViewedIds,
        recordViewedEvent,
        squadPlans,
        saveSquadPlan,
        deleteSquadPlan,
        activeBudget,
        updateActiveBudget,
        budgetFilterLimit,
        setBudgetFilterLimit,
        applyBudgetFilterToDiscovery,
        festivalSchedule,
        addScheduleEntry,
        removeScheduleEntry,
        quests,
        toggleQuest,
        reviews,
        addReview,
        memories,
        saveMemory,
        deleteMemory,
        ticketAlerts,
        saveTicketAlert,
        removeTicketAlert,
        collectionFilter,
        setCollectionFilter,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
