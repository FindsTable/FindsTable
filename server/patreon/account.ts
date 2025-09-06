import { PatreonAuthorization } from '@@/server/types/patreon'
import {isMember, isTier, PatreonTokens_Raw } from './types'
import { PatreonUser } from '@@/server/types/patreon'

export {
    patreon_getTokensWithCode,
    patreon_getMe,
    formatUserState_Patreon,
    refactorTokens
}

async function patreon_getTokensWithCode(
    code: string
): Promise<ApiResponse<PatreonAuthorization | null>> {
    const runtimeConfig = useRuntimeConfig()
    
    try {
        const tokens: PatreonAuthorization = await $fetch(
            'https://www.patreon.com/api/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                code: code,
                grant_type: 'authorization_code',
                client_id: runtimeConfig.public.PATREON_FINDSTABLENET_CLIENT_ID,
                client_secret: runtimeConfig.PATREON_FINDSTABLENET_CLIENT_SECRET,
                redirect_uri: setRedirectUrl()
            }).toString()
        });

        if (tokens.scope) {
            delete tokens.scope
        }
         
        return newResponse({
            ok: true,
            status: 200,
            statusText: 'OK',
            data: tokens
        })
    } catch(error) {
        return newResponse({
            ok: false,
            status: 401,
            statusText: 'Unauthorized for some reason',
            data: null
        })
    }
}

function setRedirectUrl(): string {
    let url = ''
    if (process.env.NODE_ENV === 'development') {
        url = 'http://dev.findstable.net:3000/redirection/patreon/link-account'
    }
    if (process.env.NODE_ENV === 'production') {
        url = 'https://findstable.net/redirection/patreon/link-account'
    }
    return url
}


async function patreon_getMe(
    bearerToken: string
): Promise<ApiResponse<PatreonUser | null>> {
    try {
        const user: any = await $fetch(

            `https://www.patreon.com/api/oauth2/v2/identity`,
            {
                method: 'GET',
                headers: {
                    'Authorization': bearerToken
                },
                params: {
                    'fields[user]': 'full_name,email,url,thumb_url',
                    'include': 'memberships,campaign,memberships.currently_entitled_tiers',
                    'fields[member]': 'full_name,patron_status,last_charge_status'
                }
            }
        )

        return newResponse({
            ok: true,
            status: 200,
            statusText: 'OK',
            data: user
        })
    } catch(error: any) {
        // if (error.response._data.errors.length) {
        //     return {
        //         ok: false,
        //         status: error.response._data.errors[0].status,
        //         statusText: error.response._data.errors[0].title
        //     }
        // }

        return newResponse({
            ok: false,
            status: 500,
            statusText: 'Internal Patreon Server Error',
            data: null
        })
    }
}

function getMemberTierId(patreonUser: any) {
    if (!patreonUser?.included?.length) {
        return undefined;
    }

    const tier = patreonUser.included.find((item: any) => item.type === "tier");

    return tier ? tier.id : undefined;
}

function formatUserState_Patreon(
    user: any, 
    tokens: any = undefined
): UserState_Patreon {

    const tierId = getMemberTierId(user)
    console.log('patreon tier id: ', tierId)

    let patreonUser = {
        id: user.data.id,
        email: user.data.attributes.email,
        first_name: user.data.attributes.first_name || "",
        full_name: user.data.attributes.full_name || "",
        url: user.data.attributes.url,
        thumb_url: user.data.attributes.thumb_url,
        patron_status: '',
        tier: tierId
    }

    if(tokens) {
        patreonUser = {
            ...patreonUser,
            ...tokens
        }
    }

    /*
    loop to check the nature of the included data.
    Unsure about the consistency of the structure. 
    Member, tier and campign might or might not be included
    */

    if (user.included.length) {
        for (let i = 0; i < user.included.length; i++) {
            const item = user.included[i];

            if (isMember(item)) {
                patreonUser.patron_status = item.attributes.patron_status || '';
            } else if (isTier(item)) {
                patreonUser.tier = item.id;
            }
        }
    }

    return patreonUser
}

function refactorTokens(
    tokens: PatreonTokens_Raw
): PatreonAuthorization {

    /*
    patreon provides a "expires_in" value, but we need a "exipre_at" value
    */
    
    let toks: PatreonAuthorization = {
        access_token: tokens.access_token,
        expires_at: Date.now() + (tokens.expires_in * 1000),
        token_type: tokens.token_type,
        refresh_token: tokens.refresh_token
    }

    return toks
}
