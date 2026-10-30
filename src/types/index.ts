// Types for VYBE Platform

export const VYBE_VERSION = '2.6.0';

export type MusicGenre = 
  | 'Pop' 
  | 'Rock' 
  | 'Indie' 
  | 'Electronic' 
  | 'EDM' 
  | 'Techno' 
  | 'House' 
  | 'Hip-hop' 
  | 'R&B' 
  | 'Jazz' 
  | 'Classical' 
  | 'Metal' 
  | 'Folk' 
  | 'Carnatic' 
  | 'Hindustani' 
  | 'Tamil Music' 
  | 'Bollywood' 
  | 'Punjabi' 
  | 'Ambient' 
  | 'Psytrance';

export type AtmosphereType = 
  | 'High-energy' 
  | 'Relaxed' 
  | 'Intimate' 
  | 'Experimental' 
  | 'Family-friendly' 
  | 'Cultural' 
  | 'Outdoors' 
  | 'Party-focused';

export type EventType = 
  | 'Music Festival' 
  | 'Concert' 
  | 'Club Gig' 
  | 'Warehouse Rave' 
  | 'Acoustic Session' 
  | 'Cultural Festival' 
  | 'College Fest' 
  | 'Multi-day Campout';

export type CrowdSize = 'Intimate (<500)' | 'Medium (500-3,000)' | 'Massive (3,000+)';

export interface AccessibilityFeature {
  id: string;
  label: string;
  description: string;
  status: 'verified' | 'unconfirmed' | 'not_supplied';
}

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  benefits: string[];
  status: 'available' | 'selling_fast' | 'sold_out' | 'announced';
}

export interface FestivalStage {
  id: string;
  name: string;
  genreFocus: string[];
  capacity: string;
  locationDescription: string;
  simulatedVibe: 'Electric Surge' | 'Euphoric & Packed' | 'Chilled & Groovy' | 'Mellow Ambient';
}

export interface FestivalPerformance {
  id: string;
  artistId: string;
  artistName: string;
  stageId: string;
  stageName: string;
  startTime: string; // "18:00"
  endTime: string;   // "19:30"
  day: string;       // "Day 1 - Friday"
  genre: MusicGenre;
  popularityScore: number; // 1-100
}

export interface EventItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  type: EventType;
  category: 'Festival' | 'Concert' | 'Underground' | 'Cultural' | 'Indie';
  genres: MusicGenre[];
  artists: string[];
  venueName: string;
  city: string;
  country: string;
  startDate: string; // ISO string e.g. "2026-11-15T16:00:00"
  endDate: string;
  durationHours: number;
  isOutdoor: boolean;
  coverImage: string;
  galleryImages: string[];
  ticketPriceMin: number;
  ticketPriceMax: number;
  currency: string;
  ticketTiers: TicketTier[];
  officialUrl?: string;
  isFree: boolean;
  isFamilyFriendly: boolean;
  isGroupFriendly: boolean;
  ageRestriction: string;
  atmosphere: AtmosphereType[];
  expectedCrowd: CrowdSize;
  accessibility: {
    wheelchair: boolean;
    stepFree: boolean;
    accessibleToilets: boolean;
    quietSensorySpaces: boolean;
    signLanguage: boolean;
    companionPolicy: string;
    sensoryNotes: string;
    verifiedByOrganizer: boolean;
  };
  sustainability: {
    publicTransitAvailable: boolean;
    transitAdvice: string;
    reusableCups: boolean;
    waterRefillStations: boolean;
    shuttleBuses: boolean;
    carbonOffsetInitiative: boolean;
  };
  stages?: FestivalStage[];
  performances?: FestivalPerformance[];
  ticketDropDate?: string; // For radar
  presaleDate?: string;
  dataSource: 'Verified Official' | 'Organizer Submission' | 'Curated Sample';
  lastUpdated: string;
  featured?: boolean;
  collectionTags: string[]; // e.g. ["Hidden Gems", "Sunset Sessions"]
}

export interface Artist {
  id: string;
  name: string;
  bio: string;
  genres: MusicGenre[];
  image: string;
  origin: string;
  upcomingEventIds: string[];
  relatedArtists: string[];
  topTracks: {
    title: string;
    duration: string;
    playCount: string;
  }[];
  recentSetlist: {
    tourName: string;
    lastCity: string;
    songs: string[];
    isConfirmed: boolean;
    sourceType: 'Historical Setlist' | 'Community Submission';
  };
  festivalPrepChecklist: {
    id: string;
    songTitle: string;
    type: 'Essential Anthem' | 'Crowd Chant' | 'Deep Cut' | 'Latest Release';
    whyListen: string;
  }[];
}

export interface VibeProfile {
  genres: MusicGenre[];
  favoriteArtists: string[];
  atmospheres: AtmosphereType[];
  crowdSizePreference: CrowdSize[];
  setting: 'Indoor' | 'Outdoor' | 'Either';
  energyLevel: number; // 1 to 5
  budgetMax: number;
  travelDistanceKm: number;
  socialPreference?: 'Solo Explorer' | 'Small Tight Crew' | 'Big Festival Tribe';
  scalePreference?: 'Intimate Club & Sessions' | 'Multi-Stage Mega Festivals' | 'Balanced Mix';
  culturalInterests: string[];
  accessibilityNeeds: string[];
  discoveryPersonality: {
    title: string;
    description: string;
    badgeEmoji: string;
    superpower: string;
  };
  lastUpdated: string;
}

export interface SquadMember {
  id: string;
  name: string;
  avatar: string;
  budgetMax: number;
  genres: MusicGenre[];
  availability: string;
  votedEventIds: string[];
}

export interface SquadPlan {
  id: string;
  name: string;
  eventDates: string;
  members: SquadMember[];
  targetEventIds: string[];
  anonymousVoting: boolean;
  status: 'Brainstorming' | 'Voting Open' | 'Locked In';
  createdAt: string;
}

export interface NightOutBudget {
  eventId: string;
  eventName: string;
  partySize: number;
  ticketPerPerson: number;
  transitCost: number;
  accommodationCost: number;
  foodCost: number;
  drinksCost: number;
  parkingCost: number;
  merchCost: number;
  activitiesCost: number;
  bufferPercent: number;
}

export interface PersonalScheduleEntry {
  id: string;
  eventId: string;
  performanceId: string;
  artistName: string;
  stageName: string;
  startTime: string;
  endTime: string;
  day: string;
  reminderMinutesBefore: number;
  notes?: string;
}

export interface FestivalQuest {
  id: string;
  title: string;
  category: 'Exploration' | 'Music Discovery' | 'Community' | 'Eco Impact' | 'Moments';
  description: string;
  badgeReward: string;
  badgeIcon: string;
  xpPoints?: number;
  completed: boolean;
  completedAt?: string;
  userNotes?: string;
}

export interface EventReview {
  id: string;
  eventId: string;
  eventName: string;
  authorName: string;
  avatar: string;
  ratingOverall: number;
  ratingMusic: number;
  ratingVenue: number;
  ratingCrowd: number;
  ratingAccessibility: number;
  title: string;
  comment: string;
  topTip: string;
  createdAt: string;
  isDemoSample: boolean;
  reported?: boolean;
}

export interface MemoryCapsule {
  id: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  venue: string;
  notes: string;
  favoriteMoment: string;
  bestSet: string;
  memorableQuote: string;
  rating: number;
  photos: string[]; // local data URLs or sample URLs
  createdAt: string;
}

export interface TicketAlert {
  id: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  dropDate: string;
  tierName: string;
  notifyAtSale: boolean;
  notify1DayBefore: boolean;
  notify1HourBefore: boolean;
  createdAt: string;
}

export interface MatchBreakdown {
  score: number;
  summary: string;
  reasons: {
    label: string;
    points: number;
    description: string;
  }[];
}
