'use client';

import { useWatchlistStore } from '@/store/watchlists.client.store';
import { WatchlistCard } from './watchlist-card';
import { CreateWatchlistDialog } from './create-watchlist-dialog';
import { ListTodo } from 'lucide-react';

export function WatchlistsGrid() {
  const watchlists = useWatchlistStore((s) => s.watchlists);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Watchlists</h1>
          <p className="text-muted-foreground">
            Manage and organize your securities
          </p>
        </div>
        <CreateWatchlistDialog />
      </div>

      {watchlists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ListTodo className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No watchlists yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Create your first watchlist to start organizing your securities and
            tracking their performance.
          </p>
          <CreateWatchlistDialog />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {watchlists.map((watchlist) => (
            <WatchlistCard key={watchlist.id} watchlist={watchlist} />
          ))}
        </div>
      )}
    </div>
  );
}
