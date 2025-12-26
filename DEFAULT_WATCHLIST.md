# Default Watchlist Feature

## Overview

The "General" watchlist is automatically created as a default fallback watchlist when no watchlists exist. The main Quick Actions button always adds/removes entries to this default watchlist.

## Implementation

### 1. Server-Side Default Creation

**File**: `lib/watchlist-storage.ts`

The `ensureDefaultWatchlist()` function automatically adds the "General" watchlist if it doesn't exist:

```typescript
function ensureDefaultWatchlist(watchlists: Watchlists): Watchlists {
  const defaultId = slug(DEFAULT_WATCHLIST_NAME);
  const hasDefault = watchlists.some((w) => w.id === defaultId);

  if (!hasDefault) {
    watchlists.unshift({
      id: defaultId,
      name: DEFAULT_WATCHLIST_NAME,
      entries: [],
      lastAccessedAt: Date.now(),
    });
  }

  return watchlists;
}
```

This runs every time watchlists are fetched from Redis or filesystem.

### 2. Client-Side Default Creation

**File**: `store/watchlists.client.store.ts`

Added `ensureDefaultWatchlist()` method to the Zustand store:

```typescript
ensureDefaultWatchlist: () => {
  const watchlists = get().watchlists;
  const defaultId = slug(DEFAULT_WATCHLIST_NAME);
  const hasDefault = watchlists.some((w) => w.id === defaultId);

  if (!hasDefault) {
    set({
      watchlists: [
        {
          id: defaultId,
          name: DEFAULT_WATCHLIST_NAME,
          entries: [],
          lastAccessedAt: Date.now(),
        },
        ...watchlists,
      ],
    });
  }
},
```

### 3. Hydration

**File**: `components/providers/watchlist-syncer.tsx`

Ensures default watchlist exists after server data is synced:

```typescript
useEffect(() => {
  if (!initialized.current) {
    setWatchlists(serverData);
    ensureDefaultWatchlist();
    initialized.current = true;
  }
}, [serverData, setWatchlists, ensureDefaultWatchlist]);
```

### 4. Quick Actions Integration

**File**: `components/web/quick-actions.tsx`

The main bookmark button always toggles entries in the General watchlist:

```typescript
const defaultWatchlistId = slug(DEFAULT_WATCHLIST_NAME);
const isInDefaultWatchlist = watchlistsContainingEntry.some(
  (w) => w.id === defaultWatchlistId,
);

const handleToggleDefaultWatchlist = async () => {
  await toggleEntry(entry, defaultWatchlistId);
};
```

Also calls `ensureDefaultWatchlist()` on component mount to guarantee it exists.

## Behavior

### Initial State (No Watchlists)

1. User visits app for first time
2. Server returns empty array `[]`
3. `ensureDefaultWatchlist()` creates "General" watchlist
4. User sees one watchlist: "General"

### With Existing Watchlists

1. Server returns existing watchlists
2. `ensureDefaultWatchlist()` checks if "General" exists
3. If missing, adds it to the beginning
4. If exists, does nothing

### Quick Actions Button

- **Always** adds/removes to "General" watchlist
- Shows filled bookmark icon when entry is in General
- Shows empty bookmark icon when entry is not in General
- Dropdown menu allows adding to other watchlists

## User Flow

```
New User
  ↓
Opens Dashboard
  ↓
"General" watchlist created automatically
  ↓
Clicks bookmark on any stock
  ↓
Stock added to "General"
  ↓
Clicks bookmark again
  ↓
Stock removed from "General"
```

## Constants

**File**: `lib/constants.ts`

```typescript
export const DEFAULT_WATCHLIST_NAME = 'General';
```

The default watchlist ID is generated as: `slug('General')` = `'general'`

## Benefits

1. **No Empty State**: Users always have at least one watchlist
2. **Intuitive**: Main button has consistent, predictable behavior
3. **Quick Access**: One-click add/remove to default watchlist
4. **Flexibility**: Dropdown menu for other watchlists
5. **Persistence**: Default watchlist survives data resets

## Testing

To test the default watchlist:

1. Clear localStorage: `localStorage.clear()`
2. Clear Redis: Delete `watchlists` key in Redis
3. Refresh page
4. Verify "General" watchlist appears
5. Add stock via bookmark button
6. Verify stock appears in "General" watchlist
