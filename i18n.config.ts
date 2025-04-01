// generate array of translation files
function translationFiles(locale: string) {
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
    ]

    const arr: string[] = [];

    files.forEach( file => {
        arr.push(`${locale}/${file}`);
    })

    return arr;
}

export default {
    lazy: false,
    defaultLocale: 'en',
    langDir: 'locales/',
    customRoutes: false,
    strategy: 'no_prefix',
    detectBrowserLanguage: false,
    locales: [
        {
            code: 'fr',
            name: 'Français',
            iso: 'fr-FR',
            files: translationFiles('fr')
        },
        {
            code: 'en',
            name: 'English',
            iso: 'en-US',
            files: translationFiles('en')
        }
    ],
    pages: {
        index: {
            en: "/",
            fr: "/"
        },
        home: {
            en: "/home",
            fr: "/accueil"
        },
        account: {
            en: "/my-account",
            fr: "/mon-compte"
        },
        'legal-notice': {
            en: "/legal-notice",
            fr: "/mentions-légales"
        },
        privacy: {
            en: "/privacy",
            fr: "/confidentialité"
        }
    }
};