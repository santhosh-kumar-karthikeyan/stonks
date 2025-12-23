import { InstrumentType } from '../contracts/securities.contract';

export interface Instrument {
  id: number;
  symbol: string;
  name: string;
  type: InstrumentType;
  exchanges: string[];
  lotSize: number;
  expiry: string | null;
  strike: number;
  expiryType: string | null;
}
