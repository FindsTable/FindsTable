import iconModuleConfig from '@/config/modules/icon.config.js'

type ColorMode = string | undefined | null;

export default defineAppConfig({
    version: "1.0.0",
    cookiePolicyLastUpdate: '01/04/2025',
    legalNoticeLastUpdate: '01/04/2025',
    cacheKeys: {
        appVersion: 'app_version'
    },
    welcomeUrl: '/home?content=finds',
    directusUrl: "https://admin.findstable.net",
    device: {
        hasCamera: false, //set in lazyAppConfig plugin
    },
    showConsoleLogs: true,
    colorModes: [
        {
            id: 'light',
            name: 'Light mode',
            icon: 'material-symbols:light-mode'
        },
        {
            id: 'dark',
            name: 'Dark mode',
            icon: 'material-symbols:dark-mode-rounded'
        },
        // {
        //     id: 'coffee',
        //     name: 'Café',
        //     icon: 'coffee'
        // },
        {
            id: 'auto',
            name: 'Automatic',
            icon: 'device'
        },
        {
            id: 'forest',
            name: 'Forest',
            icon: 'forest'
        }
    ],
    showSideBar: false,

    colorMode: {
        setting: undefined as undefined | string,
        active: undefined as undefined | string,
        browser: undefined as undefined | string,
        default: 'dark'
    },
    icon: iconModuleConfig,
    fetchTimeout: {
        multiplyfactor: 2,
        min: 100000,
        max: 5000,
        adapted: 0
    }
})