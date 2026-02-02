import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useActiveUrl } from '@/hooks/use-active-url';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface NavGroup {
    title: string;
    items: NavItem[];
}

export const NavMain = memo(function NavMain({
    groups = [],
    items = [],
}: {
    groups?: NavGroup[];
    items?: NavItem[];
}) {
    const { t } = useTranslation();
    const { urlIsActive } = useActiveUrl();
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

    const toggleGroup = (title: string) => {
        setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
    };

    return (
        <>
            <SidebarGroup className="px-2 py-0">
                <SidebarGroupLabel>{t('platform')}</SidebarGroupLabel>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={urlIsActive(item.href)}
                                tooltip={{ children: item.title }}
                            >
                                <Link
                                    href={item.href}
                                    prefetch={item.href !== '/compensations'}
                                >
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>

            {groups.map((group) => (
                <SidebarGroup key={group.title} className="px-2 py-0">
                    <Collapsible
                        open={openGroups[group.title] ?? false}
                        onOpenChange={() => toggleGroup(group.title)}
                    >
                        <CollapsibleTrigger asChild>
                            <SidebarGroupLabel className="cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                                {group.title}
                                <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarGroupLabel>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarMenu>
                                {group.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={urlIsActive(item.href)}
                                            tooltip={{ children: item.title }}
                                        >
                                            <Link
                                                href={item.href}
                                                prefetch={item.href !== '/compensations'}
                                            >
                                                {item.icon && <item.icon />}
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </CollapsibleContent>
                    </Collapsible>
                </SidebarGroup>
            ))}
        </>
    );
});
