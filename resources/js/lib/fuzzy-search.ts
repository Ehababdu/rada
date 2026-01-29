import Fuse, { IFuseOptions } from 'fuse.js';

/**
 * Fuzzy search configuration options
 */
export interface FuzzySearchOptions {
    /**
     * Keys to search in (e.g., ['name', 'email', 'description'])
     */
    keys: string[];

    /**
     * Threshold for matching (0.0 = perfect match, 1.0 = match anything)
     * Default: 0.3
     */
    threshold?: number;

    /**
     * Maximum distance between characters
     * Default: 100
     */
    distance?: number;

    /**
     * Include match score in results
     * Default: true
     */
    includeScore?: boolean;

    /**
     * Minimum characters before search activates
     * Default: 2
     */
    minMatchCharLength?: number;
}

/**
 * Create a fuzzy searcher for items
 * Supports typo tolerance and partial matching
 */
export function createFuzzySearcher<T>(
    items: T[],
    options: FuzzySearchOptions
) {
    const fuseOptions: IFuseOptions<T> = {
        keys: options.keys,
        threshold: options.threshold ?? 0.3,
        distance: options.distance ?? 100,
        includeScore: options.includeScore ?? true,
        minMatchCharLength: options.minMatchCharLength ?? 2,
        useExtendedSearch: true,
        ignoreLocation: true, // Search anywhere in the string
        findAllMatches: true,
    };

    return new Fuse(items, fuseOptions);
}

/**
 * Perform fuzzy search on items
 */
export function fuzzySearch<T>(
    items: T[],
    query: string,
    keys: string[],
    options?: Partial<FuzzySearchOptions>
): T[] {
    if (!query || query.trim().length === 0) {
        return items;
    }

    const searcher = createFuzzySearcher(items, {
        keys,
        ...options,
    });

    const results = searcher.search(query);
    return results.map((result) => result.item);
}

/**
 * Highlight matching text in search results
 */
export function highlightMatches(
    text: string,
    query: string
): { text: string; isMatch: boolean }[] {
    if (!query) return [{ text, isMatch: false }];

    const parts: { text: string; isMatch: boolean }[] = [];
    const regex = new RegExp(`(${query.split('').join('.*')})`, 'gi');
    let lastIndex = 0;

    text.replace(regex, (match, ...args) => {
        const index = args[args.length - 2];

        if (index > lastIndex) {
            parts.push({
                text: text.slice(lastIndex, index),
                isMatch: false,
            });
        }

        parts.push({
            text: match,
            isMatch: true,
        });

        lastIndex = index + match.length;
        return match;
    });

    if (lastIndex < text.length) {
        parts.push({
            text: text.slice(lastIndex),
            isMatch: false,
        });
    }

    return parts.length > 0 ? parts : [{ text, isMatch: false }];
}
