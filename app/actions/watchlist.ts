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

// export async function populateWatchlist(watchlists: Watchlists) {
//   if (watchlists.length === 0) {
//     const slugName = slug(DEFAULT_WATCHLIST_NAME);
//     watchlists.push({
//       id: slugName,
//       name: DEFAULT_WATCHLIST_NAME,
//       entries: [],
//       lastAccessedAt: Date.now(),
//     });
//     await fs.writeFile(WATCHLIST_PATH, JSON.stringify(watchlists), () => {});
//   }
// }

// export async function createWatchlist(
//   name: string,
//   defaultEntry?: WatchlistEntry,
// ): Promise<Result<string>> {
//   const watchlists: Watchlists = await getWatchlistFromJSON();
//   const slugName = slug(name);
//   if (slugName in watchlists) {
//     return { ok: false, err: 'Watchlist already present' };
//   }
//   await populateWatchlist(watchlists);
//   watchlists.push({
//     id: slugName,
//     name: name,
//     entries: defaultEntry ? [defaultEntry] : [],
//     lastAccessedAt: Date.now(),
//   });
//   await fs.writeFile(WATCHLIST_PATH, JSON.stringify(watchlists), (err) => {
//     if (err) {
//       return { ok: false, err: 'Cannot write in database' };
//     }
//   });
//   return { ok: true, data: slugName };
// }

export async function toggleToWatchlist(
  entry: WatchlistEntry,
  watchlistId: string,
) {
  const watchlists: Watchlists = await getWatchlistFromJSON();
  const watchlist = watchlists.find((list) => list.id === watchlistId);
  if (!watchlist) return;
  console.log("Found watchlist");
  console.table(watchlist);
  const entries = watchlist.entries;
  const index = entries.findIndex((e) => e.id === entry.id);
  const newEntries =
    index === -1
      ? [...entries, entry]
      : entries.filter((e) => e.id !== entry.id);
  watchlist.entries = newEntries;
  console.log("new watchlists: ");
  console.table(watchlists);
  await fs.writeFile(WATCHLIST_PATH, JSON.stringify(watchlists), () => {});
}

// redundant for now:
// export async function removeFromWatchlist(
//   entryId: string,
//   watchlistId: string,
// ) {
//   const watchlists: Watchlists = await getWatchlistFromJSON();
//   watchlists[watchlistId].entries = watchlists[watchlistId].entries.filter(
//     (entry) => entry.id !== entryId,
//   );
//   await fs.writeFile(WATCHLIST_PATH, JSON.stringify(watchlists), () => {});
// }

export async function deleteWatchlist(watchlistId: string) {
  const watchlists: Watchlists = (await getWatchlistFromJSON()).filter(
    (list) => list.id !== watchlistId,
  );
  await fs.writeFile(WATCHLIST_PATH, JSON.stringify(watchlists), () => {});
}