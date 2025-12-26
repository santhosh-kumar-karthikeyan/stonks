'use client';

import { useWatchlistStore } from '@/store/watchlists.client.store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { WatchlistEntry } from '@/data/models/watchlist.model';
import { PortfolioTableRow } from '@/data/selectors/portfolio.selectors';
import { DEFAULT_WATCHLIST_NAME } from '@/lib/constants';
import {
  Bookmark,
  BookmarkCheck,
  BookmarkPlus,
  Copy,
  ListPlus,
  MoreHorizontalIcon,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { slug } from 'slug-gen';
import { Button } from '../ui/button';
import { ButtonGroup } from '../ui/button-group';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

export default function QuickActions({ row }: { row: PortfolioTableRow }) {
  const [isAdding, setIsAdding] = useState(false);
  const watchlists = useWatchlistStore((s) => s.watchlists);
  const toggleEntry = useWatchlistStore((s) => s.toggleEntry);

  const entry: WatchlistEntry = useMemo(
    () => ({
      id: row.id,
      avgPrice: row.avgPrice,
      dayPnl: row.dayPnl,
      instrumentType: row.instrumentType,
      ltp: row.ltp,
      pnlPercent: row.pnlPercent,
      marketValue: row.marketValue,
      quantity: row.quantity,
      symbol: row.symbol,
      totalPnl: row.totalPnl,
    }),
    [row],
  );

  const watchlistsContainingEntry = useMemo(() => {
    return watchlists.filter((w) => w.entries.some((e) => e.id === entry.id));
  }, [watchlists, entry.id]);

  const isInAnyWatchlist = watchlistsContainingEntry.length > 0;

  const defaultWatchlistId = slug(DEFAULT_WATCHLIST_NAME);
  const isInDefaultWatchlist = watchlistsContainingEntry.some(
    (w) => w.id === defaultWatchlistId,
  );

  const handleToggleDefaultWatchlist = async () => {
    setIsAdding(true);
    try {
      await toggleEntry(entry, defaultWatchlistId);
      toast.success(
        isInDefaultWatchlist
          ? `Removed ${row.symbol} from ${DEFAULT_WATCHLIST_NAME}`
          : `Added ${row.symbol} to ${DEFAULT_WATCHLIST_NAME}`,
      );
    } catch (error) {
      toast.error('Failed to update watchlist');
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleWatchlist = async (
    watchlistId: string,
    watchlistName: string,
  ) => {
    const isInWatchlist = watchlistsContainingEntry.some(
      (w) => w.id === watchlistId,
    );

    try {
      await toggleEntry(entry, watchlistId);
      toast.success(
        isInWatchlist
          ? `Removed ${row.symbol} from ${watchlistName}`
          : `Added ${row.symbol} to ${watchlistName}`,
      );
    } catch (error) {
      toast.error('Failed to update watchlist');
      console.error(error);
    }
  };

  const handleCopySymbol = () => {
    navigator.clipboard.writeText(row.symbol);
    toast.success(`Copied ${row.symbol} to clipboard`);
  };

  return (
    <ButtonGroup>
      <Button
        variant={isInDefaultWatchlist ? 'default' : 'outline'}
        onClick={handleToggleDefaultWatchlist}
        disabled={isAdding}
        title={
          isInDefaultWatchlist
            ? `Remove from ${DEFAULT_WATCHLIST_NAME}`
            : `Add to ${DEFAULT_WATCHLIST_NAME}`
        }
      >
        {isInDefaultWatchlist ? (
          <BookmarkCheck className="h-4 w-4" />
        ) : (
          <Bookmark className="h-4 w-4" />
        )}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="More Options">
            {isInAnyWatchlist && watchlistsContainingEntry.length > 1 && (
              <Badge
                variant="secondary"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {watchlistsContainingEntry.length}
              </Badge>
            )}
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>{row.symbol}</span>
            <Badge
              variant={row.totalPnl >= 0 ? 'default' : 'destructive'}
              className="ml-2"
            >
              {row.totalPnl >= 0 ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {row.totalPnl >= 0 ? '+' : ''}
              {row.pnlPercent.toFixed(2)}%
            </Badge>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <ListPlus className="mr-2 h-4 w-4" />
                Add to Watchlist
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="max-h-[300px] overflow-y-auto">
                {watchlists.length === 0 ? (
                  <DropdownMenuItem disabled>
                    No watchlists available
                  </DropdownMenuItem>
                ) : (
                  watchlists.map((watchlist) => {
                    const isInWatchlist = watchlist.entries.some(
                      (e) => e.id === entry.id,
                    );
                    return (
                      <DropdownMenuItem
                        key={watchlist.id}
                        onClick={() =>
                          handleToggleWatchlist(watchlist.id, watchlist.name)
                        }
                        className="flex items-center justify-between"
                      >
                        <span className="flex items-center">
                          {isInWatchlist ? (
                            <BookmarkCheck className="mr-2 h-4 w-4 text-primary" />
                          ) : (
                            <BookmarkPlus className="mr-2 h-4 w-4" />
                          )}
                          {watchlist.name}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {watchlist.entries.length}
                        </Badge>
                      </DropdownMenuItem>
                    );
                  })
                )}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleCopySymbol}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Symbol
            </DropdownMenuItem>
          </DropdownMenuGroup>

          {isInAnyWatchlist && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                In {watchlistsContainingEntry.length}{' '}
                {watchlistsContainingEntry.length === 1
                  ? 'watchlist'
                  : 'watchlists'}
              </DropdownMenuLabel>
              {watchlistsContainingEntry.map((w) => (
                <DropdownMenuItem key={w.id} className="text-xs" disabled>
                  <BookmarkCheck className="mr-2 h-3 w-3 text-primary" />
                  {w.name}
                </DropdownMenuItem>
              ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
