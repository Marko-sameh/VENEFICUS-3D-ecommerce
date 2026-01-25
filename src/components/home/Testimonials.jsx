// src/components/home/Testimonials.jsx
'use client';

import { useState, useEffect } from 'react';
// import { StarRating } from '@/components/common/StarRating';

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      location: 'New York, NY',
      rating: 5,
      content: 'The quality of ESSEC Denim is unmatched. I\'ve never owned jeans that fit so perfectly and lasted this long. Worth every penny!',
      image: '/images/testimonials/sarah.jpg'
    },
    {
      id: 2,
      name: 'Michael Chen',
      location: 'Los Angeles, CA',
      rating: 5,
      content: 'I\'m extremely picky about my denim, but ESSEC has exceeded my expectations. The attention to detail and craftsmanship is evident in every stitch.',
      image: '/images/testimonials/michael.jpg'
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      location: 'Miami, FL',
      rating: 4.5,
      content: 'Beautiful collection with timeless designs. The customer service was exceptional when I had a question about sizing. Will definitely be a repeat customer.',
      image: '/images/testimonials/emma.jpg'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const nextSlide = () => {
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
    setIsTransitioning(false);
  };

  const prevSlide = () => {
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
    setIsTransitioning(false);
  };

  return (
    <section className="py-16" aria-labelledby="testimonials-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            id="testimonials-heading"
            className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4"
            itemProp="name"
          >
            What Our Customers Say
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Don't just take our word for it. Hear from our satisfied customers who love their ESSEC Denim.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          {/* Schema.org structured data for aggregate rating */}
          <div
            itemScope
            itemType="https://schema.org/AggregateRating"
            className="sr-only"
          >
            <meta itemProp="ratingValue" content="4.8" />
            <meta itemProp="bestRating" content="5" />
            <meta itemProp="ratingCount" content="1245" />
          </div>

          <div className="overflow-hidden">
            <div
              className={`flex transition-transform duration-500 ease-in-out ${isTransitioning ? 'transform' : ''
                }`}
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-4"
                  itemScope
                  itemType="https://schema.org/Review"
                >
                  <div className="bg-[var(--card-bg)] rounded-xl p-8 shadow-sm">
                    <div className="flex items-center mb-4">
                      <div className="mr-4 flex-shrink-0">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                            <img
                              src={testimonial.image}
                              alt={`صورة لـ ${String(testimonial.name).replace(/<[^>]*>/g, '')}`}
                              width={64}
                              height={64}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3
                          className="text-lg font-semibold text-[var(--text-primary)]"
                          itemProp="author"
                          itemScope
                          itemType="https://schema.org/Person"
                        >
                          <meta itemProp="name" content={String(testimonial.name).replace(/<[^>]*>/g, '')} />
                          {String(testimonial.name).replace(/<[^>]*>/g, '')}
                        </h3>
                        <div className="flex items-center">
                          {/* <StarRating
                            rating={testimonial.rating}
                            className="mr-2"
                          /> */}
                          <span className="text-sm text-[var(--text-light)]">
                            {String(testimonial.location).replace(/<[^>]*>/g, '')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <blockquote className="text-[var(--text-secondary)] italic text-lg leading-relaxed">
                      <p
                        className="mb-4"
                        itemProp="reviewBody"
                      >
                        "{String(testimonial.content).replace(/<[^>]*>/g, '')}"
                      </p>
                      <div
                        itemProp="reviewRating"
                        itemScope
                        itemType="https://schema.org/Rating"
                        className="sr-only"
                      >
                        <meta itemProp="ratingValue" content={testimonial.rating.toString()} />
                        <meta itemProp="bestRating" content="5" />
                      </div>
                    </blockquote>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation controls */}
          <div className="mt-8 flex justify-center items-center gap-4">
            <button
              onClick={prevSlide}
              aria-label="Previous testimonial"
              className="p-2 rounded-full bg-[var(--gray-light)] text-[var(--text-primary)] hover:bg-[var(--gray)] transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setCurrentIndex(index);
                      setIsTransitioning(false);
                    }, 300);
                  }}
                  aria-label={`Go to testimonial ${index + 1}`}
                  className={`w-3 h-3 rounded-full transition-all ${currentIndex === index
                    ? 'bg-[var(--main-color)] w-3.5 h-3.5'
                    : 'bg-[var(--gray)] hover:bg-[var(--gray-dark)]'
                    }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              aria-label="Next testimonial"
              className="p-2 rounded-full bg-[var(--gray-light)] text-[var(--text-primary)] hover:bg-[var(--gray)] transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="mt-10 text-center">
            <a
              href="/reviews"
              className="inline-block px-6 py-3 bg-[var(--main-color)] text-white font-medium rounded-md hover:bg-[var(--main-color-hover)] transition-colors"
            >
              Read All Reviews
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}