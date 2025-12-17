/**
 * مساعد للتعامل مع البيانات المترجمة من الـ API
 * يدعم البيانات التي تأتي من الباك اند بصيغ مختلفة
 */

/**
 * تحويل البيانات من الـ API إلى صيغة مترجمة
 * @param {Object} apiResponse - الاستجابة من الـ API
 * @param {string} currentLanguage - اللغة الحالية
 * @returns {Object} البيانات المترجمة
 */
export function transformApiData(apiResponse, currentLanguage = 'en') {
  if (!apiResponse) return null;

  // إذا كانت البيانات مصفوفة
  if (Array.isArray(apiResponse)) {
    return apiResponse.map(item => transformApiData(item, currentLanguage));
  }

  // إذا كانت البيانات كائن
  if (typeof apiResponse === 'object') {
    const transformed = { ...apiResponse };

    // التعامل مع الحقول المترجمة
    Object.keys(transformed).forEach(key => {
      const value = transformed[key];

      // إذا كان الحقل يحتوي على ترجمات متعددة
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        // البحث عن الترجمة المناسبة
        if (value[currentLanguage]) {
          transformed[key] = value[currentLanguage];
        } else if (value['en']) {
          // fallback للإنجليزية
          transformed[key] = value['en'];
        } else if (value['it']) {
          // fallback للإيطالية
          transformed[key] = value['it'];
        }
      }
      
      // التعامل مع الكائنات المتداخلة
      else if (value && typeof value === 'object') {
        transformed[key] = transformApiData(value, currentLanguage);
      }
    });

    return transformed;
  }

  return apiResponse;
}

/**
 * مثال على بنية البيانات المتوقعة من الـ API
 */
export const exampleApiResponse = {
  products: [
    {
      id: 1,
      name: {
        en: "Classic Slim Fit Jeans",
        it: "Jeans Slim Fit Classici"
      },
      description: {
        en: "Premium slim fit jeans crafted from 100% organic cotton.",
        it: "Jeans slim fit premium realizzati in cotone 100% biologico."
      },
      price: 149.99,
      category: {
        en: "Men's Jeans",
        it: "Jeans da Uomo"
      },
      material: {
        en: "100% Organic Cotton",
        it: "100% Cotone Biologico"
      },
      careInstructions: {
        en: "Machine wash cold with like colors. Do not bleach.",
        it: "Lavare in lavatrice a freddo con colori simili. Non candeggiare."
      },
      colors: [
        {
          name: {
            en: "Navy",
            it: "Blu Navy"
          },
          hex: "#000080"
        }
      ],
      sizes: [
        {
          name: "28",
          label: {
            en: "Size 28",
            it: "Taglia 28"
          }
        }
      ]
    }
  ],
  categories: [
    {
      id: 1,
      name: {
        en: "Men",
        it: "Uomo"
      },
      description: {
        en: "Men's denim collection",
        it: "Collezione denim da uomo"
      }
    }
  ],
  content: {
    hero: {
      title: {
        en: "Find the best DENIM for your closet",
        it: "Trova il miglior DENIM per il tuo guardaroba"
      },
      subtitle: {
        en: "Over 200 different models available. Choose the right one for you",
        it: "Oltre 200 modelli diversi disponibili. Scegli quello giusto per te"
      },
      buttonText: {
        en: "Shop now!",
        it: "Acquista ora!"
      }
    }
  }
};

/**
 * دالة لمحاكاة استدعاء الـ API
 */
export async function fetchTranslatedData(endpoint, language = 'en') {
  try {
    // Validate endpoint to prevent SSRF
    const allowedEndpoints = ['products', 'content', 'categories', 'users', 'orders'];
    const safeEndpoint = endpoint.replace(/[^a-zA-Z0-9-_]/g, '');
    
    if (!allowedEndpoints.includes(safeEndpoint)) {
      throw new Error('Invalid endpoint');
    }
    
    // Validate language parameter
    const safeLanguage = language.replace(/[^a-zA-Z-]/g, '').substring(0, 10);
    
    // محاكاة استدعاء API
    const response = await fetch(`/api/${safeEndpoint}?lang=${safeLanguage}`);
    const data = await response.json();
    
    // تحويل البيانات للصيغة المترجمة
    return transformApiData(data, safeLanguage);
  } catch (error) {
    
    throw error;
  }
}

/**
 * دالة للحصول على المنتجات المترجمة
 */
export async function fetchTranslatedProducts(language = 'en') {
  return fetchTranslatedData('products', language);
}

/**
 * دالة للحصول على المحتوى المترجم
 */
export async function fetchTranslatedContent(language = 'en') {
  return fetchTranslatedData('content', language);
}