export default defineNuxtPlugin((nuxtApp) => {
    const preferredLocaleCookie = useCookie('preferredLocale')
    if (preferredLocaleCookie.value) {
        nuxtApp.vueApp.config.globalProperties.$i18n.locale = preferredLocaleCookie.value
    }
    useActivateRouteWatcher()
    handleColorModeCookie()
    setBrowserColorModeSetting()
    watchBrowserColorModeSetting(nuxtApp)
    checkVersionNumber()
})



function checkVersionNumber() {
  const { version: currentVersion } = useAppConfig() as unknown as { version: string }
  const versionKey = 'app_version'
  const storedVersion = localStorage.getItem(versionKey)

  if (storedVersion !== currentVersion) {
    console.info(`[Cache] App version changed (${storedVersion || 'none'} → ${currentVersion}) — clearing localStorage caches.`)

    const permanentCacheKeys = useAppConfig().permanentCacheKeys as CacheKey[]

    permanentCacheKeys.forEach(key => {
    useClearLocalStorageCache(key)
    })

    localStorage.setItem(versionKey, currentVersion)
  }
}




function setBrowserColorModeSetting() {
    useAppConfig().colorMode.browser = getBrowserColorMode()
}

function handleColorModeCookie() {
    const appConfig = useAppConfig()
    const colorModeCookie = useCookie('colorMode')

    if (!colorModeCookie.value) {
        colorModeCookie.value = getBrowserColorMode()
    }

    if (colorModeCookie.value) {
        appConfig.colorMode.setting = colorModeCookie.value

        if (colorModeCookie.value === 'auto') {
            appConfig.colorMode.active = getBrowserColorMode()
        } else {
            appConfig.colorMode.active = colorModeCookie.value
        }
    }
}

function getBrowserColorMode() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    return mediaQuery.matches ? 'dark' : 'light';
}

function watchBrowserColorModeSetting(nuxtApp: any) {
    useAppConfig().colorMode.browser = getBrowserColorMode()
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    // Watch for changes in the browser color mode
    nuxtApp.hook('app:mounted', () => {
        mediaQuery.addEventListener('change', updateBrowserColorMode);
    });

    nuxtApp.vueApp.unmount = (() => {
        const originalUnmount = nuxtApp.vueApp.unmount;
        return function (this: any) {
            mediaQuery.removeEventListener('change', updateBrowserColorMode);
            originalUnmount.call(this);
        };
    })();
}
function updateBrowserColorMode(event: MediaQueryListEvent) {
    const appConfig = useAppConfig()
    const newMode = event.matches ? 'dark' : 'light';
    appConfig.colorMode.browser = newMode
    if (appConfig.colorMode.setting === 'auto') {
        appConfig.colorMode.active = newMode
    }
}