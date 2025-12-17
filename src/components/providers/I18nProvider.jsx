"use client";

import { useEffect, useState, useMemo } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n.client";

export function I18nProvider({ children }) {
  const [isReady, setIsReady] = useState(i18n.isInitialized);

  useEffect(() => {
    if (i18n.isInitialized) {
      setIsReady(true);
    } else {
      const handleInit = () => setIsReady(true);
      i18n.on("initialized", handleInit);
      return () => i18n.off("initialized", handleInit);
    }
  }, []);

  const memoizedChildren = useMemo(() => children, [children]);

  if (!isReady) return <div>Loading...</div>;

  return <I18nextProvider i18n={i18n}>{memoizedChildren}</I18nextProvider>;
}