export interface VenueDetail {
  id: string;
  name: string;
  city: string;
  address: string;
  coordinates: { lat: number; lng: number };
  capacity: string;
  type: 'Outdoor Festival Grounds' | 'Heritage Palace' | 'Rooftop' | 'Warehouse' | 'Acoustic Auditorium' | 'Public Park';
  transitSummary: string;
  transitOptions: {
    type: 'Metro' | 'Bus' | 'Train' | 'Cab' | 'Walking';
    detail: string;
    distance: string;
  }[];
  nearbyFood: {
    name: string;
    cuisine: string;
    distance: string;
  }[];
  accessibilityAudit: {
    wheelchairRamps: 'Yes - Verified' | 'Partial' | 'None';
    dedicatedViewingBay: 'Elevated Deck' | 'Front Bay' | 'Unavailable';
    accessibleWashrooms: 'Yes - Braille & Handrails' | 'Standard only';
    quietZoneAvailable: boolean;
    tactilePaving: boolean;
    auditoriumAcousticTuning: string;
  };
  simulatedCrowdFeed: {
    currentStatus: 'Smooth Flow' | 'Moderate Density' | 'Peak Surge' | 'Calm / Spacious';
    entryQueueMinutes: number;
    barWaitMinutes: number;
    recommendedGate: string;
    lastUpdated: string;
  };
  stages: {
    name: string;
    vibe: string;
    soundSystem: string;
  }[];
}

export const MOCK_VENUES: Record<string, VenueDetail> = {
  'Embassy Riding School, Yelahanka': {
    id: 'ven-embassy-blr',
    name: 'Embassy Riding School, Yelahanka',
    city: 'Bengaluru',
    address: 'Near Stonehill International School, Tarunhunse Village, Yelahanka, Bengaluru 562157',
    coordinates: { lat: 13.1594, lng: 77.5629 },
    capacity: '12,000 across 3 open grass arenas',
    type: 'Outdoor Festival Grounds',
    transitSummary: 'Electric festival shuttles link directly to Nagasandra & Yelahanka Metro Stations.',
    transitOptions: [
      { type: 'Metro', detail: 'Nagasandra Metro (Green Line) + 20 min festival e-shuttle', distance: '12 km' },
      { type: 'Bus', detail: 'BMTC Route 285 from Majestic to Tarunhunse Cross', distance: '800 m walk' },
      { type: 'Cab', detail: 'Dedicated App-based Taxi Drop & Pickup Zone at Gate 3', distance: 'Direct' }
    ],
    nearbyFood: [
      { name: 'Festival Artisan Food Village', cuisine: 'Gourmet Woodfire Pizza, Vegan Bowls, Sourdough', distance: 'Inside grounds' },
      { name: 'Kavitha Traditional Mess', cuisine: 'Authentic South Indian Filter Coffee & Dosas', distance: '1.2 km away' }
    ],
    accessibilityAudit: {
      wheelchairRamps: 'Yes - Verified',
      dedicatedViewingBay: 'Elevated Deck',
      accessibleWashrooms: 'Yes - Braille & Handrails',
      quietZoneAvailable: true,
      tactilePaving: false,
      auditoriumAcousticTuning: 'Open-air acoustic dampening baffle screens between stages'
    },
    simulatedCrowdFeed: {
      currentStatus: 'Moderate Density',
      entryQueueMinutes: 6,
      barWaitMinutes: 4,
      recommendedGate: 'Gate 2 (Fast-Track Wristband Exchange)',
      lastUpdated: '10 mins ago (Simulated Demo Stream)'
    },
    stages: [
      { name: 'Earth Mainstage', vibe: 'Epic headliners & visual light tapestry', soundSystem: 'L-Acoustics K2 System' },
      { name: 'Canopy Forest Arena', vibe: 'Pulsing house & techno under twilight trees', soundSystem: 'd&b audiotechnik J-Series' },
      { name: 'The Acoustic Nest', vibe: 'Chill ambient, jazz & hammocks', soundSystem: 'Meyer Sound Linear Pro' }
    ]
  },
  'Mahalaxmi Racecourse': {
    id: 'ven-mahalaxmi-mum',
    name: 'Mahalaxmi Racecourse',
    city: 'Mumbai',
    address: 'Keshavrao Khadye Marg, Mahalaxmi, Mumbai 400034',
    coordinates: { lat: 18.9827, lng: 72.8229 },
    capacity: '45,000 festival spectators',
    type: 'Outdoor Festival Grounds',
    transitSummary: 'Right opposite Mahalaxmi Suburban Railway Station; easily reached via Western Railway.',
    transitOptions: [
      { type: 'Train', detail: 'Mahalaxmi Station (Western Railway line)', distance: '250 m walk' },
      { type: 'Metro', detail: 'Lower Parel Metro Station (Aqua Line 3)', distance: '1.4 km' },
      { type: 'Cab', detail: 'Designated drop off along Haji Ali seaside loop', distance: '400 m' }
    ],
    nearbyFood: [
      { name: 'Gallops Heritage Bistro', cuisine: 'Continental & Classic Club Dining', distance: 'Adjacent to paddock' },
      { name: 'Haji Ali Juice Centre', cuisine: 'Iconic Fresh Fruit Creams & Falooda', distance: '1.1 km' }
    ],
    accessibilityAudit: {
      wheelchairRamps: 'Yes - Verified',
      dedicatedViewingBay: 'Front Bay',
      accessibleWashrooms: 'Yes - Braille & Handrails',
      quietZoneAvailable: true,
      tactilePaving: true,
      auditoriumAcousticTuning: 'Stadium-grade delay towers minimizing sound spill'
    },
    simulatedCrowdFeed: {
      currentStatus: 'Peak Surge',
      entryQueueMinutes: 18,
      barWaitMinutes: 12,
      recommendedGate: 'Gate 4 (South Paddock Express)',
      lastUpdated: '5 mins ago (Simulated Demo Stream)'
    },
    stages: [
      { name: 'Budweiser Stage A', vibe: 'Massive stadium rock & international pop', soundSystem: 'JBL VTX Dual Array' },
      { name: 'Nexa Stage B', vibe: 'Hip-hop and electronic bangers', soundSystem: 'Funktion-One Vero' }
    ]
  },
  'The Boilerhouse Compound, Okhla Phase III': {
    id: 'ven-boilerhouse-del',
    name: 'The Boilerhouse Compound, Okhla Phase III',
    city: 'Delhi NCR',
    address: 'Industrial Plot 12, Okhla Industrial Area Phase III, New Delhi 110020',
    coordinates: { lat: 28.5355, lng: 77.2731 },
    capacity: '1,800 underground ravers',
    type: 'Warehouse',
    transitSummary: 'Govindpuri Metro Station on Violet line is under 1 km.',
    transitOptions: [
      { type: 'Metro', detail: 'Govindpuri Metro Station (Violet Line)', distance: '900 m' },
      { type: 'Cab', detail: 'Inner industrial lane drop directly in front of roll-up shutter', distance: 'Direct' }
    ],
    nearbyFood: [
      { name: 'Late Night Paratha Point', cuisine: 'Hot stuffed tandoori parathas & chai', distance: '400 m' }
    ],
    accessibilityAudit: {
      wheelchairRamps: 'Yes - Verified',
      dedicatedViewingBay: 'Unavailable',
      accessibleWashrooms: 'Standard only',
      quietZoneAvailable: true,
      tactilePaving: false,
      auditoriumAcousticTuning: 'Acoustic foam panelling and bass traps'
    },
    simulatedCrowdFeed: {
      currentStatus: 'Smooth Flow',
      entryQueueMinutes: 3,
      barWaitMinutes: 2,
      recommendedGate: 'Main Warehouse Roller Shutter Door',
      lastUpdated: '12 mins ago (Simulated Demo Stream)'
    },
    stages: [
      { name: 'The Cavern', vibe: 'Smoky, laser-sliced hypnotic industrial techno', soundSystem: 'Funktion-One Resolution 5' }
    ]
  }
};
