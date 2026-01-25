// src/components/product/ProductGallery.jsx
'use client';

import { useState } from 'react';
import Shirt3D from './Shirt3D';
import { Button } from '../ui/Button-improved';
import Shirt3DLazy from './Shirt3DLazy';
import { API_BASE_URL } from '@/lib';
import { motion } from 'framer-motion';
export function ProductGallery({
    productName,
    models = ['/models/t_shirt.glb'],
    modelNames = ['product'],
    width = 500,
    height = 500,
}) {
    const [selectedModel, setSelectedModel] = useState(0);

    // Use local model by default, construct external URL only if needed
    const getModelSrc = (modelPath) => {
        // If no model path or empty, use local fallback
        // if (!modelPath || modelPath === '') {
        //     return '/models/t_shirt.glb';
        // }

        // if (modelPath.startsWith('/')) {
        //     return modelPath; // Local path
        // }

        // For external URLs, we'll let the Shirt3D component handle CORS fallback
        return `${API_BASE_URL}/${modelPath}`;
    };

    const currentModelSrc = getModelSrc(models[selectedModel]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 3D Model Display */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-9 relative"
            >
                <div className="aspect-square w-full rounded-2xl bg-gradient-to-br from-[var(--gray-light)] to-white shadow-2xl flex items-center justify-center overflow-hidden border border-[var(--border-color)]">
                    <Shirt3DLazy
                        src={currentModelSrc}
                        width={width}
                        height={height}
                        size={5}
                    />
                </div>

                {/* Decorative Glow */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                    transition={{ duration: 2, delay: 0.5 }}
                    className="absolute -bottom-10 -right-10 w-64 h-64 bg-[var(--main-color)] rounded-full blur-[100px] pointer-events-none"
                />
            </motion.div>

            {/* Model Selection */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-3"
            >
                {models.length > 1 && (
                    <>
                        <h3 className="text-base font-semibold mb-4 text-[var(--text-primary)]">Models</h3>
                        <div className="space-y-3">
                            {models.map((model, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                                    whileHover={{ scale: 1.03, x: 5 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        onClick={() => setSelectedModel(index)}
                                        className={`w-full p-3 text-sm font-medium rounded-xl border-2 transition-all shadow-md ${selectedModel === index
                                            ? 'border-[var(--main-color)] bg-[var(--main-color)] text-white shadow-lg shadow-[var(--main-color)]/30'
                                            : 'border-[var(--border-color)] hover:border-[var(--main-color)] bg-white'
                                            }`}
                                    >
                                        {modelNames[index] || `Model ${index + 1}`}
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
}