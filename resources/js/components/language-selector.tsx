import { cn } from '@/lib/utils';
import { Languages } from 'lucide-react';
import { HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSelector({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const languages = [
        { value: 'en', label: 'English', nativeLabel: 'English' },
        { value: 'ar', label: 'Arabic', nativeLabel: 'العربية' },
    ];

    return (
        <div
            className={cn(
                'inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800',
                className,
            )}
            {...props}
        >
            {languages.map(({ value, nativeLabel }) => (
                <button
                    key={value}
                    onClick={() => changeLanguage(value)}
                    className={cn(
                        'flex items-center rounded-md px-3.5 py-1.5 transition-colors',
                        i18n.language === value
                            ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                            : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60',
                    )}
                >
                    <Languages className="-ml-1 h-4 w-4" />
                    <span className="ml-1.5 text-sm">{nativeLabel}</span>
                </button>
            ))}
        </div>
    );
}
