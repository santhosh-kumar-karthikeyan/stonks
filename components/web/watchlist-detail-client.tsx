'use client';

import { useMemo } from 'react';
import { useWatchlistStore } from '@/store/watchlists.client.store';
import { createWatchlistStore } from '@/data/store/watchlist.store';
import { selectWatchlistRows } from '@/data/selectors/watchlist.selector';
import { DataTable } from '@/components/web/data-table';
import { watchlistColumns } from '@/components/web/watchlist-columns';
import { RemoveEntryButton } from './remove-entry-button';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';

interface WatchlistDetailClientProps {
  watchlistId: string;
}

export function WatchlistDetailClient({
  watchlistId,
}: WatchlistDetailClientProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const watchlists = useWatchlistStore((s) => s.watchlists);
  const deleteWatchlist = useWatchlistStore((s) => s.deleteWatchlist);

  const watchlist = useMemo(() => {
    return watchlists.find((w) => w.id === watchlistId);
  }, [watchlists, watchlistId]);

  const watchlistRows = useMemo(() => {
    const wStore = createWatchlistStore(watchlists);
    return selectWatchlistRows(watchlistId, wStore);
  }, [watchlists, watchlistId]);

  // Enhanced columns with remove button
  type RowData = { original: (typeof watchlistRows)[0] };
  const columnsWithActions = [
    ...watchlistColumns,
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: RowData }) => (
        <RemoveEntryButton entry={row.original} watchlistId={watchlistId} />
      ),
    },
  ];

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteWatchlist(watchlistId);
      router.push('/watchlists');
    } catch (error) {
      console.error('Failed to delete watchlist:', error);
      setIsDeleting(false);
    }
  };

  if (!watchlist) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Watchlist not found</h2>
          <p className="text-muted-foreground mb-6">
            The watchlist you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button asChild>
            <Link href="/watchlists">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Watchlists
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/watchlists">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {watchlist.name}
                </h1>
                <p className="text-muted-foreground">
                  {watchlist.entries.length}{' '}
                  {watchlist.entries.length === 1 ? 'entry' : 'entries'}
                </p>
              </div>
            </div>
          </div>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Watchlist
          </Button>
        </div>

        {watchlistRows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">No entries yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Add securities to this watchlist from the dashboard by clicking
              the bookmark icon.
            </p>
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        ) : (
          <DataTable columns={columnsWithActions} data={watchlistRows} />
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Watchlist</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{watchlist.name}&quot;? This
              action cannot be undone and will remove all{' '}
              {watchlist.entries.length} entries.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
