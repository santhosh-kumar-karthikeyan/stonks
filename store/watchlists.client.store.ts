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

const API_URL = 'http://localhost:3000';

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      watchlists: [],

      setWatchlists: (watchlists) => set({ watchlists }),

      createWatchlist: async (name) => {
        const watchlists = [...get().watchlists];
        const slugName = slug(name);

        // Check if watchlist already exists
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

        // Sync to server
        try {
          await fetch(`${API_URL}/api/watchlists`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(watchlists),
          });
        } catch (error) {
          console.error('Failed to sync watchlist creation to server:', error);
          throw error;
        }
      },

      deleteWatchlist: async (watchlistId) => {
        const watchlists = get().watchlists.filter((w) => w.id !== watchlistId);
        set({ watchlists });

        // Sync to server
        try {
          await fetch(`${API_URL}/api/watchlists`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(watchlists),
          });
        } catch (error) {
          console.error('Failed to sync watchlist deletion to server:', error);
          throw error;
        }
      },

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

        watchlist.lastAccessedAt = Date.now();
        set({ watchlists });

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

      removeEntry: async (entryId, watchlistId) => {
        const watchlists = [...get().watchlists];
        const watchlist = watchlists.find((w) => w.id === watchlistId);
        if (!watchlist) return;

        watchlist.entries = watchlist.entries.filter((e) => e.id !== entryId);
        watchlist.lastAccessedAt = Date.now();
        set({ watchlists });

        try {
          await fetch(`${API_URL}/api/watchlists`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(watchlists),
          });
        } catch (error) {
          console.error('Failed to sync entry removal to server:', error);
          throw error;
        }
      },
    }),
    {
      name: 'stonks-watchlists',
    },
  ),
);
