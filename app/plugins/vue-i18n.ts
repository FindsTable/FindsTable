import { createI18n } from 'vue-i18n'

// Function to dynamically load and merge translation files
async function loadLocaleMessages(locale: string) {
  const files = [
    'legal.json',
    'forms.json',
    'global.json',
    'pages.json',
    'activity.json',
    'messages/info.json',
    'messages/error.json',
    'messages/success.json',
    'messages/tip.json',
    'messages/warning.json',
  ];

  const messages = {};

  for (const file of files) {
    const filePath = `../locales/${locale}/${file}`;
    try {
      const content = await import(filePath);
      Object.assign(messages, content.default || content);
    } catch (error) {
      console.warn(`Could not load ${filePath}:`, error);
    }
  }

  return messages;
}

export default defineNuxtPlugin(async (nuxtApp) => {
  const messages = {
    en: await loadLocaleMessages('en'),
    fr: await loadLocaleMessages('fr'),
  };

  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages,
    strategy: 'no_prefix',
    detectBrowserLanguage: false, 
  });

  nuxtApp.vueApp.use(i18n);

//   return {
//     provide: {
//       i18n,
//     },
//   };
});