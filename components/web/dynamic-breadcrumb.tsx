'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useWatchlistStore } from '@/store/watchlists.client.store';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Home, ChevronRight, LayoutDashboard, ListTodo } from 'lucide-react';
import { Fragment } from 'react';
import type { LucideIcon } from 'lucide-react';

const routeMetadata: Record<string, { label: string; icon?: LucideIcon }> = {
  dashboard: { label: 'Dashboard', icon: LayoutDashboard },
  watchlists: { label: 'Watchlists', icon: ListTodo },
};

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  const watchlists = useWatchlistStore((s) => s.watchlists);

  if (pathname === '/' || pathname === '/dashboard') {
    return null;
  }

  const segments = pathname.split('/').filter(Boolean);

  const breadcrumbItems: Array<{
    label: string;
    href: string;
    isLast: boolean;
    icon?: LucideIcon;
  }> = [];

  breadcrumbItems.push({
    label: 'Dashboard',
    href: '/dashboard',
    isLast: false,
    icon: Home,
  });

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;

    let label = segment.charAt(0).toUpperCase() + segment.slice(1);
    let icon = undefined;
    if (routeMetadata[segment]) {
      label = routeMetadata[segment].label;
      icon = routeMetadata[segment].icon;
    }
    if (segments[index - 1] === 'watchlists' && segment !== 'watchlists') {
      const watchlist = watchlists.find((w) => w.id === segment);
      if (watchlist) {
        label = watchlist.name;
      }
    }

    breadcrumbItems.push({
      label,
      href: currentPath,
      isLast,
      icon,
    });
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item) => {
          const Icon = item.icon;

          return (
            <Fragment key={item.href}>
              <BreadcrumbItem>
                {item.isLast ? (
                  <BreadcrumbPage className="flex items-center gap-2">
                    {Icon && <Icon className="h-4 w-4" />}
                    <span className="font-medium">{item.label}</span>
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={item.href}
                      className="flex items-center gap-2 hover:text-foreground transition-colors"
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!item.isLast && (
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              )}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
