export {
    useHandleSignup,
    useAnonymizeEmail,
    useLogin,
    useRefresh,
    useLogout
}

async function useRefresh() : Promise<void> {
    try {
        const token = await $fetch<AccessToken>(
            '/api/auth/refresh',
            {
                method: 'POST',
            }
        )

        const userData = await useNuxtApp().$auth.getUserDataWithAccessToken(token.value)

        useLoadStateData('userState', {
            ...userData,
            accessToken: token
        })

        useUserState().value.isLoggedIn = true

        useUserState().value.isLoggedIn = true
    } catch(err) {
        useHandleError(err)
    }
}

async function useLogin(
    email: string,
    password: string
) : Promise<void> {

    try {
        assertEmailFormat(email)
        assertPasswordFormat(password)

        var token = await $fetch<AccessToken>(
            '/api/auth/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    email,
                    password
                }
            }
        )

        const userData = await useNuxtApp().$auth.getUserDataWithAccessToken(token.value)
        
        useLoadStateData('userState', {
            ...userData.data,
            accessToken: token
        })

        useToaster('show', {
            id: 'loggedIn',
            messagePath: useWelcomeBackString() ,
            type: 'success',
            autoClose: true,
            position: 'bottom'
        })
        useUserState().value.isLoggedIn = true
        navigateTo(useAppConfig().welcomeUrl)

    } catch(err) {
        useHandleError(err)
    }
}

async function useHandleSignup(p: {
    invitationCode: string
    username: string
    email: string
    password: string
    passwordConfirmation: string
}) {

    try {
        assertEmailFormat(p.email)
        assertPasswordFormat(p.password)
        assertStrongEquality(p.password, p.passwordConfirmation)

        const res = await $fetch(
            '/api/auth/signup',
            {
                method: 'POST',
                body: {
                    invitation_code: p.invitationCode,
                    username: p.username,
                    email :p.email,
                    password : p.password,
                    passwordConfirmation :p.passwordConfirmation
                }
            }
        )

        navigateTo(`/redirection/new-account-created?email=${useAnonymizeEmail(p.email)}`)
    } catch(err) {
        useHandleError(err)
    }
}

function useAnonymizeEmail(email: string): string {
    const [localPart, domain] = email.split("@");

    if (!localPart || !domain) {
        throw new Error("Invalid email format.");
    }

    const firstLetter = localPart[0];
    const lastLetter = localPart[localPart.length - 1];
    const hiddenPart = "*".repeat(localPart.length - 2 > 0 ? localPart.length - 2 : 0);

    return `${firstLetter}${hiddenPart}${lastLetter}@${domain}`;
}

async function useDestroyCookie(name: string) {
    try {
        await $fetch(
            '/api/auth/destroy-cookie',
            {
                method: 'POST',
                body: {
                    name: name
                }
            }
        )
    } catch(err) {
        useHandleError(err)
    }
}

async function useLogout() {
    console.log('logout')
    try {
        await $fetch(
            '/api/auth/logout',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        )

        useToaster('show', {
            id: 'loggedOut',
            message: 'bye bye !' ,
            type: 'success',
            autoClose: true,
            position: 'bottom'
        })

        navigateTo('/');
    } catch(err) {
        useHandleError(err)
    }
}