"use client";
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useProducts } from '@/hooks/useProducts';
import { debounce } from '@/lib/utils';
import { hashId } from '@/lib/hash';

const SearchBar = ({ className }) => {
    const { t } = useTranslation();
    const { products: allProducts, fetchProducts } = useProducts();
    
    useEffect(() => {
        if (!allProducts?.length) {
            fetchProducts();
        }
    }, []);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    const openSearch = () => {
        setIsVisible(true);
        setTimeout(() => setIsSearchOpen(true), 20);
    };

    const closeSearch = () => {
        setIsSearchOpen(false);
        setTimeout(() => setIsVisible(false), 300);
    };

    // Client-side search function
    const performSearch = (query) => {
        
        
        
        if (!query || query.length < 1) {
            setFilteredProducts([]);
            setSuggestions([]);
            return;
        }

        const searchTerm = query.toLowerCase();
        const results = (allProducts || []).filter(product => {
            const nameMatch = product.name?.toLowerCase().includes(searchTerm);
            const descMatch = product.description?.toLowerCase().includes(searchTerm);
            const catMatch = product.category?.name?.toLowerCase().includes(searchTerm);
            return nameMatch || descMatch || catMatch;
        }).slice(0, 5);

        
        setFilteredProducts(results);
        setSuggestions(results.map(p => p.name).slice(0, 5));
    };

    const debouncedSearch = debounce(performSearch, 300);

    useEffect(() => {
        debouncedSearch(searchQuery);
    }, [searchQuery, allProducts]);

    const filteredSuggestions = suggestions.filter(
        (s) => s.toLowerCase().includes(searchQuery.toLowerCase()) && searchQuery.length > 0
    );

    return (
        <>
            <button
                onClick={openSearch}
                className=" hover:text-[var(--gray)] transition-colors w-6 h-6 transition-transform duration-300 ease-in-out hover:scale-125 hover:opacity-80"
            >
                <Search />
            </button>

            {isVisible && (
                <>
                    {/* Overlay */}
                    <div
                        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 z-40
                            ${isSearchOpen ? "opacity-100" : "opacity-0"}`}
                        onClick={closeSearch}
                    />

                    {/* Search Panel */}
                    <div
                        className={`fixed inset-0 z-50 bg-white/95 backdrop-blur-sm transform transition-transform duration-300 h-50
                            ${isSearchOpen ? "translate-y-0" : "-translate-y-full"}`}
                    >
                        <div className="max-w-2xl mx-auto pt-20 px-4">
                            {/* Search Input */}
                            <div className="relative mb-6">
                                <div className="flex items-center border-b-2 border-gray-300 pb-2">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={t('search.placeholder', 'Search products...')}
                                        className="flex-1 text-lg bg-transparent border-none outline-none"
                                        autoFocus
                                    />
                                    {searchQuery && (
                                        <button onClick={() => setSearchQuery('')}>
                                            <X className="w-5 h-5 text-[var(--gray)]" />
                                        </button>
                                    )}
                                    <button onClick={closeSearch}>
                                        <X className="w-6 h-6 text-[var(--gray-dark)]" />
                                    </button>
                                </div>
                            </div>

                            {/* نتائج البحث */}
                            {searchQuery && (
                                <div className="bg-[var(--background)] rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                                    <div className="flex">
                                        {/* Suggestions */}
                                        <div className="w-1/2 border-r border-gray-200">
                                            <div className="p-4 bg-[var(--gray-light)] border-b border-gray-200">
                                                <h3 className="text-sm font-medium text-[var(--text-secondary)] uppercase">
                                                    {t('search.searchSuggestions', 'Suggestions')}
                                                </h3>
                                            </div>
                                            <div className="p-2">
                                                {filteredSuggestions.map((s, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setSearchQuery(s)}
                                                        className="w-full text-left px-3 py-2 hover:bg-[var(--gray-light)] rounded"
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Products */}
                                        <div className="w-1/2">
                                            <div className="p-4 bg-[var(--gray-light)] border-b border-gray-200">
                                                <h3 className="text-sm font-medium text-[var(--text-secondary)] uppercase">
                                                    {t('products.title', 'Products')}
                                                </h3>
                                            </div>
                                            <div className="p-2 max-h-96 overflow-y-auto">
                                                {filteredProducts.map((p) => (
                                                    <a
                                                        key={p.id}
                                                        href={`/en/products/${p.slug || hashId(p.id)}`}
                                                        className="flex items-center p-3 hover:bg-[var(--gray-light)] rounded cursor-pointer"
                                                        onClick={closeSearch}
                                                    >
                                                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center mr-3">
                                                            <img src={p.mainImage} alt={p.name} className="w-full h-full object-cover rounded" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-medium">{p.name}</h4>
                                                            <span className="text-sm">${p.price}</span>
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default SearchBar;
