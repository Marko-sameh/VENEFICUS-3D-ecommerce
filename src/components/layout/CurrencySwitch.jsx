'use client';


import { useLocalization } from '@/hooks/useUserSettings';
import { Button } from '@/components/ui/Button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GlobeIcon } from 'lucide-react';

export function CurrencySwitch() {
    const { currency, availableCurrencies, setCurrency, mounted } = useLocalization();

    if (!mounted) {
        return (
            <Button variant="ghost" size="sm" className="opacity-0 h-8 w-16" aria-hidden="true">
                USD
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5">
                    <GlobeIcon className="h-4 w-4" aria-hidden="true" />
                    <span className="font-medium">{currency.code}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
                {availableCurrencies.map((curr) => (
                    <DropdownMenuItem
                        key={curr.code}
                        onClick={() => setCurrency(curr.code)}
                        className={currency.code === curr.code ? 'font-medium bg-muted' : ''}
                    >
                        <span className="flex w-full justify-between">
                            <span>{curr.code}</span>
                            <span className="text-muted-foreground">
                                {new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: curr.code,
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                }).format(1)}
                            </span>
                        </span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}