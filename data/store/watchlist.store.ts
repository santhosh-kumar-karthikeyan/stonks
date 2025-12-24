import { Watchlist, Watchlists } from '../models/watchlist.model';

export interface WatchlistStore {
  getById(id: string): Watchlist | undefined;
  getAll(): Watchlist[];
}

export function createWatchlistStore(watchlists: Watchlists): WatchlistStore {
  const byId = new Map<string, Watchlist>();
  const allIds: string[] = [];

  for (const watchlist of watchlists) {
    byId.set(watchlist.id, watchlist);
    allIds.push(watchlist.id);
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
