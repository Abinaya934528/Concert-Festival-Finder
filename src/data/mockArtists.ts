import type { Artist } from '../types';

export const MOCK_ARTISTS: Artist[] = [
  {
    id: 'art-bonobo',
    name: 'Bonobo (Simon Green)',
    bio: 'Seven-time Grammy-nominated British producer and composer Simon Green is heralded as one of the defining figures in modern ambient electronica. Blending live orchestral instrumentation with deep downtempo rhythms and shifting polyrhythms.',
    genres: ['Electronic', 'Ambient', 'Jazz'],
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    origin: 'Brighton, United Kingdom',
    upcomingEventIds: ['ev-echoes-earth-2026'],
    relatedArtists: ['Floating Points', 'Tycho', 'Four Tet', 'Maribou State'],
    topTracks: [
      { title: 'Kerala', duration: '3:57', playCount: '142M plays' },
      { title: 'Shadows (ft. Jordan Rakei)', duration: '4:45', playCount: '98M plays' },
      { title: 'Cirrus', duration: '5:52', playCount: '185M plays' },
      { title: 'Otomo (ft. O’Flynn)', duration: '6:11', playCount: '64M plays' }
    ],
    recentSetlist: {
      tourName: 'Fragments Live World Tour',
      lastCity: 'Alexandra Palace, London',
      songs: [
        'Polyghost (Live Intro)',
        'Rosewood',
        'Counterpart',
        'Kiara',
        'Kong',
        'Linked',
        'Age of Phase',
        'Otomo',
        'Break Apart',
        'Kerala (Encore)'
      ],
      isConfirmed: true,
      sourceType: 'Historical Setlist'
    },
    festivalPrepChecklist: [
      { id: 'prep-1', songTitle: 'Kerala', type: 'Essential Anthem', whyListen: 'His signature live transition track; the crowd erupts when the harp sample drops.' },
      { id: 'prep-2', songTitle: 'Otomo', type: 'Crowd Chant', whyListen: 'Massive live percussion and peak dance intensity.' },
      { id: 'prep-3', songTitle: 'Cirrus', type: 'Deep Cut', whyListen: 'Masterclass in organic percussion build-ups.' }
    ]
  },
  {
    id: 'art-prateek-kuhad',
    name: 'Prateek Kuhad',
    bio: 'Acclaimed singer-songwriter known for tender vocal delivery, acoustic fingerpicking, and poetic multilingual songwriting in Hindi and English that has captivated listeners worldwide, including Barack Obama’s favorite tracks.',
    genres: ['Indie', 'Folk', 'Pop'],
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
    origin: 'Jaipur / New Delhi, India',
    upcomingEventIds: ['ev-bombay-indie-after-dark'],
    relatedArtists: ['When Chai Met Toast', 'Anuv Jain', 'Tanmaya Bhatnagar'],
    topTracks: [
      { title: 'cold/mess', duration: '4:29', playCount: '210M plays' },
      { title: 'Kasoor', duration: '3:17', playCount: '160M plays' },
      { title: 'Tune Kaha', duration: '3:22', playCount: '115M plays' },
      { title: 'Co2', duration: '2:44', playCount: '85M plays' }
    ],
    recentSetlist: {
      tourName: 'The Way That Too Lovers Do Tour',
      lastCity: 'Jio World Garden, Mumbai',
      songs: [
        'All I Need',
        '100 Words',
        'Kasoor',
        'For Your Mind',
        'cold/mess',
        'Tune Kaha',
        'Dil Beparwah',
        'Co2 (Acoustic Unplugged)'
      ],
      isConfirmed: false,
      sourceType: 'Community Submission'
    },
    festivalPrepChecklist: [
      { id: 'prep-pk-1', songTitle: 'cold/mess', type: 'Essential Anthem', whyListen: 'Singalong staple of every live show.' },
      { id: 'prep-pk-2', songTitle: 'Kasoor', type: 'Crowd Chant', whyListen: 'The entire audience usually sings the bridge in unison.' },
      { id: 'prep-pk-3', songTitle: 'Co2', type: 'Latest Release', whyListen: 'Upbeat tempo with delightful rhythm.' }
    ]
  },
  {
    id: 'art-four-tet',
    name: 'Four Tet (Kieran Hebden)',
    bio: 'Pioneering electronic producer Kieran Hebden seamlessly traverses ambient glitch, microhouse, and massive festival bangers with his unmistakable touch for emotive rhythm and analog texture.',
    genres: ['Electronic', 'Techno', 'House', 'Ambient'],
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    origin: 'London, United Kingdom',
    upcomingEventIds: ['ev-magnetic-fields-2026'],
    relatedArtists: ['Floating Points', 'Caribou', 'Jon Hopkins', 'Bicep'],
    topTracks: [
      { title: 'Baby', duration: '4:24', playCount: '90M plays' },
      { title: 'Two Thousand and Seventeen', duration: '4:12', playCount: '110M plays' },
      { title: 'Looking at Your Pager', duration: '2:47', playCount: '75M plays' }
    ],
    recentSetlist: {
      tourName: 'Squids Live',
      lastCity: 'Finsbury Park, London',
      songs: [
        'Parallel 4',
        'Baby (Four Tet Club Edit)',
        'Looking at Your Pager',
        'Kool FM',
        'Only Human',
        'Two Thousand and Seventeen'
      ],
      isConfirmed: true,
      sourceType: 'Historical Setlist'
    },
    festivalPrepChecklist: [
      { id: 'prep-ft-1', songTitle: 'Looking at Your Pager', type: 'Essential Anthem', whyListen: 'Guaranteed festival peak bass drop.' },
      { id: 'prep-ft-2', songTitle: 'Baby', type: 'Crowd Chant', whyListen: 'Ellie Goulding vocal sample loop that hypnotizes the crowd.' }
    ]
  },
  {
    id: 'art-divine',
    name: 'DIVINE (Gully Gang)',
    bio: 'The undisputed voice of Mumbai street rap who ignited the Indian hip-hop revolution. Hard-hitting rhymes depicting authentic street realities, backed by blistering 808s and world-class flow.',
    genres: ['Hip-hop'],
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    origin: 'Mumbai, India',
    upcomingEventIds: ['ev-lollapalooza-india-2027'],
    relatedArtists: ['Naezy', 'Karan Kanchan', 'MC Stan', 'Seedhe Maut'],
    topTracks: [
      { title: 'Mirchi', duration: '3:35', playCount: '290M plays' },
      { title: '3:59 AM', duration: '4:10', playCount: '180M plays' },
      { title: 'Kaam 25', duration: '2:48', playCount: '140M plays' },
      { title: 'Gunehgar', duration: '3:15', playCount: '95M plays' }
    ],
    recentSetlist: {
      tourName: 'Gunehgar Arena Tour',
      lastCity: 'D.Y. Patil Stadium, Navi Mumbai',
      songs: [
        'Gunehgar',
        'Farak',
        'Kohinoor',
        'Chal Bombay',
        'Satya',
        '3:59 AM',
        'Mirchi (Finale)'
      ],
      isConfirmed: true,
      sourceType: 'Historical Setlist'
    },
    festivalPrepChecklist: [
      { id: 'prep-dv-1', songTitle: '3:59 AM', type: 'Essential Anthem', whyListen: 'His lyrical magnum opus; every rap fan knows the verses by heart.' },
      { id: 'prep-dv-2', songTitle: 'Mirchi', type: 'Crowd Chant', whyListen: 'Uncontrollable high-energy moshpit fuel.' }
    ]
  },
  {
    id: 'art-tm-krishna',
    name: 'T.M. Krishna',
    bio: 'Ramon Magsaysay awardee and vocal maestro renowned for democratizing classical music, questioning social hierarchies, and delivering transcendent Carnatic performances of pure sonic depth.',
    genres: ['Carnatic', 'Classical'],
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80',
    origin: 'Chennai, India',
    upcomingEventIds: ['ev-margazhi-classical-fusion'],
    relatedArtists: ['Sanjay Subrahmanyan', 'Bombay Jayashri', 'Agam Live'],
    topTracks: [
      { title: 'Kalyani Raga Alapana', duration: '18:20', playCount: '4.2M plays' },
      { title: 'Thodudaya Seviyan', duration: '11:15', playCount: '3.1M plays' },
      { title: 'Poromboke Song', duration: '6:45', playCount: '6.8M plays' }
    ],
    recentSetlist: {
      tourName: 'Winter Sangeeth Season',
      lastCity: 'Music Academy, Chennai',
      songs: [
        'Varnam in Natakurinji',
        'Kalyani Raga Vinyasam',
        'Tani Avartanam (Mridangam Solo)',
        'Bhajan in Sindhubhairavi'
      ],
      isConfirmed: true,
      sourceType: 'Historical Setlist'
    },
    festivalPrepChecklist: [
      { id: 'prep-tm-1', songTitle: 'Kalyani Raga Alapana', type: 'Essential Anthem', whyListen: 'Experience the microtonal nuances of pure Indian classical melody.' }
    ]
  }
];
