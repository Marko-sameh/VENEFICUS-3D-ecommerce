'use client'

import { useSizeStore } from '../../store/sizeStore'

export default function SizeSelectorSimple({ sizes }) {
    const { selectedSize, setSelectedSize } = useSizeStore()

    if (!sizes?.length) return null

    return (
        <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Size</label>
            <div className="flex gap-2">
                {sizes.map((size) => (
                    <button
                        key={size.id}
                        onClick={() => setSelectedSize(size.name)}
                        className={`px-4 py-2 border rounded ${
                            selectedSize === size.name 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-white text-black hover:bg-gray-100'
                        }`}
                    >
                        {size.name}
                    </button>
                ))}
            </div>
        </div>
    )
}