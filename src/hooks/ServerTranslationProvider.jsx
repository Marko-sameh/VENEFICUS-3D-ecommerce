import { getServerTranslationsWithT } from '@/lib/server-translations';

export async function ServerTranslationProvider({ children, locale }) {
  const { translations, t } = await getServerTranslationsWithT(locale);

  return (
    <div data-translations={JSON.stringify(translations)} data-locale={locale}>
      {children}
    </div>
  );
}