import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function NavUser() {
    const { auth } = usePage<SharedData>().props;
    const { state } = useSidebar();
    const isMobile = useIsMobile();
    const { i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className={cn(
                                'group rounded-lg transition-all duration-200',
                                'bg-gradient-to-r from-primary/5 to-primary/10',
                                'hover:from-primary/10 hover:to-primary/20',
                                'data-[state=open]:from-primary/15 data-[state=open]:to-primary/25',
                            )}
                            data-test="sidebar-menu-button"
                        >
                            <Avatar className="h-8 w-8 shrink-0 rounded-lg border-2 border-primary/20 shadow-sm transition-transform duration-200 group-hover:scale-105">
                                <AvatarImage
                                    src={auth.user.avatar}
                                    alt={auth.user.name}
                                />
                                <AvatarFallback className="rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                                    {getInitials(auth.user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div
                                className={cn(
                                    'grid flex-1 text-sm leading-tight',
                                    isRTL ? 'text-right' : 'text-left',
                                )}
                            >
                                <span className="truncate font-semibold">
                                    {auth.user.name}
                                </span>
                                <span className="truncate text-xs text-muted-foreground">
                                    {auth.user.email}
                                </span>
                            </div>
                            <ChevronsUpDown
                                className={cn(
                                    'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
                                    isRTL ? 'mr-auto' : 'ml-auto',
                                    'group-data-[state=open]:rotate-180',
                                )}
                            />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl shadow-lg"
                        align={isRTL ? 'start' : 'end'}
                        side={
                            isMobile
                                ? 'bottom'
                                : state === 'collapsed'
                                  ? isRTL
                                      ? 'right'
                                      : 'left'
                                  : 'bottom'
                        }
                        sideOffset={8}
                    >
                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
