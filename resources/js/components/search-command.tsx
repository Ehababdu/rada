import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { router } from '@inertiajs/react';
import axios from 'axios';
import {
    Award,
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
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const iconMap: Record<string, any> = {
    LayoutGrid,
    Users,
    Award,
    DollarSign,
    Building,
    Briefcase,
    GraduationCap: LayoutGrid, // Fallback if missing
    Shield,
    Building2,
    FileText,
    UserCheck,
    Lock,
};

interface SearchResult {
    id: number;
    title: string;
    route: string;
    group: string;
    icon: string;
}

export function SearchCommand() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);

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

    const handleSelect = (result: SearchResult) => {
        setOpen(false);
        router.visit(route(result.route));
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="relative flex h-9 w-full items-center justify-start gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground md:w-40 lg:w-64"
            >
                <Search className="h-4 w-4" />
                <span className="inline-flex">{t('search')}...</span>
                <kbd className="pointer-events-none absolute inset-y-0 end-3 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <div dir={isRTL ? 'rtl' : 'ltr'}>
                    <CommandInput
                        placeholder={t('search_placeholder') || 'البحث في صفحات النظام...'}
                        onValueChange={setQuery}
                    />
                    <CommandList>
                        <CommandEmpty>
                            {loading ? t('loading') : t('no_results_found')}
                        </CommandEmpty>
                        {results.length > 0 && (
                            <CommandGroup heading={t('results') || 'النتائج'}>
                                {results.map((result) => {
                                    const Icon = iconMap[result.icon] || LayoutGrid;
                                    return (
                                        <CommandItem
                                            key={result.id}
                                            onSelect={() => handleSelect(result)}
                                            className="flex items-center gap-2"
                                        >
                                            <Icon className="h-4 w-4" />
                                            <div className="flex flex-col">
                                                <span>{result.title}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {result.group}
                                                </span>
                                            </div>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        )}
                    </CommandList>
                </div>
            </CommandDialog>
        </>
    );
}
