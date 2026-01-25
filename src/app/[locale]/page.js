import { IntroSplash } from "@/components/intro";
import HomeClient from "./HomeClient";
import { categoryService } from "@/services/categoryService";
import { productService } from "@/services/products";
import { replaceImageUrl } from "@/lib/config";

async function fetchHomeData() {
  const [collections, productsResult, bestSellersResult, aboutRes] =
    await Promise.all([
      categoryService.getCategories().catch(() => []),
      productService.getProducts().catch(() => ({ products: [] })),
      productService.getBestSellingProducts().catch(() => []),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/all_about`)
        .then((r) => r.json())
        .catch(() => null),
    ]);

  const aboutData = aboutRes?.[0] || {};
  const translations = aboutData.translations || [];
  const products = productsResult?.products || [];
  const bestSellers = Array.isArray(bestSellersResult) ? bestSellersResult : [];
  
  const collectionsArray = Array.isArray(collections) ? collections : collections.categories || [];
  const transformedCollections = collectionsArray.map(c => ({
    ...c,
    image: replaceImageUrl(c.image)
  }));

  return {
    collections: transformedCollections,
    products: Array.isArray(products) ? products : [],
    bestSellers: bestSellers,
    homedata: aboutData,
    translations: translations,
  };
}

export default async function HomePage({ params }) {
  const { locale } = await params;
  const data = await fetchHomeData();

  return (
    <IntroSplash>
      <HomeClient
        locale={locale}
        initialData={{
          collections: data.collections,
          products: data.products,
          bestSellers: data.bestSellers,
        }}
        homedata={data.homedata}
        translations={data.translations}
      />
    </IntroSplash>
  );
}
