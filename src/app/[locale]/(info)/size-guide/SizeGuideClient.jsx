'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/store';
import LazyImage from '@/components/common/LazyImage';
import { API_BASE_URL } from '@/lib';
import { useTranslation } from 'react-i18next';

const sizeChart = [
    { size: 'XS', waist: '28-29"', hips: '34-35"', inseam: '30-32"' },
    { size: 'S', waist: '30-31"', hips: '36-37"', inseam: '30-32"' },
    { size: 'M', waist: '32-33"', hips: '38-39"', inseam: '30-32"' },
    { size: 'L', waist: '34-35"', hips: '40-41"', inseam: '30-32"' },
    { size: 'XL', waist: '36-37"', hips: '42-43"', inseam: '30-32"' },
    { size: 'XXL', waist: '38-39"', hips: '44-45"', inseam: '30-32"' }
];

export function SizeGuideClient() {
    const { t } = useTranslation();
    const { getAboutData, fetchAboutData } = useUserStore();
    const [homedata, setHomedata] = useState({});

    useEffect(() => {
        fetchAboutData();
        const data = getAboutData();
        setHomedata(data[0] || {});
    }, [fetchAboutData, getAboutData]);

    return (
        <>
            <motion.header
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12 text-center"
            >
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-[var(--text-primary)] mb-4">
                    {t('pages.sizeGuide.title', 'Size Guide')}
                </h1>
                <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: 48 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="block mx-auto h-1 bg-gradient-to-r from-transparent via-[var(--main-color)] to-transparent"
                />
                <p className="text-[var(--text-secondary)] mt-4">
                    {t('pages.sizeGuide.subtitle', 'Find your perfect fit with our comprehensive size guide')}
                </p>
            </motion.header>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-12"
            >
                <div className="aspect-[2/1] w-full overflow-hidden rounded-2xl bg-[var(--card-bg)] shadow-xl">
                    {homedata.image && (
                        <LazyImage
                            src={`${API_BASE_URL}/${homedata.image}`}
                            alt="VENEFICUS Size Guide Chart"
                            fill={true}
                            className="h-full w-full object-cover"
                        />
                    )}
                </div>
            </motion.div>

            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
                    {t('pages.sizeGuide.sizeChart', 'Size Chart')}
                </h2>

                <div className="overflow-x-auto rounded-xl shadow-lg">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[var(--color-gray-light)]">
                                <th className="py-2 px-3 text-left font-bold text-[var(--color-text-primary)] border-b border-[var(--main-color-hover)]">
                                    Size
                                </th>
                                <th className="py-2 px-3 text-left font-bold text-[var(--color-text-primary)] border-b border-[var(--main-color-hover)]">
                                    Waist
                                </th>
                                <th className="py-2 px-3 text-left font-bold text-[var(--color-text-primary)] border-b border-[var(--main-color-hover)]">
                                    Hips
                                </th>
                                <th className="py-2 px-3 text-left font-bold text-[var(--color-text-primary)] border-b border-[var(--main-color-hover)]">
                                    Inseam
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sizeChart.map((size, index) => (
                                <tr
                                    key={size.size}
                                    className={
                                        index % 2 === 0
                                            ? 'bg-[var(--color-white)]'
                                            : 'bg-[var(--color-gray-light)]'
                                    }
                                >
                                    <td className="py-2 px-3 font-medium text-[var(--color-text-primary)] border-b border-[var(--color-border)]">
                                        {size.size}
                                    </td>
                                    <td className="py-2 px-3 text-[var(--color-text-secondary)] border-b border-[var(--color-border)]">
                                        {size.waist}
                                    </td>
                                    <td className="py-2 px-3 text-[var(--color-text-secondary)] border-b border-[var(--color-border)]">
                                        {size.hips}
                                    </td>
                                    <td className="py-2 px-3 text-[var(--color-text-secondary)] border-b border-[var(--color-border)]">
                                        {size.inseam}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.section>
        </>
    );
}
