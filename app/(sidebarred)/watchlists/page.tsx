import { PortfolioResponse } from '@/data/contracts/portfolio.contracts';
import { SecuritiesResponse } from '@/data/contracts/securities.contract';
import { Instrument } from '@/data/models/instrument.model';
import { Position } from '@/data/models/position.model';
import { selectPortfolioTableRows } from '@/data/selectors/portfolio.selectors';
import { createInstrumentStore } from '@/data/store/instruments.store';
import { createPositionsStore } from '@/data/store/positions.store';
import { createWatchlistStore } from '@/data/store/watchlist.store';
import { transformPortfolioResponse } from '@/data/transformers/portfolio.transformer';
import { transformSecuritiesResponse } from '@/data/transformers/securities.transformer';
import { Watchlists } from '../../../data/models/watchlist.model';
import { DataTable } from '@/components/web/data-table';
import { portfolioColumns } from '@/components/web/portfolio-columns';

const API_URL = 'http://localhost:3000';

export default async function DashboardPage() {
  const rawSecurities = (await fetch(`${API_URL}/api/securities`, {
    next: { tags: ['securities'] },
  }).then((res) => res.json())) as SecuritiesResponse;
  const rawPortfolios = (await fetch(`${API_URL}/api/portfolio`, {
    next: { tags: ['portfolio'] },
  }).then((res) => res.json())) as PortfolioResponse;
  const rawWatchlists = (await fetch(`${API_URL}/api/watchlists`, {
    next: { tags: ['watchlists'] },
  }).then((res) => res.json())) as Watchlists;
  const instruments: Instrument[] = transformSecuritiesResponse(rawSecurities);
  const positions: Position[] = transformPortfolioResponse(rawPortfolios);
  const iStore = createInstrumentStore(instruments);
  const pStore = createPositionsStore(positions);
  const wStore = createWatchlistStore(rawWatchlists);
  const portfolioTableRows = selectPortfolioTableRows(pStore, iStore, wStore);
  // const portfolioSummary = selectPortfolioSummary(pStore);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={portfolioColumns} data={portfolioTableRows} />
    </div>
  );
}
