'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/Button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';
import { memo, useCallback, useMemo, useState, useEffect } from 'react';

const TRIGGER_PROPS = {
    'aria-label': 'Select language',
    'aria-haspopup': 'menu'
};

const CONTENT_PROPS = {
    align: 'end',
    className: 'w-32'
};

const LanguageItem = memo(({ lang, isActive, onSelect }) => {
    const handleClick = useCallback(() => {
        onSelect(lang.code);
    }, [lang.code, onSelect]);

    const itemClassName = useMemo(() =>
        isActive ? 'font-medium bg-muted' : '',
        [isActive]
    );

    return (
        <DropdownMenuItem
            onClick={handleClick}
            className={itemClassName}
        >
            <span className="flex w-full justify-between">
                <span>{lang.name}</span>
                <span className="text-muted-foreground">{lang.flag}</span>
            </span>
        </DropdownMenuItem>
    );
});

const LangSwitcher = memo(() => {
    const { locale, changeLanguage } = useTranslation();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const availableLanguages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'it', name: 'Italiano', flag: '🇮🇹' }
    ];

    const handleLanguageChange = useCallback((code) => {
        if (locale !== code) {
            changeLanguage(code);
        }
    }, [changeLanguage, locale]);

    const displayText = useMemo(() =>
        locale.toUpperCase(),
        [locale]
    );

    const menuItems = useMemo(() =>
        availableLanguages.map((lang) => (
            <LanguageItem
                key={lang.code}
                lang={lang}
                isActive={locale === lang.code}
                onSelect={handleLanguageChange}
            />
        )),
        [availableLanguages, locale, handleLanguageChange]
    );

    if (!mounted) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5" {...TRIGGER_PROPS}>
                    <Languages className="h-4 w-4" aria-hidden="true" />
                    <span className="font-medium">{displayText}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent {...CONTENT_PROPS}>
                {menuItems}
            </DropdownMenuContent>
        </DropdownMenu>
    );
});

LangSwitcher.displayName = 'LangSwitcher';
LanguageItem.displayName = 'LanguageItem';

export default LangSwitcher;
