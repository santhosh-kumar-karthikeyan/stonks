import { Timestamp } from 'next/dist/server/lib/cache-handlers/types';
import { InstrumentType } from '../contracts/securities.contract';
export interface WatchlistEntry {
  id: string;
  symbol: string;
  instrumentType: InstrumentType;
  quantity: number;
  avgPrice: number;
  ltp: number;
  dayPnl: number;
  totalPnl: number;
  pnlPercent: number;
  marketValue: number;
}

export type Watchlist = {
  id: string;
  name: string;
  entries: WatchlistEntry[];
  lastAccessedAt: Timestamp;
};

export type Watchlists = Watchlist[];
