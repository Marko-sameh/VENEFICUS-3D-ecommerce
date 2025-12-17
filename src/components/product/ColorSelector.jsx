// src/components/product/ColorSelector.jsx
'use client';

import { useEffect, useCallback, memo, useMemo } from 'react';
import { useProducts } from '../../hooks/useProducts';

function ColorSelector({ colors }) {
    const {
        selectedColor,
        isClient,
        initializeClient,
        selectColor
    } = useProducts();

    useEffect(() => {
        if (colors?.length > 0 && !isClient) {
            initializeClient(colors);
        }
    }, [colors, isClient, initializeClient]);

    const handleColorSelect = useCallback((colorHex) => {
        selectColor(colorHex);
    }, [selectColor]);

    const limitedColors = useMemo(() => colors?.slice(0, 8) || [], [colors]);

    if (!isClient || !colors?.length) {
        return null;
    }

    return (
        <div className="mt-4" itemScope itemType="https://schema.org/Product">
            <label
                htmlFor="colors"
                className="block text-sm font-medium text-[var(--text-primary)]"
            >
                Color
            </label>
            <div
                className="mt-2 flex flex-wrap gap-2"
                id="colors"
                role="listbox"
                aria-label="Available colors"
            >
                {limitedColors.map((color) => (
                    <button
                        key={color.id}
                        type="button"
                        onClick={() => handleColorSelect(color.hex)}
                        className={`w-10 h-10 rounded-full border-2 transition-transform duration-150 focus:outline-none ${selectedColor === color.hex
                            ? 'ring-2 ring-[var(--main-color)] ring-offset-1 scale-110'
                            : 'hover:scale-105'
                            }`}
                        style={{ backgroundColor: color.hex }}
                        aria-pressed={selectedColor === color.hex}
                        aria-label={`Select ${color.name} color`}
                    >
                        {selectedColor === color.hex && (
                            <span className="sr-only">Selected</span>
                        )}
                    </button>
                ))}
            </div>

            {selectedColor && (
                <div className="mt-2 text-sm">
                    <span className="text-[var(--text-secondary)]">Selected color: </span>
                    <span className="font-medium text-[var(--text-primary)]">
                        {limitedColors.find(c => c.hex === selectedColor)?.name}
                    </span>
                </div>
            )}


        </div>
    );
}

export default memo(ColorSelector);