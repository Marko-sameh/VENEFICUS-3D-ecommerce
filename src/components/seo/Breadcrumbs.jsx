import Link from 'next/link';
import { JsonLd } from './JsonLd';

/**
 * Breadcrumbs component with structured data
 * @param {Array} items - Breadcrumb items with name and url
 * @param {string} separator - Separator between items
 */
export function Breadcrumbs({ items = [], separator = '/' }) {
  if (!items || items.length === 0) return null;

  // Sanitize breadcrumb items
  const safeItems = items
    .filter(item => item && typeof item === 'object' && item.name && item.url)
    .map(item => ({
      name: typeof item.name === 'string' ? item.name.replace(/[<>\"'&]/g, '').substring(0, 100) : '',
      url: typeof item.url === 'string' ? item.url.replace(/[<>\"'&]/g, '').substring(0, 200) : ''
    }))
    .filter(item => item.name && item.url);

  if (safeItems.length === 0) return null;

  // Generate structured data for breadcrumbs
  const breadcrumbSchema = {
    '@type': 'BreadcrumbList',
    itemListElement: safeItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://veneficus.com'}${item.url}`
    }))
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} type="breadcrumb" />

      <nav
        aria-label="Breadcrumb navigation"
        className="mb-6"
      >
        <ol className="flex items-center space-x-2 text-sm">
          {safeItems.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span
                  className="mx-2 text-[var(--text-light)]"
                  aria-hidden="true"
                >
                  {separator}
                </span>
              )}

              {index === safeItems.length - 1 ? (
                <span
                  className="text-[var(--text-primary)] font-medium"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="text-[var(--text-secondary)] hover:text-[var(--main-color)] transition-colors duration-200"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}