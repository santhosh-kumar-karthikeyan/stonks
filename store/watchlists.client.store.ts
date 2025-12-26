'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Watchlists, WatchlistEntry } from '@/data/models/watchlist.model';

interface WatchlistStore {
  watchlists: Watchlists;
  setWatchlists: (watchlists: Watchlists) => void;
  toggleEntry: (entry: WatchlistEntry, watchlistId: string) => Promise<void>;
}

const API_URL = 'http://localhost:3000';

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      watchlists: [],

      setWatchlists: (watchlists) => set({ watchlists }),

      toggleEntry: async (entry, watchlistId) => {
        const watchlists = [...get().watchlists];
        const watchlist = watchlists.find((w) => w.id === watchlistId);
        if (!watchlist) return;

        const index = watchlist.entries.findIndex((e) => e.id === entry.id);
        if (index === -1) {
          watchlist.entries.push(entry);
        } else {
          watchlist.entries.splice(index, 1);
        }

        set({ watchlists });

        // Sync to server
        try {
          await fetch(`${API_URL}/api/watchlists`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(watchlists),
          });
        } catch (error) {
          console.error('Failed to sync watchlists to server:', error);
        }
      },
    }),
    {
      name: 'stonks-watchlists',
    },
  ),
);
