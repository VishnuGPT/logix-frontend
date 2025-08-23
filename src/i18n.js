import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ["en", "hi", "ben", "mar", "tam", "tel"], 
    lng: "en", // default language
    fallbackLng: "en",
    debug: false,
    ns: [
      "navbar",
      "caseStudy",
      "citiesChart",
      "contact",
      "faq",
      "hero",
      "keyFeatures",
      "news",
      "testimonials"
    ],
    defaultNS: "navbar",
    backend: {
      loadPath: (lng, ns) => {
        if (ns === "navbar") {
          return `/locales/${lng}/navbar.json`;
        }
        return `/locales/${lng}/landingPage/${ns}.json`;
      },
    },
    react: {
      useSuspense: true, // wait for JSON to load before rendering
    },
  });

// Optional: make it globally safe to return objects
i18n.options.returnObjects = true;

export default i18n;
