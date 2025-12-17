'use client';

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { User, LogOut } from 'lucide-react';
import { CurrencySwitch } from './CurrencySwitch';
import LangSwitcher from './LangSwitcher';
import { useTranslation } from '@/hooks/useTranslation';
import GoogleSignInButton from '../auth/GoogleSignInButton';
import { useUserStore } from '@/store/userStore';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function UserMenu() {
    const { t } = useTranslation();
    const { isAuthenticated, logout, initializeAuth } = useUserStore();
    const router = useRouter();
    const params = useParams();
    const locale = params?.locale || 'en';

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    const handleLoginSuccess = (data) => {
        window.location.reload();
    };

    const handleLogout = () => {
        logout();
        window.location.reload();
    };


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="h-8 w-8 items-center justify-center cursor-pointer">
                    <User className="w-6 h-6 transition-transform duration-300 ease-in-out hover:scale-125 hover:opacity-80" />
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                {isAuthenticated ? (
                    <>
                        <DropdownMenuItem onClick={() => router.push(`/${locale}/profile`)}>
                            {t('account.profile', 'Profile')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/${locale}/orders`)}>
                            {t('account.orders', 'Orders')}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>{t('account.signOut', 'Sign out')}</span>
                        </DropdownMenuItem>
                    </>
                ) : (
                    <DropdownMenuItem>
                        <GoogleSignInButton onSuccess={handleLoginSuccess} />
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-between">
                    <CurrencySwitch />
                    <div className="w-[1px] bg-[var(--gray)] self-stretch mx-2"></div>
                    <LangSwitcher />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}