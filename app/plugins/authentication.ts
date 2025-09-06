import {  newResponse } from '#shared/types/apiResponse'

export default defineNuxtPlugin(() => {
    return {
        provide: {
            auth: {
                createNewUser,
                loginWithEmailAndPassword,
                getUserDataWithAccessToken,
                refreshTokens,
                ativateAccessTokenAutoRefresh,
                logout,
                destroyCookie
            }
        },
    }
})

async function createNewUser(
    invitationCode: string,
    username: string,
    email: string,
    password: string,
    passwordConfirmation: string,
) {

    if (import.meta.server) { return }

    const res = await use$Fetch(
        '/api/auth/signup',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                invitation_code: invitationCode,
                username,
                email,
                password,
                passwordConfirmation
            }
        }
    )

    return useParseApiResponse(res)
}

async function loginWithEmailAndPassword(
    email: string,
    password: string
): Promise<ParsedApiResponse> {
    console.log('in auth plugin:', email, password)
    const res = await use$Fetch<ParsedAccessToken>(
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
    })

    if (!res) {
        return {
            ok: false,
            data: null,
            toaster: {
                id: Date.now().toString(),
                messagePath: 'error.server.noResponse',
                type: 'error',
                autoClose: true,
                position: 'bottom'
            },
            tips: null
        }
    }

    return useParseApiResponse(res)
}

async function getUserDataWithAccessToken(token: string)
:Promise<ParsedApiResponse<ParsedAccessToken>> {
    const fields = [
        "id",
        "username",
        "displayName",
        "avatar",
        "patreon_account",
        "patreon_account.*",
        "personalDataRecord.*",
        "personalDataRecord.email.*",
        "personalDataRecord.firstName.*",
        "personalDataRecord.lastName.*",
        "personalDataRecord.country.*",
    ]

    const res = await use$Fetch<{
        id: string,
        username: string,
        email: string,
        patreon_account?: DirectusPatreonAccountObject
    }>(
        '/api/users/me',
        {
            method: 'GET',
            headers: {
                'authorization': 'Bearer ' + token,
            },
            query: {
                fields: fields.join(',')
            }
        }
    )
    
    if(!res?.data) {
        return useParseApiResponse({
            ok: false,
            status: 500,
            statusText: 'Server error'
        })
    }
    if(res.data.patreon_account) {
        res.data.patreon_account = res.data.patreon_account[0] //extract patreon account from array. O2M field
        res.data.personalDataRecord = res.data.personalDataRecord[0]
    }

    return useParseApiResponse(res)
}

async function refreshTokens()
: Promise <ParsedApiResponse<ParsedAccessToken | null>> {
    const res: any = await use$Fetch<ParsedAccessToken>(
        '/api/auth/refresh', 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    if (!res) {
        return useParseApiResponse({
            ok: false,
            status: 500,
            statusText: 'Server error'
        })
    }
    
    return useParseApiResponse(res)
}


let timeout: ReturnType<typeof setTimeout> | null = null;

function ativateAccessTokenAutoRefresh() {
    console.log('refreshing token')
    if (timeout !== null) {
        clearTimeout(timeout)
    }
    if (useUserState().value.accessToken?.value) {
        timeout = setTimeout(async () => {
            const res = await refreshTokens()
            
            if (res.ok && res.data) {
                const newToken = res.data.access_token
                useUserState().value.accessToken.value = newToken.value
                useUserState().value.accessToken.expires_at = newToken.expires_at + 1
            }
            ativateAccessTokenAutoRefresh()
        }, 840000)
    }
}


async function logout() {
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

async function destroyCookie(name: string) {
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

const getUserDataFields = () => {

    const fields = [
        "id", 
        "username", 
        "displayName", 
        "patreon_account", 
        "patreon_account.*", 
        "personalDataRecord.id", 
        "personalDataRecord.email.*", 
        "personalDataRecord.firstName.*", 
        "personalDataRecord.lastName.*",
        "personalDataRecord.country.*"
    ]
}