import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useActiveUrl } from '@/hooks/use-active-url';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

export const NavMain = memo(function NavMain({
    items = [],
}: {
    items: NavItem[];
}) {
    const { t } = useTranslation();
    const { urlIsActive } = useActiveUrl();

    return (
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
    );
});
