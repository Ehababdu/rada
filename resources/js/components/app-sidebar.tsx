import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import { isUserSuperAdmin } from '@/lib/permissions';
import { dashboard } from '@/routes';
import { index as activityLogIndex } from '@/routes/activity-log';
import { index as alertsIndex } from '@/routes/alerts';
import { index as attachmentTypesIndex } from '@/routes/attachment-types';
import { index as banksIndex } from '@/routes/banks';
import { index as compensationsIndex } from '@/routes/compensations';
import { index as employersIndex } from '@/routes/employers';
import { index as employmentStatusesIndex } from '@/routes/employment-statuses';
import { index as jobGradesIndex } from '@/routes/job-grades';
import { index as martyrsIndex } from '@/routes/martyrs';
import { index as militaryRanksIndex } from '@/routes/military-ranks';
import { index as permissionsIndex } from '@/routes/permissions';
import { index as promotionsIndex } from '@/routes/promotions';
import { index as rolesIndex } from '@/routes/roles';
import { index as usersIndex } from '@/routes/users';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Award,
    Bell,
    Briefcase,
    Building,
    Building2,
    DollarSign,
    FileText,
    GraduationCap,
    History,
    LayoutGrid,
    Lock,
    Settings,
    Shield,
    UserCheck,
    Users,
} from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [
    //
];

export const AppSidebar = memo(function AppSidebar() {
    const { props } = usePage<{
        navAccess?: Record<string, boolean>;
        auth: { user?: { roles?: Array<{ name: string }> } };
    }>();
    const { t, i18n } = useTranslation();
    const sidebarSide = i18n.language === 'ar' ? 'right' : 'left';

    const { auth } = props;
    const isSuperAdmin = isUserSuperAdmin(auth);
    const navAccess = props.navAccess ?? {};

    // Define navigation groups with permission checks
    const navGroups = [
        {
            title: t('navigation.martyrs_management'),
            icon: Users,
            items: [
                {
                    title: t('navigation.martyrs'),
                    href: martyrsIndex.definition?.url ?? martyrsIndex(),
                    icon: Users,
                    resource: 'martyrs',
                },
                {
                    title: t('navigation.promotions'),
                    href: promotionsIndex.definition?.url ?? promotionsIndex(),
                    icon: Award,
                    resource: 'promotions',
                },
                {
                    title: t('navigation.compensations'),
                    href:
                        compensationsIndex.definition?.url ??
                        compensationsIndex(),
                    icon: DollarSign,
                    resource: 'compensations',
                },
            ],
        },
        {
            title: t('navigation.employer'),
            icon: Building,
            items: [
                {
                    title: t('navigation.employers'),
                    href: employersIndex.definition?.url ?? employersIndex(),
                    icon: Building,
                    resource: 'employers',
                },
                {
                    title: t('navigation.employment_statuses'),
                    href:
                        employmentStatusesIndex.definition?.url ??
                        employmentStatusesIndex(),
                    icon: Briefcase,
                    resource: 'employment-statuses',
                },
                {
                    title: t('navigation.job_grades'),
                    href: jobGradesIndex.definition?.url ?? jobGradesIndex(),
                    icon: GraduationCap,
                    resource: 'job-grades',
                },
            ],
        },
        {
            title: t('navigation.military_ranks'),
            icon: Shield,
            items: [
                {
                    title: t('navigation.military_ranks'),
                    href:
                        militaryRanksIndex.definition?.url ??
                        militaryRanksIndex(),
                    icon: Shield,
                    resource: 'military-ranks',
                },
                {
                    title: t('navigation.banks'),
                    href: banksIndex.definition?.url ?? banksIndex(),
                    icon: Building2,
                    resource: 'banks',
                },
            ],
        },
        {
            title: t('navigation.system_management'),
            icon: Settings,
            items: [
                {
                    title: 'سجل الأنشطة',
                    href:
                        activityLogIndex.definition?.url ?? activityLogIndex(),
                    icon: History,
                    resource: 'activity-log',
                },
                {
                    title: t('navigation.alerts', 'التنبيهات'),
                    href: alertsIndex.definition?.url ?? alertsIndex(),
                    icon: Bell,
                    resource: 'alerts',
                },
                {
                    title: t('navigation.attachment_types') || 'أنواع المرفقات',
                    href:
                        attachmentTypesIndex.definition?.url ??
                        attachmentTypesIndex(),
                    icon: FileText,
                    resource: 'attachment-types',
                },
                {
                    title: t('navigation.users'),
                    href: usersIndex.definition?.url ?? usersIndex(),
                    icon: UserCheck,
                    resource: 'users',
                },
                {
                    title: t('navigation.permissions'),
                    href:
                        permissionsIndex.definition?.url ?? permissionsIndex(),
                    icon: Lock,
                    resource: 'permissions',
                },
                {
                    title: t('navigation.roles'),
                    href: rolesIndex.url(),
                    icon: Shield,
                    resource: 'roles',
                },
            ],
        },
    ];

    // Define standalone items
    const standaloneItems = [
        {
            title: t('dashboard'),
            href: dashboard.definition?.url ?? dashboard(),
            icon: LayoutGrid,
            resource: null, // Dashboard always visible
        },
    ];

    // Filter groups and standalone items based on permissions
    const filteredNavGroups = navGroups
        .map((group) => ({
            ...group,
            items: group.items.filter((item) => {
                // Super admin sees everything
                if (isSuperAdmin) {
                    return true;
                }

                // Check navAccess for the resource
                return navAccess[item.resource] === true;
            }),
        }))
        .filter((group) => group.items.length > 0);

    const filteredStandaloneItems: NavItem[] = standaloneItems
        .filter((item) => {
            // Dashboard is always visible
            if (item.resource === null) {
                return true;
            }

            // Super admin sees everything
            if (isSuperAdmin) {
                return true;
            }

            // Check navAccess for the resource
            return navAccess[item.resource] === true;
        })
        .map((item) => item);

    return (
        <Sidebar collapsible="icon" variant="inset" side={sidebarSide}>
            <SidebarHeader className="border-b border-sidebar-border/50 pb-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40">
                <NavMain
                    groups={filteredNavGroups}
                    items={filteredStandaloneItems}
                />
            </SidebarContent>

            <SidebarSeparator className="mx-3" />

            <SidebarFooter className="border-t border-sidebar-border/50 pt-2">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
});
