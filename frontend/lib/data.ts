import { unstable_cache } from 'next/cache';
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

const BASE_URL = 'https://ewalgamescache.blob.core.windows.net/gamescache';

async function fetchFromCache<T>(
  endpoint: string,
  tags: string[],
  revalidate: number = 60
): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      next: { 
        revalidate,
        tags
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }
      throw new Error(`Failed to fetch ${endpoint}: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

export const getPlays = unstable_cache(
  async () => {
    const plays = await fetchFromCache<Play[]>('plays-ervwalter.json', [CACHE_TAGS.plays]);
    return plays.sort((a, b) => {
      const dateCompare = b.playDate.localeCompare(a.playDate);
      if (dateCompare !== 0) return dateCompare;
      return b.playId.localeCompare(a.playId);
    });
  },
  ['plays'],
  { revalidate: 60, tags: [CACHE_TAGS.plays] }
);

export const getRecentPlays = unstable_cache(
  async () => {
    const plays = await getPlays();
    return plays.slice(0, 100);
  },
  ['recent-plays'],
  { revalidate: 60, tags: [CACHE_TAGS.plays] }
);

export const getCollection = unstable_cache(
  async () => {
    const collection = await fetchFromCache<Game[]>('collection-ervwalter.json', [CACHE_TAGS.collection]);
    return collection.sort((a, b) => a.sortableName.localeCompare(b.sortableName));
  },
  ['collection'],
  { revalidate: 60, tags: [CACHE_TAGS.collection] }
);

export const getTopTen = unstable_cache(
  async () => {
    const topten = await fetchFromCache<TopTenItem[]>('top10-ervwalter.json', [CACHE_TAGS.topTen]);
    return topten;
  },
  ['top-ten'],
  { revalidate: 60, tags: [CACHE_TAGS.topTen] }
);

export const getStats = unstable_cache(
  async () => {
    return fetchFromCache<Stats>('stats-ervwalter.json', [CACHE_TAGS.stats]);
  },
  ['stats'],
  { revalidate: 60, tags: [CACHE_TAGS.stats] }
);

export const getInsights = unstable_cache(
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
