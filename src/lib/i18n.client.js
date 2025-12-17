"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";

if (!i18n.isInitialized) {
  i18n
    .use(HttpApi)
    .use(initReactI18next)
    .init({
      lng: "en",
      fallbackLng: "en",
      backend: {
        loadPath: "/locales/{{lng}}/{{ns}}.json",
      },
      ns: ["common"],
      defaultNS: "common",
      interpolation: { escapeValue: false },
      react: {
        useSuspense: false,
      },
      debug: false,
    });
}

export default i18n;
