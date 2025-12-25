'use client';

import { Column, ColumnDef, Row } from '@tanstack/react-table';
import { PortfolioTableRow } from '@/data/selectors/portfolio.selectors';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ArrowUpDown,
  ArrowDownNarrowWide,
  ArrowUpWideNarrow,
  ChevronDown,
  MoreHorizontal,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';
import QuickActions from './quick-actions';

type NumericCellProps = {
  value: number;
  precision?: number;
  colorBySign?: boolean;
};

function NumericCell({
  value,
  precision = 2,
  colorBySign = false,
}: NumericCellProps) {
  const formatted = value.toFixed(precision);
  const colorClass = colorBySign
    ? value < 0
      ? 'text-red-500'
      : value > 0
      ? 'text-green-500'
      : ''
    : '';
  return (
    <div className="text-right tabular-nums">
      <span className={colorClass}>{formatted}</span>
    </div>
  );
}

function colToCell(
  column: Column<PortfolioTableRow, unknown>,
  colName: string,
) {
  return (
    <Button
      className="w-full"
      variant={'ghost'}
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {colName}
      {column.getIsSorted() === 'asc' ? (
        <ArrowUpWideNarrow />
      ) : column.getIsSorted() === 'desc' ? (
        <ArrowDownNarrowWide />
      ) : (
        <ArrowUpDown />
      )}
    </Button>
  );
}

export const portfolioColumns: ColumnDef<PortfolioTableRow>[] = [
  {
    accessorKey: 'symbol',
    header: 'Symbol',
  },
  {
    accessorKey: 'instrumentType',
    header: 'Type',
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => {
      return colToCell(column, 'Quantity');
    },
    cell: ({ row }) => {
      return <NumericCell value={Number(row.getValue('quantity'))} />;
    },
  },
  {
    accessorKey: 'avgPrice',
    header: ({ column }) => {
      return colToCell(column, 'AvgPrice');
    },
    cell: ({ row }) => {
      return <NumericCell value={Number(row.getValue('avgPrice'))} />;
    },
  },
  {
    accessorKey: 'ltp',
    header: ({ column }) => {
      return colToCell(column, 'LTP');
    },
    cell: ({ row }) => {
      return <NumericCell value={Number(row.getValue('ltp'))} colorBySign />;
    },
  },
  {
    accessorKey: 'dayPnl',
    header: ({ column }) => {
      return colToCell(column, 'Day PnL');
    },
    cell: ({ row }) => {
      return <NumericCell value={Number(row.getValue('dayPnl'))} colorBySign />;
    },
  },
  {
    accessorKey: 'totalPnl',
    header: ({ column }) => {
      return colToCell(column, 'TotalPnL');
    },
    cell: ({ row }) => {
      return (
        <NumericCell value={Number(row.getValue('totalPnl'))} colorBySign />
      );
    },
  },
  {
    accessorKey: 'pnlPercent',
    header: ({ column }) => {
      return colToCell(column, 'PnL%');
    },
    cell: ({ row }) => {
      return (
        <NumericCell value={Number(row.getValue('pnlPercent'))} colorBySign />
      );
    },
  },
  {
    accessorKey: 'marketValue',
    header: ({ column }) => {
      return colToCell(column, 'Market Value');
    },
    cell: ({ row }) => {
      return (
        <NumericCell value={Number(row.getValue('marketValue'))} colorBySign />
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const entry = row.original;
      return <QuickActions row={entry} />;
    },
  },
];
