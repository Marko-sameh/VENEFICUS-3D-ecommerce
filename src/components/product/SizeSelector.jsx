// src/components/product/SizeSelector.jsx
'use client';

import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { useProducts } from '../../hooks/useProducts';

function SizeSelector({ sizes }) {
    const { 
        modelSize,
        isClient, 
        initializeClient, 
        selectSize 
    } = useProducts();
    
    const [showSizeGuide, setShowSizeGuide] = useState(false);

    useEffect(() => {
        if (sizes?.length > 0 && !isClient) {
            initializeClient([], sizes);
        }
    }, [sizes, isClient, initializeClient]);

    const handleSizeSelect = useCallback((sizeName) => {
        selectSize(sizeName);
    }, [selectSize]);

    // Get current size name from modelSize
    const selectedSize = useMemo(() => {
        const sizeMap = { 3: 'S', 4: 'M', 5: 'L', 6: 'XL' };
        return sizeMap[modelSize] || 'M';
    }, [modelSize]);

    const sizeButtons = useMemo(() => {
        return sizes?.map(size => ({
            id: size.id,
            name: size.name,
            isSelected: selectedSize === size.name
        })) || [];
    }, [sizes, selectedSize]);

    const toggleSizeGuide = useCallback(() => {
        setShowSizeGuide(prev => !prev);
    }, []);

    const closeSizeGuide = useCallback(() => {
        setShowSizeGuide(false);
    }, []);

    const clearSelection = useCallback(() => {
        selectSize('M');
    }, [selectSize]);

    if (!isClient || !sizes?.length) {
        return null;
    }

    return (
        <div className="mt-4" itemScope itemType="https://schema.org/Product">
            <div className="flex justify-between items-center">
                <label
                    htmlFor="sizes"
                    className="block text-sm font-medium text-[var(--text-primary)]"
                >
                    Size
                </label>
                <button
                    type="button"
                    onClick={toggleSizeGuide}
                    className="text-sm font-medium text-[var(--main-color)] hover:text-[var(--main-color-hover)]"
                    aria-label="Size guide"
                >
                    Size Guide
                </button>
            </div>

            <div
                className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-2"
                id="sizes"
                role="listbox"
                aria-label="Available sizes"
            >
                {sizeButtons.map((size) => (
                    <button
                        key={size.id}
                        type="button"
                        onClick={() => handleSizeSelect(size.name)}
                        className={`h-10 px-4 rounded-md flex items-center justify-center text-sm font-medium transition-colors duration-150 ${size.isSelected
                                ? 'bg-[var(--main-color)] text-white'
                                : 'bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--main-color)]'
                            }`}
                        aria-pressed={size.isSelected}
                        aria-label={`Select size ${size.name}`}
                    >
                        {size.name}
                    </button>
                ))}
            </div>

            {selectedSize && (
                <button
                    type="button"
                    onClick={clearSelection}
                    className="mt-2 text-sm text-[var(--text-light)] hover:text-[var(--text-primary)]"
                >
                    Clear selection
                </button>
            )}

            {/* Size Guide Modal */}
            {showSizeGuide && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 z-10
                            opacity-100"
                            onClick={closeSizeGuide}
                            aria-hidden="true"
                        />

                        <div className="relative bg-white rounded-lg max-w-2xl w-full p-6 z-20">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-[var(--text-primary)]">Size Guide</h2>
                                <button
                                    onClick={closeSizeGuide}
                                    className="text-2xl text-[var(--text-light)] hover:text-[var(--text-primary)]"
                                    aria-label="Close size guide"
                                >
                                    &times;
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-[var(--gray-light)]">
                                            <th className="p-2 text-left text-[var(--text-primary)]">Size</th>
                                            <th className="p-2 text-left text-[var(--text-primary)]">Chest (in)</th>
                                            <th className="p-2 text-left text-[var(--text-primary)]">Waist (in)</th>
                                            <th className="p-2 text-left text-[var(--text-primary)]">Hips (in)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-[var(--border-color)]">
                                            <td className="p-2 text-[var(--text-primary)]">S</td>
                                            <td className="p-2 text-[var(--text-secondary)]">34-36</td>
                                            <td className="p-2 text-[var(--text-secondary)]">28-30</td>
                                            <td className="p-2 text-[var(--text-secondary)]">34-36</td>
                                        </tr>
                                        <tr className="border-b border-[var(--border-color)]">
                                            <td className="p-2 text-[var(--text-primary)]">M</td>
                                            <td className="p-2 text-[var(--text-secondary)]">36-38</td>
                                            <td className="p-2 text-[var(--text-secondary)]">30-32</td>
                                            <td className="p-2 text-[var(--text-secondary)]">36-38</td>
                                        </tr>
                                        <tr className="border-b border-[var(--border-color)]">
                                            <td className="p-2 text-[var(--text-primary)]">L</td>
                                            <td className="p-2 text-[var(--text-secondary)]">38-40</td>
                                            <td className="p-2 text-[var(--text-secondary)]">32-34</td>
                                            <td className="p-2 text-[var(--text-secondary)]">38-40</td>
                                        </tr>
                                        <tr>
                                            <td className="p-2 text-[var(--text-primary)]">XL</td>
                                            <td className="p-2 text-[var(--text-secondary)]">40-42</td>
                                            <td className="p-2 text-[var(--text-secondary)]">34-36</td>
                                            <td className="p-2 text-[var(--text-secondary)]">40-42</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <p className="mt-4 text-[var(--text-secondary)]">
                                Measure your body using a measuring tape for the most accurate sizing.
                                Sizes may vary slightly depending on the style.
                            </p>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
}

export default memo(SizeSelector);