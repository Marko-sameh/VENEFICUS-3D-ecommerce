"use client";
import Link from 'next/link';
import { useMemo, useEffect, memo, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { usePagination } from '@/hooks/useUi';

/**
 * Optimized Pagination component with centralized logic
 */
export const Pagination = memo(function Pagination({
    currentPage,
    totalPages,
    baseUrl,
    filters = {},
    isCategory = false
}) {
    const { t } = useTranslation();
    const { calculateVisiblePages, generatePageUrl } = usePagination();

    // Early return if no pages
    if (totalPages <= 0) {
        return null;
    }

    const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages));
    
    // Memoized visible pages calculation
    const visiblePages = useMemo(() => 
        calculateVisiblePages(currentPage, totalPages),
        [currentPage, totalPages, calculateVisiblePages]
    );

    // Memoized page URL generator
    const getPageUrl = useCallback((page) => 
        generatePageUrl(page, baseUrl, filters),
        [generatePageUrl, baseUrl, filters]
    );

    return (
        <nav
            aria-label={isCategory ? "Category page numbering" : "Product pagination"}
            className="mt-8"
        >
            <ul className="inline-flex items-center -space-x-px">
                {/* زر "السابق" مع rel="prev" */}
                {safeCurrentPage > 1 ? (
                    <li>
                        <Link
                            href={getPageUrl(safeCurrentPage - 1)}
                            rel="prev"
                            className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
                            aria-label={t('pagination.previous', 'Previous page')}
                        >
                            <span className="sr-only">السابق</span>
                            <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                            </svg>
                        </Link>
                    </li>
                ) : (
                    <li>
                        <span
                            className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-300 bg-gray-50 border border-e-0 border-gray-300 rounded-s-lg cursor-not-allowed"
                            aria-disabled="true"
                        >
                            <span className="sr-only">السابق</span>
                            <svg className="w-2.5 h-2.5 rtl:rotate-180 opacity-50" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                            </svg>
                        </span>
                    </li>
                )}

                {/* عرض أرقام الصفحات */}
                {visiblePages.map((page, index) => (
                    <li key={index}>
                        {page === 'ellipsis-start' || page === 'ellipsis-end' ? (
                            <span className="flex items-center justify-center px-3 h-8 text-gray-500">...</span>
                        ) : (
                            <Link
                                href={getPageUrl(page)}
                                className={`flex items-center justify-center px-3 h-8 leading-tight ${page === safeCurrentPage
                                    ? 'text-blue-600 bg-blue-50 border border-blue-300 hover:bg-blue-100 hover:text-blue-700'
                                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'
                                    }`}
                                aria-current={page === safeCurrentPage ? 'page' : undefined}
                                aria-label={page === 1 ? "الصفحة الرئيسية للمنتجات" :
                                    page === safeCurrentPage ? `الصفحة الحالية: ${page}` :
                                        `Go to page ${page}`}
                            >
                                {page}
                            </Link>
                        )}
                    </li>
                ))}

                {/* زر "التالي" مع rel="next" */}
                {safeCurrentPage < totalPages ? (
                    <li>
                        <Link
                            href={getPageUrl(safeCurrentPage + 1)}
                            rel="next"
                            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700"
                            aria-label={t('pagination.next', 'Next page')}
                        >
                            <span className="sr-only">التالي</span>
                            <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                            </svg>
                        </Link>
                    </li>
                ) : (
                    <li>
                        <span
                            className="flex items-center justify-center px-3 h-8 leading-tight text-gray-300 bg-gray-50 border border-gray-300 rounded-e-lg cursor-not-allowed"
                            aria-disabled="true"
                        >
                            <span className="sr-only">التالي</span>
                            <svg className="w-2.5 h-2.5 rtl:rotate-180 opacity-50" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                            </svg>
                        </span>
                    </li>
                )}
            </ul>
        </nav>
    );
});