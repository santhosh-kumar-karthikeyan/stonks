import { WatchlistDetailClient } from '@/components/web/watchlist-detail-client';

export default async function WatchlistPage({
  params,
}: {
  params: Promise<{ watchlistId: string }>;
}) {
  const { watchlistId } = await params;

  return <WatchlistDetailClient watchlistId={watchlistId} />;
}
