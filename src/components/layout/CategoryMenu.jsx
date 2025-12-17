'use client';

import { useEffect, memo } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown } from 'lucide-react';
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useProducts } from '@/hooks/useProducts';

export const CategoryMenu = memo(function CategoryMenu({
    position = 'bottom',
    className = '',
    onCategorySelect
}) {
    const {
        categoriesWithActiveState: categories,
        loading,
        error,
        toggleCategory,
        fetchCategories
    } = useProducts();

    useEffect(() => {
        if (!categories.length && !loading.categories) {
            fetchCategories();
        }
    }, [categories.length, loading.categories, fetchCategories]);



    // SEO: Use semantic nav element for better accessibility and crawlability
    return (
        <nav
            className={`category-menu ${className}`}
            aria-label="Product categories navigation"
        >
            {loading.categories ? (
                <div className="py-4 flex justify-center">
                    <LoadingSpinner size="sm" />
                </div>
            ) : error ? (
                <div className="py-4 text-center text-red-500">
                    {error}
                </div>
            ) : (
                <ul className={`flex flex-col ${position === 'side' ? 'space-y-1' : 'space-y-0.5'}`}>
                    {categories.map((category) => (
                        <CategoryItem
                            key={category.id}
                            category={category}
                            position={position}
                            isActive={category.isActive}
                            isOpen={category.isOpen}
                            onToggle={() => toggleCategory(category.id)}
                            onCategorySelect={onCategorySelect}
                        />
                    ))}
                </ul>
            )}
        </nav>
    );
});

const CategoryItem = memo(function CategoryItem({
    category,
    position,
    isActive,
    isOpen,
    onToggle,
    onCategorySelect
}) {
    const hasChildren = category.children && category.children.length > 0;

    return (
        <li>
            <div className="group relative">
                <Link
                    href={`/shop/categories/${category.slug}`}
                    className={`flex items-center w-full px-3 py-2 rounded-md transition-colors ${isActive
                        ? 'bg-gray-100 text-black font-medium'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-black'
                        }`}
                    onClick={() => onCategorySelect?.(category)}
                    // SEO: aria-current="page" helps search engines understand active page
                    aria-current={isActive ? 'page' : undefined}
                >
                    {category.name}

                    {hasChildren && (
                        position === 'side' ? (
                            <ChevronRight className="ml-1 h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
                        ) : (
                            <ChevronDown
                                className={`ml-1 h-4 w-4 flex-shrink-0 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''
                                    }`}
                            />
                        )
                    )}
                </Link>

                {/* SEO: Only show dropdown on hover/focus - ensures crawlers see main links */}
                {hasChildren && position !== 'side' && (
                    <div
                        className={`${isOpen ? 'block' : 'hidden'
                            } absolute left-full top-0 w-64 pl-2 mt-[-2px]`}
                    >
                        <ul className="bg-white shadow-lg rounded-md py-1 border border-gray-100">
                            {category.children.map((child) => (
                                <CategoryItem
                                    key={child.id}
                                    category={child}
                                    position={position}
                                    isActive={isActive}
                                    onCategorySelect={onCategorySelect}
                                />
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Mobile nested menu */}
            {hasChildren && position === 'side' && (
                <div
                    className={`${isOpen ? 'block' : 'hidden'} pl-4 mt-1`}
                    role="group"
                    aria-label={`Subcategories for ${category.name}`}
                >
                    {category.children.map((child) => (
                        <CategoryItem
                            key={child.id}
                            category={child}
                            position={position}
                            isActive={isActive}
                            onCategorySelect={onCategorySelect}
                        />
                    ))}
                </div>
            )}
        </li>
    );
});