import { createI18n } from 'vue-i18n'

async function loadLocaleMessages(locale: string) {
  const files = {
    'legal.json': () => import(`../locales/${locale}/legal.json`),
    'forms.json': () => import(`../locales/${locale}/forms.json`),
    'global.json': () => import(`../locales/${locale}/global.json`),
    'pages.json': () => import(`../locales/${locale}/pages.json`),
    'activity.json': () => import(`../locales/${locale}/activity.json`),
    'messages/info.json': () => import(`../locales/${locale}/messages/info.json`),
    'messages/error.json': () => import(`../locales/${locale}/messages/error.json`),
    'messages/success.json': () => import(`../locales/${locale}/messages/success.json`),
    'messages/tip.json': () => import(`../locales/${locale}/messages/tip.json`),
    'messages/warning.json': () => import(`../locales/${locale}/messages/warning.json`),
  };

  const messages = {};

  for (const [file, loader] of Object.entries(files)) {
    try {
      const content = await loader();
      Object.assign(messages, content.default || content);
    } catch (error) {
      console.warn(`Could not load ${file}:`, error);
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
});