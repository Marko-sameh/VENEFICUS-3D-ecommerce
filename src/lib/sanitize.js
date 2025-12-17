/**
 * HTML sanitization utilities to prevent XSS attacks
 */

// Simple HTML sanitizer for basic content
export function sanitizeHTML(html) {
  if (typeof html !== 'string') return '';
  
  // Remove script tags and their content
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove dangerous attributes
  html = html.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, ''); // event handlers
  html = html.replace(/\s*javascript\s*:/gi, ''); // javascript: protocol
  html = html.replace(/\s*data\s*:/gi, ''); // data: protocol
  html = html.replace(/\s*vbscript\s*:/gi, ''); // vbscript: protocol
  
  // Remove dangerous tags
  const dangerousTags = ['script', 'object', 'embed', 'link', 'style', 'meta', 'iframe', 'frame', 'frameset'];
  dangerousTags.forEach(tag => {
    const regex = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'gi');
    html = html.replace(regex, '');
  });
  
  return html;
}

// Safe component for rendering sanitized HTML
export function SafeHTML({ html, className = '' }) {
  const sanitized = sanitizeHTML(html);
  
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}