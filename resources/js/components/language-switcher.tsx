import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Check, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        // Persist language preference if needed (e.g., localStorage or cookie)
        // Usually handled by i18next plugin, but explicit check helps validation
        document.dir = lng === 'ar' ? 'rtl' : 'ltr';
    };

    const languages = [
        { code: 'ar', label: 'العربية', dir: 'rtl' },
        { code: 'en', label: 'English', dir: 'ltr' },
    ];

    const currentLanguage =
        languages.find((l) => l.code === i18n.language) || languages[0];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full"
                >
                    <Globe className="h-4 w-4" />
                    <span className="sr-only">Toggle language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {languages.map((language) => (
                    <DropdownMenuItem
                        key={language.code}
                        onClick={() => changeLanguage(language.code)}
                        className={cn(
                            'flex cursor-pointer items-center justify-between gap-4',
                            i18n.language === language.code &&
                                'bg-accent text-accent-foreground',
                        )}
                    >
                        <span
                            className={cn(
                                language.code === 'ar' && 'font-cairo',
                            )}
                        >
                            {language.label}
                        </span>
                        {i18n.language === language.code && (
                            <Check className="h-4 w-4" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
