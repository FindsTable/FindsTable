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

    const res = await $fetch<{
        data: {
            id: string;
            username: string;
            email: string;
            personalDataRecord: any;
            patreon_account?: DirectusPatreonAccountObject;
        }
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
