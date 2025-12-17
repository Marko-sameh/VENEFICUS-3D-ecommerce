import "./globals.css";
import ClientLayout from "./ClientLayout";
import { Playfair_Display_SC } from 'next/font/google';

const playfairDisplaySC = Playfair_Display_SC({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata = {
  title: "VENEFICUS - Premium Denim Collection",
  description:
    "Discover premium denim crafted with exceptional quality. Over 200 different models available.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://veneficus.com"
  ),
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "VENEFICUS - Premium Denim Collection",
    description:
      "Premium denim collection with unmatched durability and best fit.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Content-Language" content="en" />
        <link rel="preload" as="fetch" href="/models/t_shirt.glb" crossOrigin="anonymous" />
      </head>
      <body className={playfairDisplaySC.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
