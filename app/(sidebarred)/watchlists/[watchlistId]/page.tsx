import { DataTable } from '@/components/web/data-table';
import { watchlistColumns } from '@/components/web/watchlist-columns';
import { Watchlists } from '@/data/models/watchlist.model';
import { selectWatchlistRows } from '@/data/selectors/watchlist.selector';
import { createWatchlistStore } from '@/data/store/watchlist.store';

const API_URL = 'http://localhost:3000';

export default async function WatchlistPage({
  params,
}: {
  params: Promise<{ watchlistId: string }>;
}) {
  const { watchlistId } = await params;
  const rawWatchlists = (await fetch(`${API_URL}/api/watchlists`, {
    next: { tags: ['watchlists'] },
  }).then((res) => res.json())) as Watchlists;
  const wStore = createWatchlistStore(rawWatchlists);
  const watchlist = wStore.getById(watchlistId);
  if (!watchlist) {
    return;
  }
  const watchlistRows = selectWatchlistRows(watchlistId, wStore);

  return (
    <div className="container mx-auto py-10">
      {watchlistId}
      <DataTable columns={watchlistColumns} data={watchlistRows} />
    </div>
  );
}
