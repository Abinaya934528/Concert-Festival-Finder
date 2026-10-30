import type { FestivalQuest } from '../types';

export const DEFAULT_FESTIVAL_QUESTS: FestivalQuest[] = [
  {
    id: 'quest-vibe-dna',
    title: 'Complete Your Vibe DNA',
    category: 'Exploration',
    description: 'Tune your musical frequencies in the Vibe DNA Lab to decode your core concert personality archetype.',
    badgeReward: 'Aura Awakened Badge',
    badgeIcon: 'Sparkles',
    xpPoints: 250,
    completed: true,
    completedAt: '2026-10-25'
  },
  {
    id: 'quest-save-festival',
    title: 'Save Your First Festival',
    category: 'Exploration',
    description: 'Bookmark a festival or concert to your local watchlist to track tickets and updates.',
    badgeReward: 'Bookmark Sentinel',
    badgeIcon: 'Heart',
    xpPoints: 100,
    completed: true,
    completedAt: '2026-10-26'
  },
  {
    id: 'quest-build-schedule',
    title: 'Build Your First Schedule',
    category: 'Exploration',
    description: 'Add performances to your personal itinerary and resolve stage overlap conflicts.',
    badgeReward: 'Master Timekeeper',
    badgeIcon: 'Calendar',
    xpPoints: 200,
    completed: false
  },
  {
    id: 'quest-discover-artists',
    title: 'Discover 5 New Artists',
    category: 'Music Discovery',
    description: 'Explore the Artist Catalog and preview tracks or check off festival prep songs for 5 acts.',
    badgeReward: 'Aural Pioneer Badge',
    badgeIcon: 'Compass',
    xpPoints: 150,
    completed: false
  },
  {
    id: 'quest-create-squad',
    title: 'Create a Squad',
    category: 'Community',
    description: 'Assemble your concert crew in Squad Sync, compare music compatibility, and cast your votes.',
    badgeReward: 'Tribe Architect',
    badgeIcon: 'Users',
    xpPoints: 150,
    completed: false
  },
  {
    id: 'quest-explore-genres',
    title: 'Explore 3 Genres',
    category: 'Music Discovery',
    description: 'Filter events by at least 3 distinct genres to expand your live music comfort zone.',
    badgeReward: 'Sonic Polymath',
    badgeIcon: 'Radio',
    xpPoints: 100,
    completed: false
  },
  {
    id: 'quest-eco-hero',
    title: 'Zero Waste Wanderer',
    category: 'Eco Impact',
    description: 'Commit to using a single reusable cup and refill from free hydration stations throughout the entire event.',
    badgeReward: 'Green Guardian Badge',
    badgeIcon: 'Leaf',
    xpPoints: 100,
    completed: false
  },
  {
    id: 'quest-squad-moment',
    title: 'Capture a Memory Capsule',
    category: 'Moments',
    description: 'Log an attended event into your digital scrapbook with ratings, set highlights, and a photo.',
    badgeReward: 'Memory Alchemist',
    badgeIcon: 'Camera',
    xpPoints: 150,
    completed: false
  }
];
