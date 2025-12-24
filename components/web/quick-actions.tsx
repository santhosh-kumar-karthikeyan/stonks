'use client';
import { addToWatchlist } from '@/app/actions/watchlist';
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
  BookmarkMinus,
  Copy,
  MoreHorizontalIcon,
} from 'lucide-react';
import { slug } from 'slug-gen';
import { Button } from '../ui/button';
import { ButtonGroup } from '../ui/button-group';

export default function QuickActions({ entry }: { entry: PortfolioTableRow }) {
  // const [watchlists, setWatchlists] = useState<Watchlists>();
  // useEffect(() => {
  //   async function loadWatchlists() {
  //     setWatchlists(await getWatchlistFromJSON());
  //   }
  //   loadWatchlists();
  // }, []);
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
          addToWatchlist(watchlistEntry, slug(DEFAULT_WATCHLIST_NAME));
        }}
      >
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
