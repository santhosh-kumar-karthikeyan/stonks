import {
  SecurityInstrument,
  SecuritiesResponse,
} from '../contracts/securities.contract';
import { Instrument } from '../models/instrument.model';
import { WatchlistEntry } from '../models/watchlist.model';

// 1 -> 1
function transformRawSecurity(raw: SecurityInstrument): Instrument {
  return {
    id: raw.zen_id,
    symbol: raw.trading_symbol,
    name: raw.name,
    type: raw.instrument_type,
    exchanges: raw.exchanges,
    lotSize: raw.lot_size,
    expiry: raw.expiry_date,
    strike: raw.strike,
    expiryType: raw.expiry_type,
  };
}

export function transformSecuritiesToWatchlistEntry(
  raw: SecurityInstrument,
): WatchlistEntry {
  return {
    id: raw.zen_id,
    type: raw.instrument_type,
    symbol: raw.trading_symbol,
    name: raw.name,
  };
}

// many raw -> instrument array
export function transformSecuritiesResponse(
  response: SecuritiesResponse,
): Instrument[] {
  const instruments: Instrument[] = [];
  for (const rawList of Object.values(response.payload)) {
    if (!rawList) continue;
    for (const rawSec of rawList) {
      instruments.push(transformRawSecurity(rawSec));
    }
  }
  return instruments;
}
