import { useI18n } from 'vue-i18n'

export {
    use$t,
    useLocaleText,
    useI18n
}

function use$t(messagePath: string): string {
    const t = useNuxtApp().$i18n.global.t
    return t(messagePath) as string
}

type Locale = 'fr' | 'en';

function useLocaleText(
  p: Record<Locale, string> 
): string {
  const { locale } = useI18n();
  const currentLocale = locale.value as Locale;

  return p[currentLocale] || p['en'];
}