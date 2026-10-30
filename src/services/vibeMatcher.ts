import { EventItem, VibeProfile, MatchBreakdown, MusicGenre, AtmosphereType } from '../types';

/**
 * Calculates a transparent, explainable compatibility score between an event and user's Vibe Profile.
 * Max score is 100%.
 */
export function calculateVibeMatch(event: EventItem, profile: VibeProfile | null): MatchBreakdown {
  if (!profile) {
    // Default neutral match if no profile set yet
    return {
      score: 75,
      summary: 'General popularity match. Complete your Vibe DNA for personalized scoring.',
      reasons: [
        { label: 'Popular Event', points: 40, description: 'High community interest and curated status.' },
        { label: 'Baseline Fit', points: 35, description: 'Default discovery match based on universal appeal.' }
      ]
    };
  }

  let totalScore = 0;
  const reasons: { label: string; points: number; description: string }[] = [];

  // 1. Genre Compatibility (Max 40 points)
  const sharedGenres = event.genres.filter(g => profile.genres.includes(g));
  if (sharedGenres.length > 0) {
    const genreScore = Math.min(40, sharedGenres.length * 20);
    totalScore += genreScore;
    reasons.push({
      label: 'Genre Match',
      points: genreScore,
      description: `Features your favorite sound: ${sharedGenres.join(', ')}.`
    });
  } else {
    // Check adjacent genres for slight affinity
    totalScore += 5;
    reasons.push({
      label: 'Sound Discovery',
      points: 5,
      description: 'Expands your palette beyond your current top genres.'
    });
  }

  // 2. Favorite Artist presence (Max 20 points)
  const matchingArtists = event.artists.filter(artist => 
    profile.favoriteArtists.some(fav => fav.toLowerCase().trim() === artist.toLowerCase().trim())
  );
  if (matchingArtists.length > 0) {
    totalScore += 20;
    reasons.push({
      label: 'Artist In Lineup',
      points: 20,
      description: `Directly includes your saved artist: ${matchingArtists.join(', ')}.`
    });
  }

  // 3. Atmosphere Preference (Max 15 points)
  const sharedAtmosphere = event.atmosphere.filter(a => profile.atmospheres.includes(a));
  if (sharedAtmosphere.length > 0) {
    const atmosScore = Math.min(15, sharedAtmosphere.length * 8);
    totalScore += atmosScore;
    reasons.push({
      label: 'Atmosphere Fit',
      points: atmosScore,
      description: `Matches your preferred vibe: ${sharedAtmosphere.join(', ')}.`
    });
  }

  // 4. Setting (Indoor / Outdoor) (Max 10 points)
  if (profile.setting === 'Either') {
    totalScore += 10;
    reasons.push({
      label: 'Flexible Venue',
      points: 10,
      description: 'You are open to both indoor stages and open-air festival grounds.'
    });
  } else if ((profile.setting === 'Outdoor' && event.isOutdoor) || (profile.setting === 'Indoor' && !event.isOutdoor)) {
    totalScore += 10;
    reasons.push({
      label: 'Setting Match',
      points: 10,
      description: `Perfect ${profile.setting.toLowerCase()} environment matching your preference.`
    });
  }

  // 5. Budget Compatibility (Max 10 points)
  if (event.isFree) {
    totalScore += 10;
    reasons.push({
      label: 'Free Entry',
      points: 10,
      description: 'Zero admission cost, completely within your budget.'
    });
  } else if (event.ticketPriceMin <= profile.budgetMax) {
    totalScore += 10;
    reasons.push({
      label: 'Budget Friendly',
      points: 10,
      description: `Entry starts at ₹${event.ticketPriceMin.toLocaleString()}, well within your max ₹${profile.budgetMax.toLocaleString()}.`
    });
  } else if (event.ticketPriceMin <= profile.budgetMax * 1.25) {
    totalScore += 4;
    reasons.push({
      label: 'Slight Budget Stretch',
      points: 4,
      description: `Slightly above your ideal budget, but high value for the experience.`
    });
  }

  // 6. Accessibility Match (Max 5 points)
  if (profile.accessibilityNeeds && profile.accessibilityNeeds.length > 0) {
    let allMet = true;
    if (profile.accessibilityNeeds.includes('Wheelchair Access') && !event.accessibility.wheelchair) allMet = false;
    if (profile.accessibilityNeeds.includes('Quiet Sensory Spaces') && !event.accessibility.quietSensorySpaces) allMet = false;
    if (profile.accessibilityNeeds.includes('Sign Language Interpreter') && !event.accessibility.signLanguage) allMet = false;

    if (allMet) {
      totalScore += 5;
      reasons.push({
        label: 'Accessibility Verified',
        points: 5,
        description: 'Venue supports your specific comfort and accessibility requirements.'
      });
    }
  } else {
    // If no accessibility needs, award standard points
    totalScore += 5;
  }

  const finalScore = Math.min(99, Math.max(35, totalScore));

  // Synthesize short summary
  let summary = `Strong ${finalScore}% match based on your taste`;
  if (sharedGenres.length > 0 && sharedAtmosphere.length > 0) {
    summary = `Matched because you love ${sharedGenres[0].toLowerCase()} music and ${sharedAtmosphere[0].toLowerCase()} vibes.`;
  } else if (sharedGenres.length > 0) {
    summary = `Matched because you love ${sharedGenres.join(' & ')} performances.`;
  } else if (matchingArtists.length > 0) {
    summary = `Matched for ${matchingArtists[0]} live in your area.`;
  }

  return {
    score: finalScore,
    summary,
    reasons
  };
}

/**
 * Determines Discovery Personality based on user preferences.
 * Generates exact Vibe DNA archetypes:
 * - Midnight Raver
 * - Indie Explorer
 * - Festival Nomad
 * - Acoustic Soul
 * - Bass Hunter
 * - Pop Dreamer
 */
export function determineDiscoveryPersonality(
  genres: MusicGenre[],
  atmospheres: AtmosphereType[],
  energyLevel: number,
  scalePreference?: 'Intimate Club & Sessions' | 'Multi-Stage Mega Festivals' | 'Balanced Mix'
): { title: string; description: string; badgeEmoji: string; superpower: string } {
  const hasBass = genres.some(g => ['Psytrance', 'EDM', 'Techno', 'Metal'].includes(g));
  const isMidnightRave = genres.some(g => ['Techno', 'House', 'Electronic'].includes(g)) && (atmospheres.includes('Party-focused') || atmospheres.includes('Experimental') || energyLevel >= 4);
  const isIndie = genres.some(g => ['Indie', 'Rock', 'Folk'].includes(g));
  const isAcousticSoul = genres.some(g => ['Classical', 'Carnatic', 'Hindustani', 'Jazz', 'Ambient', 'Folk'].includes(g)) || atmospheres.includes('Intimate') || energyLevel <= 2;
  const isPop = genres.some(g => ['Pop', 'R&B', 'Bollywood', 'Punjabi', 'Tamil Music'].includes(g));
  const isFestivalLover = atmospheres.includes('Outdoors') || scalePreference === 'Multi-Stage Mega Festivals';

  // 1. Midnight Raver
  if (isMidnightRave && !hasBass) {
    return {
      title: 'Midnight Raver',
      description: 'You thrive in the after-hours glow, hypnotic 4/4 kicks, strobe-lit warehouse sanctuaries, and marathon club sets that stretch until sunrise.',
      badgeEmoji: '⚡',
      superpower: 'Always finds the secret underground afterparty before the headliner even finishes.'
    };
  }

  // 2. Bass Hunter
  if (hasBass && energyLevel >= 4) {
    return {
      title: 'Bass Hunter',
      description: 'You chase chest-rattling sub-frequencies, towering Funktion-One rigs, high-voltage dancefloors, and unapologetic sonic drops.',
      badgeEmoji: '🔊',
      superpower: 'Pinpoints the exact sweet spot on the dancefloor where the sub-bass hits hardest.'
    };
  }

  // 3. Festival Nomad
  if (isFestivalLover && energyLevel >= 3) {
    return {
      title: 'Festival Nomad',
      description: 'You live for multi-day campouts, wandering between dusty sunset stages, golden-hour live sets, and collecting wristbands like badges of honor.',
      badgeEmoji: '🎪',
      superpower: 'Flawless festival navigation with zero stage-hop FOMO and boundless weekend stamina.'
    };
  }

  // 4. Acoustic Soul
  if (isAcousticSoul) {
    return {
      title: 'Acoustic Soul',
      description: 'You value pristine acoustics, intimate candlelit listening rooms, heartfelt singer-songwriters, and virtuoso instrumental performances.',
      badgeEmoji: '🕯️',
      superpower: 'Can hear pure lyrical brilliance and pinpoint every nuance in an unamplified room.'
    };
  }

  // 5. Pop Dreamer
  if (isPop) {
    return {
      title: 'Pop Dreamer',
      description: 'You are all about anthemic choruses, dazzling stadium lighting, electric euphoria, and unity in collective stadium sing-alongs.',
      badgeEmoji: '✨',
      superpower: 'Knows every lyric to every encore and electrifies the crowd with contagious joy.'
    };
  }

  // 6. Indie Explorer (Default / Fallback)
  return {
    title: 'Indie Explorer',
    description: 'You uncover tomorrow’s headliners in small basement gigs today, treasuring thoughtful lyricism, fuzzy guitars, and authentic artistic soul.',
    badgeEmoji: '🎸',
    superpower: 'Uncanny intuition for uncovering hidden gem underground talent before they blow up.'
  };
}
