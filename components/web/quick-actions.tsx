'use client';
import {
  toggleToWatchlist,
  getWatchlistFromJSON,
} from '@/app/actions/watchlist';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Watchlist, WatchlistEntry } from '@/data/models/watchlist.model';
import { PortfolioTableRow } from '@/data/selectors/portfolio.selectors';
import { DEFAULT_WATCHLIST_NAME } from '@/lib/constants';
import {
  Bookmark,
  BookmarkMinus,
  BookmarkCheck,
  Copy,
  MoreHorizontalIcon,
} from 'lucide-react';
import { slug } from 'slug-gen';
import { Button } from '../ui/button';
import { ButtonGroup } from '../ui/button-group';
import { Watchlists } from '../../data/models/watchlist.model';
import { useState, useEffect } from 'react';

type Result<T> = { ok: true; data: T } | { ok: false; err: string };

export function getWatchlistFromEntryId(
  entryId: string,
  watchlists: Watchlists,
): Result<Watchlist> {
  for (const list of Object.values(watchlists)) {
    if (list.entries.some((e) => e.id === entryId))
      return { ok: true, data: list };
  }
  return { ok: false, err: 'Cannot find the entry' };
}

export default function QuickActions({ entry }: { entry: PortfolioTableRow }) {
  const [watchlists, setWatchlists] = useState<Watchlists>({});
  
  const [bookmarked, setBookmarked] = useState<boolean>(
    getWatchlistFromEntryId(entry.id, watchlists).ok,
  );
  useEffect(() => {
    async function loadWatchlists() {
      setWatchlists(await getWatchlistFromJSON());
    }
    loadWatchlists();
  }, []);

  useEffect(() => {
    async function setBookmarks() {
      await setBookmarked(getWatchlistFromEntryId(entry.id, watchlists).ok);
    }
    setBookmarks();
  }, [watchlists, entry.id]);
  return (
    <ButtonGroup>
      <Button
        variant="outline"
        onClick={() => {
          console.log('CLICKED');
          const watchlistEntry: WatchlistEntry = {
            id: entry.id,
            marketValue: entry.marketValue,
            symbol: entry.symbol,
            type: entry.instrumentType,
          };
          console.table(watchlistEntry);
          setBookmarked((bookmarked) => !bookmarked);
          toggleToWatchlist(watchlistEntry, slug(DEFAULT_WATCHLIST_NAME));
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
