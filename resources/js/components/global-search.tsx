import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { index as activityLogIndex } from '@/routes/activity-log';
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
import axios from 'axios';
import {
    Activity,
    Award,
    Bell,
    Briefcase,
    Building,
    Building2,
    DollarSign,
    FileText,
    LayoutGrid,
    Lock,
    Search,
    Shield,
    UserCheck,
    Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const iconMap: Record<string, any> = {
    Activity,
    Bell,
    LayoutGrid,
    Users,
    Award,
    DollarSign,
    Building,
    Briefcase,
    GraduationCap: LayoutGrid,
    Shield,
    Building2,
    FileText,
    UserCheck,
    Lock,
};

interface SearchResult {
    id: number | string;
    title: string;
    route?: string;
    href?: string;
    group: string;
    icon: string;
}

export function GlobalSearch() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);

    // Static fallback pages for empty search
    const basePages = useMemo(
        () => [
            {
                id: 'p1',
                title: t('dashboard'),
                href: dashboard().url,
                icon: 'LayoutGrid',
                group: t('navigation.system_management'),
            },
            {
                id: 'p2',
                title: t('navigation.martyrs'),
                href: martyrsIndex().url,
                icon: 'Users',
                group: t('navigation.martyrs_management'),
            },
            {
                id: 'p3',
                title: t('navigation.promotions'),
                href: promotionsIndex().url,
                icon: 'Award',
                group: t('navigation.martyrs_management'),
            },
            {
                id: 'p4',
                title: t('navigation.compensations'),
                href: compensationsIndex().url,
                icon: 'DollarSign',
                group: t('navigation.martyrs_management'),
            },
            {
                id: 'p5',
                title: t('navigation.employers'),
                href: employersIndex().url,
                icon: 'Building',
                group: t('navigation.employer'),
            },
            {
                id: 'p11',
                title: t('navigation.users'),
                href: usersIndex().url,
                icon: 'UserCheck',
                group: t('navigation.system_management'),
            },
            {
                id: 'p12',
                title: t('navigation.permissions'),
                href: permissionsIndex().url,
                icon: 'Lock',
                group: t('navigation.system_management'),
            },
            {
                id: 'p13',
                title: t('navigation.roles'),
                href: rolesIndex().url,
                icon: 'Shield',
                group: t('navigation.system_management'),
            },
            {
                id: 'p14',
                title: t('navigation.activity_log', 'سجل الأنشطة'),
                href: activityLogIndex().url,
                icon: 'Activity',
                group: t('navigation.system_management'),
            },
            {
                id: 'p15',
                title: t('navigation.alerts', 'التنبيهات'),
                href: '/alerts',
                icon: 'Bell',
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

    // Fetch results from Meilisearch via Laravel API
    useEffect(() => {
        const fetchResults = async () => {
            if (!query) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const response = await axios.get(route('api.search'), {
                    params: { q: query },
                });
                setResults(response.data);
            } catch (error) {
                console.error('Search failed:', error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchResults, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (href: string) => {
        setOpen(false);
        router.visit(href);
    };

    const displayResults = useMemo(() => {
        const lowerQuery = query.toLowerCase().trim();
        if (!lowerQuery) return basePages;

        const filteredBase = basePages.filter(
            (page) =>
                page.title.toLowerCase().includes(lowerQuery) ||
                page.group.toLowerCase().includes(lowerQuery),
        );

        // Filter API results to avoid duplicates if they were already found in basePages
        const uniqueAPIResults = results.filter((apiItem) => {
            const apiLink = apiItem.route ? route(apiItem.route) : apiItem.href;
            return !filteredBase.some((baseItem) => baseItem.href === apiLink);
        });

        return [...filteredBase, ...uniqueAPIResults];
    }, [query, results, basePages]);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="relative inline-flex h-9 w-full items-center justify-start whitespace-nowrap rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 sm:pr-12 md:w-40 lg:w-64"
            >
                <Search
                    className={cn(
                        'h-4 w-4 shrink-0 opacity-50',
                        isRTL ? 'ml-2' : 'mr-2',
                    )}
                />
                <span className="inline-flex">
                    {t('search.placeholder', 'البحث في صفحات النظام...')}
                </span>
                <kbd
                    className={cn(
                        'pointer-events-none absolute top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex',
                        isRTL ? 'left-1.5' : 'right-1.5',
                    )}
                >
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>
            <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
                <div dir={isRTL ? 'rtl' : 'ltr'}>
                    <CommandInput
                        placeholder={t('search.input_placeholder', 'اكتب للبحث...')}
                        onValueChange={setQuery}
                    />
                    <CommandList>
                        {query && displayResults.length === 0 && (
                            <CommandEmpty>
                                {loading ? t('loading', 'جاري البحث...') : t('search.no_results', 'لا توجد نتائج.')}
                            </CommandEmpty>
                        )}

                        {Object.entries(
                            displayResults.reduce((acc, result) => {
                                const groupName = result.group || t('navigation.other', 'أخرى');
                                if (!acc[groupName]) acc[groupName] = [];
                                acc[groupName].push(result);
                                return acc;
                            }, {} as Record<string, any[]>),
                        ).map(([group, groupResults]) => (
                            <CommandGroup key={group} heading={group}>
                                {groupResults.map((result) => {
                                    const IconComponent = iconMap[result.icon] || LayoutGrid;
                                    const href = result.route ? route(result.route) : (result.href || '');
                                    return (
                                        <CommandItem
                                            key={result.id}
                                            value={result.title}
                                            onSelect={() => handleSelect(href)}
                                            className="flex items-center gap-2 cursor-pointer"
                                        >
                                            <IconComponent className="h-4 w-4 shrink-0 opacity-50" />
                                            <div className="flex flex-col">
                                                <span>{result.title}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {group}
                                                </span>
                                            </div>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        ))}
                    </CommandList>
                </div>
            </CommandDialog>
        </>
    );
}