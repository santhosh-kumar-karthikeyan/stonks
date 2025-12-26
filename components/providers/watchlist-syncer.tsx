'use client';

import { useEffect, useRef } from 'react';
import { useWatchlistStore } from '@/store/watchlists.client.store';
import { Watchlists } from '@/data/models/watchlist.model';

export function WatchlistSyncer({
  serverData,
  children,
}: {
  serverData: Watchlists;
  children: React.ReactNode;
}) {
  const initialized = useRef(false);
  const setWatchlists = useWatchlistStore((s) => s.setWatchlists);
  const ensureDefaultWatchlist = useWatchlistStore(
    (s) => s.ensureDefaultWatchlist,
  );

  useEffect(() => {
    if (!initialized.current) {
      setWatchlists(serverData);
      ensureDefaultWatchlist();
      initialized.current = true;
    }
  }, [serverData, setWatchlists, ensureDefaultWatchlist]);

  return <>{children}</>;
}
