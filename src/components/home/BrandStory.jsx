// src/components/home/BrandStory.jsx
import LazyImage from '@/components/common/LazyImage';

export function BrandStory() {
  return (
    <section
      className="py-16"
      itemScope
      itemType="https://schema.org/AboutPage"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2
              className="text-3xl md:text-4xl font-bold mb-6 text-[var(--text-primary)]"
              itemProp="name"
            >
              Our Story
            </h2>

            <div
              className="prose prose-lg max-w-none text-[var(--text-secondary)] mb-8"
              itemProp="description"
            >
              <p className="text-lg leading-relaxed mb-4">
                ESSEC Denim was born from a passion for quality craftsmanship and sustainable fashion.
                Founded in 2010 by designer Maria Thompson, our mission has always been to create
                timeless denim pieces that combine traditional techniques with modern innovation.
              </p>
              <p className="text-lg leading-relaxed mb-4">
                What started as a small workshop in Brooklyn has grown into a globally recognized brand,
                but our commitment to quality remains unchanged. Each pair of jeans is meticulously
                crafted using premium, ethically sourced materials and traditional techniques passed
                down through generations of denim artisans.
              </p>
              <p className="text-lg leading-relaxed">
                Today, ESSEC Denim continues to push the boundaries of sustainable fashion while staying
                true to our core values: quality, craftsmanship, and environmental responsibility.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="bg-[var(--card-bg)] p-6 rounded-lg">
                <div className="text-3xl font-bold text-[var(--main-color)] mb-2">2010</div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-1">Our Beginning</h3>
                <p className="text-[var(--text-secondary)] text-sm">
                  Founded in a small Brooklyn workshop with a commitment to quality denim.
                </p>
              </div>
              <div className="bg-[var(--card-bg)] p-6 rounded-lg">
                <div className="text-3xl font-bold text-[var(--main-color)] mb-2">100K+</div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-1">Happy Customers</h3>
                <p className="text-[var(--text-secondary)] text-sm">
                  Serving denim lovers across 30+ countries worldwide.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-2xl">
              <LazyImage
                src="/images/brand/story.jpg"
                alt="ESSEC Denim workshop showing artisans crafting denim products"
                width={800}
                height={1000}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Schema.org Organization markup */}
            <div
              itemScope
              itemType="https://schema.org/Organization"
              className="sr-only"
            >
              <meta itemProp="name" content="ESSEC Denim" />
              <meta itemProp="url" content="https://essec-denim.com" />
              <div itemProp="logo" itemScope itemType="https://schema.org/ImageObject">
                <meta itemProp="url" content="/images/logo.png" />
                <meta itemProp="width" content="500" />
                <meta itemProp="height" content="100" />
              </div>
              <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                <meta itemProp="streetAddress" content="123 Denim Street" />
                <meta itemProp="addressLocality" content="Brooklyn" />
                <meta itemProp="addressRegion" content="NY" />
                <meta itemProp="postalCode" content="11201" />
                <meta itemProp="addressCountry" content="US" />
              </div>
              <meta itemProp="telephone" content="+1-555-123-4567" />
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-[var(--card-bg)] rounded-xl">
            <div className="text-[var(--main-color)] text-4xl font-bold mb-4">100%</div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Sustainable Materials</h3>
            <p className="text-[var(--text-secondary)]">
              We use only organic cotton and eco-friendly dyes in our production process.
            </p>
          </div>
          <div className="text-center p-6 bg-[var(--card-bg)] rounded-xl">
            <div className="text-[var(--main-color)] text-4xl font-bold mb-4">30+</div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Years of Expertise</h3>
            <p className="text-[var(--text-secondary)]">
              Our team combines traditional craftsmanship with modern denim innovation.
            </p>
          </div>
          <div className="text-center p-6 bg-[var(--card-bg)] rounded-xl">
            <div className="text-[var(--main-color)] text-4xl font-bold mb-4">1</div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Mission</h3>
            <p className="text-[var(--text-secondary)]">
              To create the perfect pair of jeans that will become your favorite for years.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}