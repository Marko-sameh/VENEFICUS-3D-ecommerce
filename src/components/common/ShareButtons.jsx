"use client";
import { useEffect, useCallback, memo, useMemo } from 'react';
import { Copy } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { useSharing } from '@/hooks/useUi';

const ShareButtons = memo(function ShareButtons({
    url,
    title,
    description = '',
    componentId = 'default'
}) {
    const { t } = useTranslation('common');
    const {
        clientReady,
        currentUrl,
        copiedStates,
        initializeClient,
        copyToClipboard,
        shareViaSystem
    } = useSharing();

    // Initialize client on mount
    useEffect(() => {
        initializeClient();
    }, [initializeClient]);

    // Get copied state for this component
    const copied = useMemo(() =>
        copiedStates.get(componentId) || false,
        [copiedStates, componentId]
    );

    // Use provided URL or current URL
    const shareUrl = useMemo(() =>
        url || currentUrl,
        [url, currentUrl]
    );

    // Memoized copy handler
    const handleCopy = useCallback(async () => {
        const success = await copyToClipboard(shareUrl, componentId);
        if (!success) {
            alert(t('copy_manually'));
        }
    }, [copyToClipboard, shareUrl, componentId, t]);

    // Memoized system share handler
    const handleSystemShare = useCallback(async () => {
        await shareViaSystem({
            title: title || document.title,
            text: description
        }, shareUrl);
    }, [shareViaSystem, title, description, shareUrl]);

    // انتظر حتى التحميل الكامل (لتجنب أخطاء SSR)
    if (!clientReady) return null;

    return (
        <div className="flex flex-wrap items-center gap-3 mt-4">

            <button
                onClick={handleCopy}
                aria-label={copied ? t('copied') : t('copy_link')}
                className={`p-2 rounded-full transition-colors ${copied
                    ? 'bg-[var(--main-color-light)] text-[var(--main-color)]'
                    : 'bg-gray-100 hover:bg-gray-200'
                    }`}
            >
                {copied ? (
                    <CheckIcon className="h-5 w-5" />
                ) : (
                    <Copy className="h-5 w-5" />
                )}
            </button>

            {typeof navigator !== 'undefined' && navigator.share && (
                <button
                    onClick={handleSystemShare}
                    aria-label={t('share_via_system')}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                    <ShareIcon className="h-5 w-5" />
                </button>
            )}

            {/* <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                {t('Share')}
            </span> */}
        </div>
    );
});

export default ShareButtons;

// أيقونات مخصصة (لتحسين الأداء)
function CheckIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    );
}

function ShareIcon(props) {
    return (
        <svg width="13" height="12" viewBox="0 0 13 12" className="icon icon-share" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"  {...props}>
            <path d="M1.625 8.125V10.2917C1.625 10.579 1.73914 10.8545 1.9423 11.0577C2.14547 11.2609 2.42102 11.375 2.70833 11.375H10.2917C10.579 11.375 10.8545 11.2609 11.0577 11.0577C11.2609 10.8545 11.375 10.579 11.375 10.2917V8.125" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
            <path fillRule="evenodd" clipRule="evenodd" d="M6.14775 1.27137C6.34301 1.0761 6.65959 1.0761 6.85485 1.27137L9.56319 3.9797C9.75845 4.17496 9.75845 4.49154 9.56319 4.6868C9.36793 4.88207 9.05135 4.88207 8.85609 4.6868L6.5013 2.33203L4.14652 4.6868C3.95126 4.88207 3.63468 4.88207 3.43942 4.6868C3.24415 4.49154 3.24415 4.17496 3.43942 3.9797L6.14775 1.27137Z" fill="currentColor"></path>
            <path fillRule="evenodd" clipRule="evenodd" d="M6.5 1.125C6.77614 1.125 7 1.34886 7 1.625V8.125C7 8.40114 6.77614 8.625 6.5 8.625C6.22386 8.625 6 8.40114 6 8.125V1.625C6 1.34886 6.22386 1.125 6.5 1.125Z" fill="currentColor"></path>
        </svg>
    );
}