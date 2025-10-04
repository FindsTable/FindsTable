export {
    useLoginFlow,
    useHandleSignup,
    useAnonymizeEmail,
    useLogin,
    useRefresh,
    useLogout
}

type AccessToken = {
    value: string,
    expires_at: number
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
            ...userData.data,
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

        var token = await use$Fetch<ParsedAccessToken>(
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

        useUserState().value.isLoggedIn = true

    useUserState().value.isLoggedIn = true
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

    return res
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
    const res = await use$Fetch(
        '/api/auth/destroy-cookie',
        {
            method: 'POST',
            body: {
                name: name
            }
        }
    )
    if (!res) {
        return newResponse({
            ok: false,
            status: 500,
            statusText: 'Server error'
        })
    }
}

async function useLogout() {
    const res = await use$Fetch(
        '/api/auth/logout',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        }
    )
    
    if(res.ok) {
        navigateTo('/')
    }
}