export default defineNuxtPlugin(() => {
    return {
        provide: {
            patreon: {
                getMe,
                refreshToken,
                unlinkAccount,
                getPatreonAccountFromDirectus
            }
        },
    }
})

async function getMe(
    accessToken: string
) {

    const res = await $fetch(
        '/api/patreon/me',
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    )
    return res.data
}

async function refreshToken(refreshToken: string) {

    const runtimeConfig = useRuntimeConfig()
    const res = $fetch(
        '/api/patreon/refresh',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: {
                grant_type: "refresh_token",
                refresh_token: refreshToken,
                client_id: runtimeConfig.public.PATREON_FINDSTABLENET_CLIENT_ID,
                client_secret: runtimeConfig.PATREON_FINDSTABLENET_CLIENT_SECRET
            }
        }
    )
}

async function unlinkAccount() {
    const user = useUserState()
    if (!user.value?.patreon_account?.id) {
        return
    }

    const res = await $fetch(
        '/api/patreon/account/unlink',
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${user.value.accessToken.value}`
            },
            body: {
                patreonAccountId: user.value.patreon_account.id
            }
            
        }
    )
    return res
}

async function getPatreonAccountFromDirectus() {
    console.log('getting patreon account from directus')

    const res = await useNuxtApp().$items.getByQuery({
        collection: 'Patreon_accounts',
        query: {
            fields: '*,tier.*,tier.translations.*,user',
            filter: {
                user: {
                    _eq: useUserState().value.id
                }
            }
        }
    })

    if(res?.data) {
        return res.data[0]
    }
}