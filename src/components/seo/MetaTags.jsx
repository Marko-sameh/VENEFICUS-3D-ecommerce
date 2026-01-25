'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const DEFAULT_DOMAIN = 'https://veneficus.com';
const DEFAULT_TITLE = 'VENEFICUS - Premium Denim Collection';
const DEFAULT_DESCRIPTION = 'Discover VENEFICUS premium denim collection. Handcrafted with sustainable materials and timeless designs.';
const DEFAULT_IMAGE = '/images/og-default.jpg';

function sanitizeInput(input) {
  if (!input) return '';
  return String(input)
    .replace(/<[^>]*>/g, '')
    .replace(/[<>"'&]/g, (match) => {
      const entities = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;' };
      return entities[match] || match;
    })
    .trim();
}

function sanitizeUrl(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url, DEFAULT_DOMAIN);
    return parsed.href;
  } catch {
    return url.replace(/[<>"']/g, '');
  }
}

export function MetaTags({
  title,
  description,
  keywords,
  image,
  url,
  locale = 'en-US',
  alternateLocales = [],
  noIndex = false,
  domain = DEFAULT_DOMAIN
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const baseUrl = sanitizeUrl(url || `${domain}${pathname || ''}`);
    const fullTitle = title ? `${sanitizeInput(title)} | VENEFICUS` : DEFAULT_TITLE;
    const safeDescription = sanitizeInput(description) || DEFAULT_DESCRIPTION;
    const safeImage = sanitizeUrl(image) || `${domain}${DEFAULT_IMAGE}`;
    const safeKeywords = sanitizeInput(keywords) || 'denim, jeans, premium, sustainable, fashion';

    document.title = fullTitle;

    updateMetaTag('description', safeDescription);
    updateMetaTag('keywords', safeKeywords);
    updateMetaTag('og:title', sanitizeInput(title) || DEFAULT_TITLE);
    updateMetaTag('og:description', safeDescription);
    updateMetaTag('og:image', safeImage);
    updateMetaTag('og:url', baseUrl);
    updateMetaTag('og:type', 'website');
    updateMetaTag('og:locale', sanitizeInput(locale));
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', sanitizeInput(title) || DEFAULT_TITLE);
    updateMetaTag('twitter:description', safeDescription);
    updateMetaTag('twitter:image', safeImage);

    updateLinkTag('canonical', baseUrl);

    if (Array.isArray(alternateLocales)) {
      alternateLocales.forEach(({ hrefLang, href }) => {
        const safeHrefLang = sanitizeInput(hrefLang);
        const safeHref = sanitizeUrl(href);
        if (safeHrefLang && safeHref) {
          updateLinkTag('alternate', safeHref, { hrefLang: safeHrefLang });
        }
      });
    }

    updateMetaTag('robots', noIndex 
      ? 'noindex, nofollow' 
      : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
    );

  }, [title, description, keywords, image, url, locale, alternateLocales, noIndex, pathname, domain]);

  return null;
}

function updateMetaTag(name, content) {
  if (!content || !name) return;

  try {
    const safeName = sanitizeInput(name);
    
    // Find existing meta tag safely without dynamic selectors
    let metaTag;
    const existingMetas = document.querySelectorAll('meta');
    for (const meta of existingMetas) {
      if (meta.getAttribute('name') === safeName || meta.getAttribute('property') === safeName) {
        metaTag = meta;
        break;
      }
    }

    if (!metaTag) {
      metaTag = document.createElement('meta');
      if (safeName.startsWith('og:') || safeName.startsWith('twitter:')) {
        metaTag.setAttribute('property', safeName);
      } else {
        metaTag.setAttribute('name', safeName);
      }
      document.head.appendChild(metaTag);
    }

    metaTag.setAttribute('content', sanitizeInput(content));
  } catch (error) {
    
  }
}

function updateLinkTag(rel, href, attributes = {}) {
  if (!href || !rel) return;

  try {
    const safeRel = sanitizeInput(rel);
    const safeHref = sanitizeUrl(href);
    const safeHrefLang = attributes.hrefLang ? sanitizeInput(attributes.hrefLang) : null;
    
    // Find existing link tag safely without dynamic selectors
    let linkTag;
    const existingLinks = document.querySelectorAll('link');
    for (const link of existingLinks) {
      if (link.getAttribute('rel') === safeRel && 
          (!safeHrefLang || link.getAttribute('hreflang') === safeHrefLang)) {
        linkTag = link;
        break;
      }
    }

    if (!linkTag) {
      linkTag = document.createElement('link');
      linkTag.setAttribute('rel', safeRel);
      if (safeHrefLang) {
        linkTag.setAttribute('hreflang', safeHrefLang);
      }
      document.head.appendChild(linkTag);
    }

    linkTag.setAttribute('href', safeHref);
  } catch (error) {
    
  }
}