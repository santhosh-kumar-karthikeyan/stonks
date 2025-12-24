import { Timestamp } from 'next/dist/server/lib/cache-handlers/types';
import { InstrumentType } from '../contracts/securities.contract';
import { Instrument } from './instrument.model';
export interface WatchlistEntry {
  id: Instrument['id'];
  symbol: string;
  type: InstrumentType;
  name: Instrument['name'];
}

export type Watchlist = {
  id: string;
  name: string;
  entries: WatchlistEntry[];
  lastAccessedAt: Timestamp;
};

export type Watchlists = Watchlist[];
