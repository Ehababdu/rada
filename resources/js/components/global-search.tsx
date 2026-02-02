import { Button } from '@/components/ui/button';
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { useToast } from '@/hooks/use-toast';
import { router } from '@inertiajs/react';
import { Search, User } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface GlobalSearchProps {
    className?: string;
}

export function GlobalSearch({ className }: GlobalSearchProps) {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [instantSearchResults, setInstantSearchResults] = useState<Array<{
        id: number;
        full_name: string;
        national_id: string;
        military_number: string | null;
        decision_number: string | null;
    }>>([]);
    const [isSearching, setIsSearching] = useState(false);

    const abortControllerRef = useRef<AbortController | null>(null);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Instant search function
    const performInstantSearch = useCallback(async (query: string) => {
        if (query.trim() === '') {
            setInstantSearchResults([]);
            return;
        }

        // Cancel previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        setIsSearching(true);
        try {
            const response = await fetch(`/api/martyrs/search?q=${encodeURIComponent(query)}`, {
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                if (response.status === 429) {
                    // Rate limited - don't show error toast for this
                    setInstantSearchResults([]);
                    return;
                }
                throw new Error('Search failed');
            }

            const results = await response.json();
            setInstantSearchResults(results);
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                // Request was cancelled, ignore
                return;
            }

            console.error('Search failed:', error);
            setInstantSearchResults([]);

            // Only show toast for non-rate-limit errors
            if (!(error instanceof Response) || error.status !== 429) {
                toast({
                    title: t('search.error_title', 'خطأ في البحث'),
                    description: t('search.error_description', 'حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.'),
                    variant: 'destructive',
                });
            }
        } finally {
            setIsSearching(false);
        }
    }, [toast, t]);

    // Keyboard shortcut for global search
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

    // Debounced search with longer delay
    useEffect(() => {
        // Clear previous timeout
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        // Only search if query is at least 2 characters
        if (searchTerm.length < 2) {
            setInstantSearchResults([]);
            setIsSearching(false);
            return;
        }

        debounceTimeoutRef.current = setTimeout(() => {
            performInstantSearch(searchTerm);
        }, 300); // Increased delay

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [searchTerm]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, []);

    return (
        <>
            <Button
                variant="outline"
                className={`relative h-8 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64 ${className}`}
                onClick={() => setOpen(true)}
            >
                <Search className="mr-2 h-4 w-4" />
                {t('search.placeholder', 'البحث في الشهداء...')}
                <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder={t('search.input_placeholder', 'ابحث عن شهيد...')}
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                />
                <CommandList>
                    <CommandEmpty>
                        {isSearching ? (
                            <div className="flex items-center justify-center py-6">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                <span className="ml-2">{t('search.searching', 'جاري البحث...')}</span>
                            </div>
                        ) : searchTerm.length < 2 ? (
                            t('search.type_more', 'اكتب حرفين على الأقل...')
                        ) : (
                            t('search.no_results', 'لا توجد نتائج.')
                        )}
                    </CommandEmpty>
                    {instantSearchResults.length > 0 && (
                        <CommandGroup heading={t('martyrs.title', 'الشهداء')}>
                            {instantSearchResults.map((martyr) => (
                                <CommandItem
                                    key={martyr.id}
                                    value={martyr.full_name}
                                    onSelect={() => {
                                        router.visit(`/martyrs/${martyr.id}`);
                                        setOpen(false);
                                        setSearchTerm('');
                                        setInstantSearchResults([]);
                                    }}
                                    className="flex items-center space-x-2"
                                >
                                    <User className="h-4 w-4 flex-shrink-0" />
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className="font-medium truncate">{martyr.full_name}</span>
                                        <div className="flex gap-4 text-sm text-muted-foreground">
                                            <span>{t('martyrs.national_id')}: {martyr.national_id}</span>
                                            {martyr.military_number && (
                                                <span>{t('martyrs.military_number')}: {martyr.military_number}</span>
                                            )}
                                            {martyr.decision_number && (
                                                <span>{t('martyrs.decision_number')}: {martyr.decision_number}</span>
                                            )}
                                        </div>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    );
}