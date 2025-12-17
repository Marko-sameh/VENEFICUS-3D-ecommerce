export const metadata = {
  title: {
    template: '%s | VENEFICUS',
    default: 'VENEFICUS - Premium Fashion & Lifestyle Brand'
  },
  description: 'Premium fashion and lifestyle brand offering high-quality denim and clothing',
  keywords: ['fashion', 'denim', 'premium', 'clothing', 'lifestyle', 'VENEFICUS'],
  authors: [{ name: 'VENEFICUS Team' }],
  creator: 'VENEFICUS',
  publisher: 'VENEFICUS',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://veneficus.com',
    siteName: 'VENEFICUS',
    title: 'VENEFICUS - Premium Fashion & Lifestyle Brand',
    description: 'Premium fashion and lifestyle brand offering high-quality denim and clothing',
    images: [
      {
        url: '/images/logo_wbg.png',
        width: 1200,
        height: 630,
        alt: 'VENEFICUS Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VENEFICUS - Premium Fashion & Lifestyle Brand',
    description: 'Premium fashion and lifestyle brand offering high-quality denim and clothing',
    images: ['/images/logo_wbg.png'],
  },
  verification: {
    google: 'google-site-verification-code',
  },
};