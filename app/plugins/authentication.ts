import {  newResponse } from '#shared/types/apiResponse'

export default defineNuxtPlugin(() => {
    return {
        provide: {
            auth: {
                getUserDataWithAccessToken,
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

let timeout: ReturnType<typeof setTimeout> | null = null;

function ativateAccessTokenAutoRefresh() {

    if (timeout !== null) {
        clearTimeout(timeout)
    }

    if (useUserState().value.accessToken?.value) {
        timeout = setTimeout(async () => {
            await useRefresh()

            ativateAccessTokenAutoRefresh()
        }, 840000)
    }
}
