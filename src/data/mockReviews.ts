import type { EventReview, MusicGenre, AtmosphereType } from '../types';

export interface DemoBuddyProfile {
  id: string;
  name: string;
  city: string;
  tagline: string;
  avatar: string;
  topGenres: MusicGenre[];
  atmospheres: AtmosphereType[];
  lookingForEvents: string[];
  vibePersonality: string;
  safetyVerifiedBadge: boolean;
}

export const MOCK_BUDDIES: DemoBuddyProfile[] = [
  {
    id: 'buddy-1',
    name: 'Aanya Sharma',
    city: 'Bengaluru',
    tagline: 'Always near the front left speaker. Big fan of ambient synths and post-rock.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    topGenres: ['Ambient', 'Electronic', 'Indie'],
    atmospheres: ['Outdoors', 'Relaxed', 'Intimate'],
    lookingForEvents: ['Echoes of Earth 2026', 'Cubbon Park Acoustic Circle'],
    vibePersonality: 'Sonic Eclectic Explorer',
    safetyVerifiedBadge: true
  },
  {
    id: 'buddy-2',
    name: 'Kabir Mehta',
    city: 'Mumbai',
    tagline: 'Guitar nerd and festival photographer. Looking for an indie gig crew.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    topGenres: ['Indie', 'Rock', 'Folk'],
    atmospheres: ['Intimate', 'High-energy'],
    lookingForEvents: ['Bombay Indie After Dark', 'Lollapalooza India 2027'],
    vibePersonality: 'Indie Soul Nomad',
    safetyVerifiedBadge: true
  },
  {
    id: 'buddy-3',
    name: 'Rohan Sen',
    city: 'Delhi NCR',
    tagline: 'Bass music producer. Weekend raver, daytime techie.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    topGenres: ['Techno', 'Electronic', 'House'],
    atmospheres: ['High-energy', 'Party-focused', 'Experimental'],
    lookingForEvents: ['SUBKUTIR: Industrial Underground Rave 004', 'Goa Sun & Bass'],
    vibePersonality: 'Neon Alchemist',
    safetyVerifiedBadge: true
  },
  {
    id: 'buddy-4',
    name: 'Meera Swaminathan',
    city: 'Chennai',
    tagline: 'Carnatic violin student with a passion for jazz harmonies and fusion jams.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    topGenres: ['Carnatic', 'Classical', 'Jazz', 'Tamil Music'],
    atmospheres: ['Cultural', 'Intimate', 'Relaxed'],
    lookingForEvents: ['Margazhi Reimagined: Classical Carnatic & Jazz Symphony'],
    vibePersonality: 'Heritage Harmony Seeker',
    safetyVerifiedBadge: true
  }
];

export const MOCK_REVIEWS: EventReview[] = [
  {
    id: 'rev-1',
    eventId: 'ev-echoes-earth-2026',
    eventName: 'Echoes of Earth 2026',
    authorName: 'Tara Deshmukh',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    ratingOverall: 5,
    ratingMusic: 5,
    ratingVenue: 5,
    ratingCrowd: 4,
    ratingAccessibility: 5,
    title: 'The cleanest and most respectful festival crowd in India',
    comment: 'The sound clarity under the banyan trees at the Earth Stage was breathtaking. Truly zero trash on the ground thanks to the deposit cup system.',
    topTip: 'Take the electric shuttle from Nagasandra Metro. Trying to book a cab back after midnight is hectic.',
    createdAt: '2025-12-08',
    isDemoSample: true
  },
  {
    id: 'rev-2',
    eventId: 'ev-bombay-indie-after-dark',
    eventName: 'Bombay Indie After Dark',
    authorName: 'Aditya Roy',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    ratingOverall: 5,
    ratingMusic: 5,
    ratingVenue: 4,
    ratingCrowd: 5,
    ratingAccessibility: 4,
    title: 'Unbelievable sunset view with Prateek Kuhad’s acoustic set',
    comment: 'Hearing 400 people gently sing along as the sun dipped behind the Arabian Sea gave me absolute chills.',
    topTip: 'Arrive 30 mins before sunset to secure the front row beanbags on the wooden deck.',
    createdAt: '2025-11-20',
    isDemoSample: true
  },
  {
    id: 'rev-3',
    eventId: 'ev-subkutir-warehouse-rave',
    eventName: 'SUBKUTIR Warehouse Rave',
    authorName: 'Vikram Joshi',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    ratingOverall: 4,
    ratingMusic: 5,
    ratingVenue: 4,
    ratingCrowd: 5,
    ratingAccessibility: 3,
    title: 'Relentless bass. The no-phone policy made everyone actually dance!',
    comment: 'Funktion-One sound was dialed in with surgery precision. Deep physical bass and amazing industrial aesthetic.',
    topTip: 'Bring quality high-fidelity earplugs. It peaks around 102dB inside the cavern.',
    createdAt: '2025-10-15',
    isDemoSample: true
  }
];
