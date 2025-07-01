import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {  // english
    translation: {
      title: "AI Code Generator",
      placeholder: "Describe what you want to build...",
      generate: "Generate Code",
      copying: "Copied to clipboard!",
      copied: "Copy Code",
      generating: "Generating...",
    },
  },
  es: { // spanish
    translation: {
      title: "Generador de Código IA",
      placeholder: "Describe lo que quieres construir...",
      generate: "Generar Código",
      copying: "¡Copiado al portapapeles!",
      copied: "Copiar Código",
      generating: "Generando...",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
