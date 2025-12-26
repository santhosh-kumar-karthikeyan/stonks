'use client';

import { useState } from 'react';
import { useWatchlistStore } from '@/store/watchlists.client.store';
import { Watchlist } from '@/data/models/watchlist.model';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { ListTodo, MoreVertical, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface WatchlistCardProps {
  watchlist: Watchlist;
}

export function WatchlistCard({ watchlist }: WatchlistCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteWatchlist = useWatchlistStore((s) => s.deleteWatchlist);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteWatchlist(watchlist.id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Failed to delete watchlist:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <ListTodo className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-xl">{watchlist.name}</CardTitle>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/watchlists/${watchlist.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardDescription>
            {watchlist.entries.length === 0
              ? 'No entries yet'
              : `${watchlist.entries.length} ${
                  watchlist.entries.length === 1 ? 'entry' : 'entries'
                }`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {watchlist.entries.length > 0 ? (
            <div className="space-y-2">
              {watchlist.entries.slice(0, 3).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="font-medium">{entry.symbol}</span>
                  <span
                    className={
                      entry.totalPnl >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }
                  >
                    {entry.totalPnl >= 0 ? '+' : ''}
                    {entry.pnlPercent.toFixed(2)}%
                  </span>
                </div>
              ))}
              {watchlist.entries.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  +{watchlist.entries.length - 3} more
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Add entries from the dashboard
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-xs text-muted-foreground">
            {watchlist.lastAccessedAt
              ? `Updated ${formatDistanceToNow(
                  new Date(watchlist.lastAccessedAt),
                  { addSuffix: true },
                )}`
              : 'Never accessed'}
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href={`/watchlists/${watchlist.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </Link>
          </Button>
        </CardFooter>
      </Card>

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
