'use server';
import { WatchlistEntry, Watchlists } from '@/data/models/watchlist.model';
import { revalidateTag } from 'next/cache';

const API_URL = 'http://localhost:3000';

export async function getWatchlistFromJSON(): Promise<Watchlists> {
  const watchlists = await fetch(`${API_URL}/api/watchlists`, {
    next: { tags: ['watchlists'] },
  }).then((res) => res.json());
  return watchlists as Watchlists;
}

async function saveWatchlists(watchlists: Watchlists): Promise<void> {
  await fetch(`${API_URL}/api/watchlists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(watchlists),
  });
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
  console.log('Found watchlist');
  console.table(watchlist);
  const entries = watchlist.entries;
  const index = entries.findIndex((e) => e.id === entry.id);
  const newEntries =
    index === -1
      ? [...entries, entry]
      : entries.filter((e) => e.id !== entry.id);
  watchlist.entries = newEntries;
  console.log('new watchlists: ');
  console.table(watchlists);
  await saveWatchlists(watchlists);
  revalidateTag('watchlists', 'max');
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
  await saveWatchlists(watchlists);
}
