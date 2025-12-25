import { Watchlist, WatchlistEntry } from '../models/watchlist.model';

export interface WatchlistEntryStore {
  getById(id: string): WatchlistEntry | undefined;
  getAll(): WatchlistEntry[];
}

export function createWatchlistEntryStore(
  watchlist: Watchlist,
): WatchlistEntryStore {
  const byId = new Map<string, WatchlistEntry>();
  const allIds: string[] = [];

  for (const entry of watchlist.entries) {
    byId.set(entry.id, entry);
    allIds.push(entry.id);
  }

  return {
    getById(id: string) {
      return byId.get(id);
    },
    getAll() {
      return allIds.map((id) => byId.get(id)!);
    },
  };
}
