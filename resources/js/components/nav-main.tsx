import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useActiveUrl } from '@/hooks/use-active-url';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { ChevronDown, LucideIcon } from 'lucide-react';
import { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface NavGroup {
    title: string;
    icon?: LucideIcon;
    items: NavItem[];
}

export const NavMain = memo(function NavMain({
    groups = [],
    items = [],
}: {
    groups?: NavGroup[];
    items?: NavItem[];
}) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const { urlIsActive } = useActiveUrl();
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';

    // Find which group contains the active page
    const activeGroupTitle = useMemo(() => {
        for (const group of groups) {
            for (const item of group.items) {
                if (urlIsActive(item.href)) {
                    return group.title;
                }
            }
        }
        return null;
    }, [groups, urlIsActive]);

    // Track which groups are open - only the group with active page is open by default
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        groups.forEach((group) => {
            // Only open the group that contains the active page
            initial[group.title] = group.title === activeGroupTitle;
        });
        return initial;
    });

    const toggleGroup = (title: string) => {
        setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
    };

    return (
        <div className="flex flex-col gap-1">
            {/* Standalone Items (Dashboard etc.) */}
            {items.length > 0 && (
                <SidebarGroup className="p-2">
                    <SidebarGroupLabel
                        className={cn(
                            'mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70',
                            isCollapsed && 'sr-only',
                        )}
                    >
                        {t('platform')}
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={urlIsActive(item.href)}
                                        tooltip={{ children: item.title }}
                                        className={cn(
                                            'group relative h-9 rounded-lg transition-all duration-200',
                                            'hover:bg-primary/10 hover:text-primary',
                                            'data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow-md',
                                        )}
                                    >
                                        <Link
                                            href={item.href}
                                            prefetch={item.href !== '/compensations'}
                                            className="flex items-center gap-3"
                                        >
                                            {item.icon && (
                                                <item.icon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                                            )}
                                            <span
                                                className={cn(
                                                    'truncate font-medium',
                                                    isCollapsed && 'sr-only',
                                                )}
                                            >
                                                {item.title}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            )}

            {/* Grouped Items */}
            {groups.map((group) => {
                // Get the first item's icon as group icon if not specified
                const GroupIcon = group.icon || group.items[0]?.icon;

                // When collapsed, show all items directly without collapsible
                if (isCollapsed) {
                    return (
                        <SidebarGroup key={group.title} className="p-2">
                            <SidebarMenu className="gap-0.5">
                                {group.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={urlIsActive(item.href)}
                                            tooltip={{ children: item.title }}
                                            className={cn(
                                                'group relative h-9 rounded-lg transition-all duration-200',
                                                'hover:bg-primary/10 hover:text-primary',
                                                'data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow-md',
                                            )}
                                        >
                                            <Link
                                                href={item.href}
                                                prefetch={
                                                    item.href !== '/compensations'
                                                }
                                                className="flex items-center gap-3"
                                            >
                                                {item.icon && (
                                                    <item.icon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                                                )}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroup>
                    );
                }

                // When expanded, use collapsible groups
                return (
                    <SidebarGroup key={group.title} className="p-2">
                        <Collapsible
                            open={openGroups[group.title] ?? true}
                            onOpenChange={() => toggleGroup(group.title)}
                            className="group/collapsible"
                        >
                            <CollapsibleTrigger asChild>
                                <SidebarGroupLabel
                                    className={cn(
                                        'mb-1 flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors',
                                        'text-muted-foreground/70 hover:bg-muted hover:text-foreground',
                                    )}
                                >
                                    {GroupIcon && (
                                        <GroupIcon className="h-3.5 w-3.5 opacity-60" />
                                    )}
                                    <span className="flex-1">{group.title}</span>
                                    <ChevronDown
                                        className={cn(
                                            'h-3.5 w-3.5 shrink-0 opacity-50 transition-transform duration-200',
                                            isRTL && 'rotate-180',
                                            'group-data-[state=open]/collapsible:rotate-180',
                                        )}
                                    />
                                </SidebarGroupLabel>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                                <SidebarGroupContent>
                                    <SidebarMenu className="gap-0.5">
                                        {group.items.map((item) => (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={urlIsActive(item.href)}
                                                    tooltip={{ children: item.title }}
                                                    className={cn(
                                                        'group relative h-9 rounded-lg transition-all duration-200',
                                                        'hover:bg-primary/10 hover:text-primary',
                                                        'data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow-md',
                                                    )}
                                                >
                                                    <Link
                                                        href={item.href}
                                                        prefetch={
                                                            item.href !== '/compensations'
                                                        }
                                                        className="flex items-center gap-3"
                                                    >
                                                        {item.icon && (
                                                            <item.icon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                                                        )}
                                                        <span className="truncate font-medium">
                                                            {item.title}
                                                        </span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </CollapsibleContent>
                        </Collapsible>
                    </SidebarGroup>
                );
            })}
        </div>
    );
});
