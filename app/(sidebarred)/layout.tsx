import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/web/app-sidebar';
import { ModeToggle } from '../../components/web/mode-toggle';
import { WatchlistSyncer } from '@/components/providers/watchlist-syncer';
import { DynamicBreadcrumb } from '@/components/web/dynamic-breadcrumb';
import { Watchlists } from '@/data/models/watchlist.model';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';
import Link from 'next/link';

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
          <header className="sticky top-0 z-10 flex items-center justify-between gap-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 py-3">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="hover:bg-accent" />
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  STONKS
                </span>
                <span className="text-xs text-muted-foreground font-medium px-2 py-0.5 bg-muted rounded-full">
                  v1.0
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hover:bg-accent"
              >
                <Link
                  href="https://github.com/santhosh-kumar-karthikeyan/stonks"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View source on GitHub"
                >
                  <Github className="h-5 w-5" />
                </Link>
              </Button>
              <ModeToggle />
            </div>
          </header>
          <div className="px-6 mt-4">
            <DynamicBreadcrumb />
          </div>
          {children}
        </main>
      </SidebarProvider>
    </WatchlistSyncer>
  );
}
