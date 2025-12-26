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
import { DataTable } from '@/components/web/data-table';
import { portfolioColumns } from '@/components/web/portfolio-columns';
import { getWatchlists } from '@/lib/watchlist-storage';
import fs from 'fs';
import path from 'path';

export default async function DashboardPage() {
  const rawSecurities = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), 'data/raw/securities.json'),
      'utf-8',
    ),
  ) as SecuritiesResponse;
  const rawPortfolios = JSON.parse(
    fs.readFileSync(
      path.join(process.cwd(), 'data/raw/portfolio.json'),
      'utf-8',
    ),
  ) as PortfolioResponse;
  const rawWatchlists = await getWatchlists();
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
