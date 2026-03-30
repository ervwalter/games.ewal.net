import { cacheLife, cacheTag } from 'next/cache';
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
function getConfig() {
  const doSpacesUrl = process.env.DO_SPACES_URL;

  if (!doSpacesUrl) {
    throw new Error('DO_SPACES_URL environment variable is required');
  }

  return {
    doSpacesUrl,
    baseUrl: doSpacesUrl
  };
}

async function fetchFromCache<T>(endpoint: string): Promise<T> {
  const { baseUrl } = getConfig();

  try {
    const response = await fetch(`${baseUrl}/${endpoint}`);

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

export async function getPlays() {
  "use cache";
  cacheLife({ revalidate: 60 });
  cacheTag(CACHE_TAGS.plays);

  const plays = await fetchFromCache<Play[]>('plays.json');
  return plays.sort((a, b) => {
    const dateCompare = b.playDate.localeCompare(a.playDate);
    if (dateCompare !== 0) return dateCompare;
    return b.playId.localeCompare(a.playId);
  });
}

export async function getRecentPlays() {
  "use cache";
  cacheLife({ revalidate: 60 });
  cacheTag(CACHE_TAGS.plays);

  const plays = await getPlays();
  return plays.slice(0, 100);
}

export async function getCollection() {
  "use cache";
  cacheLife({ revalidate: 60 });
  cacheTag(CACHE_TAGS.collection);

  const collection = await fetchFromCache<Game[]>('collection.json');
  return collection.sort((a, b) => a.sortableName.localeCompare(b.sortableName));
}

export async function getTopTen() {
  "use cache";
  cacheLife({ revalidate: 60 });
  cacheTag(CACHE_TAGS.topTen);

  return fetchFromCache<TopTenItem[]>('top10.json');
}

export async function getStats() {
  "use cache";
  cacheLife({ revalidate: 60 });
  cacheTag(CACHE_TAGS.stats);

  return fetchFromCache<Stats>('stats.json');
}

export async function getInsights() {
  "use cache";
  cacheLife({ revalidate: 60 });
  cacheTag(CACHE_TAGS.insights);

  return await getInsightsOriginal();
}

export function durationForPlay(play: Play): number {
  if (play.duration && play.duration > 0) {
    return play.duration;
  } else if (play.estimatedDuration && play.estimatedDuration > 0) {
    return play.estimatedDuration * play.numPlays;
  }
  return 0;
}
