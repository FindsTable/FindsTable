const userState = useUserState()

export {
    useLoginFlow,
    useHandleSignup,
    useAnonymizeEmail
}

const useGetAccessToken = {
    withEmailAndPassword: accessTokenFromEmailAndPassword,
    withRefreshTokenCookie: accessTokenFromRefreshTokenCookie
}

async function useLoginFlow(
    flow: 'emailAndPassword' | 'refreshTokenCookie',
    p: {
        email: string
        password: string
    }
): Promise<boolean> {

    let res: ParsedApiResponse<ParsedAccessToken | null>

    if(flow === 'emailAndPassword') {
        if(!p.email || !p.password) return false
        res = await useGetAccessToken.withEmailAndPassword(p.email, p.password)
        console.log(res)
    } else {
        // refreshTokenCookie
        res = await useGetAccessToken.withRefreshTokenCookie()
    }
    
    if(!res.ok || !res.data) {
        // to do: check response to intercept unverified email
        if(res.toaster) {
            useToaster('show', {
                id: 'loggingIn',
                messagePath: res.toaster.messagePath,
                type: 'warning',
                autoClose: true,
                position: 'bottom'
            })
        }

        return false
    }

    const userData = await useNuxtApp().$auth.getUserDataWithAccessToken(res.data.access_token.value)
    
    if(!userData.ok || !userData.data) {
        return false
    }

    useLoadStateData('userState', {
        ...userData.data,
        accessToken: res.data.access_token
    })

    useUserState().value.isLoggedIn = true

    return true
}

async function accessTokenFromEmailAndPassword(
        email: string, 
        password: string
    ) :Promise<ParsedApiResponse<ParsedAccessToken | null>>
{    
    
    const $auth = useNuxtApp().$auth
    const res = await $auth.loginWithEmailAndPassword(email, password)
    console.log(email, password)
    console.log(res)
    return res
}

async function accessTokenFromRefreshTokenCookie()
    :Promise<ParsedApiResponse<ParsedAccessToken | null>>
{

    const auth = useNuxtApp().$auth
    const res = await auth.refreshTokens()

    if (!res.ok) {
        await auth.destroyCookie('findstable_refresh_token')
        await auth.destroyCookie('directus_session_token')
        await auth.destroyCookie('directus_session_token_prod')
    }

    return res
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

async function getAndLoadPatreonUserData() {
    if(userState.value?.patreon_account?.access_token) {

        const res = await useNuxtApp().$patreon.getMe(userState.value.patreon_account.access_token)

        useLoadStateData('userState', {
            patreon_account: {
                ...userState.value.patreon_account,
                ...res
            }
        })
    }
}