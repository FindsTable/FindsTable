export {
    use$t,
    useLocaleText
}

function use$t(messagePath: string): string {
    return useNuxtApp().$i18n.t(messagePath) as string
}

type Locale = 'fr' | 'en'

function useLocaleText(
    p: Record<Locale, string>
): string {
  const locale = useNuxtApp().$i18n.locale.value as Locale
  return p[locale]
}