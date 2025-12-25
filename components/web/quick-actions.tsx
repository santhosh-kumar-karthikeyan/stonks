'use client';
import { toggleToWatchlist } from '@/app/actions/watchlist';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { WatchlistEntry } from '@/data/models/watchlist.model';
import { PortfolioTableRow } from '@/data/selectors/portfolio.selectors';
import { DEFAULT_WATCHLIST_NAME } from '@/lib/constants';
import {
  Bookmark,
  BookmarkCheck,
  BookmarkMinus,
  Copy,
  MoreHorizontalIcon,
} from 'lucide-react';
import { useState } from 'react';
import { slug } from 'slug-gen';
import { Button } from '../ui/button';
import { ButtonGroup } from '../ui/button-group';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  return (
    <ButtonGroup>
      <Button
        variant="outline"
        onClick={async () => {
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
          await toggleToWatchlist(newEntry, slug(DEFAULT_WATCHLIST_NAME));
          router.refresh();
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
