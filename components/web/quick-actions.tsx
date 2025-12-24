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

export default function QuickActions({ entry }: { entry: PortfolioTableRow }) {
  const [bookmarked, setBookmarked] = useState(entry.isSaved);
  return (
    <ButtonGroup>
      <Button
        variant="outline"
        onClick={() => {
          setBookmarked((marked) => !marked);
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
