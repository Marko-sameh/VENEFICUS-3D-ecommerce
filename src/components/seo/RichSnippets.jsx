'use client';

import { useMemo } from 'react';

const DEFAULT_DOMAIN = 'https://veneficus.com';

function getOneYearFromNow() {
  return new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];
}

function safeGetMetaContent(name) {
  if (typeof document === 'undefined') return null;
  
  try {
    const metaTag = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
    return metaTag?.getAttribute('content') || null;
  } catch (error) {
    
    return null;
  }
}

export function RichSnippets({
  product,
  organization,
  localBusiness,
  domain = DEFAULT_DOMAIN
}) {
  const structuredData = useMemo(() => {
    const snippets = [];

    if (product && typeof product === 'object') {
      const productSnippet = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        '@id': `${domain}#${product.id || 'product'}`,
        name: product.name || (typeof document !== 'undefined' ? document.title.split(' | ')[0] : 'Product'),
        image: product.image || safeGetMetaContent('og:image'),
        description: product.description || safeGetMetaContent('description'),
        sku: product.id || product.sku,
        ...(organization && {
          brand: {
            '@type': 'Brand',
            name: organization.name
          }
        }),
        offers: {
          '@type': 'Offer',
          url: typeof window !== 'undefined' ? window.location.href : `${domain}/product`,
          priceCurrency: product.priceCurrency || 'USD',
          price: product.price,
          availability: product.availability || 'https://schema.org/InStock',
          priceValidUntil: product.priceValidUntil || getOneYearFromNow()
        },
        ...(product.rating && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount || 0
          }
        })
      };
      snippets.push(productSnippet);
    }

    if (organization && typeof organization === 'object') {
      const orgSnippet = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: organization.name,
        url: organization.url,
        logo: organization.logo,
        ...(Array.isArray(organization.social) && {
          sameAs: organization.social
        })
      };
      snippets.push(orgSnippet);
    }

    if (localBusiness && typeof localBusiness === 'object') {
      const businessSnippet = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: localBusiness.name || organization?.name,
        image: localBusiness.image,
        '@id': localBusiness.id || `#${(localBusiness.name || 'business').replace(/\s+/g, '-').toLowerCase()}`,
        url: localBusiness.url || organization?.url,
        telephone: localBusiness.telephone,
        ...(localBusiness.address && {
          address: {
            '@type': 'PostalAddress',
            streetAddress: localBusiness.address.street,
            addressLocality: localBusiness.address.city,
            addressRegion: localBusiness.address.region,
            postalCode: localBusiness.address.postalCode,
            addressCountry: localBusiness.address.country
          }
        }),
        ...(localBusiness.geo && {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: localBusiness.geo.latitude,
            longitude: localBusiness.geo.longitude
          }
        }),
        ...(Array.isArray(localBusiness.openingHours) && {
          openingHoursSpecification: localBusiness.openingHours.map(hours => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: hours.days,
            opens: hours.opens,
            closes: hours.closes
          }))
        })
      };
      snippets.push(businessSnippet);
    }

    return snippets;
  }, [product, organization, localBusiness, domain]);

  if (structuredData.length === 0) return null;

  return (
    <>
      {structuredData.map((snippet, index) => {
        try {
          return (
            <script
              key={`rich-snippet-${index}`}
              type="application/ld+json"
              data-rich-snippet={index}
              dangerouslySetInnerHTML={{ __html: JSON.stringify(snippet) }}
            />
          );
        } catch (error) {
          
          return null;
        }
      })}
    </>
  );
}