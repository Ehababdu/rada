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
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as martyrsIndex } from '@/routes/martyrs';
import { index as promotionsIndex } from '@/routes/promotions';
import { index as banksIndex } from '@/routes/banks';
import { index as militaryRanksIndex } from '@/routes/military-ranks';
import { index as compensationsIndex } from '@/routes/compensations';
import { index as employmentStatusesIndex } from '@/routes/employment-statuses';
import { index as jobGradesIndex } from '@/routes/job-grades';
import { index as usersIndex } from '@/routes/users';
import { index as permissionsIndex } from '@/routes/permissions';
import { index as rolesIndex } from '@/routes/roles';
import { index as attachmentTypesIndex } from '@/routes/attachment-types';
import { index as employersIndex } from '@/routes/employers';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid, Users, Award, Building2, Shield, DollarSign, Briefcase, UserCheck, Lock, GraduationCap, FileText, Building } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppLogo from './app-logo';
import { memo } from 'react';
import { usePage } from '@inertiajs/react';
import { isUserSuperAdmin } from '@/lib/permissions';

const footerNavItems: NavItem[] = [
    //
];

export const AppSidebar = memo(function AppSidebar() {
    const { props } = usePage<{ navAccess?: Record<string, boolean> }>();
    const { t, i18n } = useTranslation();
    const sidebarSide = i18n.language === 'ar' ? 'right' : 'left';

    const { auth } = props;
    const isSuperAdmin = isUserSuperAdmin(auth);
    const navAccess = props.navAccess ?? {};

    // Define all navigation items with permission checks
    const allNavItems = [
        {
            title: t('dashboard'),
            href: dashboard.definition?.url ?? dashboard(),
            icon: LayoutGrid,
            resource: null, // Dashboard always visible
        },
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
            title: t('navigation.banks'),
            href: banksIndex.definition?.url ?? banksIndex(),
            icon: Building2,
            resource: 'banks',
        },
        {
            title: t('navigation.employers'),
            href: employersIndex.definition?.url ?? employersIndex(),
            icon: Building,
            resource: 'employers',
        },
        {
            title: t('navigation.military_ranks'),
            href: militaryRanksIndex.definition?.url ?? militaryRanksIndex(),
            icon: Shield,
            resource: 'military-ranks',
        },
        {
            title: t('navigation.compensations'),
            href: compensationsIndex.definition?.url ?? compensationsIndex(),
            icon: DollarSign,
            resource: 'compensations',
        },
        {
            title: t('navigation.employment_statuses'),
            href: employmentStatusesIndex.definition?.url ?? employmentStatusesIndex(),
            icon: Briefcase,
            resource: 'employment-statuses',
        },
        {
            title: t('navigation.job_grades'),
            href: jobGradesIndex.definition?.url ?? jobGradesIndex(),
            icon: GraduationCap,
            resource: 'job-grades',
        },
        {
            title: 'أنواع المرفقات',
            href: attachmentTypesIndex.definition?.url ?? attachmentTypesIndex(),
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
            href: permissionsIndex.definition?.url ?? permissionsIndex(),
            icon: Lock,
            resource: 'permissions',
        },
        {
            title: t('navigation.roles'),
            href: rolesIndex.url(),
            icon: Shield,
            resource: 'roles',
        },
    ];

    // Filter items based on permissions
    const mainNavItems: NavItem[] = allNavItems
        .filter(item => {
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
        .map(({ resource, ...item }) => item);

    return (
        <Sidebar collapsible="icon" variant="inset" side={sidebarSide}>
            <SidebarHeader>
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

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
});
