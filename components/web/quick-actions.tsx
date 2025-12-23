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
  BookmarkMinus,
  Copy,
  MoreHorizontalIcon,
} from 'lucide-react';
import { Button } from '../ui/button';
import { ButtonGroup } from '../ui/button-group';
import { useEffect, useState } from 'react';
import { getWatchlistFromJSON } from '@/app/actions/watchlist';
import { Watchlists } from '@/data/models/watchlist.model';

export default function QuickActions({ entry }: { entry: PortfolioTableRow }) {
  const [watchlists, setWatchlists] = useState<Watchlists>();
  useEffect(() => {
    async function loadWatchlists() {
      setWatchlists(await getWatchlistFromJSON());
    }
    loadWatchlists();
  }, []);
  return (
    <ButtonGroup>
      <Button variant="outline">
        <Bookmark />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="More Options">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuGroup>
            {Array.from(watchlists)}
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
