import { createClient } from 'redis';
import { Watchlists } from '@/data/models/watchlist.model';
import fs from 'fs';
import path from 'path';
import { DEFAULT_WATCHLIST_NAME } from './constants';
import { slug } from 'slug-gen';

const WATCHLIST_PATH = path.join(process.cwd(), 'data/raw/watchlist.json');
const REDIS_KEY = 'watchlists';

let redisClient: ReturnType<typeof createClient> | null = null;

async function getRedisClient() {
  if (redisClient) {
    return redisClient;
  }

  if (!process.env.REDIS_URL) {
    return null;
  }

  try {
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error('Redis connection failed:', error);
    return null;
  }
}

function canUseFileSystem(): boolean {
  try {
    fs.accessSync(WATCHLIST_PATH, fs.constants.R_OK | fs.constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

function ensureDefaultWatchlist(watchlists: Watchlists): Watchlists {
  const defaultId = slug(DEFAULT_WATCHLIST_NAME);
  const hasDefault = watchlists.some((w) => w.id === defaultId);

  if (!hasDefault) {
    watchlists.unshift({
      id: defaultId,
      name: DEFAULT_WATCHLIST_NAME,
      entries: [],
      lastAccessedAt: Date.now(),
    });
  }

  return watchlists;
}

export async function getWatchlists(): Promise<Watchlists> {
  const redis = await getRedisClient();

  if (redis) {
    try {
      const data = await redis.get(REDIS_KEY);
      if (data) {
        const watchlists = JSON.parse(data) as Watchlists;
        return ensureDefaultWatchlist(watchlists);
      }
      return ensureDefaultWatchlist([]);
    } catch (error) {
      console.error('Redis read failed:', error);
      if (canUseFileSystem()) {
        const data = fs.readFileSync(WATCHLIST_PATH, 'utf-8');
        const watchlists = JSON.parse(data) as Watchlists;
        return ensureDefaultWatchlist(watchlists);
      }
      return ensureDefaultWatchlist([]);
    }
  } else {
    if (canUseFileSystem()) {
      const data = fs.readFileSync(WATCHLIST_PATH, 'utf-8');
      const watchlists = JSON.parse(data) as Watchlists;
      return ensureDefaultWatchlist(watchlists);
    }
    return ensureDefaultWatchlist([]);
  }
}

export async function saveWatchlists(watchlists: Watchlists): Promise<void> {
  const redis = await getRedisClient();

  if (redis) {
    try {
      await redis.set(REDIS_KEY, JSON.stringify(watchlists));
    } catch (error) {
      console.error('Redis write failed:', error);
      if (canUseFileSystem()) {
        fs.writeFileSync(WATCHLIST_PATH, JSON.stringify(watchlists, null, 2));
      } else {
        throw new Error(
          'Cannot save watchlists: Redis failed and filesystem is read-only',
        );
      }
    }
  } else {
    if (canUseFileSystem()) {
      fs.writeFileSync(WATCHLIST_PATH, JSON.stringify(watchlists, null, 2));
    } else {
      throw new Error(
        'Cannot save watchlists: Filesystem is read-only and Redis not configured',
      );
    }
  }
}
