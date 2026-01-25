import "./globals.css";
import ClientLayout from "./ClientLayout";

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Audiowide&family=Cinzel+Decorative:wght@400;700;900&family=Exo+2:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
