import { describe, it, expect } from 'vitest';
import { render, screen } from 'vitest';
import IndexPage from '@/pages/index.vue';
import { createI18n } from 'vue-i18n';
import { setup } from '@nuxt/test-utils';

const messages = {
    header: 'finds Table',
    welcomeText: 'pages.landing.welcomeText',
    loginButton: 'pages.landing.loginButton',
    patreonLink: 'pages.landing.patreonLink',
    loginSignupInvitation: 'pages.landing.loginSignupInvitation',
    footer: {
        buttons: {
            homeButton: 'Welcome',
            legalNotice: "pages.legalNotice.title",
            privacy: "pages.privacy.title",
        }
    },
    bottomBar: {
        languageToggler: {
            buttons: {
                fr: 'fr',
                en: 'en'
            }
        }
    }
}

const colorModeButtons = {
    dark: {
        id: 'publicRoute-colorModeButton-dark',
        icon: 'night'
    },
    light: {
        id: 'publicRoute-colorModeButton-light',
        icon: 'day'
    },
    system: {
        id: 'publicRoute-colorModeButton-system',
        icon: 'system'
    },
    forest: {
        id: 'publicRoute-colorModeButton-forest',
        icon: 'forest'
    }
}

