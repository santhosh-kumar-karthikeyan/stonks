'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Watchlists, WatchlistEntry } from '@/data/models/watchlist.model';
import { slug } from 'slug-gen';

interface WatchlistStore {
  watchlists: Watchlists;
  setWatchlists: (watchlists: Watchlists) => void;
  createWatchlist: (name: string) => Promise<void>;
  deleteWatchlist: (watchlistId: string) => Promise<void>;
  toggleEntry: (entry: WatchlistEntry, watchlistId: string) => Promise<void>;
  removeEntry: (entryId: string, watchlistId: string) => Promise<void>;
}

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      watchlists: [],

      setWatchlists: (watchlists) => set({ watchlists }),

      createWatchlist: async (name) => {
        const watchlists = [...get().watchlists];
        const slugName = slug(name);

        if (watchlists.find((w) => w.id === slugName)) {
          throw new Error('Watchlist already exists');
        }

        const newWatchlist = {
          id: slugName,
          name: name,
          entries: [],
          lastAccessedAt: Date.now(),
        };

        watchlists.push(newWatchlist);
        set({ watchlists });

        try {
          const response = await fetch('/api/watchlists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(watchlists),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
              errorData.details || `Server responded with ${response.status}`,
            );
          }
        } catch (error) {
          console.error('Failed to sync watchlist creation:', error);
          set({ watchlists: watchlists.filter((w) => w.id !== slugName) });
          throw error;
        }
      },

      deleteWatchlist: async (watchlistId) => {
        const previousWatchlists = get().watchlists;
        const watchlists = previousWatchlists.filter(
          (w) => w.id !== watchlistId,
        );
        set({ watchlists });

        try {
          const response = await fetch('/api/watchlists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(watchlists),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
              errorData.details || `Server responded with ${response.status}`,
            );
          }
        } catch (error) {
          console.error('Failed to sync watchlist deletion:', error);
          set({ watchlists: previousWatchlists });
          throw error;
        }
      },

      toggleEntry: async (entry, watchlistId) => {
        const previousWatchlists = [...get().watchlists];
        const watchlists = [...previousWatchlists];
        const watchlist = watchlists.find((w) => w.id === watchlistId);
        if (!watchlist) return;

        const index = watchlist.entries.findIndex((e) => e.id === entry.id);
        if (index === -1) {
          watchlist.entries.push(entry);
        } else {
          watchlist.entries.splice(index, 1);
        }

        watchlist.lastAccessedAt = Date.now();
        set({ watchlists });

        try {
          const response = await fetch('/api/watchlists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(watchlists),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
              errorData.details || `Server responded with ${response.status}`,
            );
          }
        } catch (error) {
          console.error('Failed to sync entry toggle:', error);
          set({ watchlists: previousWatchlists });
          throw error;
        }
      },

      removeEntry: async (entryId, watchlistId) => {
        const previousWatchlists = [...get().watchlists];
        const watchlists = [...previousWatchlists];
        const watchlist = watchlists.find((w) => w.id === watchlistId);
        if (!watchlist) return;

        watchlist.entries = watchlist.entries.filter((e) => e.id !== entryId);
        watchlist.lastAccessedAt = Date.now();
        set({ watchlists });

        try {
          const response = await fetch('/api/watchlists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(watchlists),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
              errorData.details || `Server responded with ${response.status}`,
            );
          }
        } catch (error) {
          console.error('Failed to sync entry removal:', error);
          set({ watchlists: previousWatchlists });
          throw error;
        }
      },
    }),
    {
      name: 'stonks-watchlists',
    },
  ),
);
