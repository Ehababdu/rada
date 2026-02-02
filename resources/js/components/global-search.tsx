import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { usePermissions } from '@/hooks/use-permissions';
import { dashboard } from '@/routes';
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
import { router } from '@inertiajs/react';
import {
    Award,
    Briefcase,
    Building,
    Building2,
    DollarSign,
    FileText,
    GraduationCap,
    LayoutGrid,
    Lock,
    Search,
    Settings,
    Shield,
    UserCheck,
    Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function GlobalSearch() {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const { can } = usePermissions('martyrs'); // Generic permission check helper

    // Define all searchable system pages
    const pages = useMemo(
        () => [
            {
                title: t('dashboard'),
                href: dashboard(),
                icon: LayoutGrid,
                group: t('navigation.system_management'),
            },
            {
                title: t('navigation.martyrs'),
                href: martyrsIndex(),
                icon: Users,
                group: t('navigation.martyrs_management'),
            },
            {
                title: t('navigation.promotions'),
                href: promotionsIndex(),
                icon: Award,
                group: t('navigation.martyrs_management'),
            },
            {
                title: t('navigation.compensations'),
                href: compensationsIndex(),
                icon: DollarSign,
                group: t('navigation.martyrs_management'),
            },
            {
                title: t('navigation.employers'),
                href: employersIndex(),
                icon: Building,
                group: t('navigation.employer'),
            },
            {
                title: t('navigation.employment_statuses'),
                href: employmentStatusesIndex(),
                icon: Briefcase,
                group: t('navigation.employer'),
            },
            {
                title: t('navigation.job_grades'),
                href: jobGradesIndex(),
                icon: GraduationCap,
                group: t('navigation.employer'),
            },
            {
                title: t('navigation.military_ranks'),
                href: militaryRanksIndex(),
                icon: Shield,
                group: t('navigation.military_ranks'),
            },
            {
                title: t('navigation.banks'),
                href: banksIndex(),
                icon: Building2,
                group: t('navigation.military_ranks'),
            },
            {
                title: t('navigation.attachment_types'),
                href: attachmentTypesIndex(),
                icon: FileText,
                group: t('navigation.system_management'),
            },
            {
                title: t('navigation.users'),
                href: usersIndex(),
                icon: UserCheck,
                group: t('navigation.system_management'),
            },
            {
                title: t('navigation.permissions'),
                href: permissionsIndex(),
                icon: Lock,
                group: t('navigation.system_management'),
            },
            {
                title: t('navigation.roles'),
                href: rolesIndex.url(),
                icon: Shield,
                group: t('navigation.system_management'),
            },
        ],
        [t],
    );

    // Keyboard shortcut to open search
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="relative inline-flex h-9 w-full items-center justify-start whitespace-nowrap rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 sm:pr-12 md:w-32 lg:w-48"
            >
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <span className="hidden lg:inline-flex">
                    {t('search.placeholder', 'البحث...')}
                </span>
                <span className="inline-flex lg:hidden">
                    {t('search.short_placeholder', 'بحث...')}
                </span>
                <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder={t('search.input_placeholder', 'اكتب للبحث في الصفحات...')}
                />
                <CommandList>
                    <CommandEmpty>
                        {t('search.no_results', 'لا توجد نتائج.')}
                    </CommandEmpty>
                    {/* Group by category */}
                    {Object.entries(
                        pages.reduce((acc, page) => {
                            if (!acc[page.group]) acc[page.group] = [];
                            acc[page.group].push(page);
                            return acc;
                        }, {} as Record<string, typeof pages>),
                    ).map(([group, groupPages]) => (
                        <CommandGroup key={group} heading={group}>
                            {groupPages.map((page) => (
                                <CommandItem
                                    key={page.href}
                                    value={page.title}
                                    onSelect={() => {
                                        runCommand(() => router.visit(page.href));
                                    }}
                                    className="gap-2"
                                >
                                    {page.icon && (
                                        <page.icon className="h-4 w-4 shrink-0 opacity-50" />
                                    )}
                                    <span>{page.title}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    ))}
                </CommandList>
            </CommandDialog>
        </>
    );
}