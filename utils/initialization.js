// This file is used to initialize the app for new users
// all automatic prompts and configuratio will bee added here

export default () => {
    if (!appLoadedByKnownUser()) {
        loadAsFirstVisit();
    }
}

function appLoadedByKnownUser() {
    if (typeof window === 'undefined') return false;

    if (!localStorage.getItem('appLoadedByKnownUser')) {
        return false;
    }
    return true;
}

async function loadAsFirstVisit() {
    await setColorModeCookieForNewUser();
    localStorage.setItem('appLoadedByKnownUser', 'true')
}

async function setColorModeCookieForNewUser() {
    const response = await $fetch(
        '/api/colorMode',
        {
            method: 'POST',
            body: {
                newColorMode: 'darkMode'
            }
        }
    )
    refreshCookie('colorMode')
}