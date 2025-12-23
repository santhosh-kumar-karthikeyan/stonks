import { PortfolioSummary } from '../../data/selectors/portfolio.selectors';
export default function PortfolioSummaryCards({summary}: {summary: PortfolioSummary}) {
  return (
      <div className='bg-slate-100 flex items-center justify-center text-xl'>{summary.currentValue}</div>
  )
}
