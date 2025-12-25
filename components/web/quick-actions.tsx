'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PortfolioTableRow } from '@/data/selectors/portfolio.selectors';
import {
  Bookmark,
  BookmarkCheck,
  BookmarkMinus,
  Copy,
  MoreHorizontalIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { ButtonGroup } from '../ui/button-group';
import { WatchlistEntry } from '@/data/models/watchlist.model';
import { toggleToWatchlist } from '@/app/actions/watchlist';
import { DEFAULT_WATCHLIST_NAME } from '@/lib/constants';
import { slug } from 'slug-gen';

// type Result<T> = { ok: true; data: T } | { ok: false; err: string };

// export function getWatchlistFromEntryId(
//   entryId: string,
//   watchlists: Watchlists,
// ): Result<Watchlist> {
//   for (const list of Object.values(watchlists)) {
//     if (list.entries.some((e) => e.id === entryId))
//       return { ok: true, data: list };
//   }
//   return { ok: false, err: 'Cannot find the entry' };
// }

export default function QuickActions({ row }: { row: PortfolioTableRow }) {
  const [bookmarked, setBookmarked] = useState(row.isSaved);
  return (
    <ButtonGroup>
      <Button
        variant="outline"
        onClick={() => {
          setBookmarked((marked) => !marked);
          const newEntry: WatchlistEntry = {
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
          };
          console.table(newEntry);
          toggleToWatchlist(newEntry, slug(DEFAULT_WATCHLIST_NAME));
        }}
      >
        {bookmarked ? <BookmarkCheck /> : <Bookmark />}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="More Options">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuGroup>
            {/* {Array.from(watchlists)} */}
            <DropdownMenuItem>
              <Copy />
              Copy entry
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BookmarkMinus />
              Remove from watchlist
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
