// src/components/home/SaleSection.jsx
'use client';

import { useState, useEffect } from 'react';
// import { ProductGrid } from '@/components/product/ProductGrid';
import Link from 'next/link';
import { ProductGrid } from '../product/ProductGrid';

export function SaleSection() {
  const [saleProducts, setSaleProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const mockProducts = [
    {
      id: 1,
      name: 'Premium Denim Jacket',
      slug: 'premium-denim-jacket',
      mainImage: '/images/products/denim-jacket.jpg',
      altText: 'Premium Denim Jacket - ESSEC Denim',
      price: 149.99,
      compareAtPrice: 199.99,
      category: 'Jackets',
      categorySlug: 'jackets'
    },
    {
      id: 2,
      name: 'Classic Straight Jeans',
      slug: 'classic-straight-jeans',
      mainImage: '/images/products/straight-jeans.jpg',
      altText: 'Classic Straight Jeans - ESSEC Denim',
      price: 89.99,
      compareAtPrice: 119.99,
      category: 'Jeans',
      categorySlug: 'jeans'
    }
  ];

  useEffect(() => {
    // Fetch sale products
    const fetchSaleProducts = async () => {
      setIsLoading(true);
      try {
        // In production, replace with actual API call
        setSaleProducts(mockProducts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSaleProducts();

    // Countdown timer
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7); // 7 days from now

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(timer);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    };

    const timer = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-[var(--gray-light)]" itemScope itemType="https://schema.org/SaleEvent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4 text-[var(--text-primary)]"
            itemProp="name"
          >
            Summer Sale - Up to 40% Off
          </h2>
          <p
            className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-6"
            itemProp="description"
          >
            Discover our curated selection of premium denim pieces at special prices for a limited time only.
          </p>

          {/* Countdown timer */}
          <div
            className="flex justify-center gap-2 md:gap-4 mb-8"
            aria-label="Sale ends in"
          >
            <div className="text-center">
              <div
                className="text-2xl md:text-3xl font-bold text-[var(--main-color)] w-12 md:w-16 h-12 md:h-16 flex items-center justify-center rounded-lg bg-white shadow-md"
                itemProp="validThrough"
              >
                {String(countdown.days).padStart(2, '0')}
              </div>
              <div className="text-xs md:text-sm text-[var(--text-secondary)] mt-1">Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-[var(--main-color)] w-12 md:w-16 h-12 md:h-16 flex items-center justify-center rounded-lg bg-white shadow-md">
                {String(countdown.hours).padStart(2, '0')}
              </div>
              <div className="text-xs md:text-sm text-[var(--text-secondary)] mt-1">Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-[var(--main-color)] w-12 md:w-16 h-12 md:h-16 flex items-center justify-center rounded-lg bg-white shadow-md">
                {String(countdown.minutes).padStart(2, '0')}
              </div>
              <div className="text-xs md:text-sm text-[var(--text-secondary)] mt-1">Minutes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-[var(--main-color)] w-12 md:w-16 h-12 md:h-16 flex items-center justify-center rounded-lg bg-white shadow-md">
                {String(countdown.seconds).padStart(2, '0')}
              </div>
              <div className="text-xs md:text-sm text-[var(--text-secondary)] mt-1">Seconds</div>
            </div>
          </div>

          <Link
            href="/sale"
            className="inline-block px-8 py-3 bg-[var(--main-color)] text-white font-medium rounded-md hover:bg-[var(--main-color-hover)] transition-colors"
            itemProp="offers"
            itemScope
            itemType="https://schema.org/Offer"
          >
            <meta itemProp="url" content="/sale" />
            Shop All Sale Items
          </Link>
        </div>

        <ProductGrid products={mockProducts} />

        <div className="mt-10 text-center">
          <Link
            href="/sale"
            className="text-[var(--main-color)] hover:underline font-medium"
          >
            View All Sale Products →
          </Link>
        </div>
      </div>
    </section>
  );
}