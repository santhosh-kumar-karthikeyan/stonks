import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/web/app-sidebar';
import { ModeToggle } from '../../components/web/mode-toggle';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='flex flex-col w-full'>
        <nav className="flex items-center justify-between gap-6 mt-5">
          <section className='ml-20'>
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
  );
}
