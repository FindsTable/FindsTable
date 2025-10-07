import {  newResponse } from '#shared/types/apiResponse'

export default defineNuxtPlugin(() => {
    return {
        provide: {
            auth: {
                getUserDataWithAccessToken,
                refreshTokens,
                ativateAccessTokenAutoRefresh
            }
        },
    }
})

async function getUserDataWithAccessToken(token: string)
:Promise<any> {
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

    let res = await $fetch<{
        id: string;
        username: string;
        email: string;
        personalDataRecord: any[];
        patreon_account?: any;
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

    res.patreon_account = res.patreon_account[0]

    if(!res) {
        throw new Error('Problemo')
    }
    return res
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
                useUserState().value.accessToken.expires = newToken.expires + 1
            }
            ativateAccessTokenAutoRefresh()
        }, 840000)
    }
}
