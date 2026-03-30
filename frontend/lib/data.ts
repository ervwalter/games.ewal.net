import { unstable_cache as cache } from 'next/cache';
import { notFound } from 'next/navigation';
import { Game, Play, Stats, TopTenItem } from './games-interfaces';
import { getInsights as getInsightsOriginal } from "./insights";

// Mark this file as server-only to prevent accidental client-side imports
import 'server-only';

const CACHE_TAGS = {
  plays: 'plays',
  recentPlays: 'recent-plays',
  collection: 'collection',
  topTen: 'top-ten',
  stats: 'stats',
  insights: 'insights',
} as const;

// Helper function to get and validate environment variables at runtime
function getBaseUrl(): string {
  const doSpacesUrl = process.env.DO_SPACES_URL;

  if (!doSpacesUrl) {
    throw new Error('DO_SPACES_URL environment variable is required');
  }

  return doSpacesUrl;
}

async function fetchData<T>(endpoint: string): Promise<T> {
  const baseUrl = getBaseUrl();

  const response = await fetch(`${baseUrl}/${endpoint}`);

  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }
    throw new Error(`Failed to fetch ${endpoint}: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const getPlays = cache(
  async () => {
    const plays = await fetchData<Play[]>('plays.json');
    return plays.sort((a, b) => {
      const dateCompare = b.playDate.localeCompare(a.playDate);
      if (dateCompare !== 0) return dateCompare;
      return b.playId.localeCompare(a.playId);
    });
  },
  ['plays'],
  { revalidate: 60, tags: [CACHE_TAGS.plays] }
);

export const getRecentPlays = cache(
  async () => {
    const plays = await getPlays();
    return plays.slice(0, 100);
  },
  ['recent-plays'],
  { revalidate: 60, tags: [CACHE_TAGS.plays] }
);

export const getCollection = cache(
  async () => {
    const collection = await fetchData<Game[]>('collection.json');
    return collection.sort((a, b) => a.sortableName.localeCompare(b.sortableName));
  },
  ['collection'],
  { revalidate: 60, tags: [CACHE_TAGS.collection] }
);

export const getTopTen = cache(
  async () => {
    return fetchData<TopTenItem[]>('top10.json');
  },
  ['top-ten'],
  { revalidate: 60, tags: [CACHE_TAGS.topTen] }
);

export const getStats = cache(
  async () => {
    return fetchData<Stats>('stats.json');
  },
  ['stats'],
  { revalidate: 60, tags: [CACHE_TAGS.stats] }
);

export const getInsights = cache(
  async () => {
    return await getInsightsOriginal();
  },
  ['insights'],
  { revalidate: 60, tags: [CACHE_TAGS.insights] }
);

export function durationForPlay(play: Play): number {
  if (play.duration && play.duration > 0) {
    return play.duration;
  } else if (play.estimatedDuration && play.estimatedDuration > 0) {
    return play.estimatedDuration * play.numPlays;
  }
  return 0;
}
