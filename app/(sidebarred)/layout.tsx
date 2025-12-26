import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/web/app-sidebar';
import { ModeToggle } from '../../components/web/mode-toggle';
import { WatchlistSyncer } from '@/components/providers/watchlist-syncer';
import { Watchlists } from '@/data/models/watchlist.model';

const API_URL = 'http://localhost:3000';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const rawWatchlists = (await fetch(`${API_URL}/api/watchlists`, {
    next: { tags: ['watchlists'] },
  }).then((res) => res.json())) as Watchlists;

  return (
    <WatchlistSyncer serverData={rawWatchlists}>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex flex-col w-full">
          <nav className="flex items-center justify-between gap-6 mt-5">
            <section className="ml-20">
              <SidebarTrigger />
              <span className="text-xl">STONKS</span>
            </section>
            <section>
              <ModeToggle />
            </section>
          </nav>
          {children}
        </main>
      </SidebarProvider>
    </WatchlistSyncer>
  );
}
