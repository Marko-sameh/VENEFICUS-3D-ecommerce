export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "it" }];
}

export async function generateMetadata({ params }) {
  const { locale } = await params;

  const titles = {
    en: "VENEFICUS - Premium Denim Collection",
    it: "VENEFICUS - Collezione Denim Premium",
  };

  const descriptions = {
    en: "Discover premium denim crafted with exceptional quality. Over 200 different models available.",
    it: "Scopri il denim premium realizzato con qualità eccezionale. Oltre 200 modelli diversi disponibili.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      locale: locale === "it" ? "it_IT" : "en_US",
    },
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  return children;
}
