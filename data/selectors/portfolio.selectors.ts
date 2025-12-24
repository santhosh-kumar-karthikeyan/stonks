import { PositionsStore } from '../store/positions.store';
import { InstrumentsStore } from '../store/instruments.store';
import { InstrumentType } from '../contracts/securities.contract';
import { WatchlistStore } from '../store/watchlist.store';

export interface PortfolioTableRow {
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
  isSaved: boolean;
}

export interface PortfolioSummary {
  investedAmount: number;
  currentValue: number;
  dayPnl: number;
  totalPnl: number;
  pnlPercent: number;
}

export function selectPortfolioTableRows(
  positionsStore: PositionsStore,
  instrumentsStore: InstrumentsStore,
  watchlistsStore: WatchlistStore,
): PortfolioTableRow[] {
  const rows: PortfolioTableRow[] = [];
  const watchlists = watchlistsStore.getAll();
  for (const position of positionsStore.getAll()) {
    const instrument = instrumentsStore.getById(position.instrumentId);
    if (!instrument) continue;
    const investedAmount = position.avgPrice * position.quantity;
    const dayPnl = (position.ltp - position.dayOpenPrice) * position.quantity;
    const totalPnl = position.unrealizedPnl + position.realizedPnl;
    const pnlPercent =
      investedAmount === 0 ? 0 : (totalPnl / investedAmount) * 100;
    const isSaved: boolean = watchlists.some((w) =>
      w.entries.some((e) => e.id === instrument.id),
    );
    rows.push({
      id: position.id,
      symbol: position.symbol,
      instrumentType: instrument.type,
      quantity: position.quantity,
      avgPrice: position.avgPrice,
      ltp: position.ltp,
      dayPnl,
      totalPnl,
      pnlPercent,
      marketValue: position.marketValue,
      isSaved
    });
  }
  return rows;
}

export function selectPortfolioSummary(
  positionsStore: PositionsStore,
): PortfolioSummary {
  let investedAmount = 0;
  let currentValue = 0;
  let dayPnl = 0;
  let totalPnl = 0;
  for (const position of positionsStore.getAll()) {
    const invested = position.avgPrice * position.quantity;
    const dayPnlForPosition =
      (position.ltp - position.dayOpenPrice) * position.quantity;
    const totalPnlForPosition = position.unrealizedPnl + position.realizedPnl;
    investedAmount += invested;
    currentValue += position.marketValue;
    dayPnl += dayPnlForPosition;
    totalPnl += totalPnlForPosition;
  }
  const pnlPercent =
    investedAmount === 0 ? 0 : (totalPnl / investedAmount) * 100;
  return {
    investedAmount,
    currentValue,
    dayPnl,
    pnlPercent,
    totalPnl,
  };
}
