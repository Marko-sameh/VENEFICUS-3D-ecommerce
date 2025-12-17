// // // src/lib/server-translations.js
// // import fs from 'fs';
// // import path from 'path';
// // import { headers } from 'next/headers';

// // const translationsCache = new Map();

// // export async function getServerTranslations(locale) {
// //   // Auto-detect locale from headers if not provided
// //   if (!locale) {
// //     try {
// //       const headersList = headers();
// //       const acceptLanguage = headersList.get('accept-language') || 'en';
// //       locale = acceptLanguage.split(',')[0].split('-')[0] || 'en';
// //     } catch {
// //       locale = 'en';
// //     }
// //   }

// //   if (translationsCache.has(locale)) {
// //     return translationsCache.get(locale);
// //   }

// //   try {
// //     const filePath = path.join(process.cwd(), 'public', 'locales', locale, 'common.json');
// //     const fileContent = fs.readFileSync(filePath, 'utf8');
// //     const translations = JSON.parse(fileContent);

// //     translationsCache.set(locale, translations);
// //     return translations;
// //   } catch (error) {
// //     
// //     if (locale !== 'en') {
// //       return getServerTranslations('en');
// //     }
// //     return {};
// //   }
// // }

// // export function createServerTranslator(translations) {
// //   return function t(key, fallback = '') {
// //     const keys = key.split('.');
// //     let value = translations;

// //     for (const k of keys) {
// //       if (value && typeof value === 'object' && k in value) {
// //         value = value[k];
// //       } else {
// //         return fallback || key;
// //       }
// //     }

// //     return typeof value === 'string' ? value : fallback || key;
// //   };
// // }

// // // HOC to wrap server components with translations
// // export function withServerTranslations(Component) {
// //   return async function ServerTranslatedComponent(props) {
// //     const translations = await getServerTranslations(props.locale);
// //     const t = createServerTranslator(translations);

// //     return <Component {...props} translations={translations} t={t} />;
// //   };
// // }

// // // Utility to get translations in server components
// // export async function useServerTranslations(locale) {
// //   const translations = await getServerTranslations(locale);
// //   const t = createServerTranslator(translations);
// //   return { translations, t };
// // }

// // // Remove 'use client' from pages by converting them to server components
// // export function convertToServerComponent(clientComponent) {
// //   return async function ServerComponent(props) {
// //     const { translations, t } = await useServerTranslations(props.searchParams?.lang);

// //     // Pass translations as props to remove client dependency
// //     const ComponentWithoutClient = clientComponent.toString()
// //       .replace("'use client';", '')
// //       .replace('"use client";', '')
// //       .replace('useTranslation()', `{ t: (key, fallback) => translations[key] || fallback }`);

// //     return eval(`(${ComponentWithoutClient})`)(
// //       { ...props, translations, t }
// //     );
// //   };
// // }

// // // Inject server translations into existing pages
// // export function injectServerTranslations(pageComponent) {
// //   return async function TranslatedPage(props) {
// //     const { translations, t } = await useServerTranslations(props.searchParams?.lang);

// //     return pageComponent({ ...props, translations, t });
// //   };
// // }

// // src/lib/server-translations.js
// import fs from "fs";
// import path from "path";
// import { headers } from "next/headers";

// const translationsCache = globalThis.__translationsCache || new Map();
// globalThis.__translationsCache = translationsCache;

// export async function getServerTranslations(locale) {
//   // Auto-detect locale from headers if not provided
//   if (!locale) {
//     try {
//       const headersList = await headers(); // ✅ لازم await هنا
//       const acceptLanguage = headersList.get("accept-language") || "en";
//       const primaryLang = acceptLanguage.match(/[a-zA-Z-]+/g)?.[0] || "en";
//       locale = primaryLang.split("-")[0];
//     } catch {
//       locale = "en";
//     }
//   }

//   if (translationsCache.has(locale)) {
//     return translationsCache.get(locale);
//   }

//   try {
//     const filePath = path.join(
//       process.cwd(),
//       "public",
//       "locales",
//       locale,
//       "common.json"
//     );
//     const fileContent = await fs.promises.readFile(filePath, "utf8");
//     const translations = JSON.parse(fileContent);

//     translationsCache.set(locale, translations);
//     return translations;
//   } catch (error) {
//     
//     if (locale !== "en") {
//       return getServerTranslations("en");
//     }
//     return {};
//   }
// }

// export function createServerTranslator(translations) {
//   return function t(key, fallback = "") {
//     const keys = key.split(".");
//     let value = translations;

//     for (const k of keys) {
//       if (value && typeof value === "object" && k in value) {
//         value = value[k];
//       } else {
//         return fallback || key;
//       }
//     }

//     return typeof value === "string" ? value : fallback || key;
//   };
// }

// export async function getServerTranslationsWithT(locale) {
//   const translations = await getServerTranslations(locale);
//   const t = createServerTranslator(translations);
//   return { translations, t };
// }

// export function withServerTranslations(Component) {
//   return async function ServerTranslatedComponent(props) {
//     const { translations, t } = await getServerTranslationsWithT(
//       props.searchParams?.lang || props.locale
//     );
//     return <Component {...props} translations={translations} t={t} />;ش
//   };
// }
// export function injectServerTranslations(pageComponent) {
//   return async function TranslatedPage(props) {
//     // ✅ searchParams لازم await
//     const searchParams = await props.searchParams;
//     const lang = searchParams?.lang;

//     const { translations, t } = await getServerTranslationsWithT(lang);
//     return pageComponent({ ...props, translations, t });
//   };
// }

// import fs from "fs";
// import path from "path";
// import { headers } from "next/headers";

// const translationsCache = new Map();

// // 🟢 دالة رئيسية لجلب الترجمة من ملف JSON
// export async function getServerTranslations(locale) {
//   // لو مش محدد لغة، ناخدها من الهيدر
//   if (!locale) {
//     try {
//       const headersList = await headers(); // لازم await
//       const acceptLanguage = headersList.get("accept-language") || "en";
//       const primaryLang = acceptLanguage.match(/[a-zA-Z-]+/g)?.[0] || "en";
//       locale = primaryLang.split("-")[0];
//     } catch {
//       locale = "en";
//     }
//   }

//   if (translationsCache.has(locale)) {
//     return translationsCache.get(locale);
//   }

//   try {
//     const filePath = path.join(
//       process.cwd(),
//       "public",
//       "locales",
//       locale,
//       "common.json"
//     );
//     const fileContent = await fs.promises.readFile(filePath, "utf8");
//     const translations = JSON.parse(fileContent);

//     translationsCache.set(locale, translations);
//     return translations;
//   } catch (error) {
//     
//     if (locale !== "en") {
//       return getServerTranslations("en");
//     }
//     return {};
//   }
// }

// // 🟢 تنشئ دالة الترجمة
// export function createServerTranslator(translations) {
//   return function t(key, fallback = "") {
//     const keys = key.split(".");
//     let value = translations;

//     for (const k of keys) {
//       if (value && typeof value === "object" && k in value) {
//         value = value[k];
//       } else {
//         return fallback || key;
//       }
//     }

//     return typeof value === "string" ? value : fallback || key;
//   };
// }

// // 🟢 دالة ترجع الترجمة + الدالة t
// export async function getServerTranslationsWithT(locale) {
//   const translations = await getServerTranslations(locale);
//   const t = createServerTranslator(translations);
//   return { translations, t };
// }

// // 🟢 وورابر عشان نحقن الترجمة في أي صفحة سيرفر
// export function injectServerTranslations(pageComponent) {
//   return async function TranslatedPage(props) {
//     const searchParams = await props.searchParams; // لازم await
//     const lang = searchParams?.lang;

//     const { translations, t } = await getServerTranslationsWithT(lang);
//     return pageComponent({ ...props, translations, t });
//   };
// }

import fs from "fs";
import path from "path";
import { headers } from "next/headers";

const translationsCache = new Map();

// 🟢 جلب الترجمة
export async function getServerTranslations(locale) {
  if (!locale) {
    try {
      const headersList = await headers();
      const acceptLanguage = headersList.get("accept-language") || "en";
      const primaryLang = acceptLanguage.match(/[a-zA-Z-]+/g)?.[0] || "en";
      locale = primaryLang.split("-")[0];
    } catch {
      locale = "en";
    }
  }

  // Sanitize locale to prevent path traversal
  const sanitizedLocale = locale.replace(/[^a-zA-Z-]/g, '').substring(0, 10);
  if (!sanitizedLocale || sanitizedLocale.includes('..')) {
    return getServerTranslations('en');
  }

  if (translationsCache.has(sanitizedLocale)) {
    return translationsCache.get(sanitizedLocale);
  }

  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "locales",
      sanitizedLocale,
      "common.json"
    );
    const fileContent = await fs.promises.readFile(filePath, "utf8");
    const translations = JSON.parse(fileContent);

    translationsCache.set(sanitizedLocale, translations);
    return translations;
  } catch (error) {
    if (sanitizedLocale !== "en") {
      return getServerTranslations("en");
    }
    return {};
  }
}

// 🟢 دالة الترجمة
export function createServerTranslator(translations) {
  return function t(key, fallback = "") {
    const keys = key.split(".");
    let value = translations;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return fallback || key;
      }
    }

    return typeof value === "string" ? value : fallback || key;
  };
}

export async function getServerTranslationsWithT(locale) {
  const translations = await getServerTranslations(locale);
  const t = createServerTranslator(translations);
  return { translations, t };
}

// 🟢 وورابر للصفحات
export function injectServerTranslations(pageComponent) {
  return async function TranslatedPage(props) {
    const searchParams = await props.searchParams; // ✅ await searchParams first
    const lang = searchParams?.lang; // ✅ then access lang property
    const { translations, t } = await getServerTranslationsWithT(lang);
    return pageComponent({ ...props, translations, t });
  };
}
