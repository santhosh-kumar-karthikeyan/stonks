import { Timestamp } from 'next/dist/server/lib/cache-handlers/types';
import { InstrumentType } from '../contracts/securities.contract';

export interface WatchlistEntry {
  id: string;
  symbol: string;
  type: InstrumentType;
  marketValue: number;
}

export type Watchlist = {
  id: string;
  name: string;
  entries: WatchlistEntry[];
  lastAccessedAt: Timestamp;
};

export type Watchlists = Record<string, Watchlist>;
