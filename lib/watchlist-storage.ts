import { kv } from '@vercel/kv';
import { Watchlists } from '@/data/models/watchlist.model';
import fs from 'fs';
import path from 'path';

const WATCHLIST_PATH = path.join(process.cwd(), 'data/raw/watchlist.json');
const KV_KEY = 'watchlists';

function shouldUseKV(): boolean {
  return !!(
    process.env.KV_REST_API_URL && 
    process.env.KV_REST_API_TOKEN
  );
}

function canUseFileSystem(): boolean {
  try {
    fs.accessSync(WATCHLIST_PATH, fs.constants.R_OK | fs.constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

export async function getWatchlists(): Promise<Watchlists> {
  if (shouldUseKV()) {
    try {
      const watchlists = await kv.get<Watchlists>(KV_KEY);
      return watchlists || [];
    } catch (error) {
      console.error('KV read failed:', error);
      if (canUseFileSystem()) {
        const data = fs.readFileSync(WATCHLIST_PATH, 'utf-8');
        return JSON.parse(data) as Watchlists;
      }
      return [];
    }
  } else {
    if (canUseFileSystem()) {
      const data = fs.readFileSync(WATCHLIST_PATH, 'utf-8');
      return JSON.parse(data) as Watchlists;
    }
    return [];
  }
}

export async function saveWatchlists(watchlists: Watchlists): Promise<void> {
  if (shouldUseKV()) {
    try {
      await kv.set(KV_KEY, watchlists);
    } catch (error) {
      console.error('KV write failed:', error);
      if (canUseFileSystem()) {
        fs.writeFileSync(WATCHLIST_PATH, JSON.stringify(watchlists, null, 2));
      } else {
        throw new Error('Cannot save watchlists: KV failed and filesystem is read-only');
      }
    }
  } else {
    if (canUseFileSystem()) {
      fs.writeFileSync(WATCHLIST_PATH, JSON.stringify(watchlists, null, 2));
    } else {
      throw new Error('Cannot save watchlists: Filesystem is read-only and KV not configured');
    }
  }
}
