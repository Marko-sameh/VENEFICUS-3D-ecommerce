'use client';

import { useMemo } from 'react';

export function StructuredData({ data, type }) {
  const jsonLdScript = useMemo(() => {
    if (!data || typeof data !== 'object') return null;

    try {
      return JSON.stringify(data);
    } catch (error) {
      
      return null;
    }
  }, [data]);

  if (!jsonLdScript) return null;

  return (
    <script
      type="application/ld+json"
      data-schema-type={type}
      dangerouslySetInnerHTML={{ __html: jsonLdScript }}
    />
  );
}

export function WebsiteStructuredData({ 
  name = 'VENEFICUS',
  url = 'https://veneficus.com',
  searchUrl = 'https://veneficus.com/search?q={search_term_string}'
}) {
  const data = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    potentialAction: {
      '@type': 'SearchAction',
      target: searchUrl,
      'query-input': 'required name=search_term_string'
    }
  }), [name, url, searchUrl]);

  return <StructuredData data={data} type="WebSite" />;
}

export function OrganizationStructuredData({
  name = 'VENEFICUS',
  url = 'https://veneficus.com',
  logo = 'https://veneficus.com/images/logo_wbg.png',
  socialMedia = [
    'https://www.facebook.com/veneficus',
    'https://www.instagram.com/veneficus'
  ]
}) {
  const data = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    sameAs: socialMedia
  }), [name, url, logo, socialMedia]);

  return <StructuredData data={data} type="Organization" />;
}