'use client';

import { useState } from 'react';
import { useWatchlistStore } from '@/store/watchlists.client.store';
import { WatchlistEntry } from '@/data/models/watchlist.model';
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
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface RemoveEntryButtonProps {
  entry: WatchlistEntry;
  watchlistId: string;
}

export function RemoveEntryButton({
  entry,
  watchlistId,
}: RemoveEntryButtonProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const removeEntry = useWatchlistStore((s) => s.removeEntry);

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await removeEntry(entry.id, watchlistId);
      setShowDialog(false);
    } catch (error) {
      console.error('Failed to remove entry:', error);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowDialog(true)}
        className="h-8 w-8"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {entry.symbol} from this
              watchlist?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemove}
              disabled={isRemoving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRemoving ? 'Removing...' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
