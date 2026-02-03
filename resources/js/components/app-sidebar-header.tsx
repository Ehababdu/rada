import { Breadcrumbs } from '@/components/breadcrumbs';
import { GlobalSearch } from '@/components/global-search';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { memo } from 'react';

export const AppSidebarHeader = memo(function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header
            className={cn(
                'sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b border-border/50 bg-background/95 px-4 backdrop-blur-sm transition-[width,height] ease-linear',
                'supports-[backdrop-filter]:bg-background/60',
                'group-has-data-[collapsible=icon]/sidebar-wrapper:h-12',
            )}
        >
            {/* Right side for RTL: Sidebar trigger + Breadcrumbs */}
            <div className="flex flex-1 items-center gap-3">
                <SidebarTrigger
                    className={cn(
                        'h-8 w-8 shrink-0 rounded-lg transition-all duration-200',
                        'hover:bg-primary/10 hover:text-primary',
                    )}
                />
                <div className="h-5 w-px bg-border/50" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            {/* Left side for RTL: Search */}
            <div className="flex items-center gap-2">
                <GlobalSearch />
            </div>
        </header>
    );
});
