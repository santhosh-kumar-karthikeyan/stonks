'use server';
import { WatchlistEntry, Watchlists } from '@/data/models/watchlist.model';
import { DEFAULT_WATCHLIST_NAME } from '@/lib/constants';
import fs from 'fs';
import path from 'path';
import { slug } from 'slug-gen';
const WATCHLIST_PATH: string = path.join(
  process.cwd(),
  'data/raw/watchlist.json',
);
type Result<T> = { ok: true; data: T } | { ok: false; err: string };

export async function getWatchlistFromJSON(): Promise<Watchlists> {
  const watchlistJSON = fs.readFileSync(WATCHLIST_PATH, 'utf8');
  const watchlists: Watchlists = JSON.parse(watchlistJSON) as Watchlists;
  return watchlists;
}

export async function populateWatchlist(watchlists: Watchlists) {
  if (Object.entries(watchlists).length === 0) {
    const slugName = slug(DEFAULT_WATCHLIST_NAME);
    watchlists[slugName] = {
      id: slugName,
      name: DEFAULT_WATCHLIST_NAME,
      entries: [],
      lastAccessedAt: Date.now(),
    };
    await fs.writeFile(WATCHLIST_PATH, JSON.stringify(watchlists), () => {});
  }
}

export async function createWatchlist(
  name: string,
  defaultEntry?: WatchlistEntry,
): Promise<Result<string>> {
  const watchlists: Watchlists = await getWatchlistFromJSON();
  const slugName = slug(name);
  if (slugName in watchlists) {
    return { ok: false, err: 'Watchlist already present' };
  }
  await populateWatchlist(watchlists);
  watchlists[slugName] = {
    id: slugName,
    name: name,
    entries: defaultEntry ? [defaultEntry] : [],
    lastAccessedAt: Date.now(),
  };
  await fs.writeFile(WATCHLIST_PATH, JSON.stringify(watchlists), (err) => {
    if (err) {
      return { ok: false, err: 'Cannot write in database' };
    }
  });
  return { ok: true, data: slugName };
}

export async function addToWatchlist(
  entry: WatchlistEntry,
  watchlistId: string,
) {
  const watchlists: Watchlists = await getWatchlistFromJSON();
  if (!(watchlistId in watchlists)) {
    return;
  }
  const entries = watchlists[watchlistId].entries;
  if (entries.find((e) => e.id === entry.id)) return;
  const newEntries: WatchlistEntry[] = Array.from(
    new Set(watchlists[watchlistId].entries).add(entry),
  );

  watchlists[watchlistId].entries = newEntries;
  await fs.writeFile(WATCHLIST_PATH, JSON.stringify(watchlists), () => {});
}

export async function removeFromWatchlist(
  entryId: string,
  watchlistId: string,
) {
  const watchlists: Watchlists = await getWatchlistFromJSON();
  watchlists[watchlistId].entries = watchlists[watchlistId].entries.filter(
    (entry) => entry.id !== entryId,
  );
  await fs.writeFile(WATCHLIST_PATH, JSON.stringify(watchlists), () => {});
}

export async function deleteWatchlist(watchlistId: string) {
  const watchlists: Watchlists = await getWatchlistFromJSON();
  delete watchlists[watchlistId];
}
