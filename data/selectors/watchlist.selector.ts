import { WatchlistEntry } from '../models/watchlist.model';
import { createWatchlistEntryStore } from '../store/watch-entry.store';
import { WatchlistStore } from '../store/watchlist.store';

export type WatchlistRow = WatchlistEntry;
export function selectWatchlistRows(
  watchlistId: string,
  watchlistStore: WatchlistStore,
): WatchlistRow[] {
  const watchlist = watchlistStore.getById(watchlistId);
  if (!watchlist) return [];
  const eStore = createWatchlistEntryStore(watchlist);
  const entries = eStore.getAll();
  return entries;
}
